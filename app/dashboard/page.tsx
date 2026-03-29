import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = session.user.role

  if (role === 'THERAPIST') {
    const profile = await prisma.practitionerProfile.findUnique({
        where: { userId: session.user.id }
    })
    if (!profile || !profile.isOnboarded) {
        redirect('/practitioner/profile') // This page will now handle the extended onboarding
    }
    redirect('/practitioner/dashboard')
  }

  if (role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  // Default for CLIENT
  const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
  })
  if (!clientProfile || !clientProfile.isOnboarded) {
      redirect('/dashboard/client/intake') // Extended intake flow
  }
  
  redirect('/dashboard/client')
}
