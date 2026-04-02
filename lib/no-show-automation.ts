import { prisma } from '@/lib/prisma'
import { AppointmentStatus } from '@prisma/client'
import { getAppointmentBillingAmount } from './pricing'

export async function processNoShows() {
  const now = new Date()
  const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000)

  // Find confirmed appointments that started more than 15 mins ago and haven't been completed/started
  const missedAppointments = await prisma.appointment.findMany({
    where: {
      status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      startTime: { lte: fifteenMinsAgo },
      isGroupSession: false,
      clientId: { not: null }
    },
    include: {
        service: true,
        practitioner: true
    }
  })

  let processedCount = 0

  for (const appt of missedAppointments) {
    try {
        const amount = getAppointmentBillingAmount(appt)
        await prisma.$transaction([
            prisma.appointment.update({
                where: { id: appt.id },
                data: {
                    status: AppointmentStatus.NO_SHOW,
                    attendanceStatus: 'no_show_auto',
                    noShowFeeCharged: amount
                }
            }),
            prisma.clientProfile.update({
                where: { userId: appt.clientId! },
                data: { noShowCount: { increment: 1 } }
            })
        ])
        processedCount++
    } catch (e) {
        console.error(`[NO_SHOW_AUTO_ERROR] Failed for appt ${appt.id}:`, e)
    }
  }

  return processedCount
}
