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
    <div className="mx-auto min-h-screen max-w-7xl space-y-8 px-6 py-10 lg:px-10">
      <section className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white via-[#faf7f2] to-[#f0ece6] p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/80 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark">
                Client Workspace
              </span>
              <span className="rounded-full bg-oku-darkgrey/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">
                {careStatus}
              </span>
            </div>

            <div>
              <h1 className="heading-display text-5xl tracking-tight text-oku-darkgrey lg:text-7xl">
                Welcome back,{' '}
                <span className="italic text-oku-purple-dark">
                  {user.name?.split(' ')[0] || 'friend'}
                </span>
                .
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-oku-darkgrey/60">
                This version of OKU is organized around what you actually need:
                start care, complete clinical tasks, stay connected, and keep
                your progress in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={nextSession ? `/session/${nextSession.id}` : '/dashboard/client/therapists'}
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-8 !py-4 text-[10px]"
              >
                {nextSession ? 'Join next session' : 'Find care'}
                <ArrowRight size={14} className="ml-2" />
              </Link>
              <Link
                href="/dashboard/client/clinical"
                className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[10px]"
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

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-oku-darkgrey/35">
                First week in OKU
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-oku-darkgrey">
                Your next best moves
              </h2>
            </div>
            <div className="rounded-2xl bg-oku-darkgrey/5 px-4 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-oku-darkgrey/35">
                Done
              </p>
              <p className="mt-1 text-lg font-black text-oku-darkgrey">
                {completedSteps}/{gettingStarted.length}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {gettingStarted.map((step, index) => (
              <Link
                key={step.label}
                href={step.href}
                className={`flex items-start gap-4 rounded-[1.4rem] border p-4 transition-colors ${
                  step.done
                    ? 'border-emerald-200 bg-emerald-50/80'
                    : 'border-oku-darkgrey/5 bg-[#faf7f2] hover:bg-white'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-black ${
                    step.done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-oku-darkgrey/7 text-oku-darkgrey/55'
                  }`}
                >
                  {step.done ? 'OK' : index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-oku-darkgrey">{step.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-oku-darkgrey/55">
                    {step.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-sm backdrop-blur">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-oku-darkgrey/35">
            Care overview
          </p>

          {nextSession ? (
            <div className="mt-5 rounded-[1.6rem] bg-oku-darkgrey p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Next session
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {nextSession.practitioner.name}
              </h2>
              <p className="mt-2 text-sm text-white/65">
                {new Date(nextSession.startTime).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(nextSession.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="mt-4 text-sm text-white/55">
                {nextSession.service?.name || 'Therapy session'}
              </p>
              <Link
                href={`/session/${nextSession.id}`}
                className="btn-pill-3d mt-6 inline-flex bg-white border-white text-oku-darkgrey !px-7 !py-4 text-[10px]"
              >
                Enter session room
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.6rem] border border-dashed border-oku-darkgrey/10 bg-[#faf7f2] p-6">
              <p className="text-sm font-black text-oku-darkgrey">
                No session booked yet.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-oku-darkgrey/55">
                Start with a therapist match, or join a circle if you want a softer
                first step into the platform.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/client/therapists"
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-7 !py-4 text-[10px]"
                >
                  Browse therapists
                </Link>
                <Link
                  href="/dashboard/client/circles"
                  className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-7 !py-4 text-[10px]"
                >
                  Explore circles
                </Link>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniInfoCard
              label="Unread messages"
              value={String(unreadMessages)}
              helper="Secure support and practitioner replies"
            />
            <MiniInfoCard
              label="Active circles"
              value={String(activeCircles)}
              helper="Upcoming group spaces you belong to"
            />
            <MiniInfoCard
              label="Latest mood"
              value={latestMood ? `${latestMood}/10` : 'None'}
              helper="Your most recent logged check-in"
            />
            <MiniInfoCard
              label="ADHD workspace"
              value={user.clientProfile?.adhdDiagnosed ? 'Unlocked' : 'Locked'}
              helper={
                user.clientProfile?.adhdDiagnosed
                  ? 'Task help, routines, and body doubling'
                  : 'Unlocks after confirmed ADHD diagnosis'
              }
            />
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-oku-darkgrey/35">
            Core areas
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-oku-darkgrey">
            Everything important, without the clutter
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ModuleCard
            href="/dashboard/client/therapists"
            title="Find care"
            description="Browse practitioners and start booking from one clean place."
            badge="Start here"
            icon={<Sparkles size={20} />}
            tone="lavender"
          />
          <ModuleCard
            href="/dashboard/client/clinical"
            title="Assessments"
            description="Complete screenings, review results, and track assigned clinical tasks."
            badge={pendingAssignments > 0 ? `${pendingAssignments} pending` : 'Clinical'}
            icon={<ClipboardCheck size={20} />}
            tone="white"
          />
          <ModuleCard
            href="/dashboard/client/messages"
            title="Messages"
            description="Keep conversations with your care team in one secure channel."
            badge={unreadMessages > 0 ? `${unreadMessages} unread` : 'Secure'}
            icon={<MessageSquare size={20} />}
            tone="white"
          />
          <ModuleCard
            href="/dashboard/client/circles"
            title="Circles"
            description="Join group spaces, peer support, and facilitated community sessions."
            badge={activeCircles > 0 ? `${activeCircles} active` : 'Community'}
            icon={<Users size={20} />}
            tone="mint"
          />
          <ModuleCard
            href="/dashboard/client/wellness"
            title="Wellness"
            description="Mood check-ins, safety planning, and a simple view of your progress."
            badge="Tracking"
            icon={<Heart size={20} />}
            tone="white"
          />
          <ModuleCard
            href="/dashboard/client/documents"
            title="Documents"
            description="Invoices, records, uploads, and the paperwork that supports care."
            badge="Vault"
            icon={<FileText size={20} />}
            tone="white"
          />
          {user.clientProfile?.adhdDiagnosed && (
            <ModuleCard
              href="/dashboard/client/adhd"
              title="ADHD workspace"
              description="Focus tools, routines, body doubling, and structured low-overwhelm support."
              badge="Unlocked"
              icon={<Brain size={20} />}
              tone="peach"
            />
          )}
          <ModuleCard
            href="/dashboard/client/referrals"
            title="Referrals"
            description="Share OKU, track credits, and apply them automatically at checkout."
            badge={referralCredit > 0 ? 'Credit available' : 'Growth'}
            icon={<Gift size={20} />}
            tone="white"
          />
          <ModuleCard
            href="/dashboard/client/profile"
            title="Profile and safety"
            description="Manage your account, emergency contacts, preferences, and personal care details."
            badge="Settings"
            icon={<ShieldCheck size={20} />}
            tone="white"
          />
        </div>
      </section>
    </div>
  )
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
    <div className={`rounded-[1.5rem] border border-white/80 p-5 shadow-sm ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-oku-darkgrey/35">
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
    <div className="rounded-[1.3rem] border border-oku-darkgrey/5 bg-[#faf7f2] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-oku-darkgrey/35">
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
      className={`group rounded-[1.8rem] border border-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${toneClass}`}
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
