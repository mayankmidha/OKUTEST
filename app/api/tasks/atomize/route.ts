import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { taskId, title } = await req.json()
    if (!taskId || !title) return new NextResponse("Missing data", { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an ADHD Executive Function Coach. 
      Break down the following task into 3-5 tiny, non-intimidating, actionable micro-steps.
      Each step should take less than 10 minutes.
      TASK: "${title}"
      Respond ONLY with a JSON array of strings. Example: ["Step 1", "Step 2", "Step 3"]
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\[.*\]/s)
    
    if (!jsonMatch) throw new Error("Could not parse AI response")
    const steps = JSON.parse(jsonMatch[0])

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
