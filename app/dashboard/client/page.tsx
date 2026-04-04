import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  FileText,
  Gift,
  Heart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ChevronRight,
  Calendar,
  TrendingUp,
  Settings,
  Zap
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
import { formatCurrency } from '@/lib/currency'
import { ClientDemoOnboarding } from '@/components/ClientDemoOnboarding'

export const dynamic = 'force-dynamic'

export default async function ClientDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const now = new Date()

  const [user, intakeForm, pendingAssignments, unreadMessages, activeCircles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        clientAppointments: {
          include: { practitioner: true, service: true },
          where: { startTime: { gte: now }, status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } },
          orderBy: { startTime: 'asc' },
          take: 1,
        },
        assessmentAnswers: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            clientAppointments: { where: { status: 'COMPLETED' } },
            moodEntries: true,
          }
        },
        moodEntries: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
    }),
    prisma.intakeForm.findUnique({ where: { userId: session.user.id }, select: { id: true } }),
    prisma.assignedAssessment.count({
      where: {
        clientId: session.user.id,
        status: 'PENDING',
      },
    }),
    prisma.message.count({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
    }),
    prisma.groupParticipant.count({
      where: {
        userId: session.user.id,
        appointment: {
          startTime: { gte: now },
          status: AppointmentStatus.CONFIRMED,
        },
      },
    }),
  ])

  if (!user) redirect('/auth/login')

  const nextSession = user.clientAppointments[0]
  const totalSessions = user._count.clientAppointments
  const referralCredit = user.clientProfile?.referralCreditBalance || 0
  const hasIntake = !!intakeForm
  const hasAssessment = user.assessmentAnswers.length > 0
  const hasBooked = totalSessions > 0 || !!nextSession
  const isNewUser = totalSessions === 0 && !nextSession

  const gettingStarted = [
    {
      done: hasIntake,
      label: 'Complete intake form',
      href: '/dashboard/client/intake',
      desc: 'Share your basics, goals, and safety details once.',
    },
    {
      done: hasAssessment,
      label: 'Take a first assessment',
      href: '/dashboard/client/clinical',
      desc: 'Create a baseline and store it in your clinical record.',
    },
    {
      done: hasBooked,
      label: 'Book or join care',
      href: '/dashboard/client/therapists',
      desc: 'Choose a practitioner or step into circles first.',
    },
  ]
  const completedSteps = gettingStarted.filter((s) => s.done).length
  const careStatus = nextSession
    ? 'Next session booked'
    : completedSteps < gettingStarted.length
      ? 'Setup in progress'
      : 'Ready for active care'

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5">
      
      {/* ── HEADER: THE SANCTUARY ── */}
      <section className="card-glass-3d !p-12 mb-12 bg-white/40">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Client Sanctuary</span>
              <span className="chip !bg-oku-darkgrey/5 !text-oku-darkgrey/45 font-display italic">{careStatus}</span>
            </div>

            <div>
              <h1 className="heading-display text-5xl lg:text-8xl tracking-tighter text-oku-darkgrey leading-[0.85]">
                Welcome back, <br />
                <span className="italic text-oku-purple-dark">
                  {user.name?.split(' ')[0] || 'friend'}
                </span>.
              </h1>
              <p className="text-xl text-oku-darkgrey/60 font-display italic mt-6 max-w-2xl border-l-4 border-oku-purple-dark/10 pl-8 leading-relaxed">
                Your healing journey is a returning, not a destination. Everything you need to stay connected and grounded is held right here.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap pt-4">
              <Link
                href={nextSession ? `/session/${nextSession.id}` : '/dashboard/client/therapists'}
                className="btn-pill-3d bg-oku-darkgrey text-white !px-10 !py-5 shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                {nextSession ? 'Join Session Room' : 'Begin Your Care'}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/client/clinical"
                className="btn-pill-3d bg-white text-oku-darkgrey !px-10 !py-5 border-white shadow-sm hover:bg-oku-lavender/20"
              >
                View Clinical Records
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Sessions Completed" value={String(totalSessions)} icon={<CheckCircle2 size={18} className="text-emerald-600" />} />
            <MetricCard label="Referral Credit" value={formatCurrency(referralCredit, 'INR')} icon={<Gift size={18} className="text-oku-purple-dark" />} />
            <MetricCard label="Assigned Tasks" value={String(pendingAssignments)} icon={<ClipboardCheck size={18} className="text-oku-peach-dark" />} />
            <MetricCard label="Safe Records" value={String(user._count.moodEntries)} icon={<ShieldCheck size={18} className="text-oku-babyblue-dark" />} />
          </div>
        </div>
      </section>

      <ClientDemoOnboarding
        hasIntake={hasIntake}
        hasAssessment={hasAssessment}
        hasBooked={hasBooked}
        autoOpen={isNewUser || !hasIntake}
      />

      <div className="grid gap-12 lg:grid-cols-12 relative z-10">
        
        {/* ── COLUMN 1: CLINICAL & CORE ── */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Active Care & Sessions */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h2 className="heading-display text-3xl tracking-tight">Active <span className="italic">Care</span></h2>
                <Link href="/dashboard/client/sessions" className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 hover:text-oku-purple-dark transition-colors">Session Ledger →</Link>
             </div>

             {nextSession ? (
                <div className="card-glass-3d !p-10 !bg-oku-darkgrey text-white relative overflow-hidden group">
                   <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple mb-4">Upcoming Clinical Window</p>
                         <h3 className="text-4xl font-black tracking-tight mb-2">{nextSession.practitioner.name}</h3>
                         <p className="text-white/60 font-display italic text-lg leading-relaxed">
                            {formatDateTime(nextSession.startTime)} <br />
                            <span className="text-sm uppercase tracking-widest opacity-40 font-black">{nextSession.service?.name}</span>
                         </p>
                      </div>
                      <div className="flex flex-col gap-4">
                         <Link href={`/session/${nextSession.id}`} className="btn-pill-3d bg-white text-oku-darkgrey !py-5 text-center">Enter Room</Link>
                         <Link href="/dashboard/client/messages" className="btn-pill-3d bg-white/10 text-white border-white/10 hover:bg-white/20 !py-5 text-center">Secure Message</Link>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-1/2 h-full bg-oku-purple/10 blur-3xl group-hover:bg-oku-purple/20 transition-all duration-1000" />
                </div>
             ) : (
                <div className="card-glass-3d !p-12 border-dashed border-oku-darkgrey/10 bg-white/40 text-center">
                   <Calendar size={48} className="mx-auto text-oku-darkgrey/10 mb-6" />
                   <p className="font-bold text-oku-darkgrey text-xl mb-2">No Session Scheduled</p>
                   <p className="text-oku-darkgrey/50 text-sm italic mb-8">Ready to return? Browse our collective or join a community circle.</p>
                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link href="/dashboard/client/therapists" className="btn-pill-3d bg-oku-darkgrey text-white !px-10">Find a Therapist</Link>
                      <Link href="/dashboard/client/circles" className="btn-pill-3d bg-white text-oku-darkgrey border-white shadow-sm !px-10">Explore Circles</Link>
                   </div>
                </div>
             )}
          </section>

          {/* Clinical Assessments Grid (Vision Tiers) */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h2 className="heading-display text-3xl tracking-tight">Clinical <span className="italic">Assessments</span></h2>
                <span className="chip bg-oku-lavender/40 border-oku-purple/20">4 Tiers Active</span>
             </div>
             
             <div className="grid md:grid-cols-2 gap-6">
                <ModuleCard 
                   href="/dashboard/client/clinical" 
                   title="Clinical Tasks" 
                   description="Assessments assigned by your practitioner for review." 
                   badge={pendingAssignments > 0 ? `${pendingAssignments} Pending` : "Assigned"} 
                   icon={<ClipboardCheck size={20} />} 
                   tone="lavender" 
                />
                <ModuleCard 
                   href="/assessments" 
                   title="Self-Check" 
                   description="Public screeners for PHQ-9, GAD-7, and ADHD." 
                   badge="Public Tier" 
                   icon={<Sparkles size={20} />} 
                   tone="white" 
                />
                <ModuleCard 
                   href="/dashboard/client/mood/history" 
                   title="Score Trends" 
                   description="Track your assessment results and progress over time." 
                   badge="Personal Tier" 
                   icon={<TrendingUp size={20} />} 
                   tone="white" 
                />
                <ModuleCard 
                   href="/dashboard/client/assessments?tier=paid" 
                   title="Diagnostic Reports" 
                   description="Formal evaluations for ADHD, Autism, and IQ." 
                   badge="Paid Tier" 
                   icon={<FileText size={20} />} 
                   tone="white" 
                />
             </div>
          </section>

          {/* Community & Circles */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h2 className="heading-display text-3xl tracking-tight">Support <span className="italic">Circles</span></h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">{activeCircles} Active Memberships</span>
             </div>
             <Link href="/dashboard/client/circles" className="block card-glass-3d !p-10 !bg-oku-babyblue/30 border-none group">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-oku-babyblue-dark shadow-sm">
                         <Users size={32} />
                      </div>
                      <div>
                         <h4 className="text-2xl font-display font-bold tracking-tight">Group & Peer Support</h4>
                         <p className="text-sm text-oku-darkgrey/50 italic leading-relaxed mt-1">Trauma, ADHD, Grief, and Queer-affirming spaces.</p>
                      </div>
                   </div>
                   <ArrowRight size={24} className="text-oku-babyblue-dark/30 group-hover:translate-x-2 transition-all" />
                </div>
             </Link>
          </section>
        </div>

        {/* ── COLUMN 2: GROWTH & UTILITY ── */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* ADHD Manager (Conditional) */}
          {user.clientProfile?.adhdDiagnosed ? (
             <section className="space-y-6">
                <p className="clinic-kicker ml-4">Unlocked</p>
                <Link href="/dashboard/client/adhd" className="block p-10 rounded-[3rem] bg-oku-peach/20 border-2 border-oku-peach/30 hover:bg-oku-peach/25 transition-all group relative overflow-hidden shadow-xl">
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-4 bg-white rounded-2xl text-oku-peach-dark shadow-sm"><Brain size={28} /></div>
                         <h4 className="text-2xl font-display font-bold tracking-tight">ADHD Matrix</h4>
                      </div>
                      <ul className="space-y-4 mb-8">
                         {['3-Task Planner', 'Body Doubling', 'Dopamine Menu', 'Brain Dump'].map(f => (
                            <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-oku-peach-dark/60">
                               <div className="w-1.5 h-1.5 rounded-full bg-oku-peach-dark" /> {f}
                            </li>
                         ))}
                      </ul>
                      <div className="flex items-center justify-between text-xs font-bold text-oku-peach-dark">
                         <span>Open Workspace</span>
                         <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                   <Zap className="absolute -bottom-10 -right-10 text-oku-peach-dark opacity-5 w-48 h-48 rotate-12" />
                </Link>
             </section>
          ) : (
             <section className="space-y-6 opacity-40">
                <p className="clinic-kicker ml-4">Locked Feature</p>
                <div className="p-10 rounded-[3rem] bg-white/40 border-2 border-dashed border-oku-darkgrey/10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-white/60 rounded-2xl text-oku-darkgrey/30"><Brain size={28} /></div>
                      <h4 className="text-xl font-display font-bold tracking-tight">ADHD Manager</h4>
                   </div>
                   <p className="text-xs text-oku-darkgrey/40 leading-relaxed italic">
                      Unlocked after a confirmed diagnosis or formal evaluation.
                   </p>
                </div>
             </section>
          )}

          {/* Referrals & Credits */}
          <section className="space-y-6">
             <p className="clinic-kicker ml-4">Growth</p>
             <div className="card-glass-3d !p-10 !bg-oku-mint/30 border-none">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                      <Gift size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-oku-darkgrey tracking-tight">Referrals</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Earn 10% Credit</p>
                   </div>
                </div>
                <p className="text-sm text-oku-darkgrey/60 italic leading-relaxed mb-8">
                   Share OKU with a friend. When they complete a session, you both receive 10% credit toward your next care.
                </p>
                <Link href="/dashboard/client/referrals" className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-4 text-center">Get My Link</Link>
             </div>
          </section>

          {/* Wellness & Safety */}
          <section className="space-y-6">
             <p className="clinic-kicker ml-4">Foundation</p>
             <div className="grid gap-4">
                <QuickLink href="/dashboard/client/wellness" icon={<Heart size={16} />} label="Daily Mood Check" />
                <QuickLink href="/dashboard/client/wellness/safety-plan" icon={<ShieldCheck size={16} />} label="Crisis Safety Plan" />
                <QuickLink href="/dashboard/client/profile" icon={<Settings size={16} />} label="Account Settings" />
             </div>
          </section>

        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="card-glass-3d !p-6 !bg-white/60 flex items-center justify-between">
       <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-oku-darkgrey">{value}</p>
       </div>
       {icon}
    </div>
  )
}

function QuickLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-white hover:bg-white transition-all shadow-sm group">
       <div className="flex items-center gap-4">
          <div className="text-oku-purple-dark/40 group-hover:text-oku-purple-dark transition-colors">{icon}</div>
          <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey">{label}</span>
       </div>
       <ChevronRight size={14} className="text-oku-darkgrey/10 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ModuleCard({
  href,
  title,
  description,
  badge,
  icon,
  tone,
}: {
  href: string
  title: string
  description: string
  badge: string
  icon: ReactNode
  tone: 'lavender' | 'mint' | 'peach' | 'white'
}) {
  const toneClass =
    tone === 'lavender'
      ? 'bg-oku-lavender/20'
      : tone === 'mint'
        ? 'bg-oku-mint/20'
        : tone === 'peach'
          ? 'bg-oku-peach/25'
          : 'bg-white/70'

  return (
    <Link
      href={href}
      className={`group card-glass-3d !p-8 transition-all hover:-translate-y-1 ${toneClass} border-none`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-oku-purple-dark shadow-sm">
          {icon}
        </div>
        <span className="rounded-full bg-white/85 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-oku-darkgrey/45">
          {badge}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black tracking-tight text-oku-darkgrey">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-oku-darkgrey/60">
        {description}
      </p>
      <div className="mt-5 inline-flex items-center text-[10px] font-black uppercase tracking-[0.24em] text-oku-purple-dark">
        Open area
        <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
