import { prisma } from './prisma'
import { AppointmentStatus } from '@prisma/client'

/**
 * Checks if a practitioner is available for a given time slot.
 * Handles:
 * 1. Base availability (day of week + time range)
 * 2. Overrides (specific date changes)
 * 3. Blocked dates
 * 4. Existing appointment conflicts (Smart Buffer)
 */
export async function checkPractitionerAvailability({
  practitionerProfileId,
  startTime,
  durationMinutes,
  bufferMinutes = 0
}: {
  practitionerProfileId: string,
  startTime: Date,
  durationMinutes: number,
  bufferMinutes?: number
}) {
  const endTime = new Date(startTime.getTime() + (durationMinutes + bufferMinutes) * 60000)
  const dayOfWeek = startTime.getUTCDay()
  
  // Format time as HH:mm
  const timeStr = startTime.getUTCHours().toString().padStart(2, '0') + ':' + 
                  startTime.getUTCMinutes().toString().padStart(2, '0')

  // 1. Check for Blocked Dates
  const isBlocked = await prisma.blockedDate.findFirst({
    where: {
      practitionerProfileId,
      date: {
        gte: new Date(startTime.setUTCHours(0,0,0,0)),
        lte: new Date(startTime.setUTCHours(23,59,59,999))
      }
    }
  })
  if (isBlocked) return { available: false, reason: 'Date is blocked' }

  // 2. Check for Overrides
  const override = await prisma.availabilityOverride.findFirst({
    where: {
      practitionerProfileId,
      date: {
        gte: new Date(startTime.setUTCHours(0,0,0,0)),
        lte: new Date(startTime.setUTCHours(23,59,59,999))
      }
    }
  })

  if (override) {
    if (!override.isAvailable) return { available: false, reason: 'Practitioner marked this date as unavailable' }
    if (timeStr < override.startTime || timeStr > override.endTime) {
        return { available: false, reason: 'Outside of override hours' }
    }
  } else {
    // 3. Check Base Availability
    const baseAvail = await prisma.availability.findFirst({
        where: {
            practitionerProfileId,
            dayOfWeek,
            startTime: { lte: timeStr },
            endTime: { gte: timeStr }
        }
    })
    if (!baseAvail) return { available: false, reason: 'Outside of standard working hours' }
  }

  // 4. Check for Appointment Conflicts
  const conflict = await prisma.appointment.findFirst({
    where: {
      practitioner: {
        practitionerProfile: { id: practitionerProfileId }
      },
      status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gt: startTime }
        },
        {
          startTime: { lt: endTime },
          endTime: { gte: endTime }
        },
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime }
        }
      ]
    }
  })

  if (conflict) return { available: false, reason: 'Time slot already booked' }

  return { available: true }
}
