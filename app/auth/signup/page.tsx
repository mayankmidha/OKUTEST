'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowRight, User, Mail, Phone, Lock, Heart, Shield } from 'lucide-react'

const roles = [
  {
    label: 'I seek therapy',
    value: 'CLIENT',
    description: 'Book sessions, clinical assessments, and track your care.',
    icon: Heart
  },
  {
    label: 'I am a provider',
    value: 'THERAPIST',
    description: 'Manage clinical practice, appointments, and telehealth.',
    icon: Shield
  },
] as const

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CLIENT',
    location: 'India',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill from session storage (lead nurturing)
  useState(() => {
    if (typeof window !== 'undefined') {
      const pendingTrial = sessionStorage.getItem('pending_trial_booking')
      if (pendingTrial) {
        const data = JSON.parse(pendingTrial)
        setFormData(prev => ({ ...prev, name: data.guestName || '', email: data.guestEmail || '' }))
      }
    }
  })

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

      router.push('/auth/login?message=Welcome to the community! Please sign in.')
    } catch {
      setError('Unable to create account right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream py-24 px-6 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-[100vw] h-[100vw] bg-oku-purple/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-oku-sage/10 rounded-full translate-y-1/2 translate-x-1/4 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Column: Philosophical Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <Link href="/" className="inline-block">
              <img 
                src="/uploads/2025/07/Logoo.png" 
                alt="OKU Therapy" 
                className="h-10 w-auto opacity-80" 
              />
            </Link>
            
            <div className="space-y-8">
              <h1 className="text-7xl font-display font-bold text-oku-dark tracking-tighter leading-[0.85]">
                Begin your <br />
                <span className="italic font-script text-oku-purple lowercase text-6xl md:text-8xl">unfolding</span>.
              </h1>
              <p className="text-xl text-oku-taupe font-display italic max-w-md leading-relaxed opacity-70">
                A sanctuary designed for deep reflection and clinical excellence. Join a collective that honors your journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-md">
               <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-sm">
                  <Shield className="text-oku-purple mb-4 opacity-60" size={28} strokeWidth={1} />
                  <p className="text-sm font-bold text-oku-dark">Privacy First</p>
                  <p className="text-[10px] uppercase tracking-widest text-oku-taupe mt-2 font-black opacity-40">End-to-End Secure</p>
               </div>
               <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-sm">
                  <Heart className="text-oku-pink mb-4 opacity-60" size={28} strokeWidth={1} />
                  <p className="text-sm font-bold text-oku-dark">Care-Centric</p>
                  <p className="text-[10px] uppercase tracking-widest text-oku-taupe mt-2 font-black opacity-40">Clinical Excellence</p>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/50 backdrop-blur-3xl p-12 md:p-16 rounded-[4.5rem] border border-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.04)]"
          >
            {error && (
              <div className="mb-10 p-5 bg-red-50/50 backdrop-blur-sm border border-red-100/50 rounded-3xl text-red-700 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <Lock size={18} strokeWidth={1.5} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Role Selection */}
              <div className="space-y-5">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Intention</label>
                <div className="grid grid-cols-2 gap-6">
                  {roles.map((r) => {
                    const active = formData.role === r.value
                    const Icon = r.icon
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => handleChange('role', r.value)}
                        className={`p-8 rounded-[2.5rem] text-left transition-all duration-500 border relative overflow-hidden group ${
                          active 
                          ? 'bg-oku-dark border-oku-dark text-white shadow-2xl scale-[1.02]' 
                          : 'bg-white/40 border-white text-oku-dark hover:border-oku-purple/30'
                        }`}
                      >
                        <Icon size={24} strokeWidth={1.5} className={`mb-4 relative z-10 transition-colors duration-500 ${active ? 'text-oku-purple' : 'text-oku-taupe/40 group-hover:text-oku-purple'}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">{r.label}</p>
                        <p className={`text-[9px] leading-relaxed relative z-10 transition-colors duration-500 ${active ? 'text-white/50' : 'text-oku-taupe/60'}`}>{r.description}</p>
                        {active && <div className="absolute top-0 right-0 w-24 h-24 bg-oku-purple/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm placeholder:text-oku-taupe/30"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm placeholder:text-oku-taupe/30"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Security</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm placeholder:text-oku-taupe/30"
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-4 opacity-50">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/5 transition-all shadow-sm appearance-none"
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-oku-dark text-white py-6 rounded-full flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-oku-dark/10 hover:bg-oku-purple-dark hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 group mt-4"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={18} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-500" /></>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-oku-taupe opacity-60">
                  Already part of our collective?{' '}
                  <Link href="/auth/login" className="text-oku-purple font-black hover:underline ml-1">
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
