'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage({ params, searchParams }: { params: { sessionId: string }, searchParams: { method: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating the Webhook Trigger
    const triggerWebhook = async () => {
        try {
            await fetch(`/api/payments/webhook-simulator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: params.sessionId, method: searchParams.method })
            })
            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    triggerWebhook()
  }, [params.sessionId, searchParams.method])

  return (
    <div className="min-h-screen bg-oku-cream flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-2xl text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-display font-bold text-oku-dark mb-4 tracking-tighter">Booking Confirmed</h1>
                <p className="text-oku-taupe font-script text-2xl mb-12">Your space is now held for you.</p>
                
                <Link 
                    href="/dashboard"
                    className="block w-full py-5 bg-oku-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-xl"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    </div>
  )
}
