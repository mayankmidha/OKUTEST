import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET: return all upcoming confirmed group sessions with practitioner info
export async function GET() {
  try {
    const circles = await prisma.appointment.findMany({
      where: {
        isGroupSession: true,
        status: 'CONFIRMED',
        startTime: { gte: new Date() },
      },
      include: {
        practitioner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            practitionerProfile: { select: { specialization: true, bio: true } },
          },
        },
        participants: {
          select: { id: true, userId: true, joinedAt: true },
        },
      },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(circles)
  } catch (error) {
    console.error('[GET /api/circles] error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST: create a new circle (ADMIN or THERAPIST only)
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'THERAPIST')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      description,
      startTime,
      maxParticipants = 10,
      price = 1500,
      practitionerId,
    } = body

    if (!title || !startTime) {
      return new NextResponse('title and startTime are required', { status: 400 })
    }

    // Resolve practitioner — default to the authenticated user if THERAPIST
    const resolvedPractitionerId =
      user.role === 'ADMIN' && practitionerId ? practitionerId : session.user.id

    // Ensure the "Group Circle" service exists
    const service = await prisma.service.upsert({
      where: { name: 'Group Circle' },
      update: {},
      create: {
        name: 'Group Circle',
        description: 'Facilitated group therapy circle session',
        duration: 90,
        price,
        isActive: true,
      },
    })

    const start = new Date(startTime)
    const end = new Date(start.getTime() + 90 * 60 * 1000)
    const notes = description ? `${title}|${description}` : title

    const circle = await prisma.appointment.create({
      data: {
        practitionerId: resolvedPractitionerId,
        serviceId: service.id,
        startTime: start,
        endTime: end,
        status: 'CONFIRMED',
        isGroupSession: true,
        maxParticipants,
        priceSnapshot: price,
        notes,
      },
      include: {
        practitioner: { select: { name: true, avatar: true } },
        participants: true,
      },
    })

    return NextResponse.json(circle, { status: 201 })
  } catch (error) {
    console.error('[POST /api/circles] error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
