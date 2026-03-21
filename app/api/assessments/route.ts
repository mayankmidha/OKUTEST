import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  const { type, responses, score, result } = await req.json()

  if (!type || !responses || score === undefined || !result) {
    return new NextResponse("Missing fields", { status: 400 })
  }

  // If user is not logged in, we return 200 but don't save to DB
  // The frontend will handle storing it in sessionStorage
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Guest assessment completed" }, { status: 200 })
  }

  // Ensure assessment definition exists
  const assessmentDef = await prisma.assessment.upsert({
    where: { title: type },
    update: {},
    create: {
      title: type,
      questions: [], // We store definition in code, but keep DB for records
      description: "Auto-generated assessment type",
    },
  })

  const assessmentAnswer = await prisma.assessmentAnswer.create({
    data: {
      userId: session.user.id,
      assessmentId: assessmentDef.id,
      answers: responses,
      score,
      result,
    }
  })

  return NextResponse.json(assessmentAnswer)
}
