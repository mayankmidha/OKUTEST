import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { GoogleGenerativeAI } from '../../../../node_modules/@google/generative-ai'

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
    let systemPrompt = "You are Oku Core, an advanced, trauma-informed clinical AI assistant. ";

    if (userRole === UserRole.ADMIN) {
      const [vitals, transcripts, logs] = await Promise.all([
        prisma.user.count(),
        prisma.transcript.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
        prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
      ]);
      platformData = { systemVitals: vitals, recentIntelligence: transcripts, auditTrail: logs };
      systemPrompt += "You are advising the Platform Administrator. Analyze system integrity, risk signals, and operational health.";
    } 
    else if (userRole === UserRole.THERAPIST) {
      const [myPatients, mySchedule, recentInsights] = await Promise.all([
        prisma.user.findMany({ where: { clientAppointments: { some: { practitionerId: userId } } }, take: 10 }),
        prisma.appointment.findMany({ where: { practitionerId: userId, startTime: { gte: new Date() } }, include: { client: true }, take: 5 }),
        prisma.transcript.findMany({ where: { appointment: { practitionerId: userId } }, take: 5, orderBy: { createdAt: 'desc' } })
      ]);
      platformData = { patientLoad: myPatients.length, upcomingSchedule: mySchedule, clinicalInsights: recentInsights };
      systemPrompt += "You are a Clinical Supervisor AI. Help the therapist prepare for sessions, summarize patient progress, and identify clinical burnout signals.";
    } 
    else {
      const [myMoods, myAssessments, myCareTeam] = await Promise.all([
        prisma.moodEntry.findMany({ where: { userId }, take: 7, orderBy: { createdAt: 'desc' } }),
        prisma.assessmentAnswer.findMany({ where: { userId }, include: { assessment: true }, take: 3, orderBy: { completedAt: 'desc' } }),
        prisma.appointment.findMany({ where: { clientId: userId }, include: { practitioner: true }, take: 2 })
      ]);
      platformData = { moodTrend: myMoods, latestScreenings: myAssessments, careTeam: myCareTeam };
      systemPrompt += "You are a Compassionate Care Companion. Be deeply empathetic, trauma-informed, and validating. Help the patient reflect on their mood trends and prepare for their next therapy session.";
    }

    const fullPrompt = `
      CONTEXT: ${userRole} Dashboard
      PLATFORM_DATA: ${JSON.stringify(platformData)}
      USER_QUERY: ${prompt}

      Respond with clinical precision but human warmth. Use the data to give specific, actionable insights.
    `;

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
