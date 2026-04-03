import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Predictive Growth (Simulated based on historical signups)
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const currentMonthSignups = await prisma.user.count({
      where: { createdAt: { gte: monthStart } }
    })
    
    // Simple projection: current * (days_in_month / days_passed)
    const daysPassed = new Date().getDate()
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const projectedSignups = Math.round((currentMonthSignups / daysPassed) * daysInMonth)

    // 2. Revenue Forecasting (Current month revenue vs last month)
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    
    const lastMonthRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true }
    })

    const currentMonthRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: monthStart } },
      _sum: { amount: true }
    })

    // 3. User Lifetime Value (LTV) - Average revenue per active client
    const activeClientsCount = await prisma.user.count({ where: { role: 'CLIENT' } })
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    })
    const avgLTV = activeClientsCount > 0 ? (totalRevenue._sum.amount || 0) / activeClientsCount : 0

    return NextResponse.json({
      projections: {
        signups: projectedSignups,
        currentSignups: currentMonthSignups,
        revenue: (currentMonthRevenue._sum.amount || 0) * (daysInMonth / daysPassed)
      },
      metrics: {
        lastMonthRevenue: lastMonthRevenue._sum.amount || 0,
        currentMonthRevenue: currentMonthRevenue._sum.amount || 0,
        avgLTV
      },
      marketTrends: [
        { category: 'Anxiety', volume: 'High', growth: '+12%' },
        { category: 'ADHD Management', volume: 'Rising', growth: '+45%' },
        { category: 'Corporate Burnout', volume: 'Steady', growth: '+5%' }
      ]
    })
  } catch (error) {
    console.error('BI_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch BI data' }, { status: 500 })
  }
}
