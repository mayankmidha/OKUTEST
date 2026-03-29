import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getOkuAiSettings, getRoleAwareAiInstruction } from '@/lib/oku-ai';
import { getPractitionerFinanceSummary } from '@/lib/provider-finance';

function hasAdhdIndicators(items: Array<{ assessment?: { title?: string | null } | null; result?: string | null }> = []) {
  return items.some((item) => {
    const title = item.assessment?.title?.toLowerCase() || ''
    const result = item.result?.toLowerCase() || ''
    return title.includes('adhd') || title.includes('executive') || result.includes('adhd')
  })
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context } = await req.json();
    const userId = session.user.id;
    const userRole = session.user.role as UserRole;

    // 1. DATA HARVESTING (Role-Based Clinical Intelligence)
    let platformData: any = {};
    let preferredLanguage: string | null = null
    let hasAdhdSignals = false

    if (userRole === UserRole.ADMIN) {
      const [vitals, verifiedPractitioners, transcripts, logs, pendingPayouts, settings] = await Promise.all([
        prisma.user.count(),
        prisma.practitionerProfile.count({ where: { isVerified: true } }),
        prisma.transcript.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          select: {
            detectedLanguage: true,
            sentiment: true,
            riskLevel: true,
            appointmentId: true,
            appointment: {
              select: {
                practitioner: { select: { name: true } },
                client: { select: { name: true } },
              },
            },
          },
        }),
        prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
        prisma.payout.findMany({
          where: { status: 'PENDING' },
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.platformSettings.findUnique({ where: { id: 'global' } }),
      ]);

      platformData = {
        systemVitals: {
          totalUsers: vitals,
          verifiedPractitioners,
          highRiskTranscripts: transcripts.filter((item) => item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL').length,
          pendingPayouts: pendingPayouts.length,
        },
        settings,
        recentIntelligence: transcripts,
        auditTrail: logs,
        payoutQueue: pendingPayouts,
      };
    } 
    else if (userRole === UserRole.THERAPIST) {
      const [myPatients, mySchedule, recentInsights, pendingNotes, finance] = await Promise.all([
        prisma.user.findMany({ where: { clientAppointments: { some: { practitionerId: userId } } }, take: 10 }),
        prisma.appointment.findMany({ where: { practitionerId: userId, startTime: { gte: new Date() } }, include: { client: true }, take: 5 }),
        prisma.transcript.findMany({
          where: { appointment: { practitionerId: userId } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            detectedLanguage: true,
            sentiment: true,
            riskLevel: true,
            adhdSignals: true,
            clinicalSignals: true,
            appointment: {
              select: {
                client: { select: { name: true } },
                startTime: true,
              },
            },
          },
        }),
        prisma.appointment.count({
          where: {
            practitionerId: userId,
            status: 'COMPLETED',
            soapNote: null,
          },
        }),
        getPractitionerFinanceSummary(userId),
      ]);

      platformData = {
        patientLoad: myPatients.length,
        upcomingSchedule: mySchedule,
        clinicalInsights: recentInsights,
        pendingNotes,
        finance: {
          totalEarned: finance.totalEarned,
          availableForPayout: finance.availableBalance,
          pendingPayoutBalance: finance.pendingPayoutAmount,
        },
      };
    } 
    else {
      const [profile, myMoods, myAssessments, myCareTeam, pendingAssignments, plans, myTasks, recentTranscripts] = await Promise.all([
        prisma.clientProfile.findUnique({
          where: { userId },
          select: { preferredLanguage: true },
        }),
        prisma.moodEntry.findMany({ where: { userId }, take: 7, orderBy: { createdAt: 'desc' } }),
        prisma.assessmentAnswer.findMany({ where: { userId }, include: { assessment: true }, take: 3, orderBy: { completedAt: 'desc' } }),
        prisma.appointment.findMany({ where: { clientId: userId }, include: { practitioner: true }, take: 2 }),
        prisma.assignedAssessment.findMany({
          where: { clientId: userId, status: 'PENDING' },
          include: { assessment: true },
          take: 5,
        }),
        prisma.treatmentPlan.findMany({
          where: { clientId: userId },
          include: { practitioner: { select: { name: true } } },
          orderBy: { updatedAt: 'desc' },
          take: 3,
        }),
        prisma.task.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 12,
        }),
        prisma.transcript.findMany({
          where: { appointment: { clientId: userId } },
          select: {
            sentiment: true,
            riskLevel: true,
            adhdSignals: true,
            careRecommendations: true,
            detectedLanguage: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      preferredLanguage = profile?.preferredLanguage || null
      hasAdhdSignals = hasAdhdIndicators(myAssessments)
      platformData = {
        moodTrend: myMoods,
        latestScreenings: myAssessments,
        careTeam: myCareTeam,
        pendingAssignments,
        treatmentPlans: plans,
        activeTasks: myTasks,
        recentSessionSignals: recentTranscripts,
      };
    }

    const systemPrompt = `You are Oku Core, an advanced, trauma-informed AI assistant integrated across the full therapy platform. ${getRoleAwareAiInstruction({
      role: userRole,
      preferredLanguage,
      hasAdhdSignals,
      context,
    })}
    
    You are also the Platform Guide. If the user asks how to use a feature, navigate a menu, or perform an action (like syncing calendars, booking a session, finding a superbill, taking an assessment, using the ADHD helper, or reviewing SOAP notes), explain it clearly and concisely step-by-step based on standard OKU Therapy platform capabilities.`

    const fullPrompt = `
      CONTEXT: ${userRole} Dashboard
      REQUEST_CONTEXT: ${context || 'general'}
      PLATFORM_DATA: ${JSON.stringify(platformData)}
      USER_QUERY: ${prompt}

      Respond with human warmth, real specificity, and actionable next steps.
      If the user asks how to use the platform or a specific feature, provide clear, step-by-step instructions. 
      If the user is a client, do not diagnose. If the user is a practitioner or admin, be operationally sharp.
      When useful, use short sections with labels.
    `;

    const settings = await getOkuAiSettings()

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ result: "OKU AI is currently disabled by platform administration.", data: platformData });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ result: "AI OFFLINE: Configure API key.", data: platformData });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return NextResponse.json({ result: response.text(), data: platformData });

  } catch (error) {
    console.error("OCI_CHAT_ERROR", error);
    return NextResponse.json({ error: 'Disruption in the Oku Core neural link.' }, { status: 500 });
  }
}
