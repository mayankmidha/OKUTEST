import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { tasks, energy } = await req.json()
    
    if (!process.env.GEMINI_API_KEY) throw new Error("AI Key missing")
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an expert ADHD Executive Function Strategist.
      
      USER CONTEXT:
      - Current Tasks: ${JSON.stringify(tasks.map((t: any) => t.title))}
      - Current Energy (Spoons): ${energy}%
      
      GOAL:
      Provide a highly encouraging, non-judgmental, and strategically smart "Focus Protocol" for this user.
      1. Which task should they start with based on energy?
      2. A "gentle reminder" about dopamine or transitions.
      3. A sensory suggestion (e.g., lighting, sound).
      
      FORMAT:
      Return a JSON object:
      {
        "strategy": "...",
        "focusTask": "...",
        "tip": "..."
      }
      Keep it brief and beautiful.
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{.*\}/s)
    
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]))
    }
    
    return NextResponse.json({ 
        strategy: "Focus on one tiny atom. You have enough energy for a small win.",
        focusTask: tasks[0]?.title || "The first thing on your list",
        tip: "Remember to breathe between transitions."
    })

  } catch (error) {
    console.error("[ADHD_STRATEGY_ERROR]", error)
    return new NextResponse("Error generating strategy", { status: 500 })
  }
}
