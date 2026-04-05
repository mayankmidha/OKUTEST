import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getOkuAiSettings } from "@/lib/oku-ai";
import { triggerEmergencyAlert } from "@/lib/notifications";
import { analyzeTranscriptWithMemory } from "@/lib/ai-memory";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { appointmentId, transcriptContent } = await req.json();

    if (!appointmentId || !transcriptContent) {
      return new NextResponse("Missing transcript payload", { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        practitioner: {
          select: { name: true, email: true },
        },
        client: {
          select: {
            id: true,
            hasSignedConsent: true,
            name: true,
            email: true,
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
        service: {
          select: { name: true },
        },
      },
    });

    if (!appointment) {
      return new NextResponse("Appointment not found", { status: 404 });
    }

    const isAdmin = session.user.role === UserRole.ADMIN
    const canAccessAppointment =
      isAdmin ||
      appointment.practitionerId === session.user.id ||
      appointment.clientId === session.user.id

    if (!canAccessAppointment) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await getOkuAiSettings()

    if (!settings.okuAiEnabled) {
      return NextResponse.json({ error: "OKU_AI_DISABLED" }, { status: 503 })
    }

    if (settings.requireConsentBeforeTranscription && !appointment.client?.hasSignedConsent) {
      return NextResponse.json({ error: "TRANSCRIPTION_CONSENT_REQUIRED" }, { status: 403 })
    }

    if (!appointment.client?.id) {
      return new NextResponse("Client record missing", { status: 400 });
    }

    // MASTER AI UPGRADE: Analyze with historical memory and multilingual awareness
    const aiResponse = await analyzeTranscriptWithMemory({
      appointmentId,
      transcriptContent,
      clientId: appointment.client.id,
    });

    await prisma.transcript.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        content: transcriptContent,
        detectedLanguage: aiResponse.detectedLanguage,
        summary: aiResponse.summary,
        sentiment: aiResponse.sentiment,
        riskLevel: aiResponse.riskLevel,
        keyInsights: aiResponse.keyInsights || aiResponse.clinicalSignals, // Supporting legacy
        sentimentScores: aiResponse.sentimentScores || {},
        clinicalSignals: aiResponse.clinicalSignals,
        adhdSignals: aiResponse.adhdSignals || [],
        careRecommendations: aiResponse.treatmentRecommendations,
      },
      update: {
        content: transcriptContent,
        detectedLanguage: aiResponse.detectedLanguage,
        summary: aiResponse.summary,
        sentiment: aiResponse.sentiment,
        riskLevel: aiResponse.riskLevel,
        keyInsights: aiResponse.keyInsights || aiResponse.clinicalSignals,
        clinicalSignals: aiResponse.clinicalSignals,
        careRecommendations: aiResponse.treatmentRecommendations,
      }
    });

    // Handle high/critical risk detection alerts (Industrial Safety)
    if (aiResponse.riskLevel === 'HIGH' || aiResponse.riskLevel === 'CRITICAL') {
        await triggerEmergencyAlert({
            appointmentId,
            riskLevel: aiResponse.riskLevel,
            clinicalSignals: [
                ...aiResponse.clinicalSignals, 
                `SUICIDE_RISK: ${aiResponse.suicideRisk}`,
                `VIOLENCE_RISK: ${aiResponse.violenceRisk}`
            ]
        })
    }

    // 4. Upsert the SOAP Note draft
    await prisma.soapNote.upsert({
      where: { appointmentId },
      update: {
        subjective: aiResponse.soapNote.S,
        objective: aiResponse.soapNote.O,
        assessment: aiResponse.soapNote.A,
        plan: aiResponse.soapNote.P,
      },
      create: {
        appointmentId,
        subjective: aiResponse.soapNote.S,
        objective: aiResponse.soapNote.O,
        assessment: aiResponse.soapNote.A,
        plan: aiResponse.soapNote.P,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Clinical intelligence processed.",
      analysis: aiResponse,
    });

  } catch (error) {
    console.error("[TRANSCRIPT_PROCESS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
