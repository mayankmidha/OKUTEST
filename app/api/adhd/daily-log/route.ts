import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Get today's log
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  try {
    const log = await prisma.adhdDailyLog.findFirst({
      where: {
        userId: session.user.id,
        date: { gte: today, lt: tomorrow },
      },
    })
    return NextResponse.json(log ?? null)
  } catch (error) {
    console.error("[ADHD_DAILY_LOG_GET]", error)
    return new NextResponse("Error fetching log", { status: 500 })
  }
}

// Upsert today's log
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { energyLevel, medicationTaken, medicationName, moodScore, sleepHours, notes } =
      await req.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const log = await prisma.adhdDailyLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
      update: {
        ...(energyLevel !== undefined && { energyLevel }),
        ...(medicationTaken !== undefined && { medicationTaken }),
        ...(medicationName !== undefined && { medicationName }),
        ...(moodScore !== undefined && { moodScore }),
        ...(sleepHours !== undefined && { sleepHours }),
        ...(notes !== undefined && { notes }),
      },
      create: {
        userId: session.user.id,
        date: today,
        energyLevel: energyLevel ?? 60,
        medicationTaken: medicationTaken ?? false,
        medicationName: medicationName ?? null,
        moodScore: moodScore ?? null,
        sleepHours: sleepHours ?? null,
        notes: notes ?? null,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("[ADHD_DAILY_LOG_POST]", error)
    return new NextResponse("Error saving log", { status: 500 })
  }
}
