import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Bridge to Python FastAPI microservice
    // In production, this would be an internal network call or a Vercel Python Function
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/python/crisis-support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      // Fallback logic if Python service is unreachable
      return NextResponse.json({
        response: "I'm here with you. Please focus on your breath. If you need immediate human help, please call the helplines on our emergency page.",
        is_crisis: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ 
      response: "I hear you. Let's take a deep breath together.",
      is_crisis: false 
    })
  }
}
