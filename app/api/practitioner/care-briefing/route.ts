import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generateCareBriefing } from '@/lib/care-briefing'
import { UserRole } from '@prisma/client'

export async function GET(req: Request) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const appointmentId = searchParams.get('appointmentId')

  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!appointmentId) {
    return new NextResponse('Missing appointmentId', { status: 400 })
  }

  try {
    const briefing = await generateCareBriefing(appointmentId)
    return NextResponse.json({ briefing })
  } catch (error) {
    console.error('[CARE_BRIEFING_API_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
