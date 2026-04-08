import Link from 'next/link'
import { CheckCircle, Clock3 } from 'lucide-react'
import { RecurringPattern } from '@prisma/client'

import { auth } from '@/auth'
import { normalizeCheckoutType } from '@/lib/checkout'
import { finalizeCheckoutPayment } from '@/lib/payment-finalization'
import { getStripeClient, isStripeConfigured } from '@/lib/stripe'
import { resolveAssessmentCheckoutAssignment } from '@/lib/assessment-checkout'

interface UniversalCheckoutSuccessPageProps {
  searchParams: Promise<{
    id?: string
    type?: string
    session_id?: string
  }>
}

export default async function UniversalCheckoutSuccessPage({
  searchParams,
}: UniversalCheckoutSuccessPageProps) {
  const session = await auth()
  const { id, type = 'APPOINTMENT', session_id: stripeSessionId } = await searchParams
  const normalizedType = normalizeCheckoutType(type)
  const isFreeCheckout = !stripeSessionId
  let paymentSettled = isFreeCheckout
  let primaryHref = '/dashboard/client'
  let primaryLabel = 'Go to Dashboard'

  if (stripeSessionId && isStripeConfigured) {
    try {
      const stripeSession = await getStripeClient().checkout.sessions.retrieve(stripeSessionId)

      if (stripeSession.payment_status === 'paid' && stripeSession.metadata?.paymentId) {
        const result = await finalizeCheckoutPayment({
          paymentId: stripeSession.metadata.paymentId,
          appointmentId: stripeSession.metadata.appointmentId,
          assignmentId: stripeSession.metadata.assignmentId,
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
      }
    } catch (error) {
      console.error('[CHECKOUT_SUCCESS_FINALIZE_ERROR]', error)
    }
  }

  if (normalizedType === 'GROUP_SESSION' && id) {
    primaryHref = `/dashboard/client/circles/${id}`
    primaryLabel = 'Open Circle'
  } else if (normalizedType === 'ASSESSMENT' && id && session?.user?.id) {
    const assignment = await resolveAssessmentCheckoutAssignment(id, session.user.id)

    if (assignment) {
      primaryHref = `/dashboard/client/assessments/${assignment.assessment.id}?assignmentId=${assignment.id}`
      primaryLabel = paymentSettled ? 'Start Assessment' : 'Go to Clinical Record'
    } else {
      primaryHref = '/dashboard/client/clinical'
      primaryLabel = 'Go to Clinical Record'
    }
  } else if (normalizedType === 'APPOINTMENT') {
    primaryHref = '/dashboard/client/book'
    primaryLabel = 'View Booking'
  }

  return (
    <div className="min-h-screen bg-oku-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-2xl text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${
              isFreeCheckout
                ? 'bg-oku-green text-green-700'
                : 'bg-oku-lavender/40 text-oku-purple-dark'
            }`}
          >
            {isFreeCheckout ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <Clock3 className="w-12 h-12" />
            )}
          </div>

          <h1 className="text-4xl font-display font-bold text-oku-dark mb-4 tracking-tighter">
            {paymentSettled ? 'Access Confirmed' : 'Payment Received'}
          </h1>
          <p className="text-oku-taupe font-script text-2xl mb-6">
            {paymentSettled
              ? 'Your purchase is active and ready to use.'
              : 'Your payment was captured. Final confirmation may take a moment.'}
          </p>
          <p className="mb-8 text-sm text-oku-taupe">
            Type: {normalizedType}
            {id ? ` • Reference: ${id}` : ''}
          </p>

          {stripeSessionId && (
            <p className="mb-8 text-xs text-oku-taupe break-all">
              Stripe session: {stripeSessionId}
            </p>
          )}

          <div className="space-y-3">
            <Link
              href={primaryHref}
              className="block w-full py-5 bg-white border border-oku-taupe/10 text-oku-dark rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-oku-cream/70 transition-all"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/dashboard/client"
              className="block w-full py-5 bg-oku-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-xl"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
