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
    const { clientId, assessmentId } = await req.json()

    if (!clientId || !assessmentId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const assignment = await prisma.assignedAssessment.create({
      data: {
        clientId,
        assessmentId,
        practitionerId: session.user.id,
        status: "PENDING"
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("[ASSESSMENT_ASSIGN_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
