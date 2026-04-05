import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'
import { applyReferralCreditToAppointment } from '@/lib/referrals'
import { getPlatformSettings, getSessionRevenueSplit } from '@/lib/provider-finance'
import { getAppointmentBillingAmount } from '@/lib/pricing'
import { getStripeClient, isStripeConfigured } from '@/lib/stripe'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const sessionId = formData.get('sessionId') as string // This is actually appointmentId based on frontend usage
  const method = formData.get('method') as string
  const recurringPattern = (formData.get('recurringPattern') as string) || 'NONE'

  if (!sessionId) {
    return new NextResponse('Missing session ID', { status: 400 })
  }

  try {
      // Find the appointment to get the base price
      const appointment = await prisma.appointment.findUnique({
        where: { id: sessionId },
        include: {
          service: true,
          practitioner: {
            include: {
              practitionerProfile: true,
            },
          },
        }
      })

      if (!appointment) {
        return new NextResponse('Appointment not found', { status: 404 })
      }

      const appointmentAmount = getAppointmentBillingAmount(appointment)
      
      // MASTER UPGRADE: Enforce Referral Math
      const checkoutSummary = await applyReferralCreditToAppointment(appointment.id)
      const netAmount = checkoutSummary?.netAmount ?? appointmentAmount
      
      const processor = netAmount <= 0 ? 'referral-credit' : method
      const settings = await getPlatformSettings()
      const revenueSplit = getSessionRevenueSplit({
        grossAmount: netAmount,
        practitionerProfile: appointment.practitioner.practitionerProfile,
        settings,
      })

      if (!processor) {
        return new NextResponse('Missing payment method', { status: 400 })
      }

      // Create a Payment record
      const payment = await prisma.payment.create({
        data: {
            userId: session.user.id,
            appointmentId: appointment.id,
            amount: netAmount,
            platformFeePercent: revenueSplit.platformFeePercent,
            platformFeeAmount: revenueSplit.platformFeeAmount,
            practitionerPayoutAmount: revenueSplit.practitionerPayoutAmount,
            processor,
            status: PaymentStatus.PENDING
        }
      })

      const origin = new URL(req.url).origin

      // 1. Handle Referral Credit (Free)
      if (netAmount === 0 || processor === 'referral-credit') {
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.COMPLETED }
        })
        return NextResponse.redirect(new URL(`/dashboard/client/checkout/${sessionId}/success?method=referral-credit`, req.url), 303)
      }

      // 2. Handle Stripe
      if (processor === 'stripe') {
        if (!isStripeConfigured) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.FAILED },
          })
          return new NextResponse('Stripe checkout is not configured for this environment.', { status: 503 })
        }

        const stripe = getStripeClient()
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Session with ${appointment.practitioner.name}`,
                            description: appointment.service.name,
                        },
                        unit_amount: Math.round(netAmount * 100), // cents/paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/dashboard/client/checkout/${sessionId}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/client/checkout/${sessionId}?cancelled=true`,
            metadata: {
                appointmentId: appointment.id,
                paymentId: payment.id,
                userId: session.user.id,
                recurringPattern: recurringPattern,
            },
        })

        if (!stripeSession.url) {
            throw new Error('Failed to create Stripe session URL')
        }

        await prisma.payment.update({
            where: { id: payment.id },
            data: { stripePaymentId: stripeSession.id }
        })

        return NextResponse.redirect(stripeSession.url, 303)
      }

      if (processor === 'razorpay') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        })
        return new NextResponse('Razorpay checkout is not available in this flow yet.', { status: 501 })
      }
      
      return new NextResponse('Unsupported payment processor', { status: 400 })
  } catch (e) {
      console.error('Error initiating payment:', e)
      return new NextResponse('Error initiating payment', { status: 500 })
  }
}
