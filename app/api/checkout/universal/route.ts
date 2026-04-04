import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PaymentStatus, RecurringPattern } from '@prisma/client'
import { applyReferralCreditToAppointment } from '@/lib/referrals'
import { getPlatformSettings, getSessionRevenueSplit } from '@/lib/provider-finance'
import { getAppointmentBillingAmount } from '@/lib/pricing'
import { getStripeClient, isStripeConfigured } from '@/lib/stripe'

/**
 * Universal Checkout Engine
 * Handles: 
 * - APPOINTMENT (Individual, Psychiatrist, Couple Therapy)
 * - GROUP_SESSION (Circles)
 * - ASSESSMENT (Paid diagnostic reports)
 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  const formData = await req.formData()
  const type = (formData.get('type') as string) || 'APPOINTMENT'
  const id = formData.get('id') as string
  const method = formData.get('method') as string
  const recurringPattern = (formData.get('recurringPattern') as string) || 'NONE'

  if (!id) return new NextResponse('Missing entity ID', { status: 400 })

  try {
      let amount = 0
      let description = "Mental Health Service"
      let metadata: any = { type, userId: session.user.id }
      let revenueContext: any = null

      // 1. Resolve Entity & Pricing
      if (type === 'APPOINTMENT') {
          const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: { service: true, practitioner: { include: { practitionerProfile: true } } }
          })
          if (!appointment) return new NextResponse('Appointment not found', { status: 404 })
          
          amount = getAppointmentBillingAmount(appointment)
          description = `Session with ${appointment.practitioner.name} (${appointment.service.name})`
          metadata.appointmentId = appointment.id
          metadata.recurringPattern = recurringPattern
          
          // Apply Referral Credits for Appointments
          const creditSummary = await applyReferralCreditToAppointment(appointment.id)
          amount = creditSummary?.netAmount ?? amount
          revenueContext = { grossAmount: amount, practitionerProfile: appointment.practitioner.practitionerProfile }

      } else if (type === 'GROUP_SESSION') {
          const group = await prisma.appointment.findUnique({
            where: { id, isGroupSession: true }
          })
          if (!group) return new NextResponse('Circle not found', { status: 404 })
          
          amount = group.priceSnapshot || 500
          description = `Join Circle: ${group.notes?.split('|')[0] || 'Therapy Group'}`
          metadata.appointmentId = group.id
          // Circles don't currently use referral credits in this logic (per vision)

      } else if (type === 'ASSESSMENT') {
          const assessment = await prisma.assignedAssessment.findUnique({
            where: { id },
            include: { assessment: true }
          })
          if (!assessment) return new NextResponse('Assessment not found', { status: 404 })
          
          amount = assessment.chargeAmount || assessment.assessment.price || 0
          description = `Premium Assessment: ${assessment.assessment.title}`
          metadata.assignmentId = assessment.id
      }

      // 2. Platform Revenue Split
      const settings = await getPlatformSettings()
      const revenueSplit = revenueContext ? getSessionRevenueSplit({
        ...revenueContext,
        settings,
      }) : { platformFeePercent: 20, platformFeeAmount: amount * 0.2, practitionerPayoutAmount: amount * 0.8 }

      // 3. Create Payment Record
      const payment = await prisma.payment.create({
        data: {
            userId: session.user.id,
            appointmentId: metadata.appointmentId || id, // We use appointmentId field even for assessments/groups for simplicity in this schema
            amount: amount,
            platformFeePercent: revenueSplit.platformFeePercent,
            platformFeeAmount: revenueSplit.platformFeeAmount,
            practitionerPayoutAmount: revenueSplit.practitionerPayoutAmount,
            processor: amount === 0 ? 'referral-credit' : method,
            status: PaymentStatus.PENDING
        }
      })
      metadata.paymentId = payment.id

      // 4. Finalize Payment
      const origin = new URL(req.url).origin

      if (amount === 0) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.COMPLETED } })
        return NextResponse.redirect(new URL(`/dashboard/client/checkout/success?type=${type}&id=${id}`, req.url), 303)
      }

      if (method === 'stripe') {
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
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: description },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/dashboard/client/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=${type}&id=${id}`,
            cancel_url: `${origin}/dashboard/client/checkout?cancelled=true&type=${type}&id=${id}`,
            metadata,
        })
        await prisma.payment.update({ where: { id: payment.id }, data: { stripePaymentId: stripeSession.id } })
        return NextResponse.redirect(stripeSession.url!, 303)
      }

      if (method === 'razorpay') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED },
        })
        return new NextResponse('Razorpay checkout is not available in this flow yet.', { status: 501 })
      }
      
      return new NextResponse('Invalid state', { status: 400 })

  } catch (e) {
      console.error('[UNIVERSAL_CHECKOUT_ERROR]', e)
      return new NextResponse('Checkout initialization failed', { status: 500 })
  }
}
