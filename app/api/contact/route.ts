import { NextResponse } from 'next/server'

import { captureLead } from '@/lib/lead-capture'

export async function POST(req: Request) {
  try {
    const { name, email, message, phone } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await captureLead({
      channel: 'contact',
      name,
      email,
      phone,
      message,
      metadata: {
        source: 'contact-page',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[CONTACT_SUBMISSION_ERROR]', error)
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 })
  }
}
