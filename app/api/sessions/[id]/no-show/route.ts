import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { sessionId } = await req.json() // This is appointmentId

  const appointment = await prisma.appointment.findUnique({
    where: { id: sessionId },
    include: { 
      practitioner: true, 
      service: true
    }
  })

  if (!appointment || appointment.practitionerId !== session.user.id) {
    return new NextResponse('Appointment not found', { status: 404 })
  }

  // Grace period check: Today's time must be > startTime + 15 mins
  const scheduledPlusGrace = new Date(appointment.startTime)
  scheduledPlusGrace.setMinutes(scheduledPlusGrace.getMinutes() + 15)
  
  if (new Date() < scheduledPlusGrace) {
    return new NextResponse('Grace period (15 mins) has not yet passed.', { status: 400 })
  }

  try {
      await prisma.$transaction([
          // 1. Mark appointment as No-Show
          prisma.appointment.update({
              where: { id: sessionId },
              data: {
                  attendanceStatus: 'no_show',
                  status: AppointmentStatus.NO_SHOW,
                  noShowFeeCharged: appointment.service.price // Charge full service fee as no-show fee
              }
          }),
          // 2. Increment client no-show count
          prisma.clientProfile.update({
              where: { userId: appointment.clientId },
              data: {
                  noShowCount: { increment: 1 }
              }
          })
      ])
      
      return NextResponse.json({ success: true })
  } catch (e) {
      console.error(e)
      return new NextResponse('Error recording no-show', { status: 500 })
  }
}
