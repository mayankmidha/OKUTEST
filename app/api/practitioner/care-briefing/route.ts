import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getPatientClinicalMemory } from '@/lib/ai-memory'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')

  if (!clientId) {
    return new NextResponse('Missing clientId', { status: 400 })
  }

  try {
    const memory = await getPatientClinicalMemory(clientId)
    
    return NextResponse.json({
      success: true,
      briefing: memory || 'First session. No historical data found.'
    })
  } catch (error) {
    console.error('[CARE_BRIEFING_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
