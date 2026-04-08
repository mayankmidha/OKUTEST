import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[2FA_DISABLE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
