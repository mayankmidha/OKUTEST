import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST() {
  const start = Date.now()
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  console.log(JSON.stringify({ level: 'info', msg: 'onboarding-complete start', userId: session.user.id }))

  try {
    const profile = await prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const missing: string[] = []
    if (!profile.bio) missing.push('bio')
    if (!profile.hourlyRate && !profile.indiaSessionRate) missing.push('rates')

    const hasAvailability = await prisma.availability.findFirst({
      where: { practitionerProfileId: profile.id },
    })
    if (!hasAvailability) missing.push('availability')

    if (missing.length > 0) {
      return NextResponse.json({ onboarded: false, missing })
    }

    await prisma.practitionerProfile.update({
      where: { id: profile.id },
      data: { isOnboarded: true },
    })

    console.log(JSON.stringify({ level: 'info', msg: 'onboarding-complete done', userId: session.user.id, ms: Date.now() - start }))
    return NextResponse.json({ onboarded: true })
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'onboarding-complete failed', error: String(err), ms: Date.now() - start }))
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
