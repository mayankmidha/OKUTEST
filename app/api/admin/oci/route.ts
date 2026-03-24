import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { GoogleGenerativeAI } from '../../../../node_modules/@google/generative-ai'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // 1. COLLECT DEEP PLATFORM DATA
    const [
        users, 
        appointments, 
        transcripts, 
        payments, 
        logs,
        therapists
    ] = await Promise.all([
        prisma.user.findMany({ 
            select: { role: true, createdAt: true, name: true },
            orderBy: { createdAt: 'desc' },
            take: 100
        }),
        prisma.appointment.findMany({
            include: { service: true, client: { select: { name: true } } },
            orderBy: { startTime: 'desc' },
            take: 50
        }),
        prisma.transcript.findMany({
            select: { sentiment: true, summary: true, keyInsights: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        }),
        prisma.payment.findMany({
            where: { status: 'COMPLETED' },
            select: { amount: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        }),
        prisma.userActivity.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        }),
        prisma.practitionerProfile.findMany({
            include: { user: { select: { name: true } } }
        })
    ])

    // 2. AGGREGATE DATA FOR OCI PROCESSING
    const context = {
        growth: {
            newUsersLast7Days: users.filter(u => u.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
            roleDistribution: {
                clients: users.filter(u => u.role === 'CLIENT').length,
                therapists: users.filter(u => u.role === 'THERAPIST').length
            }
        },
        clinicalIntegrity: {
            averageSentiment: transcripts.map(t => t.sentiment),
            recentInsights: transcripts.flatMap(t => t.keyInsights || []),
            riskSignals: transcripts.filter(t => (t.summary?.toLowerCase().includes('risk') || t.summary?.toLowerCase().includes('crisis'))).length
        },
        financials: {
            recentVolume: payments.reduce((acc, p) => acc + p.amount, 0),
            payoutLiabilities: therapists.map(t => ({ name: t.user.name, rate: t.hourlyRate }))
        },
        operational: {
            activeSessions: appointments.filter(a => a.status === 'SCHEDULED').length,
            systemLoad: logs.length
        }
    }

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "OCI_OFFLINE", data: context })
    }

    // 3. CONSULT OCI MULTI-AGENT BRAIN
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: `You are OKU CORE INTELLIGENCE (OCI) v3.0. You are the autonomous brain of a clinical SaaS platform.
        Your goal is to provide a "Executive Intelligence Briefing" for the Platform Owner.
        Be analytical, proactive, and clinical.
        Provide your analysis in exactly 4 agents:
        
        AGENT 1: CLINICAL SENTINEL (Analyze patient risks and session sentiment trends)
        AGENT 2: GROWTH ARCHITECT (Analyze user onboarding and retention patterns)
        AGENT 3: FISCAL ANALYST (Analyze revenue leaks and payout liabilities)
        AGENT 4: SYSTEM OPERATOR (Analyze system health and anomaly detection)
        
        Keep each agent's response to 2 sentences.`
    });

    const prompt = `Analyze this live platform state: ${JSON.stringify(context)}. Provide the Executive Briefing.`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        analysis: analysis,
        rawVitals: context
    })

  } catch (error) {
    console.error("[OCI_V3_ERROR]", error)
    return new NextResponse("The OCI brain encountered a synchronization lag.", { status: 500 })
  }
}
