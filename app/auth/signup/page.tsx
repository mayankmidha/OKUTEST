'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowRight, User, Mail, Lock, Shield, Heart, Zap } from 'lucide-react'

const roles = [
  {
    label: 'I seek care',
    value: 'CLIENT',
    description: 'Find a therapist, book sessions, and track your journey.',
    icon: Heart,
  },
  {
    label: 'I provide care',
    value: 'THERAPIST',
    description: 'Manage clinical practice, appointments, and telehealth.',
    icon: Zap,
  },
]

function SignupContent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CLIENT',
    location: 'India',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referralCode: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill from session storage (lead nurturing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingTrial = sessionStorage.getItem('pending_trial_booking')
      if (pendingTrial) {
        const data = JSON.parse(pendingTrial)
        setFormData(prev => ({
          ...prev,
          name: prev.name || data.guestName || '',
          email: prev.email || data.guestEmail || '',
        }))
      }
    }
  }, [])

  useEffect(() => {
    const referralCode = new URLSearchParams(window.location.search).get('ref')
    if (referralCode) {
      setFormData((current) => ({
        ...current,
        referralCode: current.referralCode || referralCode,
      }))
    }
  }, [])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setError(data.error ?? 'Unable to create account.')
        return
      }

      router.push('/auth/login?message=Account created! Please sign in to complete your clinical profile.')
    } catch {
      setError('Unable to create account right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-mint py-24 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-[100vw] h-[100vw] bg-oku-lavender/30 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-oku-blush/20 rounded-full translate-y-1/2 translate-x-1/4 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Philosophical Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block space-y-12"
          >
            <Link href="/" className="inline-block animate-float-3d">
              <img 
                src="/uploads/2025/07/Logoo.png" 
                alt="OKU Therapy" 
                className="h-12 w-auto opacity-80" 
              />
            </Link>
            
            <div className="space-y-8">
              <h1 className="heading-display text-7xl text-oku-darkgrey tracking-tighter leading-[0.85]">
                Begin your <br />
                <span className="text-oku-purple-dark italic text-8xl">unfolding.</span>
              </h1>
              <p className="text-2xl text-oku-darkgrey/60 font-display italic max-w-md leading-relaxed border-l-4 border-oku-purple-dark/10 pl-8">
                A sanctuary designed for deep reflection and clinical excellence. Join a collective that honors your journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-md">
               <div className="card-glass-3d !p-8 !bg-white/40 !rounded-[2.5rem] animate-float-3d">
                  <Shield className="text-oku-purple-dark mb-4 opacity-60" size={32} strokeWidth={1} />
                  <p className="text-sm font-bold text-oku-darkgrey">Privacy First</p>
                  <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40 mt-2 font-black">End-to-End Secure</p>
               </div>
               <div className="card-glass-3d !p-8 !bg-white/40 !rounded-[2.5rem] animate-float-3d" style={{ animationDelay: '0.5s' }}>
                  <Heart className="text-oku-purple-dark mb-4 opacity-60" size={32} strokeWidth={1} />
                  <p className="text-sm font-bold text-oku-darkgrey">Care-Centric</p>
                  <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40 mt-2 font-black">Clinical Excellence</p>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="card-glass-3d !p-12 md:!p-16 !bg-white/50 !rounded-[4rem] shadow-2xl"
          >
            <div className="lg:hidden text-center mb-12">
                <Link href="/" className="inline-block mb-8">
                    <img src="/uploads/2025/07/Logoo.png" alt="OKU" className="h-8 w-auto mx-auto opacity-80" />
                </Link>
                <h1 className="heading-display text-5xl text-oku-darkgrey mb-4">Begin Journey.</h1>
            </div>

            {error && (
              <div className="mb-10 p-5 bg-red-50/50 backdrop-blur-sm border border-red-100/50 rounded-3xl text-red-700 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 animate-shake">
                <Lock size={18} strokeWidth={1.5} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Role Selection */}
              <div className="space-y-5">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Intention</label>
                <div className="grid grid-cols-2 gap-6">
                  {roles.map((r) => {
                    const active = formData.role === r.value
                    const Icon = r.icon
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => handleChange('role', r.value)}
                        className={`p-8 rounded-[2.5rem] text-left transition-all duration-500 border-2 relative overflow-hidden group ${
                          active 
                          ? 'bg-oku-darkgrey border-oku-darkgrey text-white shadow-2xl scale-[1.05]' 
                          : 'bg-white/40 border-white text-oku-darkgrey hover:border-oku-purple-dark/30'
                        }`}
                      >
                        <Icon size={28} strokeWidth={1.5} className={`mb-4 relative z-10 transition-colors duration-500 ${active ? 'text-oku-lavender' : 'text-oku-darkgrey/30 group-hover:text-oku-purple-dark'}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">{r.label}</p>
                        <p className={`text-[9px] leading-relaxed relative z-10 transition-colors duration-500 ${active ? 'text-white/50' : 'text-oku-darkgrey/60 italic'}`}>{r.description}</p>
                        {active && <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="input-pastel !bg-white/60 !py-5"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="input-pastel !bg-white/60 !py-5"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Security</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="input-pastel !bg-white/60 !py-5"
                    placeholder="Min. 6 chars"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 ml-4">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="input-pastel !bg-white/60 !py-5 appearance-none"
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 pulse-cta mt-4"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin mx-auto" />
                ) : (
                  <>Create Account <ArrowRight size={20} className="ml-2" /></>
                )}
              </button>

              <div className="text-center pt-8 border-t border-oku-darkgrey/5">
                <p className="text-xs text-oku-darkgrey/50">
                  Already part of our collective?{' '}
                  <Link href="/auth/login" className="text-oku-purple-dark font-black hover:underline ml-1">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-oku-mint flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-oku-purple-dark opacity-20" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
