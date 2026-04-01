import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus } from '@prisma/client'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        clientAppointments: {
          include: { service: true, practitioner: { select: { name: true } } },
          orderBy: { startTime: 'desc' },
        },
        moodEntries: { orderBy: { createdAt: 'desc' } },
        assessmentAnswers: {
          include: { assessment: { select: { title: true } } },
          orderBy: { completedAt: 'desc' },
        },
        clientTreatmentPlans: {
          where: { status: 'ACTIVE' },
          select: { presentingProblem: true, goals: true, objectives: true, status: true },
        },
      },
    })

    if (!user) {
      return new NextResponse('Not found', { status: 404 })
    }

    const completedSessions = user.clientAppointments.filter(
      (a) => a.status === AppointmentStatus.COMPLETED
    )

    const recentMoods = user.moodEntries.slice(0, 30)
    const avgMood =
      recentMoods.length > 0
        ? Math.round((recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length) * 10) / 10
        : null

    const daysSinceJoining = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    const report = {
      generatedAt: new Date().toISOString(),
      client: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt,
        daysSinceJoining,
      },
      sessions: {
        total: user.clientAppointments.length,
        completed: completedSessions.length,
        upcoming: user.clientAppointments.filter(
          (a) =>
            new Date(a.startTime) >= new Date() &&
            (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED)
        ).length,
        recentCompleted: completedSessions.slice(0, 10).map((a) => ({
          date: a.startTime,
          service: a.service?.name,
          practitioner: a.practitioner?.name,
        })),
      },
      mood: {
        entriesTotal: user.moodEntries.length,
        averageLast30Days: avgMood,
        recentEntries: recentMoods.slice(0, 14).map((m) => ({
          mood: m.mood,
          notes: m.notes,
          date: m.createdAt,
        })),
      },
      assessments: {
        total: user.assessmentAnswers.length,
        recent: user.assessmentAnswers.slice(0, 5).map((a) => ({
          title: a.assessment?.title,
          result: a.result,
          score: a.score,
          completedAt: a.completedAt,
        })),
      },
      treatmentPlans: user.clientTreatmentPlans,
    }

    return NextResponse.json(report, {
      headers: {
        'Content-Disposition': `attachment; filename="oku-progress-report-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[PROGRESS_REPORT_ERROR]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
