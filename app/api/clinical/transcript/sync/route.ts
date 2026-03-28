import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { analyzeClinicalTranscript, getOkuAiSettings } from "@/lib/oku-ai"


export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user.role !== UserRole.THERAPIST && session.user.role !== UserRole.ADMIN)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { appointmentId, rawTranscript } = await req.json()

    if (!appointmentId || !rawTranscript) {
      return new NextResponse("Missing data", { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: {
          include: {
            assessmentAnswers: {
              include: {
                assessment: {
                  select: {
                    title: true,
                  },
                },
              },
              orderBy: { completedAt: "desc" },
              take: 4,
            },
          },
        },
        practitioner: {
          select: { name: true },
        },
        service: true,
      }
    })

    if (!appointment) return new NextResponse("Appointment not found", { status: 404 })

    const settings = await getOkuAiSettings()

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ error: "OKU_AI_DISABLED" }, { status: 503 })
    }

    if (settings.requireConsentBeforeTranscription && !appointment.client?.hasSignedConsent) {
      return NextResponse.json({ error: "TRANSCRIPTION_CONSENT_REQUIRED" }, { status: 403 })
    }

    const aiAnalysis = await analyzeClinicalTranscript({
      transcriptContent: rawTranscript,
      patientName: appointment.client?.name,
      sessionType: appointment.service?.name,
      practitionerName: appointment.practitioner?.name,
      recentAssessments: appointment.client?.assessmentAnswers?.map((answer) => ({
        title: answer.assessment?.title,
        result: answer.result,
        score: answer.score,
      })),
      settings,
    })

    // 2. Save to Transcript model
    const transcript = await prisma.transcript.upsert({
      where: { appointmentId: appointment.id },
      update: {
        content: rawTranscript,
        detectedLanguage: aiAnalysis.detectedLanguage,
        summary: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        riskLevel: aiAnalysis.riskLevel,
        keyInsights: aiAnalysis.keyInsights,
        sentimentScores: aiAnalysis.sentimentScores,
        clinicalSignals: aiAnalysis.clinicalSignals,
        adhdSignals: aiAnalysis.adhdSignals,
        careRecommendations: aiAnalysis.careRecommendations,
      },
      create: {
        appointmentId: appointment.id,
        content: rawTranscript,
        detectedLanguage: aiAnalysis.detectedLanguage,
        summary: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        keyInsights: aiAnalysis.keyInsights,
        riskLevel: aiAnalysis.riskLevel,
        sentimentScores: aiAnalysis.sentimentScores,
        clinicalSignals: aiAnalysis.clinicalSignals,
        adhdSignals: aiAnalysis.adhdSignals,
        careRecommendations: aiAnalysis.careRecommendations,
      }
    })

    await prisma.soapNote.upsert({
      where: { appointmentId: appointment.id },
      update: {
        subjective: aiAnalysis.soapNote.S,
        objective: aiAnalysis.soapNote.O,
        assessment: aiAnalysis.soapNote.A,
        plan: aiAnalysis.soapNote.P,
      },
      create: {
        appointmentId: appointment.id,
        subjective: aiAnalysis.soapNote.S,
        objective: aiAnalysis.soapNote.O,
        assessment: aiAnalysis.soapNote.A,
        plan: aiAnalysis.soapNote.P,
      },
    })

    return NextResponse.json({ 
        success: true, 
        transcriptId: transcript.id,
        analysis: aiAnalysis 
    })

  } catch (error) {
    console.error("[OKU_CORE_AI_SYNC_ERROR]", error)
    return new NextResponse("Internal AI Sync Error", { status: 500 })
  }
}
