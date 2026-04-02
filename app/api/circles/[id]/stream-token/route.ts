import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { StreamClient } from '@stream-io/node-sdk'
import { env, validateEnv } from '@/lib/env'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Verify user is a GroupParticipant of this circle
    const participant = await prisma.groupParticipant.findUnique({
      where: {
        appointmentId_userId: {
          appointmentId: id,
          userId: session.user.id,
        },
      },
    })

    // Allow practitioners (THERAPIST/ADMIN) through as facilitators
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const isFacilitator = user?.role === 'THERAPIST' || user?.role === 'ADMIN'

    if (!participant && !isFacilitator) {
      return new NextResponse('Forbidden: you are not a member of this circle', { status: 403 })
    }

    const { isValid, missing } = validateEnv()

    if (!isValid) {
      console.error('[STREAM_CONFIG_CRITICAL]', { missing })
      return NextResponse.json(
        {
          error: `Deployment Incomplete. Missing env vars: ${missing.join(', ')}`,
          apiKey: 'missing',
        },
        { status: 500 }
      )
    }

    const streamClient = new StreamClient(
      env.NEXT_PUBLIC_STREAM_API_KEY!,
      env.STREAM_SECRET_KEY!
    )

    const token = streamClient.generateUserToken({
      user_id: session.user.id,
      validity_in_seconds: 3600,
    })

    return NextResponse.json({
      token,
      callId: `circle_${id}`,
      apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
    })
  } catch (error) {
    console.error('[POST /api/circles/[id]/stream-token] error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
