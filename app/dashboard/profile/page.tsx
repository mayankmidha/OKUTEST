import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { ArrowLeft, UserCircle, Shield } from 'lucide-react'
import ClientProfileForm from './ClientProfileForm'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { PasswordChangeForm } from '@/components/PasswordChangeForm'
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
    <div className="py-12 px-10 max-w-[1600px] mx-auto">
      <DashboardHeader 
        title={session.user.role === 'ADMIN' ? "Command Profile" : "Account Sanctuary"} 
        description={session.user.role === 'ADMIN' ? "Manage your administrative identity and secure credentials." : "Manage your personal space, clinical preferences, and secure credentials."}
      />

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <DashboardCard title="Personal Identity" icon={<UserCircle size={20} strokeWidth={1.5} />}>
            <ClientProfileForm initialData={user} />
          </DashboardCard>
        </div>

        <div className="lg:col-span-5 space-y-12">
          <DashboardCard title="Security & Access" icon={<Shield size={20} strokeWidth={1.5} />} variant="white">
            <PasswordChangeForm />
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
