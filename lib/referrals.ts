import { prisma } from '@/lib/prisma'
import { PaymentStatus, UserRole } from '@prisma/client'
import { getAppointmentBillingAmount } from '@/lib/pricing'

export const MAX_REFERRAL_REWARDS = 3
export const REFERRAL_REWARD_PERCENT = 10

function normalizeCodePart(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

function buildReferralSeed(name?: string | null) {
  const base = normalizeCodePart(name || 'OKU')
  return (base.slice(0, 6) || 'OKU').padEnd(4, 'X')
}

async function generateUniqueReferralCode(name?: string | null) {
  const seed = buildReferralSeed(name)

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
    const candidate = `${seed}${suffix}`
    const existing = await prisma.user.findUnique({
      where: { referralCode: candidate },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }
  }

  return `${seed}${Date.now().toString(36).slice(-4).toUpperCase()}`
}

export function normalizeReferralCode(referralCode?: string | null) {
  return normalizeCodePart(referralCode || '')
}

export async function createReferralCode(name?: string | null) {
  return generateUniqueReferralCode(name)
}

export async function ensureUserReferralCode(userId: string, name?: string | null) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, name: true },
  })

  if (!user) return null
  if (user.referralCode) return user.referralCode

  const referralCode = await generateUniqueReferralCode(user.name || name)

  await prisma.user.update({
    where: { id: userId },
    data: { referralCode },
  })

  return referralCode
}

export async function findReferralReferrer(referralCode?: string | null) {
  const normalizedCode = normalizeReferralCode(referralCode)
  if (!normalizedCode) return null

  return prisma.user.findUnique({
    where: { referralCode: normalizedCode },
    select: { id: true, role: true },
  })
}

export async function awardReferralRewardForAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: {
        select: { price: true },
      },
      client: {
        select: {
          id: true,
          referredById: true,
        },
      },
      payments: {
        where: { status: PaymentStatus.COMPLETED },
        select: { id: true },
      },
    },
  })

  if (!appointment?.client?.id || !appointment.client.referredById || appointment.payments.length === 0) {
    return null
  }

  const paidSessionsCount = await prisma.appointment.count({
    where: {
      clientId: appointment.client.id,
      payments: {
        some: {
          status: PaymentStatus.COMPLETED,
        },
      },
    },
  })

  if (paidSessionsCount < 1 || paidSessionsCount > MAX_REFERRAL_REWARDS) {
    return null
  }

  const existingReward = await prisma.referralReward.findUnique({
    where: {
      referredUserId_rewardStep: {
        referredUserId: appointment.client.id,
        rewardStep: paidSessionsCount,
      },
    },
    select: { id: true },
  })

  if (existingReward) {
    return null
  }

  // Fetch dynamic settings (Master Vision Control)
  const settings = await prisma.platformSettings.findUnique({ where: { id: 'global' } })
  const rewardPercent = settings?.referralRewardPercent ?? REFERRAL_REWARD_PERCENT
  const maxRewards = settings?.maxReferralRewards ?? MAX_REFERRAL_REWARDS

  if (paidSessionsCount > maxRewards) {
    return null
  }

  const appointmentAmount = getAppointmentBillingAmount(appointment)
  const rewardAmount = Number((appointmentAmount * (rewardPercent / 100)).toFixed(2))

  const [, reward] = await prisma.$transaction([
    prisma.clientProfile.upsert({
      where: { userId: appointment.client.referredById },
      update: {
        referralCreditBalance: {
          increment: rewardAmount,
        },
      },
      create: {
        userId: appointment.client.referredById,
        referralCreditBalance: rewardAmount,
      },
    }),
    prisma.referralReward.create({
      data: {
        referrerId: appointment.client.referredById,
        referredUserId: appointment.client.id,
        appointmentId,
        rewardStep: paidSessionsCount,
        rewardPercent: rewardPercent,
        rewardAmount,
        status: 'EARNED',
      },
    }),
  ])

  return reward
}

export async function getCheckoutReferralCredit(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: {
        select: { price: true },
      },
      client: {
        select: {
          clientProfile: {
            select: {
              referralCreditBalance: true,
            },
          },
        },
      },
    },
  })

  if (!appointment) return null
  const appointmentAmount = getAppointmentBillingAmount(appointment)

  const availableCredit = appointment.client?.clientProfile?.referralCreditBalance || 0
  const creditApplied = appointment.referralCreditApplied > 0
    ? appointment.referralCreditApplied
    : Math.min(availableCredit, appointmentAmount)

  return {
    grossAmount: appointmentAmount,
    availableCredit,
    creditApplied,
    netAmount: Math.max(appointmentAmount - creditApplied, 0),
  }
}

export async function applyReferralCreditToAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: {
        select: { price: true },
      },
      client: {
        select: {
          id: true,
          clientProfile: {
            select: {
              referralCreditBalance: true,
            },
          },
        },
      },
    },
  })

  if (!appointment) return null
  const appointmentAmount = getAppointmentBillingAmount(appointment)

  if (appointment.referralCreditApplied > 0) {
    return {
      grossAmount: appointmentAmount,
      creditApplied: appointment.referralCreditApplied,
      netAmount: Math.max(appointmentAmount - appointment.referralCreditApplied, 0),
    }
  }

  const availableCredit = appointment.client?.clientProfile?.referralCreditBalance || 0
  const creditApplied = Math.min(availableCredit, appointmentAmount)

  if (!appointment.client?.id || creditApplied <= 0) {
    return {
      grossAmount: appointmentAmount,
      creditApplied: 0,
      netAmount: appointmentAmount,
    }
  }

  await prisma.$transaction([
    prisma.clientProfile.update({
      where: { userId: appointment.client.id },
      data: {
        referralCreditBalance: {
          decrement: creditApplied,
        },
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        referralCreditApplied: creditApplied,
      },
    }),
  ])

  return {
    grossAmount: appointmentAmount,
    creditApplied,
    netAmount: Math.max(appointmentAmount - creditApplied, 0),
  }
}

export async function getReferralSummaryForUser(userId: string) {
  const [referredClients, rewards, clientProfile, redeemedCredit] = await Promise.all([
    prisma.user.findMany({
      where: {
        referredById: userId,
        role: UserRole.CLIENT,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        clientAppointments: {
          where: {
            payments: {
              some: {
                status: PaymentStatus.COMPLETED,
              },
            },
          },
          select: {
            id: true,
            startTime: true,
            priceSnapshot: true,
            service: {
              select: {
                name: true,
                price: true,
              },
            },
            payments: {
              where: {
                status: PaymentStatus.COMPLETED,
              },
              orderBy: { createdAt: 'desc' },
              select: {
                amount: true,
                createdAt: true,
                processor: true,
              },
            },
            referralReward: {
              select: {
                id: true,
                rewardStep: true,
                rewardAmount: true,
                createdAt: true,
              },
            },
          },
          orderBy: { startTime: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.referralReward.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: { name: true },
        },
        appointment: {
          select: {
            startTime: true,
            priceSnapshot: true,
            service: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.clientProfile.findUnique({
      where: { userId },
      select: { referralCreditBalance: true },
    }),
    prisma.appointment.aggregate({
      where: {
        clientId: userId,
        referralCreditApplied: {
          gt: 0,
        },
      },
      _sum: {
        referralCreditApplied: true,
      },
    }),
  ])

  const totalEarned = rewards.reduce((sum, reward) => sum + reward.rewardAmount, 0)
  const referralCount = referredClients.length

  const trackedReferrals = referredClients.map((client) => {
    const rewardsForClient = rewards.filter((reward) => reward.referredUserId === client.id)
    const paidSessionsCount = client.clientAppointments.length
    const rewardedSessionsCount = rewardsForClient.length
    const earnedAmount = rewardsForClient.reduce((sum, reward) => sum + reward.rewardAmount, 0)

    return {
      id: client.id,
      name: client.name,
      joinedAt: client.createdAt,
      paidSessionsCount,
      rewardedSessionsCount,
      earnedAmount,
      latestPaidSessionAt:
        client.clientAppointments[0]?.payments[0]?.createdAt || client.clientAppointments[0]?.startTime || null,
      sessionsRemainingForRewards: Math.max(MAX_REFERRAL_REWARDS - rewardedSessionsCount, 0),
      sessions: client.clientAppointments.map((appointment) => ({
        id: appointment.id,
        startTime: appointment.startTime,
        serviceName: appointment.service.name,
        price: getAppointmentBillingAmount(appointment),
        paidAmount: appointment.payments[0]?.amount || 0,
        paidAt: appointment.payments[0]?.createdAt || null,
        processor: appointment.payments[0]?.processor || null,
        reward: appointment.referralReward,
      })),
    }
  })

  const convertedReferralCount = trackedReferrals.filter((client) => client.paidSessionsCount > 0).length

  return {
    referralCount,
    convertedReferralCount,
    rewards,
    totalEarned,
    availableCredit: clientProfile?.referralCreditBalance || 0,
    totalCreditRedeemed: redeemedCredit._sum.referralCreditApplied || 0,
    referredClients: trackedReferrals,
  }
}
