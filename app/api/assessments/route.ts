import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AssessmentBillingStatus } from "@prisma/client"
import { calculateAssessmentResult, isHighRisk } from "@/lib/clinical-intelligence"
import { triggerEmergencyAlert } from "@/lib/notifications"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { type, responses, assignmentId } = await req.json()

    // 1. Find assessment by title
    const assessmentDef = await prisma.assessment.findFirst({
      where: { title: type }
    })

    if (!assessmentDef) {
      return new NextResponse("Assessment type not found in database", { status: 404 })
    }

    // 2. Industrial-grade Server-side Scoring (Protects data integrity)
    // We try to match based on the assessmentDef.title to our logic
    let assessmentIdForLogic = assessmentDef.title.toLowerCase().includes('phq-9') ? 'phq-9' : 
                               assessmentDef.title.toLowerCase().includes('gad-7') ? 'gad-7' :
                               assessmentDef.title.toLowerCase().includes('asrs') ? 'asrs-v1.1' : null
    
    let calculatedScore = null
    let calculatedResult = "Completed"

    if (assessmentIdForLogic) {
        const clinicalResult = calculateAssessmentResult(assessmentIdForLogic, responses)
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
            chargeAmount: true,
            billingStatus: true,
          },
        })
      : null

    // 4. Save Verified Result
    const assessmentAnswer = await prisma.assessmentAnswer.create({
      data: {
        userId: session.user.id,
        assessmentId: assessmentDef.id,
        answers: responses,
        score: calculatedScore,
        result: calculatedResult,
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
          assignment.chargeAmount > 0 && assignment.billingStatus !== AssessmentBillingStatus.COMPLETED
            ? {
                billingStatus: AssessmentBillingStatus.COMPLETED,
                processor: 'assessment-completion',
                chargedAt: new Date(),
              }
            : assignment.chargeAmount > 0
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
