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
    ChevronRight,
    MessageCircle
} from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ADHDWorkspace } from './ADHDWorkspace'
import { ADHDUnlockGate } from './ADHDUnlockGate'
import { BodyDoubleRoom } from '@/components/BodyDoubleRoom'

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

  const currentUser = {
    id: session.user.id,
    name: session.user.name || 'User',
    role: session.user.role || 'CLIENT'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12">
      <DashboardHeader 
        title="ADHD Executive Workspace" 
        description="High-Dopamine, Low-Friction Command Center"
      />

      {/* ── IMMERSIVE FOCUS ROOM ── */}
      <section className="space-y-8">
         <div className="flex items-center justify-between px-4">
            <h2 className="heading-display text-3xl tracking-tight">Active <span className="italic">Sanctuary</span></h2>
            <span className="chip bg-oku-mint/40 border-oku-mint/20 text-emerald-700">Live Body Doubling</span>
         </div>
         <BodyDoubleRoom user={currentUser} />
      </section>

      {/* ── EXECUTIVE TOOLS ── */}
      <section className="space-y-8">
         <div className="flex items-center justify-between px-4">
            <h2 className="heading-display text-3xl tracking-tight">Protocol <span className="italic">Matrix</span></h2>
         </div>
         <ADHDWorkspace initialTasks={tasks} />
      </section>

      {/* ── QUICK NAV ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Link href="/dashboard/client/adhd/tasks" className="card-glass-3d !p-8 !bg-white/60 hover:bg-white transition-all flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-inner">
                    <ClipboardCheck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-display font-bold text-oku-darkgrey">Today&apos;s Three</h3>
                    <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Task Protocol</p>
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
                    <h3 className="text-xl font-display font-bold text-oku-darkgrey">Energy Log</h3>
                    <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Vitality Audit</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
        </Link>

        <Link href="/dashboard/client/circles" className="card-glass-3d !p-8 !bg-oku-babyblue/30 hover:bg-oku-babyblue/40 transition-all flex items-center justify-between group border-none">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-oku-babyblue-dark shadow-sm">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-display font-bold text-oku-darkgrey">ADHD Circles</h3>
                    <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Peer Support</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
