import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { GoogleGenerativeAI } from '../../../../node_modules/@google/generative-ai'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // 1. Collect Platform Vitals
    const [totalUsers, activePatients, verifiedTherapists, appointments, financialPulse, recentActivities, blogPosts] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.user.count({ where: { role: UserRole.CLIENT } }).catch(() => 0),
        prisma.practitionerProfile.count({ where: { isVerified: true } }).catch(() => 0),
        prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { service: true }
        }).catch(() => []),
        prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        }).catch(() => ({ _sum: { amount: 0 } })),
        prisma.userActivity.findMany({
            orderBy: { createdAt: 'desc' },
            take: 30,
            include: { user: { select: { name: true, role: true } } }
        }).catch(() => []),
        prisma.post.findMany({
            where: { published: true },
            select: { title: true, category: true, slug: true }
        }).catch(() => [])
    ])

    // 2. Format Data for the LLM Brain
    const systemPulse = {
      vitals: {
        totalUsers,
        activePatients,
        verifiedTherapists,
        totalRevenue: financialPulse._sum?.amount || 0
      },
      availableResources: blogPosts.map(p => ({ title: p.title, category: p.category })),
      behavioralSignals: recentActivities.map(a => ({
        user: a.user?.name,
        role: a.user?.role,
        action: a.action,
        timestamp: a.createdAt
      })),
      clinicalFlow: appointments.map(appt => ({
        status: appt.status,
        service: appt.service.name
      }))
    }

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            analysis: "OCI OFFLINE: Please configure GEMINI_API_KEY to activate autonomous monitoring.",
            vitals: systemPulse.vitals
        })
    }

    // 3. Consult OCI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const systemPrompt = `You are OKU CORE INTELLIGENCE (OCI), the autonomous brain of a Mental Health SaaS platform. Analyze system data and provide a concise 'Platform Vitality Report'.`
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });
    
    const fullPrompt = `
      Analyze this system data: ${JSON.stringify(systemPulse)}

      Provide your analysis in exactly 5 sections:
      1. STATUS: (Healthy, Stressed, or Critical)
      2. ANOMALY DETECTION: (Identify any suspicious patterns)
      3. CLINICAL RISK: (e.g., missing notes, high cancellations)
      4. RESOURCE OPTIMIZATION: (Suggest which blog posts/resources should be featured based on current user trends)
      5. PROACTIVE FIX: (One specific action for the admin)

      Keep it clinical and ultra-concise.
    `

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      analysis: text,
      vitals: systemPulse.vitals
    })

  } catch (error) {
    console.error("[OCI_DIAGNOSTIC_ERROR]", error)
    return new NextResponse("OCI Brain encountered a synchronization error.", { status: 500 })
  }
}
