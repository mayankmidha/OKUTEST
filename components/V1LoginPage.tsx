'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'motion/react'
import { Loader2, ArrowRight, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react'

export default function V1LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const oauthError = searchParams.get('error')

  useEffect(() => {
    if (oauthError === 'OAuthAccountNotLinked') {
      setError('This email is already linked to another sign-in method. Try your original login path first.')
    }
  }, [oauthError])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setInfo('')
    setNeedsVerification(false)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.code === 'email_not_verified') {
          setNeedsVerification(true)
          setError('Please verify your email before signing in.')
        } else {
          setError("Invalid email or password. Please try again.")
        }
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

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Enter your email first so we know where to send the verification link.')
      return
    }

    setIsResendingVerification(true)
    setError('')
    setInfo('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Could not resend verification email.')
      }

      setInfo(payload.message || 'If that account exists, a verification email has been sent.')
    } catch (resendError: any) {
      setError(resendError.message || 'Could not resend verification email.')
    } finally {
      setIsResendingVerification(false)
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
            <div className="text-center mb-12">
                <h1 className="heading-display text-5xl text-oku-darkgrey mb-4 tracking-tighter">Welcome <span className="text-oku-purple-dark italic">back.</span></h1>
                <p className="text-sm text-oku-darkgrey/50 font-bold uppercase tracking-widest">Access your sanctuary</p>
            </div>

            {(message || error || info) && (
                <div className={`mb-8 p-5 backdrop-blur-sm border rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 ${error ? 'bg-red-50/50 border-red-100/50 text-red-700' : 'bg-green-50/50 border-green-100/50 text-green-700'}`}>
                    {error ? <Lock size={18} /> : <ShieldCheck size={18} />} {error || info || message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Identity</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-pastel !bg-white/60 !rounded-[2rem] !py-5"
                        placeholder="email@example.com"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40">Security</label>
                        <Link href="/auth/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-pastel !bg-white/60 !rounded-[2rem] !py-5 pr-14"
                            placeholder="Your secure password"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-oku-darkgrey/30 hover:text-oku-purple-dark transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 pulse-cta"
                >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Enter Sanctuary"}
                </button>

                {needsVerification && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="btn-pill-3d bg-white border-white text-oku-darkgrey w-full !py-5"
                  >
                    {isResendingVerification ? (
                      <Loader2 className="animate-spin mx-auto" size={18} />
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                )}

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-oku-darkgrey/5"></span>
                  </div>
                  <div className="relative flex justify-center text-center">
                    <span className="bg-transparent px-6 text-[9px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/20">Continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-4 flex items-center justify-center gap-3 group"
                  >
                    <img src="/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
                    className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-4 flex items-center justify-center gap-3 group"
                  >
                    <img src="/apple.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Apple" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Apple</span>
                  </button>
                </div>
            </form>

            <div className="mt-12 text-center pt-10 border-t border-oku-darkgrey/5">
                <p className="text-xs text-oku-darkgrey/50">
                    New to the collective? 
                    <Link href="/auth/signup" className="text-oku-purple-dark font-black hover:underline ml-2">Begin Journey</Link>
                </p>
            </div>

            <div className="mt-10 flex justify-center items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <ShieldCheck size={14} className="text-oku-purple-dark" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">Protected Login · Privacy First</span>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
