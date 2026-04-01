import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { analyzeClinicalTranscript, getOkuAiSettings } from "@/lib/oku-ai"


export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { appointmentId, transcript: incomingTranscript } = await req.json()

    // 1. Gather all clinical context for the LLM
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId, practitionerId: session.user.id },
      include: {
        client: {
          include: {
            moodEntries: { orderBy: { createdAt: 'desc' }, take: 5 },
            assessmentAnswers: { include: { assessment: true }, orderBy: { completedAt: 'desc' }, take: 2 },
            clientTreatmentPlans: { where: { status: 'ACTIVE' }, take: 1 },
            transcripts: { where: { appointmentId: appointmentId }, take: 1 }
          }
        },
        service: true
      }
    })

    if (!appointment || !appointment.client) return new NextResponse("Appointment or Client not found", { status: 404 })

    const transcriptContent = incomingTranscript || appointment.client.transcripts[0]?.content || "No transcript provided."
    const settings = await getOkuAiSettings()

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ error: "OKU_AI_DISABLED" }, { status: 503 })
    }

    // 2. Perform deep clinical analysis using Google GenAI
    const analysis = await analyzeClinicalTranscript({
      transcriptContent,
      patientName: appointment.client.name,
      sessionType: appointment.service.name,
      practitionerName: session.user.name,
      recentAssessments: appointment.client.assessmentAnswers.map(a => ({ title: a.assessment.title, result: a.result })),
      settings
    })

    // 3. Save the intelligence back to the database for persistence
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        aiSummary: analysis.summary,
        aiSentiment: analysis.sentiment,
        aiRiskLevel: analysis.riskLevel,
        soapNotes: JSON.stringify(analysis.soapNote)
      }
    })

    return NextResponse.json({ analysis, adhdCareModeEnabled: settings.adhdCareModeEnabled })

  } catch (error) {
    console.error("[OCI_SCRIBE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
