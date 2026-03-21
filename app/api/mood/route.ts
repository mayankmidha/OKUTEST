import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { mood, notes } = await req.json()

    if (!mood) {
      return new NextResponse("Mood is required", { status: 400 })
    }

    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: session.user.id,
        mood: parseInt(mood),
        notes: notes || ""
      }
    })

    return NextResponse.json(moodEntry)
  } catch (error) {
    console.error("Mood entry error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
