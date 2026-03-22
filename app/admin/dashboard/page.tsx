import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Fetch all necessary data for the admin
  const therapists = await prisma.user.findMany({
    where: { role: UserRole.THERAPIST },
    include: { practitionerProfile: true },
    orderBy: { createdAt: 'desc' }
  })

  const clients = await prisma.user.findMany({
    where: { role: UserRole.CLIENT },
    include: {
      clientProfile: true,
      _count: {
        select: { clientAppointments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' }
  })

  // Calculate platform stats
  const totalAppointments = await prisma.appointment.count()
  
  const completedPayments = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true }
  })

  // Fetch critical audit logs
  const auditLogs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const stats = {
    totalRevenue: completedPayments._sum.amount || 0,
    totalAppointments: totalAppointments,
    auditLogs: auditLogs
  }

  return (
    <div className="min-h-screen bg-oku-cream">
      <AdminDashboardClient 
        stats={stats} 
        therapists={therapists} 
        services={services} 
        clients={clients} 
      />
    </div>
  )
}
