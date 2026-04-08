import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus, UserRole } from '@prisma/client'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  try {
    const [todays, totalAppointments, completedAppointments, uniqueClients] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          practitionerId: session.user.id,
          startTime: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: {
            not: AppointmentStatus.CANCELLED,
          },
        },
        include: {
          client: {
            select: {
              name: true,
              email: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.appointment.count({
        where: {
          practitionerId: session.user.id,
          status: {
            not: AppointmentStatus.CANCELLED,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          practitionerId: session.user.id,
          status: {
            in: [AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW],
          },
        },
      }),
      prisma.appointment.findMany({
        where: {
          practitionerId: session.user.id,
          clientId: { not: null },
        },
        distinct: ['clientId'],
        select: { clientId: true },
      }),
    ])

    return NextResponse.json({
      todays,
      stats: {
        appointments: totalAppointments,
        clients: uniqueClients.filter((entry) => entry.clientId).length,
        completed: completedAppointments,
      },
    })
  } catch (error) {
    console.error('[PRACTITIONER_APPOINTMENTS_FETCH_FAILED]', error)
    return NextResponse.json({ error: 'Failed to fetch practitioner appointments' }, { status: 500 })
  }
}
