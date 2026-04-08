import Link from 'next/link'
import { CheckCircle, Clock3 } from 'lucide-react'
import { RecurringPattern } from '@prisma/client'

import { finalizeCheckoutPayment } from '@/lib/payment-finalization'
import { getStripeClient, isStripeConfigured } from '@/lib/stripe'

interface CheckoutSuccessPageProps {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ method?: string; session_id?: string }>
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const [{ sessionId }, { method, session_id: stripeSessionId }] = await Promise.all([
    params,
    searchParams,
  ])

  let paymentSettled = method === 'referral-credit'
  let needsManualReview = false

  if (stripeSessionId && isStripeConfigured) {
    try {
      const stripeSession = await getStripeClient().checkout.sessions.retrieve(stripeSessionId)

      if (stripeSession.payment_status === 'paid' && stripeSession.metadata?.paymentId) {
        const result = await finalizeCheckoutPayment({
          paymentId: stripeSession.metadata.paymentId,
          appointmentId: stripeSession.metadata.appointmentId,
          recurringPattern:
            (stripeSession.metadata.recurringPattern as RecurringPattern | undefined) ??
            RecurringPattern.NONE,
          externalPaymentId:
            typeof stripeSession.payment_intent === 'string'
              ? stripeSession.payment_intent
              : stripeSession.id,
          checkoutSessionId: stripeSession.id,
          processor: 'stripe',
        })

        paymentSettled = result.ok
        needsManualReview = !result.ok && result.reason === 'APPOINTMENT_CONFLICT'
      }
    } catch (error) {
      console.error('[SESSION_CHECKOUT_SUCCESS_FINALIZE_ERROR]', error)
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-2xl text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${
              paymentSettled
                ? 'bg-oku-green text-green-700'
                : 'bg-oku-lavender/40 text-oku-purple-dark'
            }`}
          >
            {paymentSettled ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <Clock3 className="w-12 h-12" />
            )}
          </div>

          <h1 className="text-4xl font-display font-bold text-oku-dark mb-4 tracking-tighter">
            {paymentSettled ? 'Booking Confirmed' : 'Payment Received'}
          </h1>
          <p className="text-oku-taupe font-script text-2xl mb-6">
            {paymentSettled
              ? 'Your session is confirmed and ready in your dashboard.'
              : needsManualReview
                ? 'We captured payment, but this slot needs a manual booking review before it can be confirmed.'
                : 'We are still reconciling this payment before marking the booking confirmed.'}
          </p>

          {stripeSessionId && (
            <p className="mb-8 text-xs text-oku-taupe break-all">
              Stripe session: {stripeSessionId}
            </p>
          )}

          <div className="space-y-3">
            <Link
              href={paymentSettled ? `/dashboard/client/sessions/${sessionId}` : `/dashboard/client/checkout/${sessionId}`}
              className="block w-full py-5 bg-white border border-oku-taupe/10 text-oku-dark rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-oku-cream/70 transition-all"
            >
              {paymentSettled ? 'Open Session' : 'Return to Checkout'}
            </Link>
            <Link
              href="/dashboard/client/sessions"
              className="block w-full py-5 bg-oku-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-xl"
            >
              Open Sessions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
