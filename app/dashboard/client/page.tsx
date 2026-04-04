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
  const moodCount = user._count.moodEntries
  const latestMood = user.moodEntries[0]?.mood
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
    <div className="clinic-shell min-h-screen">
      <section className="clinic-hero-card">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip">Client Workspace</span>
              <span className="chip !bg-oku-darkgrey/5 !text-oku-darkgrey/45">{careStatus}</span>
            </div>

            <div>
              <h1 className="heading-display text-4xl tracking-tight text-oku-darkgrey sm:text-5xl lg:text-7xl">
                Welcome back,{' '}
                <span className="italic text-oku-purple-dark">
                  {user.name?.split(' ')[0] || 'friend'}
                </span>
                .
              </h1>
              <p className="clinic-copy mt-4">
                This version of OKU is organized around what you actually need:
                start care, complete clinical tasks, stay connected, and keep
                your progress in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={nextSession ? `/session/${nextSession.id}` : '/dashboard/client/therapists'}
                className="btn-pill-3d w-full bg-oku-darkgrey border-oku-darkgrey text-white !px-8 !py-4 text-[10px] sm:w-auto"
              >
                {nextSession ? 'Join next session' : 'Find care'}
                <ArrowRight size={14} className="ml-2" />
              </Link>
              <Link
                href="/dashboard/client/clinical"
                className="btn-pill-3d w-full bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[10px] sm:w-auto"
              >
                Open clinical record
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Sessions completed"
              value={String(totalSessions)}
              tone="lavender"
            />
            <StatCard
              label="Mood check-ins"
              value={String(moodCount)}
              tone="white"
            />
            <StatCard
              label="Assigned tasks"
              value={String(pendingAssignments)}
              tone="white"
            />
            <StatCard
              label="Referral credit"
              value={formatCurrency(referralCredit, 'INR')}
              tone="mint"
            />
          </div>
        </div>
      </section>

      <ClientDemoOnboarding
        hasIntake={hasIntake}
        hasAssessment={hasAssessment}
        hasBooked={hasBooked}
        autoOpen={isNewUser || !hasIntake}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="clinic-surface space-y-8">
          <div>
            <p className="clinic-kicker">Next Steps</p>
            <h2 className="heading-display mt-2 text-3xl tracking-tight text-oku-darkgrey">
               {completedSteps < gettingStarted.length ? "Setting up your sanctuary" : "Your active care queue"}
            </h2>
          </div>

          {nextSession ? (
            <div className="rounded-[2rem] bg-oku-darkgrey p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple mb-4">Upcoming Session</p>
                <h3 className="text-4xl font-black tracking-tight mb-2">{nextSession.practitioner.name}</h3>
                <p className="text-white/60 font-display italic text-lg mb-8">
                  {formatDateTime(nextSession.startTime)} • {nextSession.service?.name}
                </p>
                <Link href={`/session/${nextSession.id}`} className="btn-pill-3d bg-white text-oku-darkgrey !px-10 !py-5">
                   Join Session Room <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-oku-purple/10 blur-3xl -z-0 group-hover:bg-oku-purple/20 transition-all duration-1000" />
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-oku-darkgrey/10 bg-[#faf7f2] p-8">
               <p className="font-bold text-oku-darkgrey text-xl mb-2">No session booked yet.</p>
               <p className="text-oku-darkgrey/50 text-sm leading-relaxed mb-6 italic">Ready to start? You can browse our collective or join a community circle.</p>
               <div className="flex gap-4">
                  <Link href="/dashboard/client/therapists" className="btn-pill-3d bg-oku-darkgrey text-white !px-8 !py-4 text-[10px]">Find a Therapist</Link>
                  <Link href="/dashboard/client/circles" className="btn-pill-3d bg-white text-oku-darkgrey !px-8 !py-4 text-[10px]">Explore Circles</Link>
               </div>
            </div>
          )}

          <div className="space-y-4">
             {gettingStarted.filter(s => !s.done).slice(0, 2).map((step, idx) => (
                <Link key={step.label} href={step.href} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-oku-taupe/5 hover:border-oku-purple/20 transition-all shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-oku-lavender/30 flex items-center justify-center text-oku-purple-dark text-[10px] font-black">{idx + 1}</div>
                      <div>
                         <p className="font-bold text-oku-darkgrey text-sm">{step.label}</p>
                         <p className="text-[11px] text-oku-darkgrey/40">{step.desc}</p>
                      </div>
                   </div>
                   <ArrowRight size={16} className="text-oku-darkgrey/10" />
                </Link>
             ))}
          </div>
        </section>

        <section className="space-y-8">
           <div className="grid gap-6 sm:grid-cols-2">
              <ModuleCard href="/dashboard/client/clinical" title="Records" description="Assessments & results" badge={pendingAssignments > 0 ? "Pending" : "Health"} icon={<ClipboardCheck size={20} />} tone="lavender" />
              <ModuleCard href="/dashboard/client/messages" title="Messages" description="Secure care channel" badge={unreadMessages > 0 ? "New" : "Inbox"} icon={<MessageSquare size={14} />} tone="white" />
              <ModuleCard href="/dashboard/client/wellness" title="Wellness" description="Track your progress" badge="Growth" icon={<Heart size={20} />} tone="mint" />
              <ModuleCard href="/dashboard/client/documents" title="Vault" description="Clinical paperwork" badge="Safe" icon={<FileText size={20} />} tone="white" />
           </div>
           
           {user.clientProfile?.adhdDiagnosed && (
             <Link href="/dashboard/client/adhd" className="block p-8 rounded-[2rem] bg-oku-peach/10 border border-oku-peach/20 hover:bg-oku-peach/15 transition-all group">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-oku-peach-dark shadow-sm"><Brain size={20} /></div>
                      <div>
                         <h4 className="font-bold text-oku-darkgrey">ADHD Workspace</h4>
                         <p className="text-sm text-oku-darkgrey/50 italic">Task help, routines, and body doubling.</p>
                      </div>
                   </div>
                   <ArrowRight size={20} className="text-oku-peach-dark/30 group-hover:translate-x-2 transition-all" />
                </div>
             </Link>
           )}
        </section>
      </div>
    </div>
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

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'lavender' | 'mint' | 'white'
}) {
  const toneClass =
    tone === 'lavender'
      ? 'bg-oku-lavender/25'
      : tone === 'mint'
        ? 'bg-oku-mint/25'
        : 'bg-white/75'

  return (
    <div className={`clinic-stat-card ${toneClass}`}>
      <p className="clinic-kicker">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight text-oku-darkgrey">
        {value}
      </p>
    </div>
  )
}

function MiniInfoCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="clinic-surface-muted">
      <p className="clinic-kicker">
        {label}
      </p>
      <p className="mt-2 text-xl font-black tracking-tight text-oku-darkgrey">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-oku-darkgrey/55">{helper}</p>
    </div>
  )
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
      className={`group clinic-surface p-6 transition-all hover:-translate-y-1 ${toneClass}`}
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
