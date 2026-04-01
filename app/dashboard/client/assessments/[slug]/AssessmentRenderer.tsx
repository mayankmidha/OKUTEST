'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Loader2, Save, Sparkles, CreditCard } from 'lucide-react'
import confetti from 'canvas-confetti'

import { signIn, useSession } from 'next-auth/react'

export function AssessmentRenderer({ assessment, isAuthenticated }: { assessment: any, isAuthenticated: boolean }) {
  const { update } = useSession()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')
  const fee = Number(searchParams.get('fee') || 0)
  const billingStatus = searchParams.get('billing')
  
  // Anonymous account details
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: ''
  })
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const questions = (assessment.questions as any[]) || []
  const currentQ = questions[currentStep]

  const handleSelect = (val: number) => {
    setAnswers({ ...answers, [currentQ.id]: val })
    if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    } else {
        // Assessment finished
        setIsComplete(true)
    }
  }

  const handleAuthenticatedSubmit = async () => {
    setIsSubmitting(true)
    try {
        const res = await fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assessmentId: assessment.id,
                answers,
                assignmentId
            })
        })
        
        if (res.ok) {
            const data = await res.json()
            confetti({ particleCount: 150, spread: 70 })
            
            // If there's a fee and it's not paid yet, go to checkout
            if (fee > 0 && billingStatus === 'PENDING') {
               // Redirect to a specific assessment checkout or session checkout bridge
               // For now, redirect to clinical dashboard with a payment prompt
               router.push(`/dashboard/client/clinical?paymentRequired=true&assessmentId=${assessment.id}&amount=${fee}`)
            } else {
               router.push('/dashboard/client/clinical?success=true')
            }
        }
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleAnonymousSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
        // 1. Create Account
        const registerRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDetails)
        })

        if (!registerRes.ok) {
            const data = await registerRes.json()
            throw new Error(data.message || "Could not create account.")
        }

        // 2. Sign in the user
        const loginRes = await signIn('credentials', {
            email: userDetails.email,
            password: userDetails.password,
            redirect: false
        })

        if (loginRes?.error) throw new Error("Account created but login failed. Please sign in.")

        // 2.1 Refresh local session
        await update()

        // 3. Submit Assessment
        await fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assessmentId: assessment.id,
                answers
            })
        })

        confetti({ particleCount: 200, spread: 100 })
        router.push('/dashboard/client/clinical?success=true&welcome=true')

    } catch (err: any) {
        setError(err.message)
    } finally {
        setIsSubmitting(false)
    }
  }

  if (isComplete && !isAuthenticated) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-pebble !p-16 text-center space-y-10"
        >
            <div className="w-20 h-20 bg-oku-lavender rounded-3xl flex items-center justify-center mx-auto animate-float-3d">
                <Sparkles size={40} className="text-oku-purple-dark" />
            </div>
            <div>
                <h2 className="heading-display text-5xl text-oku-darkgrey mb-4 italic">Sanctuary set.</h2>
                <p className="text-oku-darkgrey/60 font-display italic text-lg">Create your account to view your results and save your clinical profile.</p>
            </div>

            <form onSubmit={handleAnonymousSubmit} className="max-w-md mx-auto space-y-4">
                {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
                <input 
                    required
                    className="input-pastel" 
                    placeholder="Full Name"
                    value={userDetails.name}
                    onChange={e => setUserDetails({...userDetails, name: e.target.value})}
                />
                <input 
                    required
                    type="email"
                    className="input-pastel" 
                    placeholder="Email Address"
                    value={userDetails.email}
                    onChange={e => setUserDetails({...userDetails, email: e.target.value})}
                />
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4 text-left block">Date of Birth</label>
                    <input 
                        required
                        type="date"
                        className="input-pastel" 
                        value={userDetails.dateOfBirth}
                        onChange={e => setUserDetails({...userDetails, dateOfBirth: e.target.value})}
                    />
                </div>
                <input 
                    required
                    type="password"
                    className="input-pastel" 
                    placeholder="Create Password"
                    value={userDetails.password}
                    onChange={e => setUserDetails({...userDetails, password: e.target.value})}
                />
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 mt-6"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Claim My Results'}
                </button>
            </form>
        </motion.div>
    )
  }

  return (
    <div className="card-pebble min-h-[500px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-oku-purple transition-all duration-1000" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
        
        <AnimatePresence mode="wait">
            {!isComplete ? (
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                >
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple mb-4">Question {currentStep + 1} of {questions.length}</p>
                        <h2 className="text-3xl font-display font-bold text-oku-dark leading-tight">{currentQ.text}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQ.options.map((opt: any) => (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`p-8 rounded-[2rem] text-left border transition-all duration-500 ${
                                    answers[currentQ.id] === opt.value
                                    ? 'bg-oku-dark border-oku-dark text-white shadow-2xl scale-[1.02]'
                                    : 'bg-white border-oku-taupe/10 text-oku-dark hover:border-oku-purple/40 hover:bg-oku-purple/5'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{opt.label}</span>
                                    {answers[currentQ.id] === opt.value && <CheckCircle2 size={18} className="text-oku-purple" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <h2 className="heading-display text-4xl mb-8 italic">Ready to finalize?</h2>
                    <button 
                        onClick={handleAuthenticatedSubmit}
                        className="btn-pill-3d bg-oku-darkgrey text-white !py-5 !px-12"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Show My Assessment Summary'}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {!isComplete && (
            <div className="mt-16 flex justify-between items-center pt-8 border-t border-oku-taupe/5">
                <button 
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark disabled:opacity-20"
                >
                    Previous
                </button>
            </div>
        )}
    </div>
  )
}
