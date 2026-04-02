import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Security Incidents (Failed Logins/Audits)
    const securityLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'LOGIN_FAILURE' } },
          { action: { contains: 'UNAUTHORIZED' } },
          { action: { contains: 'SECURITY' } }
        ]
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    })

    // 2. Metrics
    const mfaEnabledCount = await prisma.user.count({ where: { twoFactorEnabled: true } })
    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      logs: securityLogs,
      metrics: {
        mfaEnabled: mfaEnabledCount,
        mfaPercent: ((mfaEnabledCount / totalUsers) * 100).toFixed(1),
        threatLevel: 'LOW'
      }
    })
  } catch (error) {
    console.error('SECURITY_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch security data' }, { status: 500 })
  }
}
