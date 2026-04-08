import { NextResponse } from 'next/server'
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe'
import { headers } from 'next/headers'
import { RecurringPattern } from '@prisma/client'
import { finalizeCheckoutPayment } from '@/lib/payment-finalization'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string

  let event

  try {
    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const appointmentId = session.metadata?.appointmentId
    const assignmentId = session.metadata?.assignmentId
    const paymentId = session.metadata?.paymentId
    const recurringPattern = (session.metadata?.recurringPattern as RecurringPattern) || RecurringPattern.NONE

    if (paymentId && (appointmentId || assignmentId)) {
      await finalizeCheckoutPayment({
        paymentId,
        appointmentId,
        assignmentId,
        recurringPattern,
        externalPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
        checkoutSessionId: session.id,
        processor: 'stripe',
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
