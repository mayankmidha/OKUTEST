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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const prompt = `
      You are an elite ADHD Executive Function Strategist.
      
      USER CONTEXT:
      - Current Tasks: ${JSON.stringify(tasks.map((t: any) => t.title))}
      - Current Energy (Spoons): ${energy}%
      
      GOAL:
      The user is feeling "chaos" in their work. Your job is to SORT THE CHAOS.
      1. Identify the ONE most critical task to start with based on the energy levels provided.
      2. Provide a "Linear Path" - a clear 1-2-3 sequence to follow.
      3. A "Gentle Override" - if they are too overwhelmed, suggest a 5-minute "Reset" task that isn't on the list.
      4. A sensory strategy to shield their focus.
      
      PHILOSOPHY:
      We don't do "busy work." We do "meaningful progress" with low working memory load.
      
      FORMAT:
      Return a JSON object:
      {
        "strategy": "A brief, powerful sorting of their current chaos...",
        "focusTask": "The specific task title to focus on first",
        "tip": "One high-impact ADHD hack for right now"
      }
      Keep it brief, beautiful, and authoritative yet kind.
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
