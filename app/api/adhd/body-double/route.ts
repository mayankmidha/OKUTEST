import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    // Fetch active focus sessions (body doubling)
    // We'll define a session as "active" if it was updated in the last 10 minutes
    const activeThreshold = new Date(Date.now() - 10 * 60 * 1000)
    
    const activeSessions = await prisma.aiCareSession.findMany({
      where: {
        updatedAt: { gte: activeThreshold }
      },
      include: {
        user: { select: { name: true, avatar: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    return NextResponse.json(activeSessions)
  } catch (error) {
    return new NextResponse("Error fetching sessions", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { taskTitle, status } = await req.json()
    
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
