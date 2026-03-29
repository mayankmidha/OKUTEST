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

    // Generate slots in 30-minute intervals from 8 AM to 8 PM
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date)
      
      // Skip weekends if practitioner doesn't work weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        // Check if practitioner works weekends
        const weekendAvailability = await prisma.availability.findFirst({
          where: {
            practitionerProfileId: practitionerId,
            dayOfWeek: currentDate.getDay()
          }
        })
        
        if (!weekendAvailability) continue
      }

      // Generate time slots for this day
      for (let hour = 8; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(currentDate)
          slotStart.setHours(hour, minute, 0, 0)
          
          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotStart.getMinutes() + 30)

          // Skip past slots
          if (slotEnd <= new Date()) continue

          // Check availability
          const availability = await checkPractitionerAvailability({
            practitionerProfileId: practitionerId,
            startTime: slotStart,
            durationMinutes: 30,
            bufferMinutes: 15 // 15-minute buffer between appointments
          })

          timeSlots.push({
            id: `${slotStart.getTime()}-${practitionerId}`,
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
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
