'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, ArrowRight, Mail, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to send reset email right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-lavender flex items-center justify-center p-6 pt-32 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-[100vw] h-[100vw] bg-oku-mint/20 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-oku-blush/30 rounded-full translate-y-1/2 translate-x-1/4 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card-glass-3d !p-12 !bg-white/50 !rounded-[4rem] shadow-2xl">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-oku-mint/60 flex items-center justify-center mx-auto mb-8 animate-float-3d">
                  <ShieldCheck size={36} strokeWidth={1.5} className="text-oku-darkgrey" />
                </div>
                <h1 className="heading-display text-4xl text-oku-darkgrey mb-4 tracking-tighter">
                  Check your <span className="text-oku-purple-dark italic">inbox.</span>
                </h1>
                <p className="text-sm text-oku-darkgrey/50 leading-relaxed mb-10">
                  If an account exists for <strong>{email}</strong>, we&rsquo;ve sent a password reset link. Check your email and spam folder.
                </p>
                <Link
                  href="/auth/login"
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5"
                >
                  <ArrowLeft size={16} className="mr-2" /> Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-12">
                  <h1 className="heading-display text-5xl text-oku-darkgrey mb-4 tracking-tighter">
                    Recover <span className="text-oku-purple-dark italic">access.</span>
                  </h1>
                  <p className="text-sm text-oku-darkgrey/50 font-bold uppercase tracking-widest">
                    We&rsquo;ll send you a reset link
                  </p>
                </div>

                {error && (
                  <div className="mb-8 p-5 bg-red-50/50 backdrop-blur-sm border border-red-100/50 rounded-3xl text-red-700 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <Mail size={18} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-pastel !bg-white/60 !rounded-[2rem] !py-5"
                      placeholder="email@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 pulse-cta"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                      <>Send Reset Link <ArrowRight size={16} className="ml-2" /></>
                    )}
                  </button>
                </form>

                <div className="mt-12 text-center pt-10 border-t border-oku-darkgrey/5">
                  <p className="text-xs text-oku-darkgrey/50">
                    Remembered it?{' '}
                    <Link href="/auth/login" className="text-oku-purple-dark font-black hover:underline ml-1">
                      Sign In
                    </Link>
                  </p>
                </div>

                <div className="mt-10 flex justify-center items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <ShieldCheck size={14} className="text-oku-purple-dark" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">HIPAA Compliant · AES-256 Secure</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
