import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const userId = session.user.id

    // Clinical Compliance Check: 
    // In many jurisdictions, clinical notes (SOAP, Treatment Plans) must be retained for 7-10 years.
    // We "soft-delete" the user profile but keep the encrypted medical records tied to an anonymized ID if required.
    // For this implementation, we will perform a cascade delete of the User record, 
    // which Prisma handles via onDelete: Cascade in the schema for profiles, moods, etc.

    await prisma.user.delete({
      where: { id: userId }
    })

    return new NextResponse('Account deleted successfully', { status: 200 })

  } catch (error) {
    console.error('[ACCOUNT_DELETE_ERROR]', error)
    return new NextResponse('Deletion failed', { status: 500 })
  }
}
