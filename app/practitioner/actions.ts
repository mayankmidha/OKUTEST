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

// ─── CIRCLE ACTIONS FOR THERAPISTS ──────────────────────────────────────────

export async function createCircleByPractitioner(data: {
  title: string,
  description?: string,
  startTime: Date,
  endTime: Date,
  maxCapacity: number,
  price: number
}) {
  const session = await checkPractitioner()
  
  let circleService = await prisma.service.findUnique({ where: { name: 'Group Circle' } })
  if (!circleService) {
    circleService = await prisma.service.create({
      data: {
        name: 'Group Circle',
        duration: 60,
        price: data.price,
        description: 'Collaborative group therapy session'
      }
    })
  }

  await prisma.appointment.create({
    data: {
      practitionerId: session.user.id,
      serviceId: circleService.id,
      startTime: data.startTime,
      endTime: data.endTime,
      isGroupSession: true,
      maxParticipants: data.maxCapacity,
      notes: `${data.title}|${data.description}`,
      status: 'CONFIRMED',
      priceSnapshot: data.price
    }
  })

  revalidatePath('/practitioner/dashboard')
  revalidatePath('/circles')
}

export async function deleteCircleByPractitioner(appointmentId: string) {
  const session = await checkPractitioner()
  
  // Ensure the practitioner owns the circle
  const circle = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })

  if (!circle || circle.practitionerId !== session.user.id) {
    throw new Error('Unauthorized or circle not found')
  }

  await prisma.appointment.delete({
    where: { id: appointmentId }
  })
  
  revalidatePath('/practitioner/dashboard')
  revalidatePath('/circles')
}

export async function addParticipantToCircleByPractitioner(appointmentId: string, userId: string) {
  const session = await checkPractitioner()
  
  const circle = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })

  if (!circle || circle.practitionerId !== session.user.id) {
    throw new Error('Unauthorized or circle not found')
  }

  await prisma.groupParticipant.upsert({
    where: {
      appointmentId_userId: { appointmentId, userId }
    },
    update: {},
    create: { appointmentId, userId }
  })
  
  revalidatePath('/practitioner/dashboard')
}

export async function removeParticipantFromCircleByPractitioner(participantId: string) {
  const session = await checkPractitioner()
  
  const participant = await prisma.groupParticipant.findUnique({
    where: { id: participantId },
    include: { appointment: true }
  })

  if (!participant || participant.appointment.practitionerId !== session.user.id) {
    throw new Error('Unauthorized or participant not found')
  }

  await prisma.groupParticipant.delete({
    where: { id: participantId }
  })
  
  revalidatePath('/practitioner/dashboard')
}

