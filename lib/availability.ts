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
  const profile = await prisma.practitionerProfile.findUnique({
    where: { id: practitionerProfileId },
    select: { timezone: true }
  })
  const tz = profile?.timezone || 'UTC'

  // Convert UTC startTime to Practitioner's Local Time
  const localDateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).format(startTime)

  // Parse back to get local components for dayOfWeek and timeStr
  // Format from Intl is MM/DD/YYYY, HH:mm:ss
  const match = localDateStr.match(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/)
  if (!match) return { available: false, reason: 'Timezone conversion error' }
  
  const [_, month, day, year, hour, minute] = match
  const localObj = new Date(parseInt(year), parseInt(month)-1, parseInt(day), parseInt(hour), parseInt(minute))
  
  const dayOfWeek = localObj.getDay()
  const timeStr = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`

  const endTime = new Date(startTime.getTime() + (durationMinutes + bufferMinutes) * 60000)
  
  // 1. Check for Blocked Dates
  const isBlocked = await prisma.blockedDate.findFirst({
    where: {
      practitionerProfileId,
      date: {
        gte: new Date(new Date(startTime).setUTCHours(0,0,0,0)),
        lte: new Date(new Date(startTime).setUTCHours(23,59,59,999))
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
      status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.EXTERNAL_BLOCK] },
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
