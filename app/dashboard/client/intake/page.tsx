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
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Clinical Intake" 
        description="Please complete your clinical onboarding documents to ensure a safe and legally compliant care journey."
      />

      <div className="max-w-4xl">
        <IntakeFormClient initialData={intake} />
      </div>
    </div>
  )
}
