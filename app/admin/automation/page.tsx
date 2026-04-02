import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AutomationDashboardClient from './AutomationDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminAutomationPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      <div className="flex flex-col gap-8 mb-16 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Enterprise Sanctuary</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Process Automation</span>
          </div>
          <h1 className="heading-display text-5xl lg:text-7xl text-oku-darkgrey tracking-tighter">
            System <span className="text-oku-purple-dark italic">Flow.</span>
          </h1>
          <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Scheduled workflows, automated reporting, and bulk operations.
          </p>
        </div>
      </div>

      <AutomationDashboardClient />
    </div>
  )
}
