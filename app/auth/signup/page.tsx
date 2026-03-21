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
    <div className="min-h-screen bg-oku-cream py-20 px-6 relative overflow-hidden">
      {/* Background aesthetic shapes */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-oku-purple/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Context */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <Link href="/">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
                alt="OKU Therapy" 
                className="h-12 w-auto" 
              />
            </Link>
            
            <div className="space-y-6">
              <h1 className="text-6xl font-display font-bold text-oku-dark tracking-tighter leading-[0.9]">
                Begin your <br />
                <span className="italic font-script text-oku-purple lowercase text-5xl md:text-7xl">journey</span> with us.
              </h1>
              <p className="text-xl text-oku-taupe font-display italic max-w-md leading-relaxed">
                Join our collective of seekers and healers. Your privacy and care are our innermost priorities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/50 p-6 rounded-3xl border border-oku-taupe/5">
                  <Shield className="text-oku-purple mb-3" size={24} />
                  <p className="text-sm font-bold text-oku-dark">Safe Space</p>
                  <p className="text-xs text-oku-taupe mt-1">Fully encrypted data.</p>
               </div>
               <div className="bg-white/50 p-6 rounded-3xl border border-oku-taupe/5">
                  <Heart className="text-oku-purple mb-3" size={24} />
                  <p className="text-sm font-bold text-oku-dark">Human-Led</p>
                  <p className="text-xs text-oku-taupe mt-1">Real therapists, real care.</p>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-white shadow-2xl relative z-10"
          >
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Lock size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Who are you?</label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((r) => {
                    const active = formData.role === r.value
                    const Icon = r.icon
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => handleChange('role', r.value)}
                        className={`p-6 rounded-3xl text-left transition-all border ${
                          active 
                          ? 'bg-oku-dark border-oku-dark text-white shadow-xl scale-105' 
                          : 'bg-oku-cream-warm/20 border-oku-taupe/10 text-oku-dark hover:border-oku-purple/50'
                        }`}
                      >
                        <Icon size={20} className={`mb-3 ${active ? 'text-oku-purple' : 'text-oku-taupe'}`} />
                        <p className="text-xs font-black uppercase tracking-widest mb-1">{r.label}</p>
                        <p className={`text-[10px] leading-relaxed ${active ? 'text-white/60' : 'text-oku-taupe'}`}>{r.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                  placeholder="Min. 6 characters"
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
                  <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-oku-taupe">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-oku-purple font-bold hover:underline ml-1">
                    Sign in securely
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
