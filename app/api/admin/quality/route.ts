import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus } from '@prisma/client'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

    const [
      recentRatings,
      ratingAggregate,
      qualityAlerts,
      completedAppointments,
      documentedAppointments,
      totalClients,
      intakeForms,
      safetyPlans,
      assessmentTrajectories,
    ] = await Promise.all([
      prisma.rating.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          practitioner: { select: { name: true } },
          client: { select: { name: true } }
        }
      }),
      prisma.rating.aggregate({
        _avg: { score: true },
        _count: { _all: true },
      }),
      prisma.rating.count({
        where: {
          score: { lte: 3 },
          createdAt: { gte: ninetyDaysAgo },
        },
      }),
      prisma.appointment.count({
        where: {
          status: AppointmentStatus.COMPLETED,
          isGroupSession: false,
        },
      }),
      prisma.appointment.count({
        where: {
          status: AppointmentStatus.COMPLETED,
          isGroupSession: false,
          OR: [
            { transcript: { isNot: null } },
            { soapNote: { isNot: null } },
          ],
        },
      }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.intakeForm.count(),
      prisma.safetyPlan.count(),
      prisma.assessmentAnswer.findMany({
        where: {
          score: { not: null },
          completedAt: { gte: oneYearAgo },
        },
        select: {
          userId: true,
          assessmentId: true,
          score: true,
          completedAt: true,
        },
        orderBy: [
          { userId: 'asc' },
          { assessmentId: 'asc' },
          { completedAt: 'asc' },
        ],
      }),
    ])

    const averageScore = ratingAggregate._avg.score
      ? ratingAggregate._avg.score.toFixed(1)
      : '0.0'

    const documentationCompletionRate =
      completedAppointments > 0 ? (documentedAppointments / completedAppointments) * 100 : 0
    const intakeCoverageRate = totalClients > 0 ? (intakeForms / totalClients) * 100 : 0
    const safetyPlanCoverageRate = totalClients > 0 ? (safetyPlans / totalClients) * 100 : 0

    let trackedOutcomeTrajectories = 0
    let improvedTrajectories = 0
    const groupedTrajectories = new Map<string, { first: number; last: number }>()

    for (const answer of assessmentTrajectories) {
      if (typeof answer.score !== 'number') continue
      const key = `${answer.userId}:${answer.assessmentId}`
      const existing = groupedTrajectories.get(key)

      if (!existing) {
        groupedTrajectories.set(key, { first: answer.score, last: answer.score })
      } else {
        existing.last = answer.score
      }
    }

    groupedTrajectories.forEach((trajectory) => {
      if (trajectory.first !== trajectory.last) {
        trackedOutcomeTrajectories += 1
        if (trajectory.last < trajectory.first) {
          improvedTrajectories += 1
        }
      }
    })

    const improvementRate =
      trackedOutcomeTrajectories > 0
        ? (improvedTrajectories / trackedOutcomeTrajectories) * 100
        : 0

    return NextResponse.json({
      metrics: {
        averageScore,
        totalRatings: ratingAggregate._count._all,
        improvementRate: Number(improvementRate.toFixed(1)),
        qualityAlerts,
        documentationCompletionRate: Number(documentationCompletionRate.toFixed(1)),
        intakeCoverageRate: Number(intakeCoverageRate.toFixed(1)),
        safetyPlanCoverageRate: Number(safetyPlanCoverageRate.toFixed(1)),
        trackedOutcomeTrajectories,
      },
      recentRatings: recentRatings.map(r => ({
        id: r.id,
        practitionerName: r.practitioner.name,
        clientInitials: r.client.name ? r.client.name.substring(0, 2).toUpperCase() : 'AN',
        score: r.score,
        comment: r.comment,
        date: r.createdAt
      }))
    })
  } catch (error) {
    console.error('QUALITY_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch quality data' }, { status: 500 })
  }
}
