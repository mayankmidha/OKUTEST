import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { ShieldCheck, FileText, AlertCircle, Save, CheckCircle2 } from 'lucide-react'
import IntakeFormClient from './IntakeFormClient'

export default async function IntakePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const intake = await prisma.intakeForm.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <DashboardHeader 
        title="Clinical Intake" 
        description="Please complete your clinical onboarding documents to support a safe, well-documented care journey."
      />

      <div className="max-w-4xl">
        <IntakeFormClient initialData={intake} />
      </div>
    </div>
  )
}
