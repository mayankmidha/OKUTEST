import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const securityWhere = {
      OR: [
        { action: { contains: 'LOGIN_FAILURE' } },
        { action: { contains: 'UNAUTHORIZED' } },
        { action: { contains: 'SECURITY' } },
      ],
    }
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [securityLogs, recentSecurityLogs, mfaEnabledCount, totalUsers] = await Promise.all([
      prisma.auditLog.findMany({
        where: securityWhere,
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      prisma.auditLog.findMany({
        where: {
          ...securityWhere,
          createdAt: { gte: last24Hours },
        },
        select: {
          ipAddress: true,
        },
      }),
      prisma.user.count({ where: { twoFactorEnabled: true } }),
      prisma.user.count(),
    ])

    const incidents24h = recentSecurityLogs.length
    const flaggedIps = new Set(
      recentSecurityLogs
        .map((log) => log.ipAddress)
        .filter((ip): ip is string => Boolean(ip))
    ).size
    const threatLevel =
      incidents24h >= 10 ? 'HIGH' : incidents24h >= 3 ? 'ELEVATED' : 'LOW'
    const mfaPercent =
      totalUsers > 0 ? Number(((mfaEnabledCount / totalUsers) * 100).toFixed(1)) : 0
    const summary =
      incidents24h === 0
        ? 'No flagged access events in the last 24 hours.'
        : `${incidents24h} flagged access event${incidents24h === 1 ? '' : 's'} logged in the last 24 hours.`

    return NextResponse.json({
      logs: securityLogs,
      metrics: {
        mfaEnabled: mfaEnabledCount,
        totalUsers,
        mfaPercent,
        threatLevel,
        incidents24h,
        flaggedIps,
        summary,
      },
    })
  } catch (error) {
    console.error('SECURITY_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch security data' }, { status: 500 })
  }
}
