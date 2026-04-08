import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AssessmentBillingStatus } from "@prisma/client"
import { calculateAssessmentResult, isHighRisk } from "@/lib/clinical-intelligence"
import { analyzeAssessmentResult } from "@/lib/oku-ai"
import { findCatalogAssessment } from "@/lib/assessment-utils"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, responses, answers, assessmentId, assignmentId } = body
    
    const finalResponses = responses || answers
    const finalId = assessmentId

    // 1. Find assessment by ID or title
    const assessmentDef = await prisma.assessment.findFirst({
      where: {
        OR: [
          { id: finalId || undefined },
          { title: { contains: type || '', mode: 'insensitive' } }
        ]
      }
    })

    if (!assessmentDef) {
      console.error("[ASSESSMENT_NOT_FOUND]", { finalId, type })
      return new NextResponse("Assessment definition not found in database", { status: 404 })
    }

    // 2. Industrial-grade Server-side Scoring (Protects data integrity)
    // We try to match based on the assessmentDef.title to our logic
    const catalogAssessment = findCatalogAssessment({
      id: assessmentDef.id,
      slug: type,
      title: assessmentDef.title,
    })
    const assessmentIdForLogic = catalogAssessment?.id ?? null
    
    let calculatedScore = null
    let calculatedResult = "Completed"

    if (assessmentIdForLogic && finalResponses) {
        const clinicalResult = calculateAssessmentResult(assessmentIdForLogic, finalResponses)
        if (clinicalResult) {
            calculatedScore = clinicalResult.score
            calculatedResult = clinicalResult.result
        }
    }

    // 3. Handle Assignment Link
    const assignment = assignmentId
      ? await prisma.assignedAssessment.findFirst({
          where: {
            id: assignmentId,
            clientId: session.user.id,
          },
          select: {
            id: true,
            status: true,
            assessmentId: true,
            chargeAmount: true,
            billingStatus: true,
          },
        })
      : null

    if (assignmentId && !assignment) {
      return new NextResponse("Assigned assessment not found", { status: 404 })
    }

    if (assignment && assignment.assessmentId !== assessmentDef.id) {
      return new NextResponse("Assigned assessment does not match this screening", { status: 400 })
    }

    if ((assignment?.chargeAmount ?? 0) > 0 && assignment?.billingStatus !== AssessmentBillingStatus.COMPLETED) {
      return new NextResponse("This premium assessment must be unlocked before submission.", { status: 402 })
    }

    if (!assignment && (assessmentDef.price || 0) > 0) {
      return new NextResponse("Premium assessments require an active assignment before submission.", { status: 403 })
    }

    // 4. OKU AI Curation Logic
    let aiCuration = null;
    try {
      aiCuration = await analyzeAssessmentResult({
        patientName: session.user.name || "Patient",
        assessmentTitle: assessmentDef.title,
        score: calculatedScore,
        result: calculatedResult,
        answers: finalResponses
      });
    } catch (aiError) {
      console.error("[ASSESSMENT_AI_ERROR]", aiError);
    }

    // 5. Save Verified Result
    const assessmentAnswer = await prisma.assessmentAnswer.create({
      data: {
        userId: session.user.id,
        assessmentId: assessmentDef.id,
        answers: finalResponses as any,
        score: calculatedScore,
        result: calculatedResult,
        // AI Curation Fields
        aiInterpretation: aiCuration?.aiInterpretation,
        clinicalCuration: aiCuration?.clinicalCuration,
        aiRecommendations: aiCuration?.personalizedRecommendations || [],
        therapistAiNotes: aiCuration?.therapistNotes,
      }
    })

    // 5. Emergency Protocol (Automated Escalation)
    if (assessmentIdForLogic && calculatedScore !== null && isHighRisk(assessmentIdForLogic, calculatedScore)) {
        console.warn(`[CLINICAL_ALERT] High score detected for ${session.user.email} on ${type}`)
        // In a real launch, trigger therapist notification via triggerEmergencyAlert
    }

    // If this was an assigned task, mark it as completed
    if (assignmentId && assignment) {
        const chargeUpdate =
          (assignment.chargeAmount ?? 0) > 0
            ? {}
            : {
                billingStatus: AssessmentBillingStatus.NOT_REQUIRED,
              }

        await prisma.assignedAssessment.update({
            where: { id: assignmentId },
            data: { 
                status: 'COMPLETED',
                completedAt: new Date(),
                ...chargeUpdate,
            }
        }).catch(err => console.error("Failed to update assignment status", err))
    }

    return NextResponse.json(assessmentAnswer)
  } catch (error) {
    console.error("[ASSESSMENTS_POST_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
