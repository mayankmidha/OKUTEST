import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import AdminDashboardClient from '../dashboard/AdminDashboardClient'

export default async function AdminTherapistsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Fetch all necessary data for the admin (similar to dashboard but focused)
  const therapists = await prisma.user.findMany({
    where: { role: UserRole.THERAPIST },
    include: { practitionerProfile: true },
    orderBy: { createdAt: 'desc' }
  })

  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' }
  })

  const clients = await prisma.user.findMany({
    where: { role: UserRole.CLIENT },
    include: { clientProfile: true, _count: { select: { clientAppointments: true } } }
  })

  // Mock stats since we're using the same client component for now
  const stats = {
    totalRevenue: 0,
    totalAppointments: 0,
    auditLogs: []
  }

  return (
    <div className="bg-oku-cream min-h-screen">
      <AdminDashboardClient 
        stats={stats} 
        therapists={therapists} 
        services={services} 
        clients={clients} 
      />
    </div>
  )
}
