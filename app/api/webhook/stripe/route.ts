import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { sendSessionReminder } from '@/lib/notifications'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

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

        // 2. Update Appointment Status
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { 
                status: AppointmentStatus.SCHEDULED, // Or CONFIRMED
                updatedAt: new Date()
            }
        })

        // 3. Trigger immediate notification (optional, but good for UX)
        try {
            await sendSessionReminder(appointmentId)
        } catch (error) {
            console.error("Failed to send initial confirmation reminder:", error)
        }
    }
  }

  return new NextResponse(null, { status: 200 })
}
