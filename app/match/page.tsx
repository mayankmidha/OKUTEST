'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, Heart, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react'

const TOPICS = [
  { id: 'anxiety', label: 'Anxiety & Worry', emoji: '🌀' },
  { id: 'depression', label: 'Low Mood / Depression', emoji: '🌧️' },
  { id: 'adhd', label: 'ADHD & Focus', emoji: '⚡' },
  { id: 'trauma', label: 'Trauma & PTSD', emoji: '🌱' },
  { id: 'relationships', label: 'Relationships', emoji: '💛' },
  { id: 'identity', label: 'Identity & Self', emoji: '🪞' },
  { id: 'grief', label: 'Grief & Loss', emoji: '🕊️' },
  { id: 'stress', label: 'Work Stress & Burnout', emoji: '🔥' },
]

const APPROACHES = [
  { id: 'any', label: 'No preference', emoji: '🌿' },
  { id: 'cbt', label: 'CBT / Structured', emoji: '🧩' },
  { id: 'psychodynamic', label: 'Depth / Psychodynamic', emoji: '🌊' },
  { id: 'somatic', label: 'Somatic / Body-based', emoji: '🌸' },
  { id: 'narrative', label: 'Narrative Therapy', emoji: '📖' },
  { id: 'mindfulness', label: 'Mindfulness-based', emoji: '☀️' },
]

const EXPERIENCE_PREFS = [
  { id: 'any', label: 'Open to all' },
  { id: 'newer', label: '2–5 years (often more affordable)' },
  { id: 'experienced', label: '5–10 years' },
  { id: 'senior', label: '10+ years (senior specialists)' },
]

const FREQUENCY = [
  { id: 'weekly', label: 'Weekly', sub: 'Consistent support' },
  { id: 'biweekly', label: 'Every 2 weeks', sub: 'Balanced pace' },
  { id: 'monthly', label: 'Monthly', sub: 'Check-ins & growth' },
  { id: 'unsure', label: 'Not sure yet', sub: 'We can figure it out' },
]

const STEPS = [
  { id: 'topic', question: "What brings you here today?", sub: "Select all that apply", multi: true },
  { id: 'approach', question: "Any therapeutic approach you'd like?", sub: "What feels right to you", multi: false },
  { id: 'experience', question: "Therapist experience level?", sub: "All are verified and licensed", multi: false },
  { id: 'frequency', question: "How often would you like to meet?", sub: "You can always adjust later", multi: false },
]

type Answers = {
  topic: string[]
  approach: string
  experience: string
  frequency: string
}

const INITIAL_ANSWERS: Answers = {
  topic: [],
  approach: '',
  experience: '',
  frequency: '',
}

function buildMatchURL(answers: Answers): string {
  const params = new URLSearchParams()
  if (answers.topic.length > 0) params.set('specialty', answers.topic[0])
  if (answers.approach && answers.approach !== 'any') params.set('approach', answers.approach)
  if (answers.experience && answers.experience !== 'any') params.set('experience', answers.experience)
  params.set('matched', '1')
  return `/therapists?${params.toString()}`
}

export default function MatchPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS)
  const [done, setDone] = useState(false)

  const currentStep = STEPS[step]
  const totalSteps = STEPS.length

  const toggleTopic = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      topic: prev.topic.includes(id)
        ? prev.topic.filter((t) => t !== id)
        : [...prev.topic, id],
    }))
  }

  const setSingle = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const canAdvance = () => {
    if (step === 0) return answers.topic.length > 0
    if (step === 1) return !!answers.approach
    if (step === 2) return !!answers.experience
    if (step === 3) return !!answers.frequency
    return false
  }

  const advance = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    const matchURL = buildMatchURL(answers)
    return (
      <div className="oku-page-public min-h-screen bg-oku-cream flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-oku-lavender/30 rounded-full blur-[150px]" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-oku-mint/20 rounded-full blur-[140px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-lg mx-auto px-6"
        >
          <div className="w-20 h-20 bg-oku-purple-dark/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles size={36} className="text-oku-purple-dark" />
          </div>
          <h1 className="heading-display text-5xl text-oku-darkgrey tracking-tighter mb-4">
            Your matches <span className="text-oku-purple-dark italic">are ready.</span>
          </h1>
          <p className="text-oku-darkgrey/50 font-display italic mb-12 text-lg leading-relaxed">
            We've filtered our collective based on your needs. Browse your matches and book a free consult.
          </p>
          <div className="space-y-4">
            <Link
              href={matchURL}
              className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-5 text-[11px] inline-flex items-center gap-3 pulse-cta w-full justify-center"
            >
              See My Matched Therapists <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => { setStep(0); setAnswers(INITIAL_ANSWERS); setDone(false) }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors mx-auto"
            >
              <RefreshCw size={12} /> Start Over
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-oku-lavender/30 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-oku-mint/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-32">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="w-8 h-8 bg-white/60 border border-white rounded-full flex items-center justify-center text-oku-darkgrey/60 hover:text-oku-darkgrey transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          <div className="flex gap-2 flex-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-500 ${i <= step ? 'bg-oku-purple-dark' : 'bg-oku-darkgrey/10'}`}
              />
            ))}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">
            {step + 1}/{totalSteps}
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Heart size={14} className="text-oku-purple-dark" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/40">{currentStep.sub}</span>
              </div>
              <h2 className="heading-display text-4xl md:text-5xl text-oku-darkgrey tracking-tighter leading-[0.9]">
                {currentStep.question}
              </h2>
            </div>

            {/* Topic Selection */}
            {step === 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TOPICS.map((t) => {
                  const selected = answers.topic.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopic(t.id)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        selected
                          ? 'border-oku-purple-dark bg-oku-lavender/30 shadow-lg scale-[1.03]'
                          : 'border-white/60 bg-white/50 hover:border-oku-purple-dark/30'
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey text-center leading-tight">{t.label}</span>
                      {selected && <CheckCircle2 size={14} className="text-oku-purple-dark" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Approach */}
            {step === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {APPROACHES.map((a) => {
                  const selected = answers.approach === a.id
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSingle('approach', a.id)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        selected
                          ? 'border-oku-purple-dark bg-oku-lavender/30 shadow-lg scale-[1.03]'
                          : 'border-white/60 bg-white/50 hover:border-oku-purple-dark/30'
                      }`}
                    >
                      <span className="text-2xl">{a.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey text-center leading-tight">{a.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Experience */}
            {step === 2 && (
              <div className="space-y-3">
                {EXPERIENCE_PREFS.map((e) => {
                  const selected = answers.experience === e.id
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSingle('experience', e.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selected
                          ? 'border-oku-purple-dark bg-oku-lavender/30 shadow-lg'
                          : 'border-white/60 bg-white/50 hover:border-oku-purple-dark/30'
                      }`}
                    >
                      <span className="text-sm font-bold text-oku-darkgrey">{e.label}</span>
                      {selected && <CheckCircle2 size={16} className="text-oku-purple-dark" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Frequency */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                {FREQUENCY.map((f) => {
                  const selected = answers.frequency === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSingle('frequency', f.id)}
                      className={`flex flex-col items-start gap-1 p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selected
                          ? 'border-oku-purple-dark bg-oku-lavender/30 shadow-lg scale-[1.02]'
                          : 'border-white/60 bg-white/50 hover:border-oku-purple-dark/30'
                      }`}
                    >
                      <span className="font-bold text-oku-darkgrey text-base">{f.label}</span>
                      <span className="text-[10px] text-oku-darkgrey/50 font-display italic">{f.sub}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: canAdvance() ? 1 : 0.3 }}
        >
          <button
            onClick={advance}
            disabled={!canAdvance()}
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-5 text-[11px] inline-flex items-center gap-3 disabled:cursor-not-allowed"
          >
            {step === totalSteps - 1 ? 'Find My Matches' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
