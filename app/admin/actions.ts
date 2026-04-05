'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { UserRole, AppointmentStatus } from '@prisma/client'

// Helper to check admin access
async function checkAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    throw new Error('Unauthorized')
  }
  return session
}

async function refreshAdminPaths() {
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/users')
  revalidatePath('/admin/practitioners')
  revalidatePath('/admin/financials')
  revalidatePath('/admin/sessions')
}

export async function toggleTherapistVerification(practitionerId: string, isVerified: boolean) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { isVerified }
  })
  await refreshAdminPaths()
}

export async function updateUserRole(userId: string, role: UserRole) {
  await checkAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })
  await refreshAdminPaths()
}

export async function deleteUser(userId: string) {
  await checkAdmin()
  await prisma.user.delete({
    where: { id: userId }
  })
  await refreshAdminPaths()
}

export async function toggleTherapistBlogPower(practitionerId: string, canPostBlogs: boolean) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { canPostBlogs }
  })
  await refreshAdminPaths()
}

export async function updateTherapistRate(practitionerId: string, hourlyRate: number) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: {
      hourlyRate,
      internationalSessionRate: hourlyRate,
    }
  })
  await refreshAdminPaths()
}

export async function updateServicePrice(serviceId: string, price: number) {
  await checkAdmin()
  await prisma.service.update({
    where: { id: serviceId },
    data: { price }
  })
  await refreshAdminPaths()
}

export async function createService(data: { name: string, duration: number, price: number, description?: string }) {
  await checkAdmin()
  await prisma.service.create({
    data: {
      name: data.name,
      duration: data.duration,
      price: data.price,
      description: data.description,
      isActive: true
    }
  })
  await refreshAdminPaths()
}

export async function toggleServiceStatus(serviceId: string, isActive: boolean) {
  await checkAdmin()
  await prisma.service.update({
    where: { id: serviceId },
    data: { isActive }
  })
  await refreshAdminPaths()
}

export async function updateServiceDefinition(
  serviceId: string,
  data: { name: string, duration: number, price: number, description?: string, isActive: boolean }
) {
  await checkAdmin()
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      name: data.name,
      duration: data.duration,
      price: data.price,
      description: data.description,
      isActive: data.isActive,
    }
  })
  await refreshAdminPaths()
}

export async function deleteServiceDefinition(serviceId: string) {
  await checkAdmin()

  const linkedAppointments = await prisma.appointment.count({
    where: { serviceId }
  })

  if (linkedAppointments > 0) {
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false }
    })

    await refreshAdminPaths()
    return { mode: 'archived' as const }
  }

  await prisma.service.delete({
    where: { id: serviceId }
  })

  await refreshAdminPaths()
  return { mode: 'deleted' as const }
}

export async function updatePlatformSettings(data: {
  maintenanceMode?: boolean
  platformFeePercent?: number
  therapySessionPlatformFeePercent?: number
  psychiatrySessionPlatformFeePercent?: number
  assessmentPlatformFeePercent?: number
  minimumPayoutAmount?: number
  okuAiEnabled?: boolean
  multilingualAiEnabled?: boolean
  autoTranslateTranscripts?: boolean
  adhdCareModeEnabled?: boolean
  requireConsentBeforeTranscription?: boolean
  transcriptRetentionDays?: number
  referralRewardPercent?: number
  maxReferralRewards?: number
}) {
  await checkAdmin()
  await prisma.platformSettings.upsert({
    where: { id: 'global' },
    update: data,
    create: {
      id: 'global',
      maintenanceMode: data.maintenanceMode ?? false,
      platformFeePercent: data.platformFeePercent ?? 20.0,
      therapySessionPlatformFeePercent: data.therapySessionPlatformFeePercent ?? data.platformFeePercent ?? 20.0,
      psychiatrySessionPlatformFeePercent: data.psychiatrySessionPlatformFeePercent ?? data.platformFeePercent ?? 20.0,
      assessmentPlatformFeePercent: data.assessmentPlatformFeePercent ?? data.platformFeePercent ?? 20.0,
      minimumPayoutAmount: data.minimumPayoutAmount ?? 25.0,
      okuAiEnabled: data.okuAiEnabled ?? true,
      multilingualAiEnabled: data.multilingualAiEnabled ?? true,
      autoTranslateTranscripts: data.autoTranslateTranscripts ?? true,
      adhdCareModeEnabled: data.adhdCareModeEnabled ?? true,
      requireConsentBeforeTranscription: data.requireConsentBeforeTranscription ?? true,
      transcriptRetentionDays: data.transcriptRetentionDays ?? 365,
      referralRewardPercent: data.referralRewardPercent ?? 10.0,
      maxReferralRewards: data.maxReferralRewards ?? 3,
    }
  })
  await refreshAdminPaths()
  revalidatePath('/admin/financials')
  revalidatePath('/practitioner/dashboard')
  revalidatePath('/practitioner/billing')
}

// Helper to check editorial access (Admin or Editor Therapist)
async function checkEditorial() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  
  if (session.user.role === UserRole.ADMIN) return session

  const profile = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (profile?.canPostBlogs) return session
  
  throw new Error('Unauthorized')
}

// ─── BLOG ACTIONS ────────────────────────────────────────────────────────────

export async function createPost(data: { title: string, content: string, excerpt?: string, category?: string, image?: string, published?: boolean }) {
  const session = await checkEditorial()
  const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  
  await prisma.post.create({
    data: {
      ...data,
      slug,
      authorId: session.user.id
    }
  })
  await refreshAdminPaths()
  revalidatePath('/practitioner/blogs')
  revalidatePath('/blog')
}

export async function updatePost(id: string, data: { title?: string, content?: string, excerpt?: string, category?: string, image?: string, published?: boolean }) {
  const session = await checkEditorial()
  
  // If therapist, ensure they own the post (or just let them edit all if they are editors)
  // For now, let's keep it simple: Editors can edit all blogs.
  
  await prisma.post.update({
    where: { id },
    data
  })
  await refreshAdminPaths()
  revalidatePath('/practitioner/blogs')
  revalidatePath('/blog')
}

export async function deletePost(id: string) {
  await checkEditorial()
  await prisma.post.delete({
    where: { id }
  })
  await refreshAdminPaths()
  revalidatePath('/practitioner/blogs')
  revalidatePath('/blog')
}

// ─── ADHD ACCESS CONTROL ─────────────────────────────────────────────────────

/** Admin: toggle ADHD Manager access for any client */
export async function toggleClientAdhd(userId: string, adhdDiagnosed: boolean) {
  await checkAdmin()
  await prisma.clientProfile.upsert({
    where: { userId },
    update: { adhdDiagnosed },
    create: { userId, adhdDiagnosed },
  })
  revalidatePath('/admin/users')
  revalidatePath('/dashboard/client')
}

/** Therapist: toggle ADHD Manager access for one of their own clients */
export async function toggleClientAdhdByTherapist(clientId: string, adhdDiagnosed: boolean) {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) throw new Error('Unauthorized')

  // Verify this client has had at least one appointment with this therapist
  const link = await prisma.appointment.findFirst({
    where: { clientId, practitionerId: session.user.id },
  })
  if (!link) throw new Error('Client not in your caseload')

  await prisma.clientProfile.upsert({
    where: { userId: clientId },
    update: { adhdDiagnosed },
    create: { userId: clientId, adhdDiagnosed },
  })
  revalidatePath(`/practitioner/clients/${clientId}`)
}

// ─── PAYOUT ACTIONS ──────────────────────────────────────────────────────────
import { transferPayoutToPractitioner } from '@/lib/stripe-connect'

export async function markAsPaid(practitionerId: string, amount: number, payoutId?: string) {
  await checkAdmin()

  if (payoutId) {
    try {
      // MASTER UPGRADE: Automated Financial Settlement
      await transferPayoutToPractitioner(payoutId)
    } catch (error: any) {
      console.warn('[AUTOMATED_PAYOUT_FAILED] Falling back to manual record update.', error.message)
      await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
          referenceId: 'MANUAL-' + Date.now(),
        },
      })
    }
  } else {
    await prisma.payout.create({
      data: {
        practitionerId,
        amount,
        status: 'COMPLETED',
        processedAt: new Date(),
        periodStart: new Date(new Date().setDate(1)), // Start of month
        periodEnd: new Date(),
        referenceId: 'MANUAL-' + Date.now()
      }
    })
  }
  await refreshAdminPaths()
}

// ─── CIRCLE ACTIONS ──────────────────────────────────────────────────────────

export async function createCircle(data: {
  title: string,
  description?: string,
  startTime: Date,
  endTime: Date,
  maxCapacity: number,
  price: number,
  practitionerId: string
}) {
  await checkAdmin()
  
  // Create a Service entry for this Circle if it doesn't exist
  // Or just use a generic 'Circle' service. 
  // Let's ensure a 'Group Circle' service exists.
  let circleService = await prisma.service.findUnique({ where: { name: 'Group Circle' } })
  if (!circleService) {
    circleService = await prisma.service.create({
      data: {
        name: 'Group Circle',
        duration: 60,
        price: data.price,
        description: 'Collaborative group therapy session'
      }
    })
  }

  await prisma.appointment.create({
    data: {
      practitionerId: data.practitionerId,
      serviceId: circleService.id,
      startTime: data.startTime,
      endTime: data.endTime,
      isGroupSession: true,
      maxParticipants: data.maxCapacity,
      notes: data.description,
      status: 'CONFIRMED',
      priceSnapshot: data.price
    }
  })

  await refreshAdminPaths()
  revalidatePath('/circles')
}

export async function deleteCircle(appointmentId: string) {
  await checkAdmin()
  await prisma.appointment.delete({
    where: { id: appointmentId }
  })
  await refreshAdminPaths()
  revalidatePath('/circles')
}

// ─── APPOINTMENT ACTIONS ──────────────────────────────────────────────────────

export async function createManualAppointment(data: {
  clientId: string,
  practitionerId: string,
  serviceId: string,
  startTime: Date,
  endTime: Date,
  status?: AppointmentStatus
}) {
  await checkAdmin()
  
  await prisma.appointment.create({
    data: {
      ...data,
      status: data.status || 'SCHEDULED'
    }
  })
  await refreshAdminPaths()
}

export async function rescheduleAppointment(appointmentId: string, startTime: Date, endTime: Date) {
  await checkAdmin()
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { startTime, endTime }
  })
  await refreshAdminPaths()
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  await checkAdmin()
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status }
  })
  await refreshAdminPaths()
}

export async function deleteAppointment(appointmentId: string) {
  await checkAdmin()
  await prisma.appointment.delete({
    where: { id: appointmentId }
  })
  await refreshAdminPaths()
}

export async function addParticipantToCircle(appointmentId: string, userId: string) {
  await checkAdmin()
  await prisma.groupParticipant.upsert({
    where: {
      appointmentId_userId: { appointmentId, userId }
    },
    update: {},
    create: { appointmentId, userId }
  })
  await refreshAdminPaths()
}

export async function removeParticipantFromCircle(participantId: string) {
  await checkAdmin()
  await prisma.groupParticipant.delete({
    where: { id: participantId }
  })
  await refreshAdminPaths()
}
