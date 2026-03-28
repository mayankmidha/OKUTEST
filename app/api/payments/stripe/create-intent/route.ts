import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { normalizeCurrencyCode } from '@/lib/currency'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { amount, sessionId, currency } = await req.json()

    if (!amount || !sessionId) {
      return new NextResponse('Missing amount or sessionId', { status: 400 })
    }
    const normalizedCurrency = normalizeCurrencyCode(currency || 'INR').toLowerCase()

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: normalizedCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id as string,
        sessionId: sessionId as string,
        type: 'session_fee',
        currency: normalizedCurrency,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('[STRIPE_CREATE_INTENT]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
