import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus } from '@prisma/client'
import { sendRescheduleEmail } from '@/lib/notifications'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { newStartTime } = body as { newStartTime: string }

    if (!newStartTime) {
      return new NextResponse('newStartTime is required', { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        client: true,
        practitioner: true,
      },
    })

    if (!appointment) {
      return new NextResponse('Session not found', { status: 404 })
    }

    // Only the client who owns the session can reschedule
    if (appointment.clientId !== session.user.id) {
      return new NextResponse('Unauthorized — only the client may reschedule.', {
        status: 403,
      })
    }

    // Must be SCHEDULED or CONFIRMED
    const reschedulableStatuses: AppointmentStatus[] = [
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.CONFIRMED,
    ]
    if (!reschedulableStatuses.includes(appointment.status)) {
      return new NextResponse(
        `Cannot reschedule a session with status: ${appointment.status}`,
        { status: 400 }
      )
    }

    // Must be more than 8 hours away
    const now = Date.now()
    const hoursUntilSession =
      (new Date(appointment.startTime).getTime() - now) / 3_600_000

    if (hoursUntilSession <= 8) {
      return new NextResponse('Too late to reschedule — must be more than 8 hours before session.', {
        status: 400,
      })
    }

    // Calculate new end time
    const durationMinutes = appointment.service.duration ?? 50
    const newStart = new Date(newStartTime)
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60_000)

    // Check for practitioner conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        practitionerId: appointment.practitionerId,
        id: { not: id },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
        },
        AND: [
          { startTime: { lt: newEnd } },
          { endTime: { gt: newStart } },
        ],
      },
    })

    if (conflict) {
      return NextResponse.json(
        { error: 'Practitioner not available at that time' },
        { status: 409 }
      )
    }

    // Create new appointment and mark old as RESCHEDULED in a transaction
    const [newAppointment] = await prisma.$transaction([
      prisma.appointment.create({
        data: {
          clientId: appointment.clientId,
          practitionerId: appointment.practitionerId,
          serviceId: appointment.serviceId,
          startTime: newStart,
          endTime: newEnd,
          status: AppointmentStatus.SCHEDULED,
          notes: appointment.notes,
          isTrial: appointment.isTrial,
          trialDuration: appointment.trialDuration,
          priceSnapshot: appointment.priceSnapshot,
          pricingRegion: appointment.pricingRegion,
          recurringPattern: appointment.recurringPattern,
          rescheduledFromId: appointment.id,
        },
      }),
      prisma.appointment.update({
        where: { id },
        data: { status: AppointmentStatus.RESCHEDULED },
      }),
    ])

    // Fire-and-forget: notifications
    sendRescheduleEmail(id, newAppointment.id).catch((e) =>
      console.error('[RESCHEDULE_EMAIL_ERROR]', e)
    )

    return NextResponse.json({ success: true, newAppointmentId: newAppointment.id })
  } catch (error) {
    console.error('[SESSION_RESCHEDULE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
