import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Optimize: Batching ALL queries into one Promise.all for parallel execution
  // Limits applied to secondary data to prevent payload bloat
  const results = await Promise.all([
    // 1. Therapists
    prisma.user.findMany({
        where: { role: UserRole.THERAPIST },
        include: { practitionerProfile: true },
        orderBy: { createdAt: 'desc' },
        take: 100
    }).catch(() => []),
    
    // 2. Clients
    prisma.user.findMany({
        where: { role: UserRole.CLIENT },
        include: {
            clientProfile: true,
            intakeForm: { select: { id: true } },
            _count: { select: { clientAppointments: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
    }).catch(() => []),

    // 3. Services
    prisma.service.findMany({
        orderBy: { createdAt: 'asc' }
    }).catch(() => []),

    // 4. Counts
    prisma.appointment.count().catch(() => 0),

    // 5. Revenue
    prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
    }).catch(() => ({ _sum: { amount: 0 } })),

    // 6. Audit
    prisma.auditLog.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20
    }).catch(() => []),

    // 7. Settings
    prisma.platformSettings.findUnique({
        where: { id: 'global' }
    }).catch(() => null),

    // 8. Activities
    prisma.userActivity.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 30
    }).catch(() => []),

    // 9. Transcripts
    prisma.transcript.findMany({
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
        take: 20
    }).catch(() => []),

    // 10. Posts
    prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
    }).catch(() => []),

    // 11. Circles
    prisma.appointment.findMany({
        where: { isGroupSession: true },
        include: { 
            practitioner: { select: { name: true } },
            participants: { include: { user: { select: { name: true } } } }
        },
        orderBy: { startTime: 'desc' },
        take: 50
    }).catch(() => [])
  ])

  const [
    therapists,
    clients,
    services,
    totalAppointments,
    completedPayments,
    auditLogs,
    dbSettings,
    recentActivities,
    allTranscripts,
    allPosts,
    circles
  ] = results as any[]

  // Default settings if DB fails
  let settings = {
    maintenanceMode: false,
    platformFeePercent: 20,
    therapySessionPlatformFeePercent: 20,
    psychiatrySessionPlatformFeePercent: 20,
    assessmentPlatformFeePercent: 20,
    minimumPayoutAmount: 25,
    okuAiEnabled: true,
    multilingualAiEnabled: true,
    autoTranslateTranscripts: true,
    adhdCareModeEnabled: true,
    requireConsentBeforeTranscription: true,
    transcriptRetentionDays: 365,
  }
  
  if (dbSettings) {
    settings = { ...settings, ...(dbSettings as any) }
  }

  const stats = {
    totalRevenue: (completedPayments as any)?._sum?.amount || 0,
    totalAppointments: totalAppointments,
    auditLogs: auditLogs || [],
    recentActivities: recentActivities || [],
    allTranscripts: allTranscripts || [],
    allPosts: allPosts || []
  }

  return (
    <div className="bg-oku-lavender/5 min-h-screen">
      <AdminDashboardClient 
        stats={stats} 
        therapists={therapists || []} 
        services={services || []} 
        clients={clients || []} 
        settings={settings}
        circles={circles || []}
      />
    </div>
  )
}
