import { prisma } from './prisma'

export async function sendSessionReminder(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true }
  })

  if (!appointment || !appointment.client || !appointment.client.email) return

  // In production, integrate with Resend, SendGrid, or AWS SES
  console.log(`[CLINICAL_REMINDER] Sending alert to ${appointment.client.email} for session with ${appointment.practitioner.name} at ${appointment.startTime}`)

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { reminderSent: true }
  })
}

export async function processDailyReminders() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: new Date(),
        lte: tomorrow
      },
      reminderSent: false,
      status: 'SCHEDULED'
    }
  })

  console.log(`[CRON] Processing ${upcomingAppointments.length} clinical reminders...`)

  for (const appt of upcomingAppointments) {
    await sendSessionReminder(appt.id)
  }

  return upcomingAppointments.length
}
