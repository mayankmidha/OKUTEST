import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { checkPractitionerAvailability } from '@/lib/availability'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const practitionerId = searchParams.get('practitionerId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!practitionerId || !startDate || !endDate) {
    return new NextResponse('Missing required parameters', { status: 400 })
  }

  try {
    // Get practitioner profile
    const practitioner = await prisma.practitionerProfile.findUnique({
      where: { id: practitionerId },
      include: {
        user: { select: { name: true } },
        services: true
      }
    })

    if (!practitioner) {
      return new NextResponse('Practitioner not found', { status: 404 })
    }

    // Generate time slots for the date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeSlots = []
    const tz = practitioner.timezone || 'UTC'

    // Generate slots for each day in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Determine day of week in practitioner's timezone
      const localDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(date)
      const [m, d, y] = localDateStr.split('/')
      const localDateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d))
      const dayOfWeek = localDateObj.getDay()

      // Fetch availability for this specific day of week
      const dayAvailability = await prisma.availability.findFirst({
        where: {
          practitionerProfileId: practitionerId,
          dayOfWeek
        }
      })
      
      if (!dayAvailability) continue

      const [startH, startM] = dayAvailability.startTime.split(':').map(Number)
      const [endH, endM] = dayAvailability.endTime.split(':').map(Number)

      // Generate slots within practitioner's working hours
      for (let hour = startH; hour <= endH; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === startH && minute < startM) continue
          if (hour === endH && minute >= endM) continue

          // Construct local slot time
          // Important: We need to convert this local time back to UTC
          // Since there's no easy way without a library, we use the fact that
          // Date.toLocaleString can tell us the offset or we can use a trick
          
          // Construct UTC date that corresponds to this local time
          const localString = `${y}-${m}-${d}T${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:00`
          
          // This is the tricky part without date-fns-tz. 
          // We'll use a robust method:
          const slotStart = new Date(new Date(localString).toLocaleString('en-US', { timeZone: tz }))
          // Wait, that's not quite right. Let's use the simpler method for now 
          // but ensure it's clinically safe.
          
          // Correct way to get UTC from Local + TZ:
          const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: tz,
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
              hour12: false
          })
          
          // We want a UTC time 'u' such that formatter.format(u) == localString
          // We'll estimate and then refine.
          let utcTime = new Date(Date.UTC(parseInt(y), parseInt(m)-1, parseInt(d), hour, minute)).getTime()
          // Adjust for TZ offset
          const dummy = new Date(utcTime)
          const parts = formatter.formatToParts(dummy)
          const offsetH = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
          const diff = hour - offsetH
          utcTime += diff * 3600000
          
          const slotStartUTC = new Date(utcTime)
          const slotEndUTC = new Date(slotStartUTC.getTime() + 30 * 60000)

          // Skip past slots
          if (slotEndUTC <= new Date()) continue

          // Check availability
          const availability = await checkPractitionerAvailability({
            practitionerProfileId: practitionerId,
            startTime: slotStartUTC,
            durationMinutes: 30,
            bufferMinutes: 15
          })

          timeSlots.push({
            id: `${slotStartUTC.getTime()}-${practitionerId}`,
            startTime: slotStartUTC.toISOString(),
            endTime: slotEndUTC.toISOString(),
            available: availability.available,
            practitionerId: practitioner.userId,
            practitionerName: practitioner.user.name,
            serviceType: practitioner.services[0]?.name || 'Therapy Session',
            location: 'Virtual',
            price: practitioner.services[0]?.price || 1500
          })
        }
      }
    }

    return NextResponse.json(timeSlots)

  } catch (error) {
    console.error('[AVAILABLE_SLOTS_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
