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

export async function sendBookingConfirmation(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true, service: true }
  })

  if (!appointment || !appointment.client || !appointment.client.email) return

  await sendPractitionerNewBookingAlert(appointmentId)

  const resendApiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

  const dateStr = new Date(appointment.startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  })

  const sessionUrl = `${appUrl}/session/${appointment.id}`
  const calendarTitle = encodeURIComponent(`Session with ${appointment.practitioner.name}`)
  const calendarStart = new Date(appointment.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const calendarEnd = new Date(appointment.endTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarStart}/${calendarEnd}&details=${encodeURIComponent(sessionUrl)}`

  if (!resendApiKey) {
    console.log(`[BOOKING_CONFIRMATION_STUB] Sending confirmation to ${appointment.client.email} for session ${appointmentId}`)
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Oku Therapy <bookings@okutherapy.com>',
        to: [appointment.client.email],
        subject: `Session Confirmed — ${dateStr}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin: 0; letter-spacing: -1px;">Oku Therapy</h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #4A4458; margin-bottom: 8px;">Your session is confirmed.</h2>
            <p style="color: #6B6480; font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
              Hello ${appointment.client.name || 'there'}, your session has been booked successfully.
            </p>
            <div style="background: #F3F0FF; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
              <table style="width: 100%;">
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Therapist</td><td style="font-weight: 700; color: #4A4458;">${appointment.practitioner.name}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${appointment.service.name}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Date & Time</td><td style="font-weight: 700; color: #4A4458;">${dateStr} UTC</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${sessionUrl}" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">Join Session Room</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${googleCalendarUrl}" style="color: #A599E0; font-size: 13px; text-decoration: none; font-weight: 600;">+ Add to Google Calendar</a>
            </div>
            <hr style="border: none; border-top: 1px solid #F0EEF8; margin-bottom: 24px;" />
            <p style="color: #C4BFD4; font-size: 11px; text-align: center;">Please reschedule at least 24 hours in advance.<br/>&copy; ${new Date().getFullYear()} Oku Therapy Integrated</p>
          </div>
        `
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error(`[RESEND_ERROR] Booking confirmation failed: ${err}`)
    } else {
      console.log(`[RESEND_SUCCESS] Booking confirmation sent to ${appointment.client.email}`)
    }
  } catch (e) {
    console.error('[BOOKING_CONFIRMATION_ERROR]', e)
  }
}

export async function sendPractitionerNewBookingAlert(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true, service: true }
  })

  if (!appointment || !appointment.practitioner?.email) return

  const resendApiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

  const dateStr = new Date(appointment.startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  })

  if (!resendApiKey) {
    console.log(`[PRACTITIONER_ALERT_STUB] New booking for ${appointment.practitioner.email} at ${dateStr}`)
    return
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Oku Therapy <bookings@okutherapy.com>',
        to: [appointment.practitioner.email],
        subject: `New Session Booked — ${appointment.client?.name || 'Client'} on ${dateStr}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
            <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin-bottom: 32px;">New Session Booked</h1>
            <p style="color: #6B6480; font-size: 16px; margin-bottom: 24px;">Hello ${appointment.practitioner.name || 'Doctor'}, a new session has been scheduled with you.</p>
            <div style="background: #E4F9F0; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
              <table style="width: 100%;">
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Client</td><td style="font-weight: 700; color: #4A4458;">${appointment.client?.name || 'Anonymous'}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${appointment.service.name}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase;">Time</td><td style="font-weight: 700; color: #4A4458;">${dateStr} UTC</td></tr>
              </table>
            </div>
            <div style="text-align: center;">
              <a href="${appUrl}/practitioner/appointments" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">View My Schedule</a>
            </div>
          </div>
        `
      })
    })
  } catch (e) {
    console.error('[PRACTITIONER_ALERT_ERROR]', e)
  }
}

export async function sendWelcomeEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.email) return

  const resendApiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

  if (!resendApiKey) {
    console.log(`[WELCOME_EMAIL_STUB] Welcome email for ${user.email}`)
    return
  }

  const dashboardUrl = user.role === 'THERAPIST' ? `${appUrl}/practitioner/dashboard` : `${appUrl}/dashboard/client`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Oku Therapy <welcome@okutherapy.com>',
        to: [user.email],
        subject: 'Welcome to Oku — Your Sanctuary Awaits',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin: 0;">Oku Therapy</h1>
            </div>
            <h2 style="font-size: 32px; font-weight: 700; color: #4A4458; margin-bottom: 12px; letter-spacing: -1px;">Welcome, ${user.name?.split(' ')[0] || 'there'}.</h2>
            <p style="color: #6B6480; font-size: 17px; line-height: 1.8; margin-bottom: 32px;">
              You've taken the first step toward healing. Your sanctuary is now ready — a private, secure space designed for your growth and wellbeing.
            </p>
            <div style="background: #E8E4F9; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
              <p style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9B96AD; margin-bottom: 16px;">What you can do now</p>
              <ul style="color: #4A4458; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                <li>Browse our verified therapists and find your match</li>
                <li>Book a free 10-minute trial session</li>
                <li>Set up your wellness profile</li>
                <li>Explore the AI wellness companion</li>
              </ul>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${dashboardUrl}" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">Enter My Sanctuary</a>
            </div>
            <hr style="border: none; border-top: 1px solid #F0EEF8; margin-bottom: 24px;" />
            <p style="color: #C4BFD4; font-size: 11px; text-align: center; line-height: 1.8;">
              Private by design · Protected access · Human support when you need it<br/>
              &copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.
            </p>
          </div>
        `
      })
    })
  } catch (e) {
    console.error('[WELCOME_EMAIL_ERROR]', e)
  }
}

export async function sendCancellationEmail(appointmentId: string, refunded: boolean) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { client: true, practitioner: true, service: true },
  })

  if (!appointment || !appointment.client?.email) return

  const resendApiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

  const dateStr = new Date(appointment.startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })

  const refundMessage = refunded
    ? 'A refund has been initiated and will appear in 5–7 business days.'
    : 'Cancellation within 8 hours — no refund per policy.'

  if (!resendApiKey) {
    console.log(
      `[CANCELLATION_EMAIL_STUB] Sending cancellation to ${appointment.client.email} for session ${appointmentId} — refunded: ${refunded}`
    )
  } else {
    // Email to client
    try {
      const clientRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: 'Oku Therapy <bookings@okutherapy.com>',
          to: [appointment.client.email],
          subject: 'Session Cancelled',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
              <div style="margin-bottom: 40px;">
                <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin: 0;">Oku Therapy</h1>
              </div>
              <h2 style="font-size: 24px; font-weight: 700; color: #4A4458; margin-bottom: 8px;">Session Cancelled</h2>
              <p style="color: #6B6480; font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
                Hello ${appointment.client.name || 'there'}, your session has been cancelled.
              </p>
              <div style="background: #F3F0FF; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
                <table style="width: 100%;">
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Therapist</td><td style="font-weight: 700; color: #4A4458;">${appointment.practitioner.name}</td></tr>
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${appointment.service.name}</td></tr>
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Date & Time</td><td style="font-weight: 700; color: #4A4458;">${dateStr} UTC</td></tr>
                </table>
              </div>
              <div style="background: ${refunded ? '#E4F9F0' : '#FFF5F5'}; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
                <p style="color: ${refunded ? '#1a6645' : '#9b1c1c'}; font-size: 14px; font-weight: 600; margin: 0;">${refundMessage}</p>
              </div>
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${appUrl}/dashboard/client/book" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">Book a New Session</a>
              </div>
              <hr style="border: none; border-top: 1px solid #F0EEF8; margin-bottom: 24px;" />
              <p style="color: #C4BFD4; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.</p>
            </div>
          `,
        }),
      })
      if (!clientRes.ok) {
        console.error('[CANCEL_EMAIL_CLIENT_ERROR]', await clientRes.text())
      } else {
        console.log(`[RESEND_SUCCESS] Cancellation email sent to ${appointment.client.email}`)
      }
    } catch (e) {
      console.error('[CANCEL_EMAIL_CLIENT_FATAL]', e)
    }

    // Email to practitioner
    if (appointment.practitioner?.email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
          body: JSON.stringify({
            from: 'Oku Therapy <bookings@okutherapy.com>',
            to: [appointment.practitioner.email],
            subject: `Session Cancelled — ${appointment.client.name || 'Client'} on ${dateStr}`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
                <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin-bottom: 32px;">Session Cancelled</h1>
                <p style="color: #6B6480; font-size: 16px; margin-bottom: 24px;">Hello ${appointment.practitioner.name || 'Doctor'}, a session has been cancelled.</p>
                <div style="background: #FFF5F5; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
                  <table style="width: 100%;">
                    <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Client</td><td style="font-weight: 700; color: #4A4458;">${appointment.client.name || 'Anonymous'}</td></tr>
                    <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${appointment.service.name}</td></tr>
                    <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase;">Cancelled Time</td><td style="font-weight: 700; color: #4A4458;">${dateStr} UTC</td></tr>
                  </table>
                </div>
                <div style="text-align: center;">
                  <a href="${appUrl}/practitioner/appointments" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">View My Schedule</a>
                </div>
              </div>
            `,
          }),
        })
      } catch (e) {
        console.error('[CANCEL_EMAIL_PRACTITIONER_ERROR]', e)
      }
    }
  }
}

export async function sendRescheduleEmail(oldAppointmentId: string, newAppointmentId: string) {
  const [oldAppt, newAppt] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: oldAppointmentId },
      include: { client: true, practitioner: true, service: true },
    }),
    prisma.appointment.findUnique({
      where: { id: newAppointmentId },
      include: { client: true, practitioner: true, service: true },
    }),
  ])

  if (!oldAppt || !newAppt || !newAppt.client?.email) return

  const resendApiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

  const newDateStr = new Date(newAppt.startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })

  const sessionUrl = `${appUrl}/session/${newAppt.id}`

  if (!resendApiKey) {
    console.log(
      `[RESCHEDULE_EMAIL_STUB] Sending reschedule to ${newAppt.client.email} — new session ${newAppointmentId}`
    )
    return
  }

  // Email to client
  try {
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Oku Therapy <bookings@okutherapy.com>',
        to: [newAppt.client.email],
        subject: `Session Rescheduled — ${newDateStr}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin: 0;">Oku Therapy</h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #4A4458; margin-bottom: 8px;">Session Rescheduled</h2>
            <p style="color: #6B6480; font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
              Hello ${newAppt.client.name || 'there'}, your session has been rescheduled to a new time.
            </p>
            <div style="background: #F3F0FF; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
              <table style="width: 100%;">
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Therapist</td><td style="font-weight: 700; color: #4A4458;">${newAppt.practitioner.name}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${newAppt.service.name}</td></tr>
                <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">New Date & Time</td><td style="font-weight: 700; color: #4A4458;">${newDateStr} UTC</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${sessionUrl}" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">Join Session Room</a>
            </div>
            <hr style="border: none; border-top: 1px solid #F0EEF8; margin-bottom: 24px;" />
            <p style="color: #C4BFD4; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.</p>
          </div>
        `,
      }),
    })
    if (!clientRes.ok) {
      console.error('[RESCHEDULE_EMAIL_CLIENT_ERROR]', await clientRes.text())
    } else {
      console.log(`[RESEND_SUCCESS] Reschedule email sent to ${newAppt.client.email}`)
    }
  } catch (e) {
    console.error('[RESCHEDULE_EMAIL_CLIENT_FATAL]', e)
  }

  // Email to practitioner
  if (newAppt.practitioner?.email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: 'Oku Therapy <bookings@okutherapy.com>',
          to: [newAppt.practitioner.email],
          subject: `Client Rescheduled — ${newAppt.client?.name || 'Client'} to ${newDateStr}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
              <h1 style="font-size: 28px; font-weight: 800; color: #4A4458; margin-bottom: 32px;">Client Rescheduled</h1>
              <p style="color: #6B6480; font-size: 16px; margin-bottom: 24px;">Hello ${newAppt.practitioner.name || 'Doctor'}, a client has rescheduled their session.</p>
              <div style="background: #E4F9F0; padding: 28px; border-radius: 16px; margin-bottom: 32px;">
                <table style="width: 100%;">
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Client</td><td style="font-weight: 700; color: #4A4458;">${newAppt.client?.name || 'Anonymous'}</td></tr>
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase; padding-bottom: 10px;">Service</td><td style="font-weight: 700; color: #4A4458;">${newAppt.service.name}</td></tr>
                  <tr><td style="color: #9B96AD; font-size: 12px; text-transform: uppercase;">New Time</td><td style="font-weight: 700; color: #4A4458;">${newDateStr} UTC</td></tr>
                </table>
              </div>
              <div style="text-align: center;">
                <a href="${appUrl}/practitioner/appointments" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">View My Schedule</a>
              </div>
            </div>
          `,
        }),
      })
    } catch (e) {
      console.error('[RESCHEDULE_EMAIL_PRACTITIONER_ERROR]', e)
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
