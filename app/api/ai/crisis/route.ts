import { NextResponse } from 'next/server'
import { assessCrisisMessage } from '@/lib/crisis-support'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const assessment = assessCrisisMessage(message || '')

    return NextResponse.json({
      response: assessment.response,
      is_crisis: assessment.isCrisis,
      severity: assessment.severity,
      matchedSignals: assessment.matchedSignals,
      resourcesUrl: '/emergency',
    })
  } catch (error) {
    return NextResponse.json({ 
      response: "I'm here with you. If this feels urgent or unsafe, please open the Emergency page for immediate human support.",
      is_crisis: false 
    })
  }
}
