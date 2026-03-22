'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, ShieldCheck, Lock } from 'lucide-react'

export default function V1LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Refined Background Aesthetic */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-oku-purple/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-oku-sage/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] bg-oku-pink/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[160px] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-10">
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-10 w-auto mx-auto opacity-80" 
            />
          </Link>
          <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter mb-4">Welcome Home.</h1>
          <p className="text-oku-taupe font-display italic text-lg opacity-60">Your sanctuary is waiting for you.</p>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.03)]">
          {message && (
            <div className="mb-8 p-5 bg-green-50/50 backdrop-blur-sm border border-green-100/50 rounded-3xl text-green-700 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <ShieldCheck size={18} strokeWidth={1.5} /> {message}
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-5 bg-red-50/50 backdrop-blur-sm border border-red-100/50 rounded-3xl text-red-700 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3"
            >
              <Lock size={18} strokeWidth={1.5} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Identity</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm placeholder:text-oku-taupe/30"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Secret</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm placeholder:text-oku-taupe/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-oku-dark text-white py-6 rounded-full flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-oku-dark/10 hover:bg-oku-purple-dark hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Enter Sanctuary <ArrowRight size={18} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-500" /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-oku-taupe/5 text-center">
            <p className="text-xs text-oku-taupe opacity-60">
              New to our collective?{' '}
              <Link href="/auth/signup" className="text-oku-purple font-black hover:underline ml-1">
                Begin Here
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-12">
            <div className="flex items-center gap-2 opacity-30 grayscale">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">HIPAA Secure</span>
            </div>
            <div className="flex items-center gap-2 opacity-30 grayscale">
                <Lock size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">AES-256</span>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
