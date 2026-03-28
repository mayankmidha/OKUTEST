import { prisma } from '@/lib/prisma'
import { autoConvert, formatCurrency } from '@/lib/currency'
import { isPsychiatristProfile } from '@/lib/practitioner-type'
import type { PlatformSettings } from '@prisma/client'

type PractitionerProfileLike = {
  specialization?: string[] | null
} | null | undefined

export const DEFAULT_PLATFORM_SETTINGS = {
  maintenanceMode: false,
  platformFeePercent: 20,
  therapySessionPlatformFeePercent: 20,
  psychiatrySessionPlatformFeePercent: 20,
  assessmentPlatformFeePercent: 20,
  minimumPayoutAmount: 25,
}

type PlatformSettingsLike = Partial<PlatformSettings> | null | undefined

export function normalizePlatformSettings(settings?: PlatformSettingsLike) {
  return {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...settings,
  }
}

export function roundMoney(amount: number) {
  return Number(amount.toFixed(2))
}

export function formatMoney(amount: number) {
  const converted = autoConvert(amount)
  return formatCurrency(converted.amount, converted.currency)
}

export function calculateRevenueSplit(grossAmount: number, platformFeePercent: number) {
  const normalizedGross = roundMoney(Math.max(grossAmount, 0))
  const normalizedPercent = roundMoney(Math.max(platformFeePercent, 0))
  const platformFeeAmount = roundMoney(normalizedGross * (normalizedPercent / 100))
  const practitionerPayoutAmount = roundMoney(Math.max(normalizedGross - platformFeeAmount, 0))

  return {
    grossAmount: normalizedGross,
    platformFeePercent: normalizedPercent,
    platformFeeAmount,
    practitionerPayoutAmount,
  }
}

export function getSessionPlatformFeePercent(
  practitionerProfile: PractitionerProfileLike,
  settings?: PlatformSettingsLike
) {
  const normalizedSettings = normalizePlatformSettings(settings)

  if (isPsychiatristProfile(practitionerProfile)) {
    return normalizedSettings.psychiatrySessionPlatformFeePercent
  }

  return normalizedSettings.therapySessionPlatformFeePercent
}

export function getSessionRevenueSplit({
  grossAmount,
  practitionerProfile,
  settings,
}: {
  grossAmount: number
  practitionerProfile: PractitionerProfileLike
  settings?: PlatformSettingsLike
}) {
  return calculateRevenueSplit(
    grossAmount,
    getSessionPlatformFeePercent(practitionerProfile, settings)
  )
}

export function getAssessmentRevenueSplit({
  grossAmount,
  settings,
}: {
  grossAmount: number
  settings?: PlatformSettingsLike
}) {
  const normalizedSettings = normalizePlatformSettings(settings)
  return calculateRevenueSplit(grossAmount, normalizedSettings.assessmentPlatformFeePercent)
}

export async function getPlatformSettings() {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'global' },
  })

  return normalizePlatformSettings(settings)
}

function resolveSessionRevenue(payment: {
  amount: number
  platformFeePercent: number
  platformFeeAmount: number
  practitionerPayoutAmount: number
}, practitionerProfile: PractitionerProfileLike, settings: ReturnType<typeof normalizePlatformSettings>) {
  if (
    payment.amount === 0 ||
    payment.platformFeePercent > 0 ||
    payment.platformFeeAmount > 0 ||
    payment.practitionerPayoutAmount > 0
  ) {
    return {
      grossAmount: payment.amount,
      platformFeePercent: payment.platformFeePercent,
      platformFeeAmount: payment.platformFeeAmount,
      practitionerPayoutAmount: payment.practitionerPayoutAmount,
    }
  }

  return getSessionRevenueSplit({
    grossAmount: payment.amount,
    practitionerProfile,
    settings,
  })
}

function resolveAssessmentRevenue(assignment: {
  chargeAmount: number
  platformFeePercent: number
  platformFeeAmount: number
  practitionerPayoutAmount: number
}, settings: ReturnType<typeof normalizePlatformSettings>) {
  if (
    assignment.chargeAmount === 0 ||
    assignment.platformFeePercent > 0 ||
    assignment.platformFeeAmount > 0 ||
    assignment.practitionerPayoutAmount > 0
  ) {
    return {
      grossAmount: assignment.chargeAmount,
      platformFeePercent: assignment.platformFeePercent,
      platformFeeAmount: assignment.platformFeeAmount,
      practitionerPayoutAmount: assignment.practitionerPayoutAmount,
    }
  }

  return getAssessmentRevenueSplit({
    grossAmount: assignment.chargeAmount,
    settings,
  })
}

export async function getPractitionerFinanceSummary(practitionerId: string) {
  const [settings, practitioner, sessionPayments, assessmentCharges, payouts] = await Promise.all([
    getPlatformSettings(),
    prisma.user.findUnique({
      where: { id: practitionerId },
      include: { practitionerProfile: true },
    }),
    prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        appointment: { practitionerId },
      },
      include: {
        appointment: {
          include: {
            client: { select: { name: true } },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assignedAssessment.findMany({
      where: {
        practitionerId,
        billingStatus: 'COMPLETED',
      },
      include: {
        assessment: { select: { title: true } },
        client: { select: { name: true } },
      },
      orderBy: { chargedAt: 'desc' },
    }),
    prisma.payout.findMany({
      where: { practitionerId },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const sessionEarnings = sessionPayments.map((payment) => {
    const revenue = resolveSessionRevenue(
      {
        amount: payment.amount,
        platformFeePercent: payment.platformFeePercent,
        platformFeeAmount: payment.platformFeeAmount,
        practitionerPayoutAmount: payment.practitionerPayoutAmount,
      },
      practitioner?.practitionerProfile,
      settings
    )

    return {
      ...payment,
      ...revenue,
      sourceLabel: payment.appointment?.service?.name || 'Session',
      sourceType: 'SESSION' as const,
      eventDate: payment.createdAt,
      clientName: payment.appointment?.client?.name || 'Client',
    }
  })

  const assessmentEarnings = assessmentCharges.map((assignment) => {
    const revenue = resolveAssessmentRevenue(
      {
        chargeAmount: assignment.chargeAmount,
        platformFeePercent: assignment.platformFeePercent,
        platformFeeAmount: assignment.platformFeeAmount,
        practitionerPayoutAmount: assignment.practitionerPayoutAmount,
      },
      settings
    )

    return {
      ...assignment,
      ...revenue,
      sourceLabel: assignment.assessment.title,
      sourceType: 'ASSESSMENT' as const,
      eventDate: assignment.chargedAt || assignment.completedAt || assignment.createdAt,
      clientName: assignment.client.name || 'Client',
    }
  })

  const totalSessionGross = roundMoney(sessionEarnings.reduce((sum, item) => sum + item.grossAmount, 0))
  const totalAssessmentGross = roundMoney(assessmentEarnings.reduce((sum, item) => sum + item.grossAmount, 0))
  const totalSessionEarnings = roundMoney(sessionEarnings.reduce((sum, item) => sum + item.practitionerPayoutAmount, 0))
  const totalAssessmentEarnings = roundMoney(assessmentEarnings.reduce((sum, item) => sum + item.practitionerPayoutAmount, 0))
  const totalPlatformFeesGenerated = roundMoney(
    sessionEarnings.reduce((sum, item) => sum + item.platformFeeAmount, 0) +
      assessmentEarnings.reduce((sum, item) => sum + item.platformFeeAmount, 0)
  )

  const completedPayouts = payouts.filter((payout) => payout.status === 'COMPLETED')
  const pendingPayouts = payouts.filter((payout) => payout.status === 'PENDING')
  const paidOutAmount = roundMoney(completedPayouts.reduce((sum, payout) => sum + payout.amount, 0))
  const pendingPayoutAmount = roundMoney(pendingPayouts.reduce((sum, payout) => sum + payout.amount, 0))
  const totalEarned = roundMoney(totalSessionEarnings + totalAssessmentEarnings)
  const grossCollected = roundMoney(totalSessionGross + totalAssessmentGross)
  const availableBalance = roundMoney(Math.max(totalEarned - paidOutAmount - pendingPayoutAmount, 0))

  return {
    settings,
    practitioner,
    totalEarned,
    grossCollected,
    totalPlatformFeesGenerated,
    totalSessionGross,
    totalAssessmentGross,
    totalSessionEarnings,
    totalAssessmentEarnings,
    paidOutAmount,
    pendingPayoutAmount,
    availableBalance,
    payouts,
    sessionEarnings,
    assessmentEarnings,
  }
}
