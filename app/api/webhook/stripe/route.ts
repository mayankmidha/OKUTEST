import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

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

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    // Handle successful payment
    console.log(`Payment successful for ${session.id}`)
    
    // Logic to update Appointment and Payment records in Prisma
    /*
    await prisma.appointment.update({
      where: { stripePaymentId: session.id },
      data: { status: 'CONFIRMED' }
    })
    */
  }

  return new NextResponse(null, { status: 200 })
}
