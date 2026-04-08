import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { assessCrisisMessage } from '@/lib/crisis-support'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { prompt, context } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ result: 'Please share a message so I can respond.' }, { status: 400 })
    }

    const crisisAssessment = assessCrisisMessage(prompt)

    if (crisisAssessment.isCrisis) {
      await prisma.aiCareSession.upsert({
        where: { userId: session.user.id },
        update: {
          summary: prompt.substring(0, 200),
          dominantMood: 'HIGH_DISTRESS',
          riskDetected: true,
          careInsights: { matchedSignals: crisisAssessment.matchedSignals, severity: crisisAssessment.severity },
        },
        create: {
          userId: session.user.id,
          summary: prompt.substring(0, 200),
          dominantMood: 'HIGH_DISTRESS',
          riskDetected: true,
          careInsights: { matchedSignals: crisisAssessment.matchedSignals, severity: crisisAssessment.severity },
        },
      })

      await prisma.careContext.upsert({
        where: { userId: session.user.id },
        update: { updatedAt: new Date() },
        create: {
          userId: session.user.id,
          longTermMemory: context?.longTermMemory || null,
          currentStruggles: [],
          recentWins: [],
        },
      })

      return NextResponse.json({
        result: `${crisisAssessment.response} You can also use your safety plan, contact a trusted person, or open /emergency right now.`,
        escalated: true,
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      await prisma.aiCareSession.upsert({
        where: { userId: session.user.id },
        update: {
          summary: prompt.substring(0, 200),
          dominantMood: 'UNAVAILABLE',
          riskDetected: false,
        },
        create: {
          userId: session.user.id,
          summary: prompt.substring(0, 200),
          dominantMood: 'UNAVAILABLE',
          riskDetected: false,
        },
      })

      return NextResponse.json({
        result:
          'Care AI is temporarily unavailable in this environment. You can still message your therapist, review your safety plan, or use Emergency support if this feels urgent.',
      }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const systemPrompt = `
      You are OKU Care AI, a supportive and non-diagnostic reflective listener.
      Your primary goal is to help the user feel heard and grounded.
      
      CONTEXT FROM PREVIOUS SESSIONS:
      ${context?.longTermMemory || "New user journey."}
      
      RULES:
      1. Do not give advice unless specifically asked.
      2. Use active listening: reflect their emotions back to them.
      3. Maintain a calm, warm, steady tone.
      4. If the user describes immediate safety risk, direct them to emergency help instead of continuing the conversation normally.
      5. Keep responses concise but deeply meaningful.
    `

    const result = await model.generateContent([systemPrompt, prompt])
    const aiResponse = result.response.text()

    // 1. Log this interaction as a Care Session
    await prisma.aiCareSession.upsert({
      where: { userId: session.user.id },
      update: {
        summary: prompt.substring(0, 200),
        dominantMood: "PENDING_ANALYSIS",
        riskDetected: false,
      },
      create: {
        userId: session.user.id,
        summary: prompt.substring(0, 200),
        dominantMood: "PENDING_ANALYSIS",
        riskDetected: false,
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

    await prisma.careContext.upsert({
      where: { userId: session.user.id },
      update: { longTermMemory: newMemory },
      create: {
        userId: session.user.id,
        longTermMemory: newMemory,
        currentStruggles: [],
        recentWins: [],
      },
    })

    return NextResponse.json({ result: aiResponse })

  } catch (error) {
    console.error("[CARE_AI_ERROR]", error)
    return NextResponse.json({
      result:
        'Care AI hit an error while responding. Please try again in a moment, or use your therapist messages and safety resources if you need support now.',
    }, { status: 502 })
  }
}
