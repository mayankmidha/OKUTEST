import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import os from 'os'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Database Health
    const dbStartTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - dbStartTime

    // 2. System Metrics
    const uptime = os.uptime()
    const freeMem = os.freemem()
    const totalMem = os.totalmem()
    const memUsage = ((totalMem - freeMem) / totalMem) * 100
    const cpus = os.cpus()
    const loadAvg = os.loadavg()

    // 3. Application Metrics (Simulated from Audit Logs/Database)
    const activeUsersCount = await prisma.user.count({
      where: {
        updatedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } // Active in last 15 mins
      }
    })

    const totalUsers = await prisma.user.count()
    const totalAppointments = await prisma.appointment.count()
    const pendingPayments = await prisma.payment.count({
      where: { status: 'PENDING' },
    })
    const stalePendingAppointments = await prisma.appointment.count({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: new Date(Date.now() - 20 * 60 * 1000),
        },
      },
    })
    
    // Error rate (last 24h from Audit Logs if applicable, or simulate for now)
    const errorLogsCount = await prisma.auditLog.count({
      where: {
        action: { contains: 'ERROR' },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })

    const alerts: string[] = []
    if (dbResponseTime > 500) alerts.push(`Database latency is elevated at ${dbResponseTime}ms.`)
    if (memUsage >= 90) alerts.push(`Memory usage is high at ${memUsage.toFixed(1)}%.`)
    if (stalePendingAppointments > 0) alerts.push(`${stalePendingAppointments} pending appointments are older than 20 minutes.`)
    if (errorLogsCount > 5) alerts.push(`${errorLogsCount} error-class audit events were logged in the last 24 hours.`)

    const status = alerts.length === 0 ? 'HEALTHY' : alerts.length <= 2 ? 'DEGRADED' : 'UNHEALTHY'

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      system: {
        uptime,
        memory: {
          total: totalMem,
          free: freeMem,
          usagePercent: memUsage.toFixed(2)
        },
        cpu: {
          count: cpus.length,
          model: cpus[0].model,
          loadAvg
        }
      },
      database: {
        status: 'CONNECTED',
        responseTimeMs: dbResponseTime
      },
      app: {
        activeUsers: activeUsersCount,
        totalUsers,
        totalAppointments,
        errorRate24h: errorLogsCount,
        pendingPayments,
        stalePendingAppointments,
      },
      alerts,
    })
  } catch (error) {
    console.error('HEALTH_CHECK_FAILED', error)
    return NextResponse.json({
      status: 'UNHEALTHY',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
