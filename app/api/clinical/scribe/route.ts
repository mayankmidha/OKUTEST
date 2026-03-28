import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { draftClinicalScribe, getOkuAiSettings } from "@/lib/oku-ai"


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

    if (!appointment || !appointment.client) return new NextResponse("Appointment or Client not found", { status: 404 })

    // 2. Format Clinical Context
    const clinicalContext = {
      patientName: appointment.client.name,
      sessionType: appointment.service.name,
      recentMoods: appointment.client.moodEntries.map(m => ({ score: m.mood, notes: m.notes })),
      recentAssessments: appointment.client.assessmentAnswers.map(a => ({ title: a.assessment.title, result: a.result })),
      activeGoals: appointment.client.clientTreatmentPlans[0]?.goals
    }

    const settings = await getOkuAiSettings()

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ error: "OKU_AI_DISABLED" }, { status: 503 })
    }

    const draft = await draftClinicalScribe(clinicalContext)

    return NextResponse.json({ draft, adhdCareModeEnabled: settings.adhdCareModeEnabled })

  } catch (error) {
    console.error("[OCI_SCRIBE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
