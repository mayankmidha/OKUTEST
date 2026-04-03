'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[APP_ERROR]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-oku-lavender flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-oku-blush/20 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-oku-peach/20 rounded-full translate-y-1/3 translate-x-1/4 blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-block mb-12">
            <img
              src="/wp-content/wp-content/uploads/2025/07/Logoo.png"
              alt="OKU Therapy"
              className="h-10 w-auto opacity-60 mx-auto"
            />
          </Link>

          <div className="w-24 h-24 rounded-[2.5rem] bg-oku-blush/80 flex items-center justify-center mx-auto mb-8 animate-float-3d">
            <AlertTriangle size={40} strokeWidth={1.5} className="text-oku-darkgrey/60" />
          </div>
        </div>

        <div className="card-glass-3d !bg-white/50 !rounded-[3rem] !p-12 md:!p-16 shadow-2xl">
          <h1 className="heading-display text-4xl md:text-6xl text-oku-darkgrey mb-6 tracking-tight">
            Something went <span className="text-oku-purple-dark italic">wrong.</span>
          </h1>
          <p className="text-lg text-oku-darkgrey/50 italic font-display leading-relaxed mb-12">
            An unexpected error occurred in your sanctuary. Our team has been notified. Please try again or return home.
          </p>

          {error.digest && (
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/20 mb-10">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-5 !px-10 flex items-center justify-center gap-3"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <Link
              href="/"
              className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-5 !px-10 flex items-center justify-center gap-3"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
