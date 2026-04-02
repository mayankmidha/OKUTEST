import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ArrowUpRight,
  Brain,
  Clock,
  FileText,
  Users,
  Calendar,
  Activity,
  Plus,
  MessageSquare,
  Sparkles,
  ChevronRight,
  DollarSign,
  TrendingUp,
  ClipboardCheck,
  Video,
  ShieldCheck,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { formatCurrency } from '@/lib/currency'

export const dynamic = 'force-dynamic'

export default async function PractitionerDashboardPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [
    practitioner,
    totalCompleted,
    caseloadCount,
    pendingNotes,
    upcomingSessions,
    unreviewedAssessments,
  ] = await Promise.all([
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    }),
    prisma.appointment.count({
      where: { practitionerId: session.user.id, status: AppointmentStatus.COMPLETED },
    }),
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      distinct: ['clientId'],
    }).then((results) => results.length),
    prisma.appointment.findMany({
      where: { 
        practitionerId: session.user.id, 
        status: AppointmentStatus.COMPLETED,
        soapNote: null
      },
      include: { client: true, service: true },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        startTime: { gte: new Date() },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: { client: true, service: true },
      orderBy: { startTime: 'asc' },
      take: 5
    }),
    prisma.assessmentAnswer.findMany({
        where: {
          user: {
            clientAppointments: {
              some: { practitionerId: session.user.id }
            }
          }
        },
        include: { user: true, assessment: true },
        orderBy: { completedAt: 'desc' },
        take: 5
    })
  ])

  if (!practitioner) redirect('/auth/login')

  const nextSession = upcomingSessions[0]
  const todaySessions = upcomingSessions.filter(s =>
    new Date(s.startTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
  )

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden text-oku-darkgrey">
      
      {/* ── HEADER: CLINICAL FOCUS ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Clinical Pulse</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Active Workspace</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Presence, <span className="text-oku-purple-dark italic">{session.user.name?.split(' ')[0]}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Your clinical windows and patient intelligence for today.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-oku-purple animate-pulse" />
              Next Session in {nextSession ? '45m' : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        
        {/* ── LEFT: THE CLINICAL QUEUE (TODAY) ── */}
        <div className="xl:col-span-8 space-y-12">
          
          <section className="card-glass-3d !p-12 !bg-white/40 overflow-hidden relative">
             <div className="flex items-center justify-between mb-12">
                <h2 className="heading-display text-4xl tracking-tight">Today&apos;s <span className="italic text-oku-purple-dark">Schedule</span></h2>
                <div className="flex items-center gap-4">
                    <button className="p-3 rounded-xl bg-white border border-white/60 text-oku-darkgrey/40 hover:text-oku-purple-dark transition-all"><Search size={18} /></button>
                    <button className="p-3 rounded-xl bg-white border border-white/60 text-oku-darkgrey/40 hover:text-oku-purple-dark transition-all relative">
                        <Bell size={18} />
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-oku-purple shadow-sm" />
                    </button>
                </div>
             </div>

             {todaySessions.length === 0 ? (
                <div className="py-24 text-center">
                    <p className="text-2xl font-display italic text-oku-darkgrey/20">A quiet day for deep work.</p>
                    <Link href="/practitioner/schedule" className="btn-pill-3d bg-oku-darkgrey text-white mt-8 !px-10">Open Calendar</Link>
                </div>
             ) : (
                <div className="space-y-6">
                    {todaySessions.map((session, i) => (
                        <div key={session.id} className="group relative">
                            <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8 ${i === 0 ? 'bg-oku-dark text-white border-oku-dark shadow-2xl scale-[1.02]' : 'bg-white border-white/60 hover:border-oku-purple/30 shadow-sm'}`}>
                                <div className="flex items-center gap-8">
                                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-inner ${i === 0 ? 'bg-white/10 border border-white/20' : 'bg-oku-lavender/40 text-oku-purple-dark'}`}>
                                        {new Date(session.startTime).getHours()}:{new Date(session.startTime).getMinutes().toString().padStart(2, '0')}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${i === 0 ? 'text-oku-lavender' : 'text-oku-darkgrey/30'}`}>
                                            {session.service.name} • {session.isTrial ? 'Free Consultation' : 'Standard Session'}
                                        </p>
                                        <h3 className="text-3xl font-display font-bold tracking-tight">{session.client?.name}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={`/session/${session.id}`}
                                        className={`btn-pill-3d !py-4 !px-10 flex items-center gap-3 ${i === 0 ? 'bg-white text-oku-dark' : 'bg-oku-dark text-white'}`}
                                    >
                                        <Video size={18} /> Launch Room
                                    </Link>
                                    <button className={`p-4 rounded-full border transition-all ${i === 0 ? 'border-white/20 text-white/40 hover:bg-white/10' : 'border-oku-darkgrey/10 text-oku-darkgrey/20 hover:bg-oku-lavender/40'}`}>
                                        <FileText size={20} />
                                    </button>
                                </div>
                            </div>
                            {i < todaySessions.length - 1 && <div className="absolute left-[40px] -bottom-[24px] w-0.5 h-6 bg-oku-darkgrey/5" />}
                        </div>
                    ))}
                </div>
             )}
          </section>

          {/* PATIENT PROGRESS RADAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="card-glass-3d !p-10 !bg-oku-mint/20 border-oku-mint/10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="heading-display text-2xl tracking-tight">Active <span className="italic">Caseload</span></h3>
                    <Users size={20} className="text-oku-mint-dark/40" />
                </div>
                <p className="text-6xl heading-display text-oku-darkgrey mb-2">{caseloadCount}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-10">Seekers in your care</p>
                <Link href="/practitioner/clients" className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-white group hover:bg-white transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest">Open Patient Ledger</span>
                    <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </section>

             <section className="card-glass-3d !p-10 !bg-oku-lavender/20 border-oku-lavender/10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="heading-display text-2xl tracking-tight">Clinical <span className="italic">Output</span></h3>
                    <TrendingUp size={20} className="text-oku-purple-dark/40" />
                </div>
                <p className="text-6xl heading-display text-oku-darkgrey mb-2">{totalCompleted}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-10">Total care windows fulfilled</p>
                <Link href="/practitioner/billing" className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-white group hover:bg-white transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest">Earnings & Financials</span>
                    <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </section>
          </div>
        </div>

        {/* ── RIGHT: CLINICAL MEMORY & INSIGHTS ── */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* WORKING MEMORY (PENDING NOTES) */}
          <section className="card-glass-3d !p-10 !bg-oku-butter/40 border-dashed border-2">
             <div className="flex items-center justify-between mb-8">
                <h3 className="heading-display text-2xl tracking-tight">Working <span className="italic text-oku-purple-dark">Memory</span></h3>
                <Sparkles size={20} className="text-oku-purple-dark/20" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-6">Pending SOAP Notes</p>
             
             {pendingNotes.length === 0 ? (
                <div className="p-6 bg-white/40 rounded-2xl border border-white/60 text-center">
                    <CheckCircle2 size={24} className="mx-auto text-oku-mint-dark mb-2" />
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Documentation Complete</p>
                </div>
             ) : (
                <div className="space-y-4">
                    {pendingNotes.map(note => (
                        <Link 
                            key={note.id} 
                            href={`/practitioner/sessions/${note.id}/notes`}
                            className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-white/60 hover:bg-white transition-all group"
                        >
                            <div>
                                <p className="text-xs font-bold">{note.client?.name}</p>
                                <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">{new Date(note.startTime).toLocaleDateString()}</p>
                            </div>
                            <ChevronRight size={14} className="text-oku-darkgrey/20 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ))}
                </div>
             )}
          </section>

          {/* ASSESSMENT RADAR */}
          <section className="card-glass-3d !p-10 !bg-white/40">
             <div className="flex items-center justify-between mb-8">
                <h3 className="heading-display text-2xl tracking-tight">Patient <span className="italic text-oku-purple-dark">Signals</span></h3>
                <Activity size={20} className="text-oku-darkgrey/20" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-6">Recent Screenings</p>
             
             <div className="space-y-4">
                {unreviewedAssessments.map(ans => (
                    <div key={ans.id} className="p-5 bg-white/60 rounded-2xl border border-white/60 relative overflow-hidden group">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-xs font-bold">{ans.user.name}</p>
                                <p className="text-[10px] text-oku-purple-dark font-display italic mt-1">{ans.assessment.title}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-xl font-display font-black ${ans.score && ans.score > 15 ? 'text-red-500' : 'text-oku-darkgrey'}`}>
                                    {ans.score || '—'}
                                </p>
                                <p className="text-[8px] opacity-40 uppercase tracking-widest">Score</p>
                            </div>
                        </div>
                        {ans.score && ans.score > 15 && (
                            <div className="absolute top-0 right-0 p-2">
                                <AlertTriangle size={12} className="text-red-500 animate-pulse" />
                            </div>
                        )}
                    </div>
                ))}
             </div>
          </section>

          {/* AI ASSISTANT CLI */}
          <div className="card-glass-3d !p-10 !bg-oku-dark text-white relative overflow-hidden group">
             <Brain size={24} className="text-oku-lavender mb-6 animate-float-3d" />
             <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">OCI Intelligent Scribe</p>
             <p className="text-sm font-bold text-white/80 italic leading-relaxed">
               &ldquo;Drafting session summaries based on patient history. Review pending for {nextSession?.client?.name || 'next patient'}.&rdquo;
             </p>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-oku-purple/10 rounded-full blur-3xl" />
          </div>

        </div>
      </div>

      {/* AMBIENT BLOBS */}
      <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-oku-lavender/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}

function VideoIcon({ size }: { size: number }) {
    return <Video size={size} />
}

function FileTextIcon({ size }: { size: number }) {
    return <FileText size={size} />
}
