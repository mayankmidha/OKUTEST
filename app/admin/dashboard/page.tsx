import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BadgeCheck,
  Calendar,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date(startOfToday)
  endOfToday.setDate(endOfToday.getDate() + 1)

  const [
    settings,
    counts,
    sessionMetrics,
    revenue,
    pendingPayoutsSummary,
    watchlist,
    verificationQueue,
    upcomingSessions,
    pendingPayouts,
    riskTranscripts,
    recentDocuments,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.platformSettings.findUnique({
      where: { id: 'global' },
    }),
    Promise.all([
      prisma.user.count({ where: { role: UserRole.CLIENT } }),
      prisma.user.count({ where: { role: UserRole.THERAPIST } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { deletionRequestedAt: { not: null } } }),
      prisma.practitionerProfile.count({ where: { isVerified: false } }),
      prisma.appointment.count({
        where: {
          isGroupSession: true,
          startTime: { gte: now },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
        },
      }),
    ]).then(
      ([
        clients,
        therapists,
        admins,
        deletionRequests,
        pendingVerification,
        upcomingCircles,
      ]) => ({
        clients,
        therapists,
        admins,
        deletionRequests,
        pendingVerification,
        upcomingCircles,
      })
    ),
    Promise.all([
      prisma.appointment.count({
        where: {
          startTime: { gte: startOfToday, lt: endOfToday },
        },
      }),
      prisma.appointment.count({
        where: {
          startTime: { gte: now },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
        },
      }),
      prisma.appointment.count({
        where: { status: AppointmentStatus.NO_SHOW },
      }),
    ]).then(([today, upcoming, noShows]) => ({ today, upcoming, noShows })),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.payout.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
      _count: { id: true },
    }),
    Promise.all([
      prisma.circleReport.count({ where: { status: 'OPEN' } }),
      prisma.transcript.count({
        where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } },
      }),
      prisma.appointment.count({
        where: { refundStatus: 'PENDING' },
      }),
    ]).then(([openCircleReports, highRiskTranscripts, pendingRefunds]) => ({
      openCircleReports,
      highRiskTranscripts,
      pendingRefunds,
    })),
    prisma.user.findMany({
      where: {
        role: UserRole.THERAPIST,
        practitionerProfile: { is: { isVerified: false } },
      },
      include: {
        practitionerProfile: true,
        practitionerDocuments: {
          where: { type: { startsWith: 'KYC_' } },
          select: { id: true, name: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
        _count: { select: { practitionerAppointments: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: {
        startTime: { gte: now },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: {
        client: { select: { name: true } },
        practitioner: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: 'asc' },
      take: 6,
    }),
    prisma.payout.findMany({
      where: { status: 'PENDING' },
      include: {
        practitioner: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.transcript.findMany({
      where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } },
      include: {
        appointment: {
          select: {
            startTime: true,
            client: { select: { name: true } },
            practitioner: { select: { name: true } },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.document.findMany({
      include: {
        practitioner: { select: { name: true } },
        client: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ])

  const totalUsers = counts.clients + counts.therapists + counts.admins
  const grossRevenue = revenue._sum.amount ?? 0
  const pendingPayoutAmount = pendingPayoutsSummary._sum.amount ?? 0
  const launchWatchlist = [
    {
      label: 'Practitioners awaiting verification',
      value: counts.pendingVerification,
      href: '/admin/practitioners',
      tone: counts.pendingVerification > 0 ? 'amber' : 'neutral',
    },
    {
      label: 'Pending payout requests',
      value: pendingPayoutsSummary._count.id,
      href: '/admin/financials',
      tone: pendingPayoutsSummary._count.id > 0 ? 'amber' : 'neutral',
    },
    {
      label: 'Open circle reports',
      value: watchlist.openCircleReports,
      href: '/admin/quality',
      tone: watchlist.openCircleReports > 0 ? 'red' : 'neutral',
    },
    {
      label: 'High-risk transcripts',
      value: watchlist.highRiskTranscripts,
      href: '/admin/compliance',
      tone: watchlist.highRiskTranscripts > 0 ? 'red' : 'neutral',
    },
    {
      label: 'Pending refunds',
      value: watchlist.pendingRefunds,
      href: '/admin/financials',
      tone: watchlist.pendingRefunds > 0 ? 'amber' : 'neutral',
    },
    {
      label: 'Deletion requests',
      value: counts.deletionRequests,
      href: '/admin/users',
      tone: counts.deletionRequests > 0 ? 'amber' : 'neutral',
    },
  ]

  return (
    <div className="min-h-screen bg-oku-lavender/5">
      <div className="clinic-shell-wide">
        <section className="clinic-hero-card">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="chip">Admin Control Plane</span>
                <span
                  className={`chip ${
                    settings?.maintenanceMode
                      ? '!bg-amber-100 !text-amber-700'
                      : '!bg-emerald-100 !text-emerald-700'
                  }`}
                >
                  {settings?.maintenanceMode ? 'Maintenance mode' : 'Live operations'}
                </span>
              </div>

              <div>
                <h1 className="heading-display text-4xl tracking-tight text-oku-darkgrey sm:text-5xl lg:text-7xl">
                  Launch <span className="italic text-oku-purple-dark">Control.</span>
                </h1>
                <p className="clinic-copy mt-4">
                  This overview is tuned for clinic launch work: platform health,
                  operator queues, verification, revenue, risk, and the surfaces
                  that can block a real clinic day.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <QuickHeroLink href="/admin/practitioners" label="Verification queue" />
                <QuickHeroLink href="/admin/sessions" label="Session ledger" />
                <QuickHeroLink href="/admin/financials" label="Financials" />
                <QuickHeroLink href="/admin/compliance" label="Compliance" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Total active users" value={String(totalUsers)} tone="lavender" />
              <MetricCard label="Sessions today" value={String(sessionMetrics.today)} tone="white" />
              <MetricCard
                label="Gross completed revenue"
                value={formatCurrency(grossRevenue, 'INR')}
                tone="mint"
              />
              <MetricCard
                label="Pending payouts"
                value={formatCurrency(pendingPayoutAmount, 'INR')}
                tone="white"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard
            title="Launch Watchlist"
            description="The queues and alerts most likely to stop a safe launch or create operator drag."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {launchWatchlist.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-[1.5rem] border p-5 transition-colors hover:bg-white ${
                    item.tone === 'red'
                      ? 'border-red-200 bg-red-50/80'
                      : item.tone === 'amber'
                        ? 'border-amber-200 bg-amber-50/80'
                        : 'border-white/80 bg-white/70'
                  }`}
                >
                  <p className="clinic-kicker">
                    {item.label}
                  </p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-oku-darkgrey">
                    {item.value}
                  </p>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="System State"
            description="A quick read on launch posture and clinic configuration."
          >
            <div className="space-y-4">
              <StateRow
                icon={<ShieldCheck size={16} />}
                label="Transcription consent"
                value={settings?.requireConsentBeforeTranscription ? 'Required' : 'Relaxed'}
              />
              <StateRow
                icon={<Sparkles size={16} />}
                label="OKU AI"
                value={settings?.okuAiEnabled ? 'Enabled' : 'Disabled'}
              />
              <StateRow
                icon={<Lock size={16} />}
                label="Maintenance mode"
                value={settings?.maintenanceMode ? 'On' : 'Off'}
              />
              <StateRow
                icon={<Users size={16} />}
                label="Upcoming circles"
                value={String(counts.upcomingCircles)}
              />
              <StateRow
                icon={<Calendar size={16} />}
                label="Upcoming sessions"
                value={String(sessionMetrics.upcoming)}
              />
              <StateRow
                icon={<AlertTriangle size={16} />}
                label="No-shows on record"
                value={String(sessionMetrics.noShows)}
              />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            title="Practitioner Verification Queue"
            description="Pending KYC and provider readiness, so the supply side of the clinic stays trustworthy."
            actionHref="/admin/practitioners"
            actionLabel="Open practitioners"
          >
            <div className="space-y-3">
              {verificationQueue.length === 0 ? (
                <CompactEmpty label="No practitioners are waiting for verification." />
              ) : (
                verificationQueue.map((item) => (
                  <QueueRow
                    key={item.id}
                    href="/admin/practitioners"
                    title={item.name || 'Practitioner'}
                    subtitle={`${item.practitionerProfile?.licenseNumber || 'No license yet'} · ${item._count.practitionerAppointments} session records`}
                    meta={
                      item.practitionerDocuments.length > 0
                        ? `${item.practitionerDocuments.length} KYC doc${item.practitionerDocuments.length === 1 ? '' : 's'}`
                        : 'No KYC docs'
                    }
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Payments and Payouts"
            description="Cash movement that needs eyes before launch and during daily operations."
            actionHref="/admin/financials"
            actionLabel="Open financials"
          >
            <div className="space-y-3">
              {pendingPayouts.length === 0 ? (
                <CompactEmpty label="No pending payout requests right now." />
              ) : (
                pendingPayouts.map((item) => (
                  <QueueRow
                    key={item.id}
                    href="/admin/financials"
                    title={item.practitioner.name || 'Practitioner'}
                    subtitle={formatCurrency(item.amount, item.currency)}
                    meta={new Date(item.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  />
                ))
              )}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            title="Upcoming Sessions"
            description="The next clinic windows going live across the platform."
            actionHref="/admin/sessions"
            actionLabel="Open session ledger"
          >
            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <CompactEmpty label="No upcoming sessions are scheduled." />
              ) : (
                upcomingSessions.map((item) => (
                  <QueueRow
                    key={item.id}
                    href="/admin/sessions"
                    title={`${item.client?.name || 'Client'} · ${item.practitioner?.name || 'Practitioner'}`}
                    subtitle={`${item.service?.name || 'Session'} · ${new Date(item.startTime).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                    meta={item.isGroupSession ? 'Circle' : '1:1'}
                  />
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Risk and Evidence"
            description="Clinical and compliance artifacts that deserve direct review."
            actions={
              <>
                <SmallLink href="/admin/compliance" label="Compliance" />
                <SmallLink href="/admin/quality" label="Quality" />
              </>
            }
          >
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                  High-risk transcripts
                </p>
                <div className="mt-3 space-y-3">
                  {riskTranscripts.length === 0 ? (
                    <CompactEmpty label="No high-risk transcript flags are open." />
                  ) : (
                    riskTranscripts.map((item) => (
                      <QueueRow
                        key={item.id}
                        href="/admin/compliance"
                        title={`${item.appointment.client?.name || 'Client'} · ${item.riskLevel || 'Risk flag'}`}
                        subtitle={`${item.appointment.practitioner?.name || 'Practitioner'} · ${item.appointment.service?.name || 'Session'}`}
                        meta={new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      />
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                  Recent documents
                </p>
                <div className="mt-3 space-y-3">
                  {recentDocuments.length === 0 ? (
                    <CompactEmpty label="No recent documents uploaded." />
                  ) : (
                    recentDocuments.map((item) => (
                      <QueueRow
                        key={item.id}
                        href="/admin/practitioners"
                        title={item.name}
                        subtitle={`${item.type} · ${item.practitioner?.name || item.client?.name || 'System'}`}
                        meta={new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Operations Surfaces"
          description="Jump directly into the admin pages that matter most during clinic launch."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SurfaceLink
              href="/admin/users"
              title="Users"
              description="Client registry, deletion requests, and account-level interventions."
              icon={<Users size={18} />}
            />
            <SurfaceLink
              href="/admin/practitioners"
              title="Practitioners"
              description="Verification, KYC docs, rates, and network readiness."
              icon={<BadgeCheck size={18} />}
            />
            <SurfaceLink
              href="/admin/sessions"
              title="Sessions"
              description="Operational ledger for appointments, status overrides, and clinic flow."
              icon={<Calendar size={18} />}
            />
            <SurfaceLink
              href="/admin/financials"
              title="Financials"
              description="Completed payments, pending payouts, and revenue split oversight."
              icon={<Banknote size={18} />}
            />
            <SurfaceLink
              href="/admin/compliance"
              title="Compliance"
              description="Clinical risk, governance, transcript controls, and review needs."
              icon={<ShieldCheck size={18} />}
            />
            <SurfaceLink
              href="/admin/quality"
              title="Quality"
              description="Circle reports, service quality review, and launch-grade trust work."
              icon={<AlertTriangle size={18} />}
            />
            <SurfaceLink
              href="/admin/security"
              title="Security"
              description="Access posture, control surfaces, and incident-facing admin tools."
              icon={<Lock size={18} />}
            />
            <SurfaceLink
              href="/admin/automation"
              title="Automation"
              description="Operational automations, pending admin signals, and system assistance."
              icon={<Sparkles size={18} />}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Audit Activity"
          description="The latest trace of admin-relevant actions across the system."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentAuditLogs.length === 0 ? (
              <CompactEmpty label="No recent audit entries found." />
            ) : (
              recentAuditLogs.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.35rem] border border-white/80 bg-white/70 p-4"
                >
                  <p className="text-sm font-black text-oku-darkgrey">
                    {item.user?.name || 'System'}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-oku-purple-dark">
                    {item.action}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-oku-darkgrey/50">
                    {item.resourceType} · {new Date(item.createdAt).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function QuickHeroLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="btn-pill-3d flex w-full items-center justify-center bg-white text-oku-darkgrey !px-7 !py-4 text-[10px] sm:w-auto"
    >
      {label}
    </Link>
  )
}

function MetricCard({
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
    <div className={`clinic-stat-card p-4 sm:p-5 ${toneClass}`}>
      <p className="clinic-kicker">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-oku-darkgrey sm:text-3xl">
        {value}
      </p>
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
  actionHref,
  actionLabel,
  actions,
}: {
  title: string
  description: string
  children: ReactNode
  actionHref?: string
  actionLabel?: string
  actions?: ReactNode
}) {
  return (
    <section className="clinic-surface">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="clinic-kicker">Operations</p>
          <h2 className="heading-display mt-2 text-3xl tracking-tight text-oku-darkgrey">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-oku-darkgrey/60">
            {description}
          </p>
        </div>
        {actions ||
          (actionHref && actionLabel ? (
            <SmallLink href={actionHref} label={actionLabel} />
          ) : null)}
      </div>
      {children}
    </section>
  )
}

function SmallLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="btn-pill-3d flex w-full items-center justify-center bg-white text-oku-darkgrey !px-6 !py-4 text-[10px] sm:w-auto"
    >
      {label}
    </Link>
  )
}

function QueueRow({
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
      className="clinic-surface-muted flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-oku-darkgrey">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-oku-darkgrey/50">{subtitle}</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="clinic-kicker">
          {meta}
        </p>
        <ArrowRight size={14} className="mt-2 text-oku-darkgrey/30 sm:ml-auto" />
      </div>
    </Link>
  )
}

function StateRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="clinic-surface-muted flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-oku-lavender/25 text-oku-purple-dark">
          {icon}
        </div>
        <p className="text-sm font-black text-oku-darkgrey">{label}</p>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/40">
        {value}
      </p>
    </div>
  )
}

function SurfaceLink({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group clinic-surface p-5 transition-all hover:-translate-y-1 hover:bg-white"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-oku-lavender/25 text-oku-purple-dark shadow-sm">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-black tracking-tight text-oku-darkgrey">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-oku-darkgrey/55">{description}</p>
    </Link>
  )
}

function CompactEmpty({ label }: { label: string }) {
  return (
    <div className="clinic-surface-muted text-sm text-oku-darkgrey/50">
      {label}
    </div>
  )
}
