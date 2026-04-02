'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Sparkles, AlertTriangle, ArrowRight, Phone } from 'lucide-react'
import confetti from 'canvas-confetti'
import { signIn, useSession } from 'next-auth/react'

// Compute score from answers map
function computeScore(answers: Record<string, number>): number {
  return Object.values(answers).reduce((sum, v) => sum + v, 0)
}

// Find the scoring band for a score
function getScoringBand(scoring: any[], score: number) {
  return scoring.find((s: any) => score >= s.min && score <= s.max) ?? scoring[scoring.length - 1]
}

export function AssessmentRenderer({ assessment, isAuthenticated }: { assessment: any; isAuthenticated: boolean }) {
  const { update } = useSession()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  // 'questions' | 'results' | 'account' | 'done'
  const [phase, setPhase] = useState<'questions' | 'results' | 'account' | 'done'>('questions')
  const [userDetails, setUserDetails] = useState({ name: '', email: '', password: '', dateOfBirth: '' })
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')
  const fee = Number(searchParams.get('fee') || 0)
  const billingStatus = searchParams.get('billing')

  const questions: any[] = assessment.questions || []
  const options: any[] = assessment.options || []
  const scoring: any[] = assessment.scoring || []
  const timeframe: string = assessment.timeframe || ''
  const highRiskThreshold: number | undefined = assessment.highRiskThreshold

  const currentQ = questions[currentStep]
  const score = computeScore(answers)
  const band = getScoringBand(scoring, score)
  const isHighRisk = highRiskThreshold !== undefined && score >= highRiskThreshold

  const handleSelect = (val: number) => {
    const updated = { ...answers, [currentQ.id]: val }
    setAnswers(updated)
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 280)
    } else {
      // All questions answered — show results
      confetti({ particleCount: 80, spread: 55, origin: { y: 0.7 } })
      setTimeout(() => setPhase('results'), 350)
    }
  }

  const handleSaveResults = async () => {
    if (!isAuthenticated) {
      setPhase('account')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessment.id, answers, assignmentId }),
      })
      if (res.ok) {
        if (fee > 0 && billingStatus === 'PENDING') {
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
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      })
      if (!registerRes.ok) {
        const data = await registerRes.json()
        throw new Error(data.message || 'Could not create account.')
      }
      const loginRes = await signIn('credentials', {
        email: userDetails.email,
        password: userDetails.password,
        redirect: false,
      })
      if (loginRes?.error) throw new Error('Account created but login failed. Please sign in.')
      await update()
      await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessment.id, answers }),
      })
      confetti({ particleCount: 200, spread: 100 })
      router.push('/dashboard/client/clinical?success=true&welcome=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── PHASE: Results ───────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-pebble !p-10 space-y-8"
      >
        {/* Score display */}
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple mb-4">Your Result</p>
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-oku-lavender/30 border-4 border-oku-lavender mb-4">
            <span className="heading-display text-5xl text-oku-darkgrey">{score}</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-oku-darkgrey mb-2">{band?.result}</h2>
          <p className="text-oku-darkgrey/60 font-display italic text-base max-w-md mx-auto leading-relaxed">{band?.description}</p>
        </div>

        {/* High risk crisis note */}
        {isHighRisk && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Your score indicates significant distress</p>
              <p className="text-xs text-red-600 leading-relaxed">
                Please reach out for support now. <strong>iCall: 9152987821</strong> or{' '}
                <strong>Vandrevala Foundation: 1860-2662-345</strong> (24/7, free).
              </p>
              <a href="tel:9152987821" className="inline-flex items-center gap-1 mt-3 text-xs font-black uppercase tracking-widest text-red-600 hover:underline">
                <Phone size={11} /> Call Now
              </a>
            </div>
          </div>
        )}

        {/* Scoring bands legend */}
        <div className="grid grid-cols-2 gap-2">
          {scoring.map((s: any) => (
            <div
              key={s.result}
              className={`px-4 py-3 rounded-2xl border text-center transition-all ${
                s.result === band?.result
                  ? 'bg-oku-darkgrey text-white border-oku-darkgrey'
                  : 'bg-white/50 text-oku-darkgrey/40 border-oku-taupe/10'
              }`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest">{s.result}</p>
              <p className="text-[10px] opacity-60 mt-0.5">{s.min}–{s.max}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveResults}
          disabled={isSubmitting}
          className="w-full btn-pill-3d bg-oku-darkgrey text-white !py-5 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Save Report & View Clinical Profile</>}
        </button>
        <p className="text-center text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">
          {isAuthenticated ? 'Results saved to your clinical record' : 'Create a free account to save your results'}
        </p>
      </motion.div>
    )
  }

  // ─── PHASE: Account creation (anonymous) ─────────────────────────────────
  if (phase === 'account') {
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
          <h2 className="heading-display text-5xl text-oku-darkgrey mb-4 italic">One step left.</h2>
          <p className="text-oku-darkgrey/60 font-display italic text-lg">
            Create your free account to save your <strong>{band?.result}</strong> result and access your clinical profile.
          </p>
        </div>
        <form onSubmit={handleAnonymousSubmit} className="max-w-md mx-auto space-y-4 text-left">
          {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
          <input required className="input-pastel" placeholder="Full Name" value={userDetails.name} onChange={e => setUserDetails({ ...userDetails, name: e.target.value })} />
          <input required type="email" className="input-pastel" placeholder="Email Address" value={userDetails.email} onChange={e => setUserDetails({ ...userDetails, email: e.target.value })} />
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4 block">Date of Birth</label>
            <input required type="date" className="input-pastel" value={userDetails.dateOfBirth} onChange={e => setUserDetails({ ...userDetails, dateOfBirth: e.target.value })} />
          </div>
          <input required type="password" className="input-pastel" placeholder="Create Password" value={userDetails.password} onChange={e => setUserDetails({ ...userDetails, password: e.target.value })} />
          <button type="submit" disabled={isSubmitting} className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 mt-6">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Claim My Results'}
          </button>
        </form>
      </motion.div>
    )
  }

  // ─── PHASE: Questions ─────────────────────────────────────────────────────
  return (
    <div className="card-pebble min-h-[500px] flex flex-col justify-center relative overflow-hidden">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-oku-purple transition-all duration-700"
        style={{ width: `${((currentStep) / questions.length) * 100}%` }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-10"
        >
          {/* Timeframe preamble */}
          {timeframe && (
            <p className="text-[11px] font-black uppercase tracking-widest text-oku-purple/70 bg-oku-lavender/20 px-4 py-2 rounded-full inline-block">
              {timeframe}
            </p>
          )}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple/50 mb-3">
              Question {currentStep + 1} of {questions.length}
            </p>
            <h2 className="text-3xl font-display font-bold text-oku-dark leading-tight">{currentQ.text}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`p-8 rounded-[2rem] text-left border transition-all duration-300 ${
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
      </AnimatePresence>

      <div className="mt-16 flex justify-between items-center pt-8 border-t border-oku-taupe/5">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark disabled:opacity-20"
        >
          ← Previous
        </button>
        <span className="text-[10px] text-oku-taupe/30 font-black uppercase tracking-widest">
          {Object.keys(answers).length}/{questions.length} answered
        </span>
      </div>
    </div>
  )
}
