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
}

export async function toggleTherapistVerification(practitionerId: string, isVerified: boolean) {
  await checkAdmin()
  await prisma.practitionerProfile.update({
    where: { id: practitionerId },
    data: { isVerified }
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
