import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, { params }: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params
  const { reason, details } = await req.json()

  if (!reason || typeof reason !== 'string') {
    return new NextResponse('Reason is required', { status: 400 })
  }

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

  const isMember = circle.participants.some((participant) => participant.userId === session.user.id)
  const isFacilitator = circle.practitionerId === session.user.id || session.user.role === 'ADMIN'

  if (!isMember && !isFacilitator) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const report = await prisma.circleReport.create({
    data: {
      appointmentId: id,
      reportedBy: session.user.id,
      reason,
      details: typeof details === 'string' ? details : null,
    },
  })

  return NextResponse.json(report, { status: 201 })
}
