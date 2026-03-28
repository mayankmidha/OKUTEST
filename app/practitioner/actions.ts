'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPractitionerFinanceSummary } from '@/lib/provider-finance'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@prisma/client'

async function checkPractitioner() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    throw new Error('Unauthorized')
  }

  return session
}

export async function requestPractitionerPayout(data?: { amount?: number; note?: string }) {
  const session = await checkPractitioner()
  const summary = await getPractitionerFinanceSummary(session.user.id)
  const requestedAmount = Number((data?.amount ?? summary.availableBalance).toFixed(2))

  if (requestedAmount <= 0) {
    throw new Error('No available balance to request.')
  }

  if (requestedAmount > summary.availableBalance) {
    throw new Error('Requested payout exceeds available balance.')
  }

  if (requestedAmount < summary.settings.minimumPayoutAmount) {
    throw new Error(`Minimum payout is ${summary.settings.minimumPayoutAmount}.`)
  }

  await prisma.payout.create({
    data: {
      practitionerId: session.user.id,
      amount: requestedAmount,
      status: 'PENDING',
      requestNote: data?.note?.trim() || null,
      periodStart: summary.payouts[summary.payouts.length - 1]?.createdAt || new Date(new Date().setDate(1)),
      periodEnd: new Date(),
    },
  })

  revalidatePath('/practitioner/billing')
  revalidatePath('/practitioner/dashboard')
  revalidatePath('/admin/financials')
}
