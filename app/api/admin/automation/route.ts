import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const [
      pendingAssessments,
      pendingPayments,
      agedPendingPayments,
      dueReminders,
      noShowCandidates,
      deletionRequests,
      syncEnabledPractitioners,
      feedReadyPractitioners,
      latestReminder,
      latestNoShowSweep,
      latestPaymentUpdate,
      latestAssessmentCreated,
      remindersSent24h,
      noShowsProcessed24h,
      paymentsCompleted24h,
    ] = await Promise.all([
      prisma.assignedAssessment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({
        where: {
          status: 'PENDING',
          createdAt: { lte: thirtyMinutesAgo },
        },
      }),
      prisma.appointment.count({
        where: {
          reminderSent: false,
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
          startTime: {
            gte: now,
            lte: next24Hours,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
          startTime: { lte: fifteenMinutesAgo },
          isGroupSession: false,
          clientId: { not: null },
        },
      }),
      prisma.user.count({ where: { deletionRequestedAt: { not: null } } }),
      prisma.practitionerProfile.count({ where: { syncEnabled: true } }),
      prisma.practitionerProfile.count({
        where: {
          syncEnabled: true,
          iCalSecret: { not: null },
        },
      }),
      prisma.appointment.findFirst({
        where: { reminderSent: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.appointment.findFirst({
        where: { attendanceStatus: 'no_show_auto' },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.payment.findFirst({
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.assignedAssessment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      prisma.appointment.count({
        where: {
          reminderSent: true,
          updatedAt: { gte: twentyFourHoursAgo },
        },
      }),
      prisma.appointment.count({
        where: {
          attendanceStatus: 'no_show_auto',
          updatedAt: { gte: twentyFourHoursAgo },
        },
      }),
      prisma.payment.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: twentyFourHoursAgo },
        },
      }),
    ])

    const tasks = [
      {
        id: 'reminders',
        name: 'Reminder delivery queue',
        schedule: process.env.CRON_SECRET ? 'Daily scheduler' : 'Manual cron trigger',
        status: dueReminders > 0 ? 'ACTIVE' : 'IDLE',
        lastRun: latestReminder?.updatedAt?.toISOString() ?? null,
        workload: dueReminders,
        detail: `${dueReminders} confirmed sessions still need reminders in the next 24 hours.`,
      },
      {
        id: 'no-shows',
        name: 'No-show sweep',
        schedule: process.env.CRON_SECRET ? 'Daily scheduler' : 'Manual cron trigger',
        status: noShowCandidates > 0 ? 'ATTENTION' : 'ACTIVE',
        lastRun: latestNoShowSweep?.updatedAt?.toISOString() ?? null,
        workload: noShowCandidates,
        detail: `${noShowCandidates} sessions currently match the automatic no-show eligibility window.`,
      },
      {
        id: 'payments',
        name: 'Payment reconciliation',
        schedule: 'Webhook + review queue',
        status: agedPendingPayments > 0 ? 'ATTENTION' : pendingPayments > 0 ? 'ACTIVE' : 'IDLE',
        lastRun: latestPaymentUpdate?.updatedAt?.toISOString() ?? null,
        workload: pendingPayments,
        detail: `${agedPendingPayments} pending payments have been waiting longer than 30 minutes.`,
      },
      {
        id: 'assessments',
        name: 'Assessment follow-up queue',
        schedule: 'Event-driven',
        status: pendingAssessments > 0 ? 'ACTIVE' : 'IDLE',
        lastRun: latestAssessmentCreated?.createdAt?.toISOString() ?? null,
        workload: pendingAssessments,
        detail: `${pendingAssessments} assigned assessments are still awaiting completion.`,
      },
      {
        id: 'calendar-feed',
        name: 'Calendar feed publication',
        schedule: 'On calendar subscription refresh',
        status:
          syncEnabledPractitioners === 0
            ? 'IDLE'
            : feedReadyPractitioners === syncEnabledPractitioners
              ? 'ACTIVE'
              : 'PARTIAL',
        lastRun: now.toISOString(),
        workload: syncEnabledPractitioners,
        detail: `${feedReadyPractitioners}/${syncEnabledPractitioners} sync-enabled practitioners currently have a private feed ready.`,
      },
      {
        id: 'deletion-queue',
        name: 'Deletion request queue',
        schedule: 'Manual compliance review',
        status: deletionRequests > 0 ? 'ATTENTION' : 'IDLE',
        lastRun: now.toISOString(),
        workload: deletionRequests,
        detail: `${deletionRequests} account deletion requests are awaiting follow-up.`,
      },
    ]

    const attentionCount = tasks.filter((task) => task.status === 'ATTENTION').length
    const activeCount = tasks.filter((task) => task.status === 'ACTIVE').length
    const executions24h = remindersSent24h + noShowsProcessed24h + paymentsCompleted24h
    const summaryStatus =
      attentionCount > 0 ? 'ATTENTION' : activeCount > 0 ? 'ACTIVE' : 'IDLE'

    return NextResponse.json({
      tasks,
      metrics: {
        pendingAssessments,
        pendingPayments,
        agedPendingPayments,
        dueReminders,
        noShowCandidates,
        syncEnabledPractitioners,
        feedReadyPractitioners,
        deletionRequests,
      },
      summary: {
        status: summaryStatus,
        attentionCount,
        activeCount,
        executions24h,
        message:
          attentionCount > 0
            ? `${attentionCount} operational queues need review.`
            : activeCount > 0
              ? 'Scheduled workflows and queues are running within normal thresholds.'
              : 'No active operational queues are waiting right now.',
      },
    })
  } catch (error) {
    console.error('AUTOMATION_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch automation data' }, { status: 500 })
  }
}
