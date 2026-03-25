import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Activity, TrendingUp, 
  FileText, ArrowRight, Sparkles, Heart,
  ShieldCheck, Zap, Brain, MessageSquare, ArrowUpRight,
  User as UserIcon
} from 'lucide-react'
import { AppointmentStatus, UserRole, Prisma } from '@prisma/client'
import { DashboardCard } from '@/components/DashboardCard'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'
import { TaskManager } from '@/components/TaskManager'
import { PractitionerShell, PractitionerStatCard } from '@/components/practitioner-shell/practitioner-shell'
import { formatCurrency, convertToINR, autoConvert } from '@/lib/currency'

export default async function PractitionerDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  // 1. Fetch Practice Intelligence
  const [
    practitioner,
    totalCompleted,
    totalEarnings,
    caseloadCount,
    pendingTasks,
    recentNotes
  ] = await Promise.all([
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
            include: {
                practitionerAppointments: {
                    where: {
                        startTime: { gte: new Date(new Date().setHours(0,0,0,0)) },
                        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
                    },
                    include: { client: true, service: true },
                    orderBy: { startTime: 'asc' }
                }
            }
        }
      }
    }),
    prisma.appointment.count({
      where: { practitionerId: session.user.id, status: AppointmentStatus.COMPLETED }
    }),
    prisma.payment.aggregate({
      where: { appointment: { practitionerId: session.user.id }, status: 'COMPLETED' },
      _sum: { amount: true }
    }),
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      distinct: ['clientId'],
    }).then(res => res.length),
    prisma.task.count({
      where: { userId: session.user.id, completed: false }
    }),
    prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
  ])

  if (!practitioner) {
    // Auto-create profile if missing
    await prisma.practitionerProfile.create({
        data: { userId: session.user.id, bio: '', specialization: [] }
    })
    redirect('/practitioner/dashboard')
  }

  const todaySessions = (practitioner.user.practitionerAppointments || []).filter((a: any) => {
      const today = new Date().setHours(0,0,0,0)
      return new Date(a.startTime).setHours(0,0,0,0) === today
  })

  const upcomingSessions = (practitioner.user.practitionerAppointments || []).filter((a: any) => {
      return new Date(a.startTime) > new Date()
  })

  const earningsValue = totalEarnings._sum.amount || 0;

  return (
    <PractitionerShell
      title={`Welcome back, ${session.user.name?.split(' ')[0]}`}
      description="Your clinical practice is synchronized. Here is your overview for today."
      badge="Clinical Command"
      currentPath="/practitioner/dashboard"
      canPostBlogs={practitioner.canPostBlogs}
      heroActions={
        <div className="flex items-center gap-4">
          <Link href="/practitioner/schedule" className="btn-sky hidden md:flex items-center gap-2">
            <Clock size={18} /> Manage Hours
          </Link>
          <Link href="/practitioner/profile" className="btn-navy group flex items-center gap-2 shadow-2xl">
            <UserIcon size={18} className="group-hover:rotate-12 transition-transform" /> Professional Profile
          </Link>
        </div>
      }
    >
      {/* Stats Grid - Live Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <PractitionerStatCard 
          label="Total Revenue" 
          value={`$${earningsValue.toLocaleString()}`} 
          detail="Settled Payments" 
          accent="bg-oku-green" 
        />
        <PractitionerStatCard 
          label="Active Caseload" 
          value={caseloadCount} 
          detail="Unique Patients" 
          accent="bg-oku-purple" 
        />
        <PractitionerStatCard 
          label="Pending Tasks" 
          value={pendingTasks} 
          detail="Clinical Actions" 
          accent="bg-oku-pink" 
        />
        <PractitionerStatCard 
          label="Next Patient" 
          value={upcomingSessions[0]?.client?.name?.split(' ')[0] || 'Clear'} 
          detail={upcomingSessions[0] ? new Date(upcomingSessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No sessions'} 
          accent="bg-oku-ocean" 
        />
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
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000" />
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
        </div>
      </div>
      <AIAssistantWidget contextType="practitioner_summary" title="Clinical AI Assistant" />
    </PractitionerShell>
  )
}
