import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Activity, TrendingUp, 
  FileText, ArrowRight, Sparkles, Heart,
  ShieldCheck, Zap, Brain, MessageSquare
} from 'lucide-react'
import { AppointmentStatus, UserRole, Prisma } from '@prisma/client'
import { DashboardCard } from '@/components/DashboardCard'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'
import { TaskManager } from '@/components/TaskManager'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export default async function PractitionerDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  let practitioner: any = null
  let totalCompleted = 0
  let totalEarnings: any = { _sum: { amount: 0 } }
  let recentNotes: any[] = []
  let needsRedirect = false

  try {
    practitioner = await prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        appointments: {
          where: {
            startTime: { gte: new Date(new Date().setHours(0,0,0,0)) },
            status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
          },
          include: {
            client: true,
            service: true
          },
          orderBy: { startTime: 'asc' }
        }
      }
    })

    if (!practitioner) {
      await prisma.practitionerProfile.create({
          data: { userId: session.user.id, bio: '', specialization: [] }
      })
      needsRedirect = true
    } else {
      totalCompleted = await prisma.appointment.count({
          where: { 
              practitionerId: session.user.id,
              status: AppointmentStatus.COMPLETED
          }
      })

      totalEarnings = await prisma.payment.aggregate({
          where: {
              appointment: { practitionerId: session.user.id },
              status: 'COMPLETED'
          },
          _sum: { amount: true }
      })

      recentNotes = await prisma.soapNote.findMany({
          where: { appointment: { practitionerId: session.user.id } },
          include: { appointment: { include: { client: true } } },
          orderBy: { createdAt: 'desc' },
          take: 3
      })
    }
  } catch (error) {
    console.error("Practitioner Dashboard Error:", error)
    return (
      <div className="py-20 px-10 bg-oku-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="animate-float mx-auto text-oku-purple-dark mb-6" size={48} />
          <h1 className="text-3xl font-display font-bold text-oku-dark">Clinical Syncing...</h1>
          <p className="text-oku-taupe italic mt-2">Finalizing your secure profile. Please refresh in a moment.</p>
        </div>
      </div>
    )
  }

  if (needsRedirect) {
    redirect('/practitioner/dashboard')
  }

  const todaySessions = (practitioner?.appointments || []).filter((a: any) => {
      const today = new Date().setHours(0,0,0,0)
      return new Date(a.startTime).setHours(0,0,0,0) === today
  })

  const upcomingSessions = (practitioner?.appointments || []).filter((a: any) => {
      return new Date(a.startTime) > new Date()
  })

  return (
    <PractitionerShell
      title="Clinical Command"
      description="Refined practice management for deep clinical focus."
      badge="Practitioner HQ"
      currentPath="/practitioner/dashboard"
      heroActions={
        <div className="flex items-center gap-4">
          <Link href="/practitioner/schedule" className="btn-sky hidden md:flex items-center gap-2">
            <Clock size={18} /> Manage Hours
          </Link>
          <Link href="/practitioner/profile" className="btn-navy group flex items-center gap-2 shadow-2xl">
            <UserCircle size={18} className="group-hover:rotate-12 transition-transform" /> Professional Profile
          </Link>
        </div>
      }
    >
      {/* Stats Grid - Enhanced with Navy & Ocean */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="card-glass p-8 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Today's Load</p>
            <p className="text-4xl font-display font-bold text-oku-dark">{todaySessions.length}</p>
            <p className="text-xs text-oku-taupe font-medium mt-1">Confirmed Sessions</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-purple/20 text-oku-purple-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Video size={24} />
          </div>
        </div>

        <div className="card-glass p-8 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Lifetime</p>
            <p className="text-4xl font-display font-bold text-oku-dark">{totalCompleted}</p>
            <p className="text-xs text-oku-taupe font-medium mt-1">Completed Sessions</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-ocean text-oku-navy-light flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="card-glass p-8 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Practice Revenue</p>
            <p className="text-4xl font-display font-bold text-oku-dark">${totalEarnings._sum.amount || 0}</p>
            <p className="text-xs text-oku-taupe font-medium mt-1">Settled Payments</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-green/20 text-oku-green-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="card-navy p-8 flex items-center justify-between group overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-60 mb-2">Next Patient</p>
            <p className="text-xl font-bold truncate pr-2 group-hover:translate-x-1 transition-transform">
              {upcomingSessions[0] ? upcomingSessions[0].client?.name : 'Queue clear'}
            </p>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 rounded-full bg-oku-purple animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Ready for Launch</span>
            </div>
          </div>
          <Zap className="absolute bottom-[-10px] right-[-10px] text-oku-purple opacity-10 group-hover:rotate-12 transition-transform" size={100} />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Schedule & Notes */}
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-display font-bold text-oku-dark">Active Schedule</h2>
              <Link href="/practitioner/appointments" className="text-[10px] font-black uppercase tracking-widest text-oku-navy hover:text-oku-purple-dark transition-colors flex items-center gap-1">Full Ledger <ArrowUpRight size={14} /></Link>
            </div>
            
            <div className="space-y-4">
              {todaySessions.length === 0 ? (
                <div className="card-glass py-24 text-center border-dashed">
                  <p className="text-oku-taupe font-display italic text-2xl opacity-40">The space is quiet today.</p>
                </div>
              ) : (
                todaySessions.map((appt: any) => (
                  <div key={appt.id} className="card-glass p-1 group hover:border-oku-navy/20 transition-all">
                    <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[100px] p-4 bg-oku-cream rounded-2xl border border-oku-taupe/5">
                           <p className="text-2xl font-display font-bold text-oku-dark tracking-tighter">
                             {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </p>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-taupe opacity-60 mt-0.5">Start Time</p>
                        </div>
                        <div className="h-12 w-px bg-oku-taupe/10 hidden md:block" />
                        <div>
                          <p className="text-2xl font-display font-bold text-oku-dark leading-tight group-hover:text-oku-navy transition-colors">{appt.client?.name || 'Patient'}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-oku-navy/5 text-oku-navy-light rounded-full border border-oku-navy/5">{appt.service?.name || 'Session'}</span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe flex items-center gap-1 opacity-60"><ShieldCheck size={10} /> Clinical Protocol</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/session/${appt.id}`} className="btn-navy min-w-[160px] text-center">
                        Launch Room
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="card-navy p-10 bg-oku-purple-dark group overflow-hidden border-none shadow-oku-purple-dark/20">
             <div className="relative z-10">
                <Heart className="text-oku-cream mb-6 animate-pulse" size={32} />
                <h3 className="text-3xl font-display font-bold text-white mb-4">Practitioner Resilience</h3>
                <p className="text-oku-cream/80 italic font-display text-lg leading-relaxed mb-8 max-w-2xl">
                   "Your capacity to hold space for others begins with your own gentle returning. Take a breath before your next session."
                </p>
                <Link href="/practitioner/support" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-oku-cream hover:text-white transition-all group-hover:translate-x-2">
                   Clinical Support Resources <ArrowUpRight size={14} />
                </Link>
             </div>
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-oku-dark/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* Sidebar Tasks & Reflections */}
        <div className="lg:col-span-4 space-y-10">
          <div className="h-[450px] card-glass overflow-hidden p-1">
             <TaskManager />
          </div>

          <section className="card-glass p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-oku-dark">Clinical Reflections</h2>
              <FileText size={20} className="text-oku-taupe/30" />
            </div>
            <div className="space-y-8 mt-4">
                {(!recentNotes || recentNotes.length === 0) ? (
                    <p className="text-sm text-oku-taupe italic opacity-60 text-center py-10">No secure notes recorded.</p>
                ) : (
                    recentNotes.map((note) => (
                        <div key={note.id} className="flex gap-5 group cursor-pointer border-b border-oku-taupe/5 pb-6 last:border-0">
                            <div className="w-12 h-12 rounded-2xl bg-oku-ocean flex items-center justify-center text-oku-navy-light shadow-inner group-hover:bg-oku-navy group-hover:text-white transition-all">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-oku-dark group-hover:text-oku-navy transition-colors truncate">{note.appointment.client?.name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-oku-taupe opacity-60 font-black mt-1">
                                    Finalized {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <ArrowUpRight size={16} className="text-oku-taupe opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 self-center" />
                        </div>
                    ))
                )}
            </div>
            <Link href="/practitioner/clients" className="mt-10 btn-sky w-full block text-center py-4">Clinical Archive</Link>
          </section>

          <div className="card-glass p-10 bg-oku-ocean/30 border-oku-blue-mid/20">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-oku-navy text-white flex items-center justify-center">
                   <MessageSquare size={18} />
                </div>
                <h3 className="font-bold text-oku-dark">Secure Messaging</h3>
             </div>
             <p className="text-xs text-oku-taupe leading-relaxed mb-6 italic font-display">
                HIPAA-compliant channel for patient coordination and follow-up.
             </p>
             <Link href="/practitioner/messages" className="text-[10px] font-black uppercase tracking-widest text-oku-navy-light hover:underline flex items-center gap-1">
                Open Inbox <ArrowRight size={12} />
             </Link>
          </div>
        </div>
      </div>
      <AIAssistantWidget contextType="practitioner_summary" title="Clinical AI Assistant" />
    </PractitionerShell>
  )
}

import { UserCircle } from 'lucide-react'
