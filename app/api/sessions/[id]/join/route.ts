import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { StreamClient } from '@stream-io/node-sdk'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: {
      id: true,
      clientId: true,
      practitionerId: true,
      status: true,
      startTime: true,
    },
  })

  if (!appointment) return new NextResponse('Session not found', { status: 404 })

  // Only the client or practitioner may join
  const isClient = appointment.clientId === session.user.id
  const isTherapist = appointment.practitionerId === session.user.id
  if (!isClient && !isTherapist) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  const secret = process.env.STREAM_SECRET_KEY
  if (!apiKey || !secret) {
    return NextResponse.json(
      { error: 'Stream.io keys not configured. Add NEXT_PUBLIC_STREAM_API_KEY and STREAM_SECRET_KEY to Vercel environment.' },
      { status: 500 }
    )
  }

  // Token generated server-side — never expose secret to client
  const streamClient = new StreamClient(apiKey, secret)
  const token = streamClient.generateUserToken({
    user_id: session.user.id,
    validity_in_seconds: 7200, // 2 hrs
  })

  // callId is stable per appointment — same id for both parties
  const callId = `session_${id}`

  return NextResponse.json({ token, callId, apiKey })
}
