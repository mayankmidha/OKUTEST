import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ArrowRight as LucideArrowRight,
  ArrowUpRight,
  Brain,
  Clock,
  FileText,
  Heart,
  Pill,
  ShieldCheck,
  User as UserIcon,
  Users,
  Zap,
  Calendar,
  Activity,
  Plus,
  MessageSquare,
  Save,
  CheckCircle2,
  Moon,
  Sparkles,
  ChevronRight,
  DollarSign,
  TrendingUp,
  ClipboardCheck,
  Video
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
    recentNotes,
    upcomingSessions,
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
    prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        startTime: { gte: new Date() },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: { client: true, service: true, participants: { include: { user: true } } },
      orderBy: { startTime: 'asc' },
      take: 5
    }),
  ])

  if (!practitioner) redirect('/auth/login')

  const nextSession = upcomingSessions[0]
  const todaySessionsCount = upcomingSessions.filter(s =>
    new Date(s.startTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
  ).length

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-mint/5 relative overflow-hidden">
      
      {/* ── HEADER: CLINICAL PULSE ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Clinical Command</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Therapist Dashboard</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Presence, <span className="text-oku-purple-dark italic">{session.user.name?.split(' ')[0]}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Manage caseload, sessions, and clinical outcomes.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/practitioner/schedule" className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10">
             <Clock size={18} className="mr-3 text-oku-purple-dark" /> Manage Hours
          </Link>
          <Link href="/practitioner/messages" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 pulse-cta">
             <MessageSquare size={18} className="mr-3" /> Secure Inbox
          </Link>
        </div>
      </div>

      {/* ── 1. STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Activity size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/40">Today</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{todaySessionsCount}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Sessions Remaining</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Active</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{caseloadCount}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Patient Caseload</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-babyblue/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <DollarSign size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/20" />
          </div>
          <div>
            <p className="text-4xl heading-display text-oku-darkgrey mb-2">Tracked</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Earnings & Payouts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        
        {/* ── LEFT: WORKFLOWS ── */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* NEXT PATIENT QUICK-JOIN */}
          {nextSession && (
            <section className="card-glass-3d !p-12 !bg-oku-dark text-white relative overflow-hidden group shadow-2xl !rounded-[3rem]">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/20 shadow-xl font-display font-bold text-3xl text-oku-lavender">
                        {nextSession.client?.name?.substring(0, 1)}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Next Clinical Window</p>
                        <h2 className="text-4xl font-display font-bold tracking-tight">{nextSession.client?.name || 'Patient Seeker'}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="flex items-center gap-2 text-sm text-white/60 font-display italic"><Calendar size={14} /> {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-2 text-sm text-white/60 font-display italic"><ShieldCheck size={14} /> HIPAA Video Ready</span>
                        </div>
                    </div>
                  </div>
                  <Link 
                    href={`/session/${nextSession.id}`}
                    className="btn-pill-3d bg-white text-oku-dark hover:bg-oku-lavender hover:scale-105 transition-all !py-5 !px-12 flex items-center gap-3"
                  >
                    Enter Care Room <ArrowRight size={18} />
                  </Link>
               </div>
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px]" />
            </section>
          )}

          {/* CAPABILITY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CASELOAD */}
            <Link href="/practitioner/clients" className="card-glass-3d !p-10 !bg-white/60 hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-oku-mint/20 flex items-center justify-center text-oku-mint-dark shadow-sm">
                        <Users size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Caseload</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Manage clients, history, and SOAP notes.</p>
            </Link>

            {/* CIRCLES HOST */}
            <Link href="/practitioner/dashboard?tab=circles" className="card-glass-3d !p-10 !bg-white/60 hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-oku-lavender/20 flex items-center justify-center text-oku-purple-dark shadow-sm">
                        <Video size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Circles Host</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Facilitate group therapy and peer sessions.</p>
            </Link>

            {/* CLINICAL TOOLS */}
            <Link href="/practitioner/assessments" className="card-glass-3d !p-10 !bg-white/60 hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-oku-peach/20 flex items-center justify-center text-oku-peach-dark shadow-sm">
                        <ClipboardCheck size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Clinical Hub</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Assign assessments and view progress trends.</p>
            </Link>

            {/* FINANCIALS */}
            <Link href="/practitioner/billing" className="card-glass-3d !p-10 !bg-white/60 hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-oku-babyblue/20 flex items-center justify-center text-oku-babyblue-dark shadow-sm">
                        <CreditCard size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Financials</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Track earnings, payouts, and invoices.</p>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: DOCUMENTATION & AI ── */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* SCRATCHPAD */}
          <section className="card-glass-3d !bg-oku-butter !p-10 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Sparkles className="text-oku-purple-dark/60 animate-float-3d" size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Clinical Space</span>
              </div>
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-6">Session <span className="italic text-oku-purple-dark">Scratchpad</span></h3>
              <textarea 
                placeholder="Draft insights or session summaries..."
                className="w-full h-40 bg-white/40 border border-white/60 rounded-[2rem] p-6 text-sm italic font-display focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all shadow-sm placeholder:text-oku-darkgrey/30"
              />
              <button className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 mt-6 group">
                <Save size={16} className="mr-3" /> Auto-Saving
              </button>
            </div>
          </section>

          {/* AI ASSISTANT WIDGET */}
          <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-dashed border-2">
             <Brain size={24} className="text-oku-purple-dark/40 mb-6 animate-float-3d" />
             <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2">AI Insights</p>
             <p className="text-sm font-bold text-oku-darkgrey/60 italic leading-relaxed">
               "Review the last PHQ-9 for {nextSession?.client?.name || 'your next patient'} before the session begins."
             </p>
          </div>

          {/* QUICK LINKS */}
          <section className="card-glass-3d !p-10 !bg-white/40">
            <div className="space-y-3">
              {[
                { label: 'Full Schedule', href: '/practitioner/appointments', icon: <Calendar size={14} /> },
                { label: 'Patient Roster', href: '/practitioner/clients', icon: <Users size={14} /> },
                { label: 'EHR Vault', href: '/practitioner/assessments', icon: <FileText size={14} /> },
                { label: 'Clinical Profile', href: '/practitioner/profile', icon: <Settings size={14} /> },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-oku-purple-dark/60">{link.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey">{link.label}</span>
                  </div>
                  <ChevronRight size={12} className="text-oku-darkgrey/20 group-hover:text-oku-purple-dark" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}

function ArrowRight({ size }: { size: number }) {
    return <ChevronRight size={size} />
}

function CreditCard({ size }: { size: number }) {
    return <DollarSign size={size} />
}

function Settings({ size }: { size: number }) {
    return <UserIcon size={size} />
}
