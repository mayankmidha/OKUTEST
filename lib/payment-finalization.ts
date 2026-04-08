import {
  AppointmentStatus,
  AssessmentBillingStatus,
  PaymentStatus,
  RecurringPattern,
} from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { buildAppointmentConflictWhere } from '@/lib/appointment-conflicts'
import { awardReferralRewardForAppointment } from '@/lib/referrals'
import { createRecurringSeries } from '@/lib/recurring-booking'
import { syncAppointmentToExternalCalendar } from '@/lib/calendar-sync'
import { sendInvoiceEmail } from '@/lib/invoicing'
import { sendBookingConfirmation } from '@/lib/notifications'

type FinalizeCheckoutPaymentInput = {
  paymentId: string
  appointmentId?: string | null
  assignmentId?: string | null
  recurringPattern?: RecurringPattern
  externalPaymentId?: string | null
  checkoutSessionId?: string | null
  processor?: string | null
}

type FinalizeCheckoutPaymentResult =
  | {
      ok: true
      entityType: 'APPOINTMENT' | 'GROUP_SESSION' | 'ASSESSMENT'
      entityId: string
      didTransition: boolean
    }
  | {
      ok: false
      reason: 'PAYMENT_NOT_FOUND' | 'TARGET_NOT_FOUND' | 'APPOINTMENT_CONFLICT'
    }

type PaymentTransition = {
  didTransition: boolean
  entityType: 'APPOINTMENT' | 'GROUP_SESSION' | 'ASSESSMENT' | 'APPOINTMENT_CONFLICT' | null
  entityId: string | null
}

export async function finalizeCheckoutPayment(
  input: FinalizeCheckoutPaymentInput
): Promise<FinalizeCheckoutPaymentResult> {
  const existingPayment = await prisma.payment.findUnique({
    where: { id: input.paymentId },
    select: {
      id: true,
      userId: true,
      amount: true,
      appointmentId: true,
      assignedAssessmentId: true,
      status: true,
      processor: true,
      appointment: {
        select: {
          id: true,
          isGroupSession: true,
          status: true,
        },
      },
    },
  })

  if (!existingPayment) {
    return { ok: false, reason: 'PAYMENT_NOT_FOUND' }
  }

  const appointmentId = input.appointmentId ?? existingPayment.appointmentId
  const assignmentId = input.assignmentId ?? existingPayment.assignedAssessmentId
  const processor = input.processor ?? existingPayment.processor ?? undefined
  const now = new Date()

  const transition = await prisma.$transaction<PaymentTransition | null>(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: input.paymentId },
      select: {
        id: true,
        userId: true,
        status: true,
        processor: true,
        appointmentId: true,
        assignedAssessmentId: true,
        appointment: {
          select: {
            id: true,
            isGroupSession: true,
            status: true,
          },
        },
      },
    })

    if (!payment) return null

    const didTransition = payment.status !== PaymentStatus.COMPLETED

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        processor,
        stripePaymentId: input.externalPaymentId ?? undefined,
        stripeCheckoutSessionId: input.checkoutSessionId ?? undefined,
        updatedAt: now,
      },
    })

    if (assignmentId) {
      const assignment = await tx.assignedAssessment.findUnique({
        where: { id: assignmentId },
        select: { id: true },
      })

      if (!assignment) {
        return { didTransition, entityType: null, entityId: null }
      }

      await tx.assignedAssessment.update({
        where: { id: assignmentId },
        data: {
          billingStatus: AssessmentBillingStatus.COMPLETED,
          processor,
          chargedAt: now,
        },
      })

      return {
        didTransition,
        entityType: 'ASSESSMENT' as const,
        entityId: assignmentId,
      }
    }

    if (!appointmentId) {
      return { didTransition, entityType: null, entityId: null }
    }

    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        isGroupSession: true,
        practitionerId: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    })

    if (!appointment) {
      return { didTransition, entityType: null, entityId: null }
    }

    if (appointment.isGroupSession) {
      await tx.groupParticipant.upsert({
        where: {
          appointmentId_userId: {
            appointmentId,
            userId: payment.userId,
          },
        },
        update: {},
        create: {
          appointmentId,
          userId: payment.userId,
        },
      })

      await tx.circleWaitlist.deleteMany({
        where: {
          appointmentId,
          userId: payment.userId,
        },
      })

      if (appointment.status !== AppointmentStatus.CONFIRMED) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            status: AppointmentStatus.CONFIRMED,
            updatedAt: now,
          },
        })
      }

      return {
        didTransition,
        entityType: 'GROUP_SESSION' as const,
        entityId: appointmentId,
      }
    }

    const conflictingAppointment = await tx.appointment.findFirst({
      where: buildAppointmentConflictWhere({
        practitionerId: appointment.practitionerId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        excludeAppointmentId: appointment.id,
      }),
      select: { id: true },
    })

    if (conflictingAppointment) {
      return {
        didTransition,
        entityType: 'APPOINTMENT_CONFLICT' as const,
        entityId: appointmentId,
      }
    }

    await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.SCHEDULED,
        recurringPattern: input.recurringPattern ?? RecurringPattern.NONE,
        updatedAt: now,
      },
    })

    return {
      didTransition,
      entityType: 'APPOINTMENT' as const,
      entityId: appointmentId,
    }
  })

  if (!transition?.entityType || !transition.entityId) {
    return { ok: false, reason: 'TARGET_NOT_FOUND' }
  }

  if (transition.entityType === 'APPOINTMENT_CONFLICT') {
    return { ok: false, reason: 'APPOINTMENT_CONFLICT' }
  }

  if (transition.didTransition && transition.entityType === 'APPOINTMENT') {
    try {
      await awardReferralRewardForAppointment(transition.entityId)
    } catch (error) {
      console.error('Failed to award referral reward', error)
    }

    if ((input.recurringPattern ?? RecurringPattern.NONE) !== RecurringPattern.NONE) {
      try {
        await createRecurringSeries(transition.entityId)
      } catch (error) {
        console.error('Failed to generate recurring series', error)
      }
    }

    try {
      await sendBookingConfirmation(transition.entityId)
    } catch (error) {
      console.error('Failed to send booking confirmation', error)
    }

    try {
      await sendInvoiceEmail(transition.entityId)
    } catch (error) {
      console.error('Failed to send automated invoice', error)
    }

    try {
      await syncAppointmentToExternalCalendar(transition.entityId)
    } catch (error) {
      console.error('Failed to sync to external calendar', error)
    }
  }

  return {
    ok: true,
    entityType: transition.entityType,
    entityId: transition.entityId,
    didTransition: transition.didTransition,
  }
}
