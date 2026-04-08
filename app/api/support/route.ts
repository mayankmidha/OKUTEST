import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { captureLead } from '@/lib/lead-capture'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await req.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    await captureLead({
      channel: 'contact',
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      message,
      metadata: {
        source: 'client-support-dashboard',
        subject,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[SUPPORT_SUBMISSION_ERROR]', error)
    return NextResponse.json({ error: 'Could not send support message' }, { status: 500 })
  }
}
