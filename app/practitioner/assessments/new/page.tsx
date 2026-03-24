import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NewAssessmentClient from './NewAssessmentClient'
import { UserRole } from '@prisma/client'

export default async function NewAssessmentPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const profile = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    select: { canPostBlogs: true }
  })

  return <NewAssessmentClient canPostBlogs={profile?.canPostBlogs} />
}
