import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
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
    Coffee
} from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ADHDWorkspace } from './ADHDWorkspace'

export default async function ADHDHelperPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
           <div className="relative z-10">
              <Sparkles className="text-oku-lavender mb-4" />
              <h3 className="font-bold text-lg">AI Atomizer</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Break the wall of awful</p>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 group hover:border-oku-purple/30 transition-all">
           <Timer className="text-oku-purple mb-4" />
           <h3 className="font-bold text-lg text-oku-dark">Pomodoro Flow</h3>
           <p className="text-[10px] text-oku-taupe uppercase tracking-widest mt-1">25/5 Sprint Mode</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 group hover:border-oku-purple/30 transition-all">
           <Focus className="text-oku-ocean mb-4" />
           <h3 className="font-bold text-lg text-oku-dark">Body Doubling</h3>
           <p className="text-[10px] text-oku-taupe uppercase tracking-widest mt-1">Virtual Focus Buddy</p>
        </div>
        <div className="bg-oku-cream p-8 rounded-[2.5rem] border border-oku-taupe/10 group hover:bg-oku-matcha transition-all">
           <Coffee className="text-oku-matcha-dark mb-4" />
           <h3 className="font-bold text-lg text-oku-dark">Dopamine Reset</h3>
           <p className="text-[10px] text-oku-taupe uppercase tracking-widest mt-1">Quick 3-min break</p>
        </div>
      </div>

      <ADHDWorkspace initialTasks={tasks} />
    </div>
  )
}
