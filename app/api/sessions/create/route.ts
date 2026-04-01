import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { resolvePractitionerSessionPrice } from '@/lib/pricing'
import { sendBookingConfirmation } from '@/lib/notifications'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Handle form data
    const formData = await req.formData()
    const practitionerProfileId = formData.get('therapistId') as string
    const timeStr = formData.get('time') as string // This is now an ISO string from BookingClient
    const serviceId = formData.get('serviceId') as string

    if (!practitionerProfileId || !timeStr) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Use ISO string directly for UTC session start
    const startTime = new Date(timeStr)

    // Calculate end time (default 1 hour or service duration)
    let duration = 60
    let finalServiceId = serviceId

    if (serviceId) {
        const s = await prisma.service.findUnique({ where: { id: serviceId } })
        if (s) duration = s.duration
    } else {
        // Ensure a default service exists if none selected
        const service = await prisma.service.upsert({
            where: { name: 'Standard Therapy Session' },
            update: {},
            create: {
                name: 'Standard Therapy Session',
                description: 'One hour individual therapy session',
                duration: 60,
                price: 150.0,
                isActive: true
            }
        })
        finalServiceId = service.id
    }

    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + duration)

    // Correctly resolve practitionerId (it might be a profile ID)
    let finalPractitionerId = practitionerProfileId
    const bookingClient = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { location: true },
    })

    let profile = await prisma.practitionerProfile.findUnique({
      where: { id: practitionerProfileId },
      select: {
        userId: true,
        indiaSessionRate: true,
        internationalSessionRate: true,
        hourlyRate: true,
        baseCurrency: true,
      }
    })
    if (!profile) {
      profile = await prisma.practitionerProfile.findUnique({
        where: { userId: practitionerProfileId },
        select: {
          userId: true,
          indiaSessionRate: true,
          internationalSessionRate: true,
          hourlyRate: true,
          baseCurrency: true,
        }
      })
    }
    if (profile) {
      finalPractitionerId = profile.userId
    }
    const pricing = resolvePractitionerSessionPrice(profile, bookingClient?.location)

    // 1. CONCURRENCY GUARD: Check for existing overlapping sessions
    const conflict = await prisma.appointment.findFirst({
        where: {
            practitionerId: finalPractitionerId,
            status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
            OR: [
                {
                    // Starts during another session
                    startTime: { lte: startTime },
                    endTime: { gt: startTime }
                },
                {
                    // Ends during another session
                    startTime: { lt: endTime },
                    endTime: { gte: endTime }
                }
            ]
        }
    })

    if (conflict) {
        return new NextResponse('Conflict: This time slot is no longer available.', { status: 409 })
    }

    // Create Appointment with PENDING status (requires advance payment)
    const appointment = await prisma.appointment.create({
      data: {
          clientId: session.user.id,
          practitionerId: finalPractitionerId,
          serviceId: finalServiceId,
          startTime: startTime,
          endTime: endTime,
          status: AppointmentStatus.PENDING,
          priceSnapshot: pricing.amountInInr,
          pricingRegion: pricing.pricingRegion,
      }
    })

    // Log the change
    await createAuditLog({
        userId: session.user.id,
        action: 'APPOINTMENT_CREATED',
        resourceType: 'APPOINTMENT',
        resourceId: appointment.id,
        changes: JSON.stringify({ status: AppointmentStatus.SCHEDULED })
    })

    // Send booking confirmation (non-blocking)
    sendBookingConfirmation(appointment.id).catch((e) => console.error('[SESSION_BOOKING_CONFIRMATION_ERROR]', e))

    const checkoutUrl = `/dashboard/client/checkout/${appointment.id}`

    // If request has JSON header, return URL
    if (req.headers.get('accept')?.includes('application/json') || req.headers.get('content-type')?.includes('application/json')) {
        return NextResponse.json({ url: checkoutUrl })
    }

    // Default to redirect for form submissions
    return NextResponse.redirect(new URL(checkoutUrl, req.url), 303)

  } catch (e) {
      console.error('Appointment creation error:', e)
      return new NextResponse('Error creating appointment', { status: 500 })
  }
}
