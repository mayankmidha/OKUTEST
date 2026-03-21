import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { type, responses, score, result } = await req.json()

  if (!type || !responses || score === undefined || !result) {
    return new NextResponse("Missing fields", { status: 400 })
  }

  // Ensure assessment definition exists
  const assessmentDef = await prisma.assessment.upsert({
    where: { title: type },
    update: {},
    create: {
      title: type,
      questions: [], // Placeholder as we don't have questions from frontend
      description: "Auto-generated assessment type",
    },
  })

  // Parse responses if it's a string
  let parsedResponses = responses
  if (typeof responses === 'string') {
    try {
      parsedResponses = JSON.parse(responses)
    } catch (e) {
      // Keep as string if parsing fails
    }
  }

  const assessmentAnswer = await prisma.assessmentAnswer.create({
    data: {
      userId: session.user.id,
      assessmentId: assessmentDef.id,
      answers: parsedResponses,
      score,
      result,
    }
  })

  return NextResponse.json(assessmentAnswer)
}
