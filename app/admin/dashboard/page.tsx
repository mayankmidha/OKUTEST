import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const now = new Date()

  const [
    settings,
    therapists,
    clients,
    services,
    circles,
    allAppointments,
    allTranscripts,
    auditLogs,
    payouts,
    circleReports,
    revenueAgg
  ] = await Promise.all([
    prisma.platformSettings.findUnique({ where: { id: 'global' } }),
    prisma.user.findMany({ where: { role: UserRole.THERAPIST }, include: { practitionerProfile: true } }),
    prisma.user.findMany({ where: { role: UserRole.CLIENT }, include: { clientProfile: true } }),
    prisma.service.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.appointment.findMany({ where: { isGroupSession: true, startTime: { gte: now } }, include: { participants: true, service: true } }),
    prisma.appointment.findMany({ include: { client: { select: { name: true } }, practitioner: { select: { name: true } }, service: { select: { name: true } } }, orderBy: { startTime: 'desc' }, take: 100 }),
    prisma.transcript.findMany({ include: { appointment: { include: { client: { select: { name: true } }, practitioner: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.auditLog.findMany({ include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.payout.findMany({ include: { practitioner: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.circleReport.findMany({ include: { reporter: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } })
  ])

  const stats = {
    totalRevenue: revenueAgg._sum.amount ?? 0,
    totalAppointments: allAppointments.length,
    auditLogs: auditLogs,
    recentActivities: auditLogs, // Reuse audit logs for activity ledger
    allTranscripts: allTranscripts,
    allPosts: [], // Can add blog posts if needed
    circleReports: circleReports
  }

  return (
    <AdminDashboardClient 
      stats={stats}
      therapists={therapists}
      clients={clients}
      services={services}
      circles={circles}
      allAppointments={allAppointments}
      settings={settings || {}}
    />
  )
}
