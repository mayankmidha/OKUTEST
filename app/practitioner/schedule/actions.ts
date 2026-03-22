'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@prisma/client'

async function checkTherapist() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function updateWeeklyAvailability(data: { dayOfWeek: number, startTime: string, endTime: string }[]) {
  const userId = await checkTherapist()
  const profile = await prisma.practitionerProfile.findUnique({ where: { userId } })
  if (!profile) throw new Error('Profile not found')

  // Transaction to update availability
  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { practitionerProfileId: profile.id } }),
    prisma.availability.createMany({
      data: data.map(d => ({
        practitionerProfileId: profile.id,
        dayOfWeek: d.dayOfWeek,
        startTime: d.startTime,
        endTime: d.endTime
      }))
    })
  ])

  revalidatePath('/practitioner/schedule')
}

export async function addAvailabilityOverride(data: { date: Date, startTime: string, endTime: string, isAvailable: boolean }) {
  const userId = await checkTherapist()
  const profile = await prisma.practitionerProfile.findUnique({ where: { userId } })
  if (!profile) throw new Error('Profile not found')

  await prisma.availabilityOverride.create({
    data: {
      practitionerProfileId: profile.id,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      isAvailable: data.isAvailable
    }
  })

  revalidatePath('/practitioner/schedule')
}

export async function blockDate(data: { date: Date, reason?: string }) {
  const userId = await checkTherapist()
  const profile = await prisma.practitionerProfile.findUnique({ where: { userId } })
  if (!profile) throw new Error('Profile not found')

  await prisma.blockedDate.create({
    data: {
      practitionerProfileId: profile.id,
      date: data.date,
      reason: data.reason
    }
  })

  revalidatePath('/practitioner/schedule')
}

export async function deleteOverride(id: string) {
  await checkTherapist()
  await prisma.availabilityOverride.delete({ where: { id } })
  revalidatePath('/practitioner/schedule')
}

export async function deleteBlockedDate(id: string) {
  await checkTherapist()
  await prisma.blockedDate.delete({ where: { id } })
  revalidatePath('/practitioner/schedule')
}
