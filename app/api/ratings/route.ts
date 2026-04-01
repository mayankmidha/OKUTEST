import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'

// POST — Create a rating (CLIENT only)
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== UserRole.CLIENT) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { appointmentId, score, comment } = body as {
      appointmentId?: string
      score?: number
      comment?: string
    }

    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 })
    }

    if (typeof score !== 'number' || score < 1 || score > 5 || !Number.isInteger(score)) {
      return NextResponse.json({ error: 'score must be an integer between 1 and 5' }, { status: 400 })
    }

    // Fetch the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { rating: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.clientId !== session.user.id) {
      return NextResponse.json({ error: 'You are not the client for this appointment' }, { status: 403 })
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      return NextResponse.json({ error: 'You can only rate completed appointments' }, { status: 400 })
    }

    if (appointment.rating) {
      return NextResponse.json({ error: 'This appointment has already been rated' }, { status: 409 })
    }

    const rating = await prisma.rating.create({
      data: {
        appointmentId,
        clientId: session.user.id,
        practitionerId: appointment.practitionerId,
        score,
        comment: comment?.trim() || null,
        isPublic: true,
      },
    })

    return NextResponse.json({ success: true, rating })
  } catch (e) {
    console.error('[POST /api/ratings] error:', e)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// GET — Public: fetch ratings for a practitioner
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const practitionerId = searchParams.get('practitionerId')

    if (!practitionerId) {
      return NextResponse.json({ error: 'practitionerId query param is required' }, { status: 400 })
    }

    const [aggregate, reviews] = await Promise.all([
      prisma.rating.aggregate({
        where: { practitionerId, isPublic: true },
        _avg: { score: true },
        _count: { score: true },
      }),
      prisma.rating.findMany({
        where: { practitionerId, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          client: { select: { name: true, avatar: true } },
        },
      }),
    ])

    return NextResponse.json({
      avgScore: aggregate._avg.score ?? 0,
      count: aggregate._count.score,
      reviews,
    })
  } catch (e) {
    console.error('[GET /api/ratings] error:', e)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
