'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { UserRole } from '@prisma/client'

// Helper to check admin access
async function checkAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function toggleTherapistVerification(practitionerId: string, isVerified: boolean) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { isVerified }
  })
  revalidatePath('/admin/dashboard')
}

export async function toggleTherapistBlogPower(practitionerId: string, canPostBlogs: boolean) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { canPostBlogs }
  })
  revalidatePath('/admin/dashboard')
}

export async function updateTherapistRate(practitionerId: string, hourlyRate: number) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { hourlyRate }
  })
  revalidatePath('/admin/dashboard')
}

export async function updateServicePrice(serviceId: string, price: number) {
  await checkAdmin()
  await prisma.service.update({
    where: { id: serviceId },
    data: { price }
  })
  revalidatePath('/admin/dashboard')
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
  revalidatePath('/admin/dashboard')
}

export async function toggleServiceStatus(serviceId: string, isActive: boolean) {
  await checkAdmin()
  await prisma.service.update({
    where: { id: serviceId },
    data: { isActive }
  })
  revalidatePath('/admin/dashboard')
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
  revalidatePath('/admin/dashboard')
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

    revalidatePath('/admin/dashboard')
    return { mode: 'archived' as const }
  }

  await prisma.service.delete({
    where: { id: serviceId }
  })

  revalidatePath('/admin/dashboard')
  return { mode: 'deleted' as const }
}

export async function updatePlatformSettings(data: { maintenanceMode?: boolean, platformFeePercent?: number }) {
  await checkAdmin()
  await prisma.platformSettings.upsert({
    where: { id: 'global' },
    update: data,
    create: {
      id: 'global',
      maintenanceMode: data.maintenanceMode ?? false,
      platformFeePercent: data.platformFeePercent ?? 20.0
    }
  })
  revalidatePath('/admin/dashboard')
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
  revalidatePath('/admin/dashboard')
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
  revalidatePath('/admin/dashboard')
  revalidatePath('/practitioner/blogs')
  revalidatePath('/blog')
}

export async function deletePost(id: string) {
  await checkEditorial()
  await prisma.post.delete({
    where: { id }
  })
  revalidatePath('/admin/dashboard')
  revalidatePath('/practitioner/blogs')
  revalidatePath('/blog')
}

// ─── PAYOUT ACTIONS ──────────────────────────────────────────────────────────

export async function markAsPaid(practitionerId: string, amount: number) {
  await checkAdmin()
  
  await prisma.payout.create({
    data: {
      practitionerId,
      amount,
      status: 'COMPLETED',
      periodStart: new Date(new Date().setDate(1)), // Start of month
      periodEnd: new Date(),
      referenceId: 'MANUAL-' + Date.now()
    }
  })
  
  revalidatePath('/admin/financials')
}
