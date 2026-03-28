import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AssessmentBillingStatus } from "@prisma/client"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { type, responses, score, result, assignmentId } = await req.json()

    // Find assessment by title (mapping type back to database model)
    const assessmentDef = await prisma.assessment.findFirst({
      where: { title: type }
    })

    if (!assessmentDef) {
      return new NextResponse("Assessment type not found in database", { status: 404 })
    }

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

    const assessmentAnswer = await prisma.assessmentAnswer.create({
      data: {
        userId: session.user.id,
        assessmentId: assessmentDef.id,
        answers: responses,
        score,
        result,
      }
    })

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
