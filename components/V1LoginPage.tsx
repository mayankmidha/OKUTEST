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
      {/* Background aesthetic shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oku-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-oku-purple/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-12 w-auto mx-auto" 
            />
          </Link>
          <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tighter mb-3">Welcome back.</h1>
          <p className="text-oku-taupe font-display italic">Secure access to your sanctuary.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-2xl relative z-10">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} /> {message}
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <Lock size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe">Password</label>
                <Link href="#" className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-purple hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-oku-taupe/5 text-center">
            <p className="text-sm text-oku-taupe">
              New to Oku?{' '}
              <Link href="/auth/signup" className="text-oku-purple font-bold hover:underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe opacity-40">
          Secure & Encrypted • HIPAA Compliant
        </p>
      </motion.div>
    </div>
  )
}
