import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

function buildAnonymousAlias(sessionId: string, fallbackIndex: number) {
  const suffix = sessionId.slice(-4).toUpperCase()
  return `Focus peer ${suffix || fallbackIndex + 1}`
}

function sanitizeTaskLabel(taskTitle?: string | null, status?: string | null) {
  if (status === 'BREAK') return 'taking a short reset'
  if (!taskTitle) return 'doing focused work'

  const value = taskTitle.toLowerCase()

  if (value.includes('study') || value.includes('read') || value.includes('learn')) {
    return 'studying'
  }
  if (value.includes('write') || value.includes('draft') || value.includes('email')) {
    return 'writing'
  }
  if (value.includes('plan') || value.includes('organize') || value.includes('schedule')) {
    return 'planning'
  }
  if (value.includes('clean') || value.includes('laundry') || value.includes('kitchen')) {
    return 'life admin'
  }
  if (value.includes('design') || value.includes('draw') || value.includes('creative')) {
    return 'creative work'
  }

  return 'doing focused work'
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    // Fetch active focus sessions (body doubling)
    // We'll define a session as "active" if it was updated in the last 10 minutes
    const activeThreshold = new Date(Date.now() - 10 * 60 * 1000)
    
    const activeSessions = await prisma.aiCareSession.findMany({
      where: {
        updatedAt: { gte: activeThreshold },
        type: { in: ['FOCUSING', 'BREAK'] },
        userId: { not: session.user.id }, // exclude self
      },
      include: {
        user: {
          select: {
            role: true,
            clientProfile: { select: { anonymousAlias: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    return NextResponse.json(
      activeSessions.map((activeSession, index) => ({
        id: activeSession.id,
        alias:
          activeSession.user.clientProfile?.anonymousAlias ||
          (activeSession.user.role === 'THERAPIST' ? 'Healing peer' : 'Focus peer') + ` ${activeSession.id.slice(-3).toUpperCase()}`,
        status: activeSession.type || 'FOCUSING',
        statusLabel:
          activeSession.type === 'BREAK' ? 'on a short break' : 'in a focus sprint',
        taskLabel: sanitizeTaskLabel(activeSession.context, activeSession.type),
        updatedAt: activeSession.updatedAt,
      }))
    )
  } catch (error) {
    return new NextResponse("Error fetching sessions", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { taskTitle, status } = await req.json()

    if (status === 'INACTIVE') {
      await prisma.aiCareSession.deleteMany({
        where: { userId: session.user.id },
      })

      return NextResponse.json({ cleared: true })
    }
    
    // Upsert a focus session record
    const focusSession = await prisma.aiCareSession.upsert({
      where: { userId: session.user.id },
      update: {
        context: taskTitle,
        type: status, // e.g. 'FOCUSING' or 'BREAK'
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        context: taskTitle,
        type: status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(focusSession)
  } catch (error) {
    return new NextResponse("Error updating session", { status: 500 })
  }
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await prisma.aiCareSession.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ cleared: true })
  } catch (error) {
    return new NextResponse("Error clearing session", { status: 500 })
  }
}
