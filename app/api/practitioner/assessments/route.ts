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
    const { title, description, questions } = await req.json()

    if (!title || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const assessment = await prisma.assessment.create({
      data: {
        title,
        description,
        questions: questions, // Prisma handles Json
        isActive: true,
      }
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("[PRACTITIONER_ASSESSMENT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(assessments)
  } catch (error) {
    console.error("[PRACTITIONER_ASSESSMENT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
