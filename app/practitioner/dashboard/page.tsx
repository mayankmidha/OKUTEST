import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import {
  PractitionerActionTile,
  PractitionerPill,
  PractitionerSectionCard,
  PractitionerShell,
  PractitionerStatCard,
} from '@/components/practitioner-shell/practitioner-shell'
import { CirclesManager } from '@/app/admin/dashboard/CirclesManager'
import { PractitionerOnboardingBanner } from '@/components/PractitionerOnboardingBanner'

export const dynamic = 'force-dynamic'

export default async function PractitionerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  const { tab } = await searchParams

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  })

  if (!practitioner) {
    redirect('/auth/login')
  }

  const hasAvailability = await prisma.availability
    .findFirst({ where: { practitionerProfileId: practitioner.id } })
    .then(Boolean)

  if (tab === 'circles') {
    const [circles, allClients, practitioners] = await Promise.all([
      prisma.appointment.findMany({
        where: { practitionerId: session.user.id, isGroupSession: true },
        include: {
          service: true,
          participants: { include: { user: true } },
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.user.findMany({ where: { role: UserRole.CLIENT } }),
      prisma.user.findMany({ where: { role: UserRole.THERAPIST } }),
    ])

    return (
      <PractitionerShell
        title="Circles Host"
        badge="Community"
        currentPath="/practitioner/dashboard"
        description="Facilitate group spaces, manage capacity, and keep community sessions organized."
        heroActions={
          <Link
            href="/practitioner/dashboard"
            className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[10px]"
          >
            Return to workbench
          </Link>
        }
      >
        <CirclesManager
          existingCircles={circles}
          allClients={allClients}
          practitioners={practitioners}
        />
      </PractitionerShell>
    )
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(todayStart.getDate() + 1)
  const weekEnd = new Date(todayStart)
  weekEnd.setDate(todayStart.getDate() + 7)

  const [
    todaySessions,
    upcomingSessions,
    pendingNotes,
    unreadMessageCount,
    unreadMessages,
    pendingAssignmentCount,
    pendingAssignments,
    recentAssessmentAnswers,
    recentTranscripts,
    caseloadClients,
    completedSessions,
    circlesThisWeek,
    adhdCareClients,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        isGroupSession: false,
        startTime: { gte: todayStart, lt: tomorrowStart },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: {
        client: { select: { id: true, name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: 'asc' },
      take: 6,
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        isGroupSession: false,
        startTime: { gte: now },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: {
        client: { select: { id: true, name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: 'asc' },
      take: 6,
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        status: AppointmentStatus.COMPLETED,
        soapNote: null,
      },
      include: {
        client: { select: { id: true, name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: 'desc' },
      take: 5,
    }),
    prisma.message.count({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
    }),
    prisma.message.findMany({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.assignedAssessment.count({
      where: {
        practitionerId: session.user.id,
        status: 'PENDING',
      },
    }),
    prisma.assignedAssessment.findMany({
      where: {
        practitionerId: session.user.id,
        status: 'PENDING',
      },
      include: {
        assessment: { select: { title: true } },
        client: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.assessmentAnswer.findMany({
      where: {
        user: {
          clientAppointments: {
            some: { practitionerId: session.user.id },
          },
        },
      },
      include: {
        assessment: { select: { title: true } },
        user: {
          select: {
            id: true,
            name: true,
            clientProfile: { select: { adhdDiagnosed: true } },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 8,
    }),
    prisma.transcript.findMany({
      where: {
        appointment: { practitionerId: session.user.id },
      },
      include: {
        appointment: {
          select: {
            id: true,
            startTime: true,
            client: { select: { id: true, name: true } },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    }),
    prisma.appointment
      .findMany({
        where: {
          practitionerId: session.user.id,
          clientId: { not: null },
        },
        select: { clientId: true },
        distinct: ['clientId'],
      })
      .then((rows) => rows.length),
    prisma.appointment.count({
      where: {
        practitionerId: session.user.id,
        isGroupSession: false,
        status: AppointmentStatus.COMPLETED,
      },
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        isGroupSession: true,
        startTime: { gte: todayStart, lte: weekEnd },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: {
        participants: { select: { id: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: 'asc' },
      take: 4,
    }),
    prisma.clientProfile.count({
      where: {
        adhdDiagnosed: true,
        user: {
          clientAppointments: {
            some: { practitionerId: session.user.id },
          },
        },
      },
    }),
  ])

  const nextSession = upcomingSessions[0] || null
  const adhdSignalTranscripts = recentTranscripts.filter(
    (transcript) =>
      Array.isArray(transcript.adhdSignals) && transcript.adhdSignals.length > 0
  )
  const adhdAssessmentCandidates = recentAssessmentAnswers.filter(
    (answer) =>
      isAdhdAssessment(answer.assessment.title) &&
      !answer.user.clientProfile?.adhdDiagnosed
  )

  return (
    <PractitionerShell
      title="Therapist Workbench"
      badge="Clinical"
      currentPath="/practitioner/dashboard"
      description="Start with today’s care queue, then move through notes, assessments, circles, and ADHD-related signals without losing context."
      heroActions={
        <>
          <Link
            href="/practitioner/schedule"
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-8 !py-4 text-[10px]"
          >
            Open schedule
          </Link>
          <Link
            href="/practitioner/clients"
            className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[10px]"
          >
            Open clients
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        {!practitioner.isOnboarded && (
          <PractitionerOnboardingBanner
            hasBio={Boolean(practitioner.bio)}
            hasRates={Boolean(practitioner.hourlyRate || practitioner.indiaSessionRate)}
            hasAvailability={hasAvailability}
          />
        )}

        {!practitioner.isVerified && (
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-5 py-5 text-amber-900 sm:px-6">
            <div className="flex items-start gap-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-black">Profile under review</p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
                  Your profile is not yet verified for marketplace visibility. You can still prepare your schedule, notes, assessments, and circles from this workspace.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PractitionerStatCard
            label="Today's Sessions"
            value={todaySessions.length}
            detail={todaySessions.length > 0 ? 'Live care windows' : 'Quiet day'}
            accent="bg-oku-purple-dark"
          />
          <PractitionerStatCard
            label="Pending Notes"
            value={pendingNotes.length}
            detail={pendingNotes.length > 0 ? 'Documentation backlog' : 'Up to date'}
            accent="bg-oku-peach-dark"
          />
          <PractitionerStatCard
            label="Unread Messages"
            value={unreadMessageCount}
            detail={unreadMessageCount > 0 ? 'Client replies waiting' : 'Inbox calm'}
            accent="bg-oku-babyblue-dark"
          />
          <PractitionerStatCard
            label="Active Caseload"
            value={caseloadClients}
            detail={`${completedSessions} total sessions`}
            accent="bg-oku-darkgrey"
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <PractitionerSectionCard
            title="Immediate Queue"
            description="Your next care windows and urgent clinical documentation."
          >
            {todaySessions.length === 0 && pendingNotes.length === 0 ? (
              <EmptyCard
                title="Your queue is clear."
                description="Use the quiet time for research, supervision, or personal rest."
                href="/practitioner/schedule"
                cta="View Full Schedule"
              />
            ) : (
              <div className="space-y-6">
                {todaySessions.map((appointment) => (
                  <div key={appointment.id} className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-purple-dark mb-1">
                          {formatTime(appointment.startTime)} • {appointment.service?.name}
                        </p>
                        <h3 className="text-2xl font-black tracking-tight text-oku-darkgrey">{appointment.client?.name}</h3>
                      </div>
                      <Link href={`/session/${appointment.id}`} className="btn-pill-3d bg-oku-darkgrey text-white !px-6 !py-3">
                        Launch Room
                      </Link>
                    </div>
                  </div>
                ))}
                
                {pendingNotes.slice(0, 2).map((note) => (
                  <div key={note.id} className="rounded-[1.6rem] border border-dashed border-oku-peach-dark/30 bg-oku-peach/5 p-5">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-oku-peach-dark mb-1">Documentation Required</p>
                          <h4 className="font-bold text-oku-darkgrey">{note.client?.name} <span className="text-oku-darkgrey/40 font-normal ml-2">({formatDateTime(note.startTime)})</span></h4>
                       </div>
                       <Link href={`/practitioner/sessions/${note.id}/notes`} className="text-[10px] font-black uppercase tracking-widest text-oku-peach-dark hover:underline">
                          Write SOAP Note →
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PractitionerSectionCard>

          <div className="space-y-8">
            <PractitionerSectionCard
              title="Clinical Tools"
              description="Jump into core practitioner surfaces."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <PractitionerActionTile href="/practitioner/clients" title="Clients" description=" Caseload & History" icon={<Users size={20} />} />
                <PractitionerActionTile href="/practitioner/messages" title="Inbox" description="Client Messages" icon={<MessageSquare size={20} />} />
                <PractitionerActionTile href="/practitioner/assessments" title="Assessments" description="Tools & Results" icon={<ClipboardCheck size={20} />} />
                <PractitionerActionTile href="/practitioner/intelligence" title="AI Signals" description="Clinical Intelligence" icon={<Brain size={20} />} />
              </div>
            </PractitionerSectionCard>
          </div>
        </div>

        <PractitionerSectionCard
          title="Recent Activity"
          description="Recent assessment answers and clinical flags."
        >
          <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    Assessment results
                  </p>
                </div>
                {recentAssessmentAnswers.length === 0 ? (
                  <EmptyMiniState text="No recent screening completions." />
                ) : (
                  <div className="space-y-3">
                    {recentAssessmentAnswers.slice(0, 3).map((answer) => (
                      <InfoRow
                        key={answer.id}
                        title={answer.user.name || 'Client'}
                        subtitle={answer.assessment.title}
                        meta={answer.score !== null ? `Score ${answer.score}` : 'Review'}
                        href={`/practitioner/clients/${answer.user.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    Upcoming Circles
                  </p>
                </div>
                {circlesThisWeek.length === 0 ? (
                  <EmptyMiniState text="No circles this week." />
                ) : (
                  <div className="space-y-3">
                    {circlesThisWeek.map((circle) => (
                      <InfoRow
                        key={circle.id}
                        title={circle.service?.name}
                        subtitle={formatDateTime(circle.startTime)}
                        meta={`${circle.participants.length} joined`}
                        href="/practitioner/dashboard?tab=circles"
                      />
                    ))}
                  </div>
                )}
              </div>
          </div>
        </PractitionerSectionCard>
      </div>
    </PractitionerShell>
  )
}

function EmptyCard({
  title,
  description,
  href,
  cta,
}: {
  title: string
  description: string
  href: string
  cta: string
}) {
  return (
    <div className="rounded-[1.8rem] border border-dashed border-oku-darkgrey/10 bg-[#faf7f2] p-6 sm:p-8">
      <p className="text-lg font-black text-oku-darkgrey">{title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-oku-darkgrey/60">
        {description}
      </p>
      <Link
        href={href}
        className="btn-pill-3d mt-5 inline-flex bg-oku-darkgrey border-oku-darkgrey text-white !px-7 !py-3 text-[10px]"
      >
        {cta}
        <ArrowRight size={14} className="ml-2" />
      </Link>
    </div>
  )
}

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-oku-darkgrey/10 bg-[#faf7f2] px-4 py-5 text-sm text-oku-darkgrey/55">
      {text}
    </div>
  )
}

function InfoRow({
  href,
  title,
  subtitle,
  meta,
}: {
  href: string
  title: string
  subtitle: string
  meta: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-[1.25rem] border border-white/70 bg-white/70 p-4 transition-colors hover:bg-white sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-oku-darkgrey">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-oku-darkgrey/55">{subtitle}</p>
      </div>
      <span className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-oku-purple-dark/70 sm:shrink-0 sm:text-right">
        {meta}
      </span>
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

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

function isAdhdAssessment(title: string) {
  const value = title.toLowerCase()
  return value.includes('adhd') || value.includes('asrs') || value.includes('conners') || value.includes('vanderbilt')
}
