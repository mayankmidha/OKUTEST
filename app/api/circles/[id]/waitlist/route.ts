import { auth } from '@/auth'
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
    include: {
      participants: {
        select: { userId: true },
      },
    },
  })

  if (!circle || !circle.isGroupSession) {
    return new NextResponse('Circle not found', { status: 404 })
  }

  if (circle.participants.some((participant) => participant.userId === session.user.id)) {
    return NextResponse.json({ message: 'You are already part of this circle.' }, { status: 409 })
  }

  const isFull = circle.participants.length >= (circle.maxParticipants || 10)
  if (!isFull) {
    return NextResponse.json({ message: 'This circle still has open spots.' }, { status: 409 })
  }

  await prisma.circleWaitlist.upsert({
    where: {
      appointmentId_userId: {
        appointmentId: id,
        userId: session.user.id,
      },
    },
    update: {
      notified: false,
    },
    create: {
      appointmentId: id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ message: 'Added to waitlist.' }, { status: 201 })
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params

  await prisma.circleWaitlist.deleteMany({
    where: {
      appointmentId: id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ message: 'Removed from waitlist.' })
}
