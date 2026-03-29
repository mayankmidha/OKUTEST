import { prisma } from './prisma'
import { RecurringPattern, AppointmentStatus } from '@prisma/client'

/**
 * Industrial-grade Recurring Booking Logic.
 * Automatically generates a series of appointments based on a pattern.
 * Required for predictable clinical ARR.
 */
export async function createRecurringSeries(parentAppointmentId: string, count: number = 12) {
  const parent = await prisma.appointment.findUnique({
    where: { id: parentAppointmentId },
    include: { service: true }
  })

  if (!parent || parent.recurringPattern === RecurringPattern.NONE) return

  const appointments = []
  let currentStartTime = new Date(parent.startTime)
  let currentEndTime = new Date(parent.endTime)

  for (let i = 1; i <= count; i++) {
    // Calculate next date based on pattern
    if (parent.recurringPattern === RecurringPattern.WEEKLY) {
      currentStartTime.setDate(currentStartTime.getDate() + 7)
      currentEndTime.setDate(currentEndTime.getDate() + 7)
    } else if (parent.recurringPattern === RecurringPattern.BIWEEKLY) {
      currentStartTime.setDate(currentStartTime.getDate() + 14)
      currentEndTime.setDate(currentEndTime.getDate() + 14)
    } else if (parent.recurringPattern === RecurringPattern.MONTHLY) {
      currentStartTime.setMonth(currentStartTime.getMonth() + 1)
      currentEndTime.setMonth(currentEndTime.getMonth() + 1)
    }

    appointments.push({
      clientId: parent.clientId,
      practitionerId: parent.practitionerId,
      serviceId: parent.serviceId,
      startTime: new Date(currentStartTime),
      endTime: new Date(currentEndTime),
      status: AppointmentStatus.SCHEDULED,
      parentAppointmentId: parent.id,
      recurringPattern: parent.recurringPattern,
      priceSnapshot: parent.priceSnapshot,
      pricingRegion: parent.pricingRegion
    })
  }

  // Create child appointments in bulk
  return await prisma.appointment.createMany({
    data: appointments
  })
}
