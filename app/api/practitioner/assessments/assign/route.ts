import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AssessmentBillingStatus, UserRole } from "@prisma/client"
import { getAssessmentRevenueSplit, getPlatformSettings } from "@/lib/provider-finance"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { clientId, assessmentId } = await req.json()

    if (!clientId || !assessmentId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const [assessment, settings, existingRelationship, existingAssignment] = await Promise.all([
      prisma.assessment.findFirst({
        where: {
          id: assessmentId,
          OR: [
            { isCustom: false },
            { creatorId: session.user.id },
          ],
        },
        select: { id: true, price: true },
      }),
      getPlatformSettings(),
      prisma.appointment.findFirst({
        where: {
          practitionerId: session.user.id,
          clientId,
        },
        select: { id: true },
      }),
      prisma.assignedAssessment.findFirst({
        where: {
          clientId,
          practitionerId: session.user.id,
          assessmentId,
          status: 'PENDING',
        },
        select: { id: true },
      }),
    ])

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 })
    }

    if (!existingRelationship) {
      return new NextResponse("You can only assign assessments to clients in your caseload.", { status: 403 })
    }

    if (existingAssignment) {
      return new NextResponse("This assessment is already pending for the selected client.", { status: 409 })
    }

    const chargeAmount = assessment.price || 0
    const revenueSplit = getAssessmentRevenueSplit({
      grossAmount: chargeAmount,
      settings,
    })

    const assignment = await prisma.assignedAssessment.create({
      data: {
        clientId,
        assessmentId,
        practitionerId: session.user.id,
        status: "PENDING",
        chargeAmount,
        billingStatus: chargeAmount > 0 ? AssessmentBillingStatus.PENDING : AssessmentBillingStatus.NOT_REQUIRED,
        platformFeePercent: revenueSplit.platformFeePercent,
        platformFeeAmount: revenueSplit.platformFeeAmount,
        practitionerPayoutAmount: revenueSplit.practitionerPayoutAmount,
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("[ASSESSMENT_ASSIGN_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
