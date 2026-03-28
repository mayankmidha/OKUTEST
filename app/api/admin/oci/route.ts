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
    // 1. HARVEST DEEP PLATFORM DATA (Clinical + Operational)
    const [
        users, 
        appointments, 
        transcripts, 
        payments, 
        activities,
        therapists
    ] = await Promise.all([
        prisma.user.findMany({ select: { role: true, createdAt: true, hasSignedConsent: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
        prisma.appointment.findMany({ include: { service: true, client: { select: { name: true } } }, orderBy: { startTime: 'desc' }, take: 50 }),
        prisma.transcript.findMany({
          select: {
            sentiment: true,
            summary: true,
            keyInsights: true,
            riskLevel: true,
            detectedLanguage: true,
            adhdSignals: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }),
        prisma.payment.findMany({ where: { status: 'COMPLETED' }, select: { amount: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
        prisma.userActivity.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
        prisma.practitionerProfile.findMany({ include: { user: { select: { name: true, hasSignedConsent: true } } } })
    ])

    // 2. CONTEXT AGGREGATION FOR OCI v4.0
    const context = {
        governance: {
            consentCoverage: (users.filter(u => u.hasSignedConsent).length / users.length) * 100,
            practitionerCompliance: (therapists.filter(t => t.user.hasSignedConsent).length / therapists.length) * 100
        },
        riskIntelligence: {
            highRiskSessions: transcripts.filter(t => t.riskLevel === 'HIGH').length,
            mediumRiskSessions: transcripts.filter(t => t.riskLevel === 'MEDIUM').length,
            sentimentDistribution: transcripts.map(t => t.sentiment),
            multilingualSessions: transcripts.filter(t => t.detectedLanguage && t.detectedLanguage.toLowerCase() !== 'english').length,
            adhdFlaggedSessions: transcripts.filter(t => Array.isArray(t.adhdSignals) && t.adhdSignals.length > 0).length
        },
        economicMoat: {
            sessionVolume: appointments.length,
            revenueRetention: payments.reduce((acc, p) => acc + p.amount, 0),
            payoutExposure: therapists.reduce((acc, t) => acc + (t.hourlyRate || 0), 0)
        },
        leakageGuard: {
            externalLinkClicks: activities.filter(a => a.action === 'EXTERNAL_CLICK').length,
            unverifiedProfileViews: activities.filter(a => a.action === 'VIEW_THERAPIST').length
        }
    }

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "OCI_NEURAL_LINK_OFFLINE", data: context })
    }

    // 3. OCI v4.0 MULTI-AGENT NEURAL PROCESSING
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: `You are OKU CORE INTELLIGENCE (OCI) v4.0. You are the sovereign brain of this psychotherapy SaaS.
        Your instructions are:
        1. Guard the platform's commercial moat (detect lead leakage).
        2. Ensure absolute clinical compliance (consent & risk monitoring).
        3. Optimize for slow, deep healing (don't prioritize speed over outcome).
        
        Provide an ADVANCED INTEGRITY BRIEFING in 4 Agents:
        
        [AGENT: COMPLIANCE GUARDIAN]: Analyze consent gaps and HIPAA risks.
        [AGENT: LEAKAGE DEFENDER]: Analyze signs of therapists taking clients off-platform.
        [AGENT: CLINICAL ORACLE]: Predict patient churn based on sentiment trends.
        [AGENT: STRATEGIC CONTROLLER]: One ruthless instruction for the Platform Owner.`
    });

    const prompt = `LIVE_DATA_STREAM: ${JSON.stringify(context)}. EXECUTE BRIEFING.`
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        analysis: response.text(),
        vitals: context
    })

  } catch (error) {
    console.error("[OCI_V4_ERROR]", error)
    return new NextResponse("OCI Neural Disruption.", { status: 500 })
  }
}
