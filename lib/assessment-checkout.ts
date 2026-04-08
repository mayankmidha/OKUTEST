import { AssessmentBillingStatus, UserRole } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { getAssessmentRevenueSplit, getPlatformSettings } from '@/lib/provider-finance'

const assessmentCheckoutInclude = {
  assessment: true,
  practitioner: true,
} as const

export async function resolveAssessmentCheckoutAssignment(entityId: string, userId: string) {
  const existingAssignment = await prisma.assignedAssessment.findFirst({
    where: {
      id: entityId,
      clientId: userId,
    },
    include: assessmentCheckoutInclude,
  })

  if (existingAssignment) {
    return existingAssignment
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: entityId },
    include: {
      creator: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  })

  if (!assessment || !assessment.isActive || assessment.price <= 0 || !assessment.isPublic) {
    return null
  }

  const practitionerId = assessment.creatorId
  const creatorRole = assessment.creator?.role

  if (!practitionerId || (creatorRole !== UserRole.THERAPIST && creatorRole !== UserRole.ADMIN)) {
    return null
  }

  const pendingAssignment = await prisma.assignedAssessment.findFirst({
    where: {
      clientId: userId,
      practitionerId,
      assessmentId: assessment.id,
      status: 'PENDING',
    },
    include: assessmentCheckoutInclude,
    orderBy: { createdAt: 'desc' },
  })

  if (pendingAssignment) {
    return pendingAssignment
  }

  const settings = await getPlatformSettings()
  const revenueSplit = getAssessmentRevenueSplit({
    grossAmount: assessment.price || 0,
    settings,
  })

  return prisma.assignedAssessment.create({
    data: {
      clientId: userId,
      practitionerId,
      assessmentId: assessment.id,
      status: 'PENDING',
      chargeAmount: assessment.price || 0,
      billingStatus:
        (assessment.price || 0) > 0
          ? AssessmentBillingStatus.PENDING
          : AssessmentBillingStatus.NOT_REQUIRED,
      platformFeePercent: revenueSplit.platformFeePercent,
      platformFeeAmount: revenueSplit.platformFeeAmount,
      practitionerPayoutAmount: revenueSplit.practitionerPayoutAmount,
    },
    include: assessmentCheckoutInclude,
  })
}
