import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // 1. Core Platform Data
  const [therapists, clients, services, totalAppointments, completedPayments, auditLogs] = await Promise.all([
    prisma.user.findMany({
        where: { role: UserRole.THERAPIST },
        include: { practitionerProfile: true },
        orderBy: { createdAt: 'desc' }
    }).catch(() => []),
    
    prisma.user.findMany({
        where: { role: UserRole.CLIENT },
        include: {
            clientProfile: true,
            intakeForm: { select: { id: true } },
            _count: { select: { clientAppointments: true } }
        }
    }).catch(() => []),

    prisma.service.findMany({
        orderBy: { createdAt: 'asc' }
    }).catch(() => []),

    prisma.appointment.count().catch(() => 0),

    prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
    }).catch(() => ({ _sum: { amount: 0 } })),

    prisma.auditLog.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50
    }).catch(() => [])
  ])

  // 2. Settings with Graceful Fallback
  let settings = { maintenanceMode: false, platformFeePercent: 20 }
  try {
    const dbSettings = await prisma.platformSettings.findUnique({
        where: { id: 'global' }
    })
    if (dbSettings) settings = dbSettings as any
  } catch (e) {
    console.warn("PlatformSettings table may not exist yet.")
  }

  // 3. Activity Tracking with Graceful Fallback
  let recentActivities: any[] = []
  try {
    recentActivities = await prisma.userActivity.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100
    })
  } catch (e) {
    console.warn("UserActivity table may not exist yet.")
  }

  // 4. Clinical Integrity (Transcripts)
  let allTranscripts: any[] = []
  try {
    allTranscripts = await prisma.transcript.findMany({
        include: { 
            appointment: { 
                include: { 
                    client: { select: { name: true } }, 
                    practitioner: { select: { name: true } },
                    service: { select: { name: true } }
                } 
            } 
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    })
  } catch (e) {
    console.warn("Transcript table may not exist yet.")
  }

  const stats = {
    totalRevenue: completedPayments._sum?.amount || 0,
    totalAppointments: totalAppointments,
    auditLogs: auditLogs || [],
    recentActivities: recentActivities || [],
    allTranscripts: allTranscripts || []
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
