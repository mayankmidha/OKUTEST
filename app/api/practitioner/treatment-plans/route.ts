import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const data = await req.json()
    const { clientId, presentingProblem, goals, objectives, interventions, nextReviewDate } = data

    if (!clientId || !presentingProblem || !goals) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const plan = await prisma.treatmentPlan.create({
      data: {
        clientId,
        practitionerId: session.user.id,
        presentingProblem,
        goals,
        objectives,
        interventions,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null
      }
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Treatment Plan POST error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
