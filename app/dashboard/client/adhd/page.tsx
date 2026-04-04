import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
    Brain, 
    Sparkles, 
    Zap, 
    Clock, 
    Focus, 
    Split, 
    PartyPopper,
    Play,
    Timer,
    Coffee,
    ClipboardCheck,
    ChevronRight
} from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ADHDWorkspace } from './ADHDWorkspace'
import { ADHDUnlockGate } from './ADHDUnlockGate'

export default async function ADHDHelperPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true }
  })

  if (!user?.clientProfile?.adhdDiagnosed) {
    return <ADHDUnlockGate />
  }

  const tasks = await prisma.task.findMany({
    where: { 
        userId: session.user.id,
        parentId: null 
    },
    include: { subTasks: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-10">
      <DashboardHeader 
        title="ADHD Executive Workspace" 
        description="High-Dopamine, Low-Friction Command Center"
      />

      {/* 1. Quick Action Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-oku-darkgrey text-white p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
           <div className="relative z-10">
              <Sparkles className="text-oku-lavender mb-4" />
              <h3 className="font-bold text-lg">AI Atomizer</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Break the wall of awful</p>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple-dark/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:border-oku-purple-dark/30 transition-all">
           <Timer className="text-oku-purple-dark mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Pomodoro Flow</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">25/5 Sprint Mode</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:border-oku-purple-dark/30 transition-all">
           <Focus className="text-oku-babyblue mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Body Doubling</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Virtual Focus Buddy</p>
        </div>
        <div className="bg-oku-butter p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:bg-oku-mint transition-all">
           <Coffee className="text-oku-darkgrey mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Dopamine Reset</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Quick 3-min break</p>
        </div>
      </div>

      {/* OS Navigation: Sub-tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Link href="/dashboard/client/adhd/tasks" className="card-glass-3d !p-8 !bg-white/60 hover:bg-white transition-all flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-inner">
                    <ClipboardCheck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-display font-bold text-oku-darkgrey">Today&apos;s Three</h3>
                    <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Focused Task Protocol</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
        </Link>

        <Link href="/dashboard/client/adhd/log" className="card-glass-3d !p-8 !bg-white/60 hover:bg-white transition-all flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-mint flex items-center justify-center text-oku-darkgrey shadow-inner">
                    <Zap size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-display font-bold text-oku-darkgrey">Energy & Meds</h3>
                    <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Daily Vitality Log</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      <ADHDWorkspace initialTasks={tasks} />
    </div>
  )
}
