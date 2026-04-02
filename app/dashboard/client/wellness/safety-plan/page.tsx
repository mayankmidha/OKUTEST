import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { SafetyPlanForm } from './SafetyPlanForm'

export const dynamic = 'force-dynamic'

export default async function SafetyPlanPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const plan = await prisma.safetyPlan.findUnique({
    where: { userId: session.user.id },
  })

  const existing = plan
    ? {
        warningSigns: plan.warningSigns,
        copingStrategies: plan.copingStrategies,
        safeContacts: (plan.safeContacts as { name: string; phone: string }[]) ?? [],
      }
    : null

  return (
    <div className="py-12 px-6 lg:px-12 max-w-2xl mx-auto min-h-screen bg-oku-lavender/5">
      {/* Back */}
      <Link
        href="/dashboard/client/wellness"
        className="inline-flex items-center gap-2 text-sm text-oku-darkgrey/50 hover:text-oku-purple-dark transition-colors mb-10"
      >
        <ArrowLeft size={16} /> Back to Wellness Hub
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck size={24} className="text-emerald-600" />
          </div>
          <span className="chip">Crisis Toolkit</span>
        </div>
        <h1 className="heading-display text-5xl text-oku-darkgrey tracking-tighter">
          Safety <span className="text-oku-purple-dark italic">Plan.</span>
        </h1>
        <p className="text-oku-darkgrey/60 text-lg max-w-lg">
          Your personal toolkit for difficult moments. Having a plan ready
          makes all the difference.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          This is private and only visible to you
        </div>
      </div>

      <SafetyPlanForm existing={existing} />
    </div>
  )
}
