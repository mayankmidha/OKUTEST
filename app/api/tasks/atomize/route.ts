import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { atomizeTask } from "@/lib/oku-ai"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { taskId, title } = await req.json()
    if (!taskId || !title) return new NextResponse("Missing data", { status: 400 })

    const steps = await atomizeTask(title)

    // Create subtasks in DB
    const subtasks = await Promise.all(steps.map((step: string) => 
      prisma.task.create({
        data: {
          userId: session.user.id,
          parentId: taskId,
          title: step,
          isCompleted: false
        }
      })
    ))

    return NextResponse.json(subtasks)
  } catch (error) {
    console.error("[ATOMIZE_ERROR]", error)
    return new NextResponse("Error atomizing task", { status: 500 })
  }
}
