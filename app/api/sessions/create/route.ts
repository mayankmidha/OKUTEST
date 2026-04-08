import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { AppointmentStatus, Prisma } from '@prisma/client'
import { resolvePractitionerSessionPrice } from '@/lib/pricing'
import { buildAppointmentConflictWhere } from '@/lib/appointment-conflicts'

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

    const startTime = new Date(timeStr)
    if (Number.isNaN(startTime.getTime())) {
      return new NextResponse('Invalid booking time', { status: 400 })
    }

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

    const appointment = await prisma.$transaction(
      async (tx) => {
        const conflict = await tx.appointment.findFirst({
          where: buildAppointmentConflictWhere({
            practitionerId: finalPractitionerId,
            startTime,
            endTime,
            includePendingHolds: true,
          }),
          select: { id: true },
        })

        if (conflict) {
          throw new Error('BOOKING_CONFLICT')
        }

        return tx.appointment.create({
          data: {
            clientId: session.user.id,
            practitionerId: finalPractitionerId,
            serviceId: finalServiceId,
            startTime,
            endTime,
            status: AppointmentStatus.PENDING,
            priceSnapshot: pricing.amountInInr,
            pricingRegion: pricing.pricingRegion,
          },
        })
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    )

    // Log the change
    await createAuditLog({
        userId: session.user.id,
        action: 'APPOINTMENT_CREATED',
        resourceType: 'APPOINTMENT',
        resourceId: appointment.id,
        changes: JSON.stringify({ status: AppointmentStatus.PENDING })
    })

    const checkoutUrl = `/dashboard/client/checkout/${appointment.id}`

    // If request has JSON header, return URL
    if (req.headers.get('accept')?.includes('application/json') || req.headers.get('content-type')?.includes('application/json')) {
        return NextResponse.json({ url: checkoutUrl })
    }

    // Default to redirect for form submissions
    return NextResponse.redirect(new URL(checkoutUrl, req.url), 303)

  } catch (e) {
      if (
        e instanceof Error &&
        (e.message === 'BOOKING_CONFLICT' ||
          (typeof (e as { code?: string }).code === 'string' &&
            (e as { code?: string }).code === 'P2034'))
      ) {
        return new NextResponse('Conflict: This time slot is no longer available.', { status: 409 })
      }

      console.error('Appointment creation error:', e)
      return new NextResponse('Error creating appointment', { status: 500 })
  }
}
