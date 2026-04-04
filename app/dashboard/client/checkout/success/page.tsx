import Link from 'next/link'
import { CheckCircle, Clock3 } from 'lucide-react'

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
  const { id, type = 'APPOINTMENT', session_id: stripeSessionId } = await searchParams
  const isFreeCheckout = !stripeSessionId

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
            {isFreeCheckout ? 'Access Confirmed' : 'Payment Received'}
          </h1>
          <p className="text-oku-taupe font-script text-2xl mb-6">
            {isFreeCheckout
              ? 'Your checkout completed without an external payment step.'
              : 'We are waiting for the Stripe webhook before marking this purchase complete.'}
          </p>
          <p className="mb-8 text-sm text-oku-taupe">
            Type: {type}
            {id ? ` • Reference: ${id}` : ''}
          </p>

          {stripeSessionId && (
            <p className="mb-8 text-xs text-oku-taupe break-all">
              Stripe session: {stripeSessionId}
            </p>
          )}

          <div className="space-y-3">
            <Link
              href={id ? `/dashboard/client/checkout?id=${id}&type=${type}` : '/dashboard/client/checkout'}
              className="block w-full py-5 bg-white border border-oku-taupe/10 text-oku-dark rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-oku-cream/70 transition-all"
            >
              Return to Checkout
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
