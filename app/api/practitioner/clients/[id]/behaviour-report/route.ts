import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { analyzeClientBehaviour } from '@/lib/oku-ai'
import { UserRole } from '@prisma/client'

// In-memory cache: clientId → { report, generatedAt }
const cache = new Map<string, { report: any; generatedAt: number }>()
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: clientId } = await params

  // Verify this client is in the therapist's caseload
  const link = await prisma.appointment.findFirst({
    where: { clientId, practitionerId: session.user.id },
    select: { id: true },
  })
  if (!link) return NextResponse.json({ error: 'Client not in your caseload' }, { status: 403 })

  // Check cache
  const cached = cache.get(clientId)
  if (cached && Date.now() - cached.generatedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ...cached.report, cached: true })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [clientData, moodEntries, assessmentAnswers, adhdLogs, sessionStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: clientId },
      select: { name: true },
    }),
    prisma.moodEntry.findMany({
      where: { userId: clientId, createdAt: { gte: thirtyDaysAgo } },
      select: { mood: true, createdAt: true, notes: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assessmentAnswer.findMany({
      where: { userId: clientId },
      include: { assessment: { select: { title: true } } },
      orderBy: { completedAt: 'desc' },
      take: 6,
    }),
    prisma.adhdDailyLog.findMany({
      where: { userId: clientId, date: { gte: thirtyDaysAgo } },
      select: { moodScore: true, energyLevel: true, sleepHours: true, medicationTaken: true, date: true },
      orderBy: { date: 'desc' },
    }),
    prisma.appointment.aggregate({
      where: { clientId, practitionerId: session.user.id },
      _count: { _all: true },
    }),
  ])

  const missedSessions = await prisma.appointment.count({
    where: { clientId, practitionerId: session.user.id, status: 'NO_SHOW' },
  })

  const report = await analyzeClientBehaviour({
    clientName: clientData?.name ?? 'Client',
    moodEntries,
    assessmentAnswers,
    adhdLogs,
    sessionCount: sessionStats._count._all,
    missedSessions,
  })

  cache.set(clientId, { report, generatedAt: Date.now() })

  return NextResponse.json(report)
}
