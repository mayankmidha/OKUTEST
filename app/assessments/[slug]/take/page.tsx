'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, ArrowLeft, ClipboardCheck, 
  Sparkles, ShieldCheck, Lock, 
  ChevronDown, ChevronUp, Loader2,
  CornerDownLeft, Wind, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { ASSESSMENTS } from '@/lib/assessments'

export default function TypeformAssessmentPlayer() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const assessment = ASSESSMENTS.find(a => a.slug === slug)
  
  const [currentStep, setCurrentStep] = useState(-1) // -1 is intro
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // ── FIX: HIDE GLOBAL HEADER ──
  useEffect(() => {
    // We add a class to the body to hide the global root layout header during this immersive session
    document.body.classList.add('hide-global-header');
    return () => document.body.classList.remove('hide-global-header');
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < (assessment?.questions.length || 0) - 1) {
      setCurrentStep(prev => prev + 1)
    } else if (currentStep !== -1) {
      finishAssessment()
    } else {
      setCurrentStep(0)
    }
  }, [currentStep, assessment])

  const handleBack = useCallback(() => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const selectOption = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setTimeout(() => handleNext(), 400)
  }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || isSyncing) return
      
      if (e.key === 'Enter' && currentStep === -1) handleNext()
      if (e.key === 'ArrowDown') handleNext()
      if (e.key === 'ArrowUp') handleBack()
      
      // Numbers 1-5 for options
      if (currentStep >= 0 && !isFinished) {
        const val = parseInt(e.key)
        if (val >= 1 && val <= (assessment?.options.length || 0)) {
          const option = assessment?.options[val - 1]
          if (option && assessment) {
            selectOption(assessment.questions[currentStep].id, option.value)
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, isFinished, isSyncing, assessment, handleNext, handleBack])

  const finishAssessment = () => {
    setIsSyncing(true)
    const guestData = { slug, answers, completedAt: new Date().toISOString() }
    localStorage.setItem('pending_assessment', JSON.stringify(guestData))
    setTimeout(() => {
        setIsSyncing(false)
        setIsFinished(true)
    }, 1500)
  }

  if (!assessment) return null

  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / assessment.questions.length) * 100

  return (
    <div className="fixed inset-0 bg-oku-cream overflow-hidden font-sans selection:bg-oku-purple/20 flex flex-col">
      
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-full h-full bg-oku-lavender/20 rounded-full blur-[120px]"
          />
      </div>

      {/* ── LOGO / HEADER ── */}
      <div className="relative z-50 p-8 flex justify-between items-center">
          <Link href="/assessments" className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 hover:text-oku-purple-dark transition-colors">
              Oku Therapy
          </Link>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/20">
              <ShieldCheck size={12} /> HIPAA Secure
          </div>
      </div>

      {/* ── MAIN PLAYER ── */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {isSyncing ? (
            <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-oku-purple mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/40">Clinical Analysis in Progress...</p>
            </motion.div>
          ) : !isFinished ? (
            <motion.div 
              key={currentStep === -1 ? 'intro' : `q-${currentStep}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              {currentStep === -1 ? (
                /* INTRO */
                <div className="space-y-10">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark bg-oku-purple/10 px-4 py-1 rounded-full">Assessment</span>
                        <h1 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter leading-tight">
                            {assessment.title.split('(')[0]}
                        </h1>
                        <p className="text-xl md:text-2xl text-oku-darkgrey/50 font-display italic">
                            {assessment.description}
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-start gap-6">
                        <button 
                            onClick={() => setCurrentStep(0)}
                            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-6 text-lg flex items-center gap-4 group"
                        >
                            Start Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                            press <span className="font-bold text-oku-darkgrey/60 border border-oku-darkgrey/20 px-1.5 py-0.5 rounded mx-1">Enter ↵</span>
                        </div>
                    </div>
                </div>
              ) : (
                /* QUESTIONS */
                <div className="space-y-16">
                  <div className="space-y-10">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-6"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-oku-purple/10 border border-oku-purple/20 flex items-center justify-center text-oku-purple-dark text-xl font-black shadow-inner">
                            {currentStep + 1}
                        </div>
                        <div className="h-px flex-1 bg-oku-darkgrey/5" />
                    </motion.div>

                    <div className="space-y-6">
                        <h2 className="heading-display text-4xl md:text-6xl text-oku-darkgrey tracking-tighter leading-[1.1] selection:bg-oku-lavender">
                          {assessment.questions[currentStep].text}
                        </h2>
                        <p className="text-xl text-oku-darkgrey/30 font-display italic">
                            {assessment.timeframe}
                        </p>
                    </div>
                  </div>

                  <div className="grid gap-4 w-full">
                    {assessment.options.map((option, idx) => {
                      const isSelected = answers[assessment.questions[currentStep].id] === option.value;
                      const keyboardKey = idx + 1;
                      
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ x: 10 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectOption(assessment.questions[currentStep].id, option.value)}
                          className={`w-full group p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 text-left relative overflow-hidden ${
                            isSelected 
                              ? 'bg-white border-oku-purple text-oku-darkgrey shadow-[0_20px_50px_-15px_rgba(110,89,165,0.2)] scale-[1.02]' 
                              : 'bg-white/40 border-white/60 hover:bg-white/80 hover:border-white text-oku-darkgrey/60'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[11px] font-black transition-all ${
                            isSelected ? 'bg-oku-purple border-oku-purple text-white shadow-lg' : 'bg-white border-oku-darkgrey/5 text-oku-darkgrey/20 group-hover:border-oku-purple/30'
                          }`}>
                            {keyboardKey}
                          </div>
                          
                          <span className={`text-xl font-bold tracking-tight transition-colors ${isSelected ? 'text-oku-darkgrey' : 'text-oku-darkgrey/70'}`}>
                            {option.label}
                          </span>

                          {isSelected && (
                              <motion.div 
                                layoutId="active-indicator"
                                className="ml-auto w-10 h-10 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple"
                              >
                                  <CheckCircle2 size={20} strokeWidth={3} />
                              </motion.div>
                          )}

                          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      )
                    })}
                  </div>
                  
                  <div className="flex items-center gap-6 pt-10">
                      <button 
                        onClick={handleNext}
                        className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-5 flex items-center gap-3 hover:bg-oku-purple-dark transition-all"
                      >
                          OK <CornerDownLeft size={16} />
                      </button>
                      <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/20">Quick Navigation</span>
                          <span className="text-[10px] font-bold text-oku-darkgrey/40 italic">Press Enter ↵</span>
                      </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* CONVERSION */
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-xl space-y-10">
                <div className="w-20 h-20 bg-oku-mint rounded-3xl flex items-center justify-center text-oku-mint-dark mx-auto shadow-xl">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-4">
                    <h2 className="heading-display text-5xl text-oku-darkgrey tracking-tighter">Insights <span className="text-oku-purple-dark italic">Ready.</span></h2>
                    <p className="text-lg text-oku-darkgrey/50 font-display italic">
                        We've analyzed your responses. To unlock your clinical report, please create your secure sanctuary.
                    </p>
                </div>
                <div className="grid gap-4">
                    <Link href={`/auth/signup?callbackUrl=/assessments/${slug}/results`} className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-6 text-lg pulse-cta flex items-center justify-center gap-3">
                        Unlock My Report <ArrowRight size={20} />
                    </Link>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <img src="/google.svg" className="w-4 h-4" /> Google
                        </button>
                        <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <img src="/apple.svg" className="w-4 h-4" /> Apple
                        </button>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FOOTER CONTROLS ── */}
      <footer className="relative z-50 p-8 flex justify-between items-center">
          <div className="flex bg-white/80 backdrop-blur rounded-xl border border-oku-darkgrey/5 overflow-hidden shadow-sm">
              <button onClick={handleBack} className="p-4 hover:bg-oku-lavender/20 border-r border-oku-darkgrey/5 transition-colors text-oku-darkgrey/40 hover:text-oku-purple-dark">
                  <ChevronUp size={20} />
              </button>
              <button onClick={handleNext} className="p-4 hover:bg-oku-lavender/20 transition-colors text-oku-darkgrey/40 hover:text-oku-purple-dark">
                  <ChevronDown size={20} />
              </button>
          </div>
          <div className="flex flex-col items-end">
              <div className="w-48 h-1 bg-oku-darkgrey/5 rounded-full overflow-hidden mb-2">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-oku-purple" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/20">{Math.round(progress)}% Completed</span>
          </div>
      </footer>
    </div>
  )
}
