import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Scheduled Tasks (Simulated/Placeholder for now)
    const tasks = [
      { id: '1', name: 'Daily Revenue Sync', schedule: 'Daily at 00:00', status: 'ACTIVE', lastRun: new Date().toISOString() },
      { id: '2', name: 'No-Show Auto-Charge', schedule: 'Every 15 mins', status: 'ACTIVE', lastRun: new Date().toISOString() },
      { id: '3', name: 'Email Reminder Batch', schedule: 'Hourly', status: 'ACTIVE', lastRun: new Date().toISOString() },
      { id: '4', name: 'Backup Routine', schedule: 'Weekly on Sunday', status: 'ACTIVE', lastRun: new Date().toISOString() }
    ]

    // 2. Pending Actions
    const pendingAssessments = await prisma.assignedAssessment.count({ where: { status: 'PENDING' } })
    const pendingPayments = await prisma.payment.count({ where: { status: 'PENDING' } })

    return NextResponse.json({
      tasks,
      metrics: {
        pendingAssessments,
        pendingPayments
      }
    })
  } catch (error) {
    console.error('AUTOMATION_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch automation data' }, { status: 500 })
  }
}
