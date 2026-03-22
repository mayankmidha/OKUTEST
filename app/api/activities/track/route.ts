import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("OK", { status: 200 }) // Ignore unauth activity for now

  try {
    const { action, metadata } = await req.json()
    const headerList = await headers()
    
    // In a real app, you'd want to throttle this or use a queue
    // but for "Super Advanced" tracking we log it
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        action,
        metadata,
        ipAddress: headerList.get("x-forwarded-for") || "127.0.0.1",
        userAgent: headerList.get("user-agent") || "unknown"
      }
    })

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    return new NextResponse("OK", { status: 200 }) // Always return OK to client
  }
}
