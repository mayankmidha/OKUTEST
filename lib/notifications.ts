import { prisma } from './prisma'

export async function sendSessionReminder(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true, service: true }
  })

  if (!appointment || !appointment.client || !appointment.client.email) return

  const resendApiKey = process.env.RESEND_API_KEY
  const dateStr = new Date(appointment.startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC' // In production, use client's timezone
  })

  if (!resendApiKey) {
    console.log(`[CLINICAL_REMINDER_STUB] Sending alert to ${appointment.client.email} for session with ${appointment.practitioner.name} at ${dateStr}`)
  } else {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Oku Therapy <reminders@okutherapy.com>', // User needs to verify this domain in Resend
          to: [appointment.client.email],
          subject: `Reminder: Session with ${appointment.practitioner.name}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;">
              <div style="margin-bottom: 30px; text-align: center;">
                <span style="font-size: 24px; font-weight: bold; color: #1a1a1a;">Oku Therapy</span>
              </div>
              
              <h1 style="color: #1a1a1a; font-size: 22px; font-weight: 700; margin-bottom: 20px; line-height: 1.3;">Upcoming Session Reminder</h1>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Hello ${appointment.client.name || 'valued client'}, this is a reminder for your upcoming session.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #eeeeee;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding-bottom: 10px; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Therapist</td>
                    <td style="padding-bottom: 10px; color: #1a1a1a; font-weight: 600;">${appointment.practitioner.name}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Service</td>
                    <td style="padding-bottom: 10px; color: #1a1a1a; font-weight: 600;">${appointment.service.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Time</td>
                    <td style="color: #1a1a1a; font-weight: 600;">${dateStr}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'}/session/${appointment.id}" 
                   style="display: inline-block; background-color: #000000; color: #ffffff; padding: 18px 36px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">
                   Join Session Hall
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #f0f0f0; margin-bottom: 30px;" />
              
              <p style="color: #999999; font-size: 12px; line-height: 1.6; text-align: center;">
                If you need to reschedule, please do so at least 24 hours in advance to avoid a no-show fee.<br />
                &copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.
              </p>
            </div>
          `
        })
      })

      if (!response.ok) {
        const err = await response.text()
        console.error(`[RESEND_ERROR] Failed to send email: ${err}`)
      } else {
        console.log(`[RESEND_SUCCESS] Reminder email sent to ${appointment.client.email}`)
      }
    } catch (e) {
      console.error(`[RESEND_FATAL_ERROR]`, e)
    }
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { reminderSent: true }
  })
}

export async function triggerEmergencyAlert({
  appointmentId,
  riskLevel,
  clinicalSignals
}: {
  appointmentId: string,
  riskLevel: string,
  clinicalSignals: string[]
}) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true }
  })

  if (!appointment || riskLevel !== 'HIGH') return

  const resendApiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL || 'safety@okutherapy.com'

  console.warn(`[EMERGENCY_ALERT] HIGH RISK DETECTED for Appointment ${appointmentId}. Signals: ${clinicalSignals.join(', ')}`)

  if (resendApiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Safety Core <safety@okutherapy.com>',
          to: [appointment.practitioner.email, adminEmail],
          subject: `URGENT: High Risk Detected - Session ${appointmentId}`,
          html: `
            <div style="font-family: sans-serif; padding: 40px; border: 2px solid #ff0000; border-radius: 16px;">
              <h1 style="color: #ff0000;">Emergency Clinical Alert</h1>
              <p>The Oku AI Core has detected <strong>HIGH RISK</strong> markers in a recent session transcript.</p>
              <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Practitioner:</strong> ${appointment.practitioner.name}</p>
                <p><strong>Client:</strong> ${appointment.client?.name || 'Anonymized'}</p>
                <p><strong>Signals:</strong> ${clinicalSignals.join(', ')}</p>
              </div>
              <p>Please review the full transcript and follow established emergency protocols immediately.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/practitioner/sessions/${appointmentId}" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; border-radius: 50px; text-decoration: none;">Review Session</a>
            </div>
          `
        })
      })
    } catch (e) {
      console.error("[EMERGENCY_NOTIFICATION_FAILED]", e)
    }
  }
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
