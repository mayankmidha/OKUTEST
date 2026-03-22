import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Fetch data with fallbacks
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

  const totalAppointments = await prisma.appointment.count()
  
  const completedPayments = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true }
  })

  const auditLogs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'global' }
  }) || { maintenanceMode: false, platformFeePercent: 20 }

  const stats = {
    totalRevenue: completedPayments._sum.amount || 0,
    totalAppointments: totalAppointments,
    auditLogs: auditLogs || []
  }

  return (
    <div className="bg-oku-cream min-h-screen">
      <AdminDashboardClient 
        stats={stats} 
        therapists={therapists || []} 
        services={services || []} 
        clients={clients || []} 
        settings={settings}
      />
    </div>
  )
}
