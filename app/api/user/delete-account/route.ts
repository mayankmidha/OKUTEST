import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const userId = session.user.id

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        deletionRequestedAt: true,
      },
    })

    if (!existingUser) {
      return new NextResponse('Account not found', { status: 404 })
    }

    if (existingUser.deletionRequestedAt) {
      return new NextResponse('Account already scheduled for deletion', { status: 409 })
    }

    const deletedAt = new Date()
    const deletedEmail = `deleted+${userId}@oku.local`

    await prisma.$transaction([
      prisma.session.deleteMany({
        where: { userId },
      }),
      prisma.account.deleteMany({
        where: { userId },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          name: 'Deleted User',
          email: deletedEmail,
          password: null,
          phone: null,
          bio: null,
          avatar: null,
          image: null,
          referralCode: null,
          referredById: null,
          location: null,
          twoFactorSecret: null,
          twoFactorEnabled: false,
          deletionRequestedAt: deletedAt,
        },
      }),
      prisma.practitionerProfile.updateMany({
        where: { userId },
        data: {
          isVerified: false,
          canPostBlogs: false,
        },
      }),
    ])

    return new NextResponse('Account deleted successfully', { status: 200 })

  } catch (error) {
    console.error('[ACCOUNT_DELETE_ERROR]', error)
    return new NextResponse('Deletion failed', { status: 500 })
  }
}
