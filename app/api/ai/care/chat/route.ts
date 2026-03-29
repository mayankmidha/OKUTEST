import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { prompt, context } = await req.json()
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `
      You are OKU Care AI, a clinical-grade empathetic listener. 
      Your primary goal is to make the user feel HEARD and VALIDATED.
      
      CONTEXT FROM PREVIOUS SESSIONS:
      ${context?.longTermMemory || "New user journey."}
      
      RULES:
      1. Do not give advice unless specifically asked.
      2. Use active listening: reflect their emotions back to them.
      3. Maintain a calm, high-fidelity, clinical but warm tone.
      4. If you detect self-harm or immediate crisis, provide the emergency resources and flag it.
      5. Keep responses concise but deeply meaningful.
    `

    const result = await model.generateContent([systemPrompt, prompt])
    const aiResponse = result.response.text()

    // 1. Log this interaction as a Care Session
    await prisma.aiCareSession.create({
        data: {
            userId: session.user.id,
            summary: prompt.substring(0, 200),
            dominantMood: "PENDING_ANALYSIS"
        }
    })

    // 2. Update Long Term Memory (Asynchronous update would be better, but we do it here for now)
    const memoryPrompt = `
        Summarize what we just learned about this user in 1 sentence for long-term clinical memory.
        USER SAID: "${prompt}"
        AI RESPONDED: "${aiResponse}"
        Current Memory: "${context?.longTermMemory || ""}"
    `
    const memoryResult = await model.generateContent(memoryPrompt)
    const newMemory = memoryResult.response.text()

    await prisma.careContext.update({
        where: { userId: session.user.id },
        data: { longTermMemory: newMemory }
    })

    return NextResponse.json({ result: aiResponse })

  } catch (error) {
    console.error("[CARE_AI_ERROR]", error)
    return new NextResponse("Error in Care Link", { status: 500 })
  }
}
