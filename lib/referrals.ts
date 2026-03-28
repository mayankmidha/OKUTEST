import { prisma } from '@/lib/prisma'
import { PaymentStatus, UserRole } from '@prisma/client'

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

  const rewardAmount = Number((appointment.service.price * (REFERRAL_REWARD_PERCENT / 100)).toFixed(2))

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
        rewardPercent: REFERRAL_REWARD_PERCENT,
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

  const availableCredit = appointment.client?.clientProfile?.referralCreditBalance || 0
  const creditApplied = appointment.referralCreditApplied > 0
    ? appointment.referralCreditApplied
    : Math.min(availableCredit, appointment.service.price)

  return {
    grossAmount: appointment.service.price,
    availableCredit,
    creditApplied,
    netAmount: Math.max(appointment.service.price - creditApplied, 0),
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

  if (appointment.referralCreditApplied > 0) {
    return {
      grossAmount: appointment.service.price,
      creditApplied: appointment.referralCreditApplied,
      netAmount: Math.max(appointment.service.price - appointment.referralCreditApplied, 0),
    }
  }

  const availableCredit = appointment.client?.clientProfile?.referralCreditBalance || 0
  const creditApplied = Math.min(availableCredit, appointment.service.price)

  if (!appointment.client?.id || creditApplied <= 0) {
    return {
      grossAmount: appointment.service.price,
      creditApplied: 0,
      netAmount: appointment.service.price,
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
    grossAmount: appointment.service.price,
    creditApplied,
    netAmount: Math.max(appointment.service.price - creditApplied, 0),
  }
}

export async function getReferralSummaryForUser(userId: string) {
  const [referralCount, rewards, clientProfile] = await Promise.all([
    prisma.user.count({
      where: {
        referredById: userId,
        role: UserRole.CLIENT,
      },
    }),
    prisma.referralReward.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.clientProfile.findUnique({
      where: { userId },
      select: { referralCreditBalance: true },
    }),
  ])

  const totalEarned = rewards.reduce((sum, reward) => sum + reward.rewardAmount, 0)

  return {
    referralCount,
    rewards,
    totalEarned,
    availableCredit: clientProfile?.referralCreditBalance || 0,
  }
}
