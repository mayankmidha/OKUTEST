import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
      return new NextResponse('Circle is not open for joining', { status: 409 })
    }

    const gracePeriod = 15 * 60 * 1000 // 15 minutes grace
    const cutOffTime = new Date(circle.startTime.getTime() + gracePeriod)
    
    if (new Date() > cutOffTime) {
      return new NextResponse('Circle session has ended or grace period expired', { status: 409 })
    }

    // Check capacity
    const spotsLeft = (circle.maxParticipants || 10) - circle.participants.length
    if (spotsLeft <= 0) {
      return new NextResponse('Circle is at full capacity', { status: 409 })
    }

    // Check if user already joined
    const alreadyJoined = circle.participants.some(
      (p) => p.userId === session.user.id
    )
    if (alreadyJoined) {
      return new NextResponse('Already joined this circle', { status: 409 })
    }

    // Create GroupParticipant record
    const participant = await prisma.groupParticipant.create({
      data: {
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
