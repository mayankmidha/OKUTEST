import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { GoogleGenAI } from '@google/genai'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // 1. Collect Platform Vitals
    const [totalUsers, activePatients, verifiedTherapists, appointments, financialPulse, recentActivities] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: UserRole.CLIENT } }),
        prisma.practitionerProfile.count({ where: { isVerified: true } }),
        prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { service: true }
        }),
        prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        }),
        prisma.userActivity.findMany({
            orderBy: { createdAt: 'desc' },
            take: 30,
            include: { user: { select: { name: true, role: true } } }
        })
    ])

    // 2. Format Data for the LLM Brain
    const systemPulse = {
      vitals: {
        totalUsers,
        activePatients,
        verifiedTherapists,
        totalRevenue: financialPulse._sum.amount || 0
      },
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
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemPrompt = `You are OKU CORE INTELLIGENCE (OCI), the autonomous brain of a Mental Health SaaS platform. Analyze system data and provide a concise 'Platform Vitality Report'.`
    
    const fullPrompt = `
      Analyze this system data: ${JSON.stringify(systemPulse)}

      Provide your analysis in exactly 4 sections:
      1. STATUS: (Healthy, Stressed, or Critical)
      2. ANOMALY DETECTION: (Identify any suspicious patterns or bottlenecks)
      3. CLINICAL RISK: (e.g., sessions with no notes, high no-shows)
      4. PROACTIVE FIX: (One specific action the admin should take now)

      Keep it clinical, professional, and ultra-concise.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Using current stable high-speed model
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      }
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      analysis: response.text,
      vitals: systemPulse.vitals
    })

  } catch (error) {
    console.error("[OCI_DIAGNOSTIC_ERROR]", error)
    return new NextResponse("OCI Brain encountered a synchronization error.", { status: 500 })
  }
}
