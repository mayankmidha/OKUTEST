import { NextResponse } from 'next/server'
import speakeasy from 'speakeasy'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { token } = await req.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorSecret: true,
      },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: '2FA setup must be started first' }, { status: 400 })
    }

    const isValidToken = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    })

    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[2FA_VERIFY_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
