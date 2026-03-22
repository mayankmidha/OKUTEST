import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import ClientProfileForm from './ClientProfileForm'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role === 'THERAPIST') {
    redirect('/practitioner/profile')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true }
  })

  if (!user) redirect('/auth/login')

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Your Profile" 
        description="Manage your personal space, clinical preferences, and contact identity."
      />

      <div className="max-w-4xl">
        <DashboardCard>
          <ClientProfileForm initialData={user} />
        </DashboardCard>
      </div>
    </div>
  )
}
