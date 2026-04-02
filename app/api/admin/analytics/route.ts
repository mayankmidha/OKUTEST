import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Revenue Analytics (Last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentPayments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        amount: true,
        platformFeeAmount: true,
        createdAt: true
      }
    })

    const totalRevenue = recentPayments.reduce((acc, curr) => acc + curr.amount, 0)
    const totalFees = recentPayments.reduce((acc, curr) => acc + curr.platformFeeAmount, 0)

    // 2. Conversion & Growth
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } })
    const totalPractitioners = await prisma.user.count({ where: { role: 'THERAPIST' } })
    
    // Funnel: Signups -> Onboarded -> Booked
    const signups30d = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    const onboarded30d = await prisma.clientProfile.count({ where: { isOnboarded: true, createdAt: { gte: thirtyDaysAgo } } })
    const booked30d = await prisma.appointment.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })

    // 3. Therapist Performance (Top 5 by appointments)
    const therapistPerformance = await prisma.user.findMany({
      where: { role: 'THERAPIST' },
      select: {
        id: true,
        name: true,
        _count: {
          select: { practitionerAppointments: true }
        },
        practitionerProfile: {
          select: { specialization: true }
        }
      },
      take: 5,
      orderBy: {
        practitionerAppointments: { _count: 'desc' }
      }
    })

    return NextResponse.json({
      revenue: {
        total30d: totalRevenue,
        fees30d: totalFees,
        count30d: recentPayments.length
      },
      funnel: {
        signups: signups30d,
        onboarded: onboarded30d,
        bookings: booked30d
      },
      growth: {
        clients: totalClients,
        therapists: totalPractitioners
      },
      topTherapists: therapistPerformance.map(t => ({
        id: t.id,
        name: t.name,
        appointments: t._count.practitionerAppointments,
        specialization: t.practitionerProfile?.specialization?.[0] || 'General'
      }))
    })
  } catch (error) {
    console.error('ANALYTICS_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
