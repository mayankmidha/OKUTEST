import { auth } from '@/auth'
import { PaymentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params

  const circle = await prisma.appointment.findUnique({
    where: { id },
    select: {
      id: true,
      isGroupSession: true,
      priceSnapshot: true,
    },
  })

  if (!circle || !circle.isGroupSession) {
    return new NextResponse('Circle not found', { status: 404 })
  }

  const participant = await prisma.groupParticipant.findUnique({
    where: {
      appointmentId_userId: {
        appointmentId: id,
        userId: session.user.id,
      },
    },
    select: { id: true },
  })

  if (participant) {
    await prisma.groupParticipant.delete({
      where: { id: participant.id },
    })
  } else {
    await prisma.circleWaitlist.deleteMany({
      where: {
        appointmentId: id,
        userId: session.user.id,
      },
    })
  }

  const waitlist = await prisma.circleWaitlist.findMany({
    where: { appointmentId: id },
    orderBy: { joinedAt: 'asc' },
    select: { id: true, userId: true },
  })

  for (const entry of waitlist) {
    if ((circle.priceSnapshot || 0) > 0) {
      const hasPayment = await prisma.payment.findFirst({
        where: {
          appointmentId: id,
          userId: entry.userId,
          status: PaymentStatus.COMPLETED,
        },
        select: { id: true },
      })

      if (!hasPayment) continue
    }

    await prisma.groupParticipant.upsert({
      where: {
        appointmentId_userId: {
          appointmentId: id,
          userId: entry.userId,
        },
      },
      update: {},
      create: {
        appointmentId: id,
        userId: entry.userId,
      },
    })

    await prisma.circleWaitlist.delete({
      where: { id: entry.id },
    })
    break
  }

  return NextResponse.json({ message: 'Membership updated.' })
}
