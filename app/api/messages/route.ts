import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const contactId = searchParams.get('contactId')

  if (!contactId) {
    return new NextResponse("Missing contactId", { status: 400 })
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: contactId },
          { senderId: contactId, receiverId: session.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
          sender: { select: { id: true, name: true, avatar: true } }
      }
    })

    // Mark as read
    await prisma.message.updateMany({
        where: { receiverId: session.user.id, senderId: contactId, isRead: false },
        data: { isRead: true }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("GET Messages error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { receiverId, content } = await req.json()

    if (!receiverId || !content) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("POST Message error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
