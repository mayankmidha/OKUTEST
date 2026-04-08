import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { normalizeAuthEmail, sendVerificationEmailForUser } from '@/lib/auth-user'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? normalizeAuthEmail(body.email) : ''

    if (!email) {
      return NextResponse.json({
        message: 'If that account exists, a verification email has been sent.',
      })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
      },
    })

    if (user && !user.emailVerified) {
      await sendVerificationEmailForUser(user.id)
    }

    return NextResponse.json({
      message: 'If that account exists, a verification email has been sent.',
    })
  } catch (error) {
    console.error('[RESEND_VERIFICATION_ERROR]', error)
    return NextResponse.json({
      message: 'If that account exists, a verification email has been sent.',
    })
  }
}
