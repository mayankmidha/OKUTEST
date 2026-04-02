import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { warningSigns, copingStrategies, reasonsToLive } = await req.json()

    const plan = await prisma.safetyPlan.upsert({
      where: { userId: session.user.id },
      update: {
        warningSigns,
        copingStrategies,
        reasonsToLive,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        warningSigns,
        copingStrategies,
        reasonsToLive
      }
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("[SAFETY_PLAN_UPDATE_ERROR]", error)
    return new NextResponse("Error updating safety plan", { status: 500 })
  }
}
