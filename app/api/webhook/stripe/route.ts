import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { AppointmentStatus, PaymentStatus, RecurringPattern } from '@prisma/client'
import { sendSessionReminder } from '@/lib/notifications'
import { sendInvoiceEmail } from '@/lib/invoicing'
import { createRecurringSeries } from '@/lib/recurring-booking'
import { syncAppointmentToExternalCalendar } from '@/lib/calendar-sync'
import { awardReferralRewardForAppointment } from '@/lib/referrals'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const appointmentId = session.metadata?.appointmentId
    const paymentId = session.metadata?.paymentId
    const recurringPattern = (session.metadata?.recurringPattern as RecurringPattern) || RecurringPattern.NONE

    if (appointmentId && paymentId) {
        console.log(`[STRIPE_WEBHOOK] Payment successful for Appointment: ${appointmentId}`)

        // 1. Update Payment Record
        await prisma.payment.update({
            where: { id: paymentId },
            data: { 
                status: PaymentStatus.COMPLETED,
                stripePaymentId: session.id,
                updatedAt: new Date()
            }
        })

        // 2. Update Appointment Status and Pattern
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { 
                status: AppointmentStatus.SCHEDULED,
                recurringPattern: recurringPattern,
                updatedAt: new Date()
            }
        })

        // Trigger Referral Reward
        try {
            await awardReferralRewardForAppointment(appointmentId);
        } catch (e) {
            console.error('Failed to award referral reward', e);
        }

        // 3. Trigger Recurring Series Generation (Phase 1 Industrialization)
        if (recurringPattern !== RecurringPattern.NONE) {
            try {
                await createRecurringSeries(appointmentId)
                console.log(`[RECURRING] Series generated for Parent: ${appointmentId} (${recurringPattern})`)
            } catch (error) {
                console.error("Failed to generate recurring series:", error)
            }
        }

        // 4. Trigger immediate notification
        try {
            await sendSessionReminder(appointmentId)
        } catch (error) {
            console.error("Failed to send initial confirmation reminder:", error)
        }

        // 5. Send Automated PDF Invoice (Industrial Requirement)
        try {
            await sendInvoiceEmail(appointmentId)
        } catch (error) {
            console.error("Failed to send automated invoice:", error)
        }

        // 6. Sync to External Calendars (Google/Outlook/Calendly Bridge)
        try {
            await syncAppointmentToExternalCalendar(appointmentId)
        } catch (error) {
            console.error("Failed to sync to external calendar:", error)
        }
    }
  }

  return new NextResponse(null, { status: 200 })
}
