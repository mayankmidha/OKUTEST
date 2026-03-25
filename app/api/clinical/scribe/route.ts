import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { GoogleGenerativeAI } from "@google/generative-ai"


export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { appointmentId } = await req.json()

    // 1. Gather all clinical context for the LLM
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId, practitionerId: session.user.id },
      include: {
        client: {
          include: {
            moodEntries: { orderBy: { createdAt: 'desc' }, take: 5 },
            assessmentAnswers: { include: { assessment: true }, orderBy: { completedAt: 'desc' }, take: 2 },
            clientTreatmentPlans: { where: { status: 'ACTIVE' }, take: 1 }
          }
        },
        service: true
      }
    })

    if (!appointment) return new NextResponse("Appointment not found", { status: 404 })

    // 2. Format Clinical Context
    const clinicalContext = {
      patientName: appointment.client?.name || 'Unknown Patient',
      sessionType: appointment.service?.name || 'Session',
      recentMoods: appointment.client?.moodEntries?.map(m => ({ score: m.mood, notes: m.notes })) || [],
      recentAssessments: appointment.client?.assessmentAnswers?.map(a => ({ title: a.assessment?.title, result: a.result })) || [],
      activeGoals: appointment.client?.clientTreatmentPlans?.[0]?.goals
    }

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ draft: "OCI OFFLINE: Please configure API key to use Scribe." })
    }

    // 3. Consult OCI Scribe
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const systemPrompt = `You are Oku Clinical Scribe, an expert AI assistant for psychotherapists. Your task is to draft a professional SOAP note based on recent patient data.`
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });
    
    const fullPrompt = `
      Draft a SOAP note for a ${clinicalContext.sessionType} with ${clinicalContext.patientName}.
      
      Patient Data:
      - Recent Mood Trend: ${JSON.stringify(clinicalContext.recentMoods)}
      - Latest Assessments: ${JSON.stringify(clinicalContext.recentAssessments)}
      - Treatment Goals: ${clinicalContext.activeGoals}

      Please provide a draft in exactly 4 sections:
      SUBJECTIVE: (A concise summary of how the patient is feeling based on trends)
      OBJECTIVE: (Observations of behavior and mood consistency)
      ASSESSMENT: (Clinical impression of progress toward goals)
      PLAN: (Proposed focus for the next session)

      Maintain a professional, clinical, yet trauma-informed tone. Keep each section to 2-3 sentences.
    `

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ draft: text })

  } catch (error) {
    console.error("[OCI_SCRIBE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
