import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { PaymentStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Verify the circle exists and is a confirmed group session
    const circle = await prisma.appointment.findUnique({
      where: { id },
      include: {
        participants: { select: { id: true, userId: true } },
      },
    })

    if (!circle || !circle.isGroupSession) {
      return new NextResponse('Circle not found', { status: 404 })
    }

    if (circle.status !== 'CONFIRMED') {
      return NextResponse.json({ message: 'This circle is currently not accepting new participants.' }, { status: 409 })
    }

    const now = new Date()
    const gracePeriod = 15 * 60 * 1000 // 15 minutes grace
    const cutOffTime = new Date(circle.startTime.getTime() + gracePeriod)
    
    if (now > cutOffTime) {
      return NextResponse.json({ message: 'Registration for this circle has closed as the session has already begun.' }, { status: 409 })
    }

    // Check capacity
    const spotsLeft = (circle.maxParticipants || 10) - circle.participants.length
    if (spotsLeft <= 0) {
      return NextResponse.json({ message: 'This circle is at full capacity. Join the waitlist instead.' }, { status: 409 })
    }

    // Check if user already joined
    const alreadyJoined = circle.participants.some(
      (p) => p.userId === session.user.id
    )
    if (alreadyJoined) {
      return NextResponse.json({ message: 'You have already secured a spot in this circle. Check your dashboard.' }, { status: 409 })
    }

    const requiresPayment = (circle.priceSnapshot || 0) > 0

    if (requiresPayment) {
      const payment = await prisma.payment.findFirst({
        where: {
          appointmentId: id,
          userId: session.user.id,
          status: PaymentStatus.COMPLETED,
        },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      })

      if (!payment) {
        return NextResponse.json({ message: 'This circle requires payment before you can join.' }, { status: 402 })
      }
    }

    // Create GroupParticipant record
    const participant = await prisma.groupParticipant.upsert({
      where: {
        appointmentId_userId: {
          appointmentId: id,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        appointmentId: id,
        userId: session.user.id,
      },
    })

    await prisma.circleWaitlist.deleteMany({
      where: {
        appointmentId: id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        message: 'Successfully joined the circle',
        participant,
        spotsRemaining: spotsLeft - 1,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/circles/[id]/join] error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
