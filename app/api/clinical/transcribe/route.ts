import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { analyzeClinicalTranscript, getOkuAiSettings, transcribeClinicalAudio } from "@/lib/oku-ai"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || (session.user.role !== UserRole.THERAPIST && session.user.role !== UserRole.ADMIN)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { appointmentId, audioBase64, mimeType } = await req.json()
    const settings = await getOkuAiSettings()

    if (!appointmentId || !audioBase64 || !mimeType) {
      return new NextResponse("Missing audio payload", { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: {
          select: {
            name: true,
            hasSignedConsent: true,
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
        service: { select: { name: true } },
      },
    })

    if (!appointment) {
      return new NextResponse("Appointment not found", { status: 404 })
    }

    if (session.user.role !== UserRole.ADMIN && appointment.practitionerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ error: "OKU_AI_DISABLED" }, { status: 503 })
    }

    if (settings.requireConsentBeforeTranscription && !appointment.client?.hasSignedConsent) {
      return NextResponse.json({ error: "TRANSCRIPTION_CONSENT_REQUIRED" }, { status: 403 })
    }

    const transcription = await transcribeClinicalAudio({
      audioBase64,
      mimeType,
      settings,
    })

    const analysis = await analyzeClinicalTranscript({
      transcriptContent: transcription.transcript,
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

    const transcript = await prisma.transcript.upsert({
      where: { appointmentId: appointment.id },
      create: {
        appointmentId: appointment.id,
        content: transcription.transcript,
        detectedLanguage: transcription.detectedLanguage,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskLevel,
        keyInsights: analysis.keyInsights,
        sentimentScores: analysis.sentimentScores,
        clinicalSignals: analysis.clinicalSignals,
        adhdSignals: analysis.adhdSignals,
        careRecommendations: analysis.careRecommendations,
      },
      update: {
        content: transcription.transcript,
        detectedLanguage: transcription.detectedLanguage,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        riskLevel: analysis.riskLevel,
        keyInsights: analysis.keyInsights,
        sentimentScores: analysis.sentimentScores,
        clinicalSignals: analysis.clinicalSignals,
        adhdSignals: analysis.adhdSignals,
        careRecommendations: analysis.careRecommendations,
      },
    })

    await prisma.soapNote.upsert({
      where: { appointmentId: appointment.id },
      update: {
        subjective: analysis.soapNote.S,
        objective: analysis.soapNote.O,
        assessment: analysis.soapNote.A,
        plan: analysis.soapNote.P,
      },
      create: {
        appointmentId: appointment.id,
        subjective: analysis.soapNote.S,
        objective: analysis.soapNote.O,
        assessment: analysis.soapNote.A,
        plan: analysis.soapNote.P,
      },
    })

    return NextResponse.json({
      success: true,
      transcriptId: transcript.id,
      transcription,
      analysis,
    })
  } catch (error) {
    console.error("[CLINICAL_TRANSCRIBE_ERROR]", error)
    return new NextResponse("Clinical transcription failed", { status: 500 })
  }
}
