'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, ArrowLeft, ClipboardCheck, 
  Sparkles, ShieldCheck, Brain, Lock, 
  Zap, Heart, ChevronRight, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { ASSESSMENTS } from '@/lib/assessments'

export default function GuestAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const assessment = ASSESSMENTS.find(a => a.slug === slug)
  
  const [currentStep, setCurrentStep] = useState(-1) // -1 is intro
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isFinished, setIsFinished] = useState(false)

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oku-cream">
        <div className="text-center">
          <h1 className="heading-display text-4xl mb-4">Assessment not found.</h1>
          <Link href="/assessments" className="text-oku-purple-dark font-black underline">Return to Hub</Link>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < assessment.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      finishAssessment()
    }
  }

  const handleBack = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const selectOption = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value })
    // Auto-advance after a small delay for better UX
    setTimeout(() => {
      if (currentStep < assessment.questions.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        finishAssessment()
      }
    }, 400)
  }

  const finishAssessment = () => {
    // Store in localStorage for later sync
    const guestData = {
      slug,
      answers,
      completedAt: new Date().toISOString()
    }
    localStorage.setItem('pending_assessment', JSON.stringify(guestData))
    setIsFinished(true)
  }

  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / assessment.questions.length) * 100

  return (
    <div className="min-h-screen bg-oku-mint flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-butter/20 rounded-full blur-[120px]" />

      {/* Progress Bar */}
      {currentStep >= 0 && !isFinished && (
        <div className="fixed top-0 left-0 w-full h-2 bg-white/20 z-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-oku-purple-dark shadow-[0_0_20px_rgba(110,89,165,0.5)]"
          />
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              key={currentStep === -1 ? 'intro' : `q-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl"
            >
              {currentStep === -1 ? (
                /* INTRO SCREEN */
                <div className="card-glass-3d !p-12 !bg-white/60 !rounded-[4rem] text-center shadow-2xl">
                  <div className="w-20 h-20 bg-oku-lavender rounded-3xl flex items-center justify-center text-oku-purple-dark mx-auto mb-10 animate-float-3d">
                    <ClipboardCheck size={40} />
                  </div>
                  <span className="chip bg-oku-purple/10 text-oku-purple-dark mb-6 inline-block">Clinical Screening</span>
                  <h1 className="heading-display text-5xl md:text-7xl text-oku-darkgrey mb-6 tracking-tighter leading-tight">
                    {assessment.title.split('(')[0]}
                  </h1>
                  <p className="text-xl text-oku-darkgrey/60 font-display italic mb-12 max-w-xl mx-auto leading-relaxed">
                    {assessment.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                      <Zap size={14} className="text-oku-purple" /> {assessment.questionCount} Questions
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                      <Heart size={14} className="text-oku-purple" /> {assessment.timeEstimate}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                      <ShieldCheck size={14} className="text-oku-purple" /> Anonymous & Secure
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(0)}
                    className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-16 !py-6 text-lg pulse-cta"
                  >
                    Begin Exploration <ArrowRight className="ml-3" />
                  </button>
                </div>
              ) : (
                /* QUESTION SCREEN */
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple-dark opacity-40">Question {currentStep + 1} of {assessment.questions.length}</p>
                    <h2 className="text-2xl md:text-4xl text-oku-darkgrey font-bold tracking-tight leading-tight">
                      {assessment.questions[currentStep].text}
                    </h2>
                    <p className="text-sm text-oku-darkgrey/40 italic font-display">{assessment.timeframe}</p>
                  </div>

                  <div className="grid gap-4">
                    {assessment.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => selectOption(assessment.questions[currentStep].id, option.value)}
                        className={`group p-8 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between ${
                          answers[assessment.questions[currentStep].id] === option.value
                            ? 'bg-oku-purple-dark border-oku-purple-dark text-white shadow-xl scale-[1.02]'
                            : 'bg-white/60 border-white/80 text-oku-darkgrey hover:border-oku-purple hover:bg-white'
                        }`}
                      >
                        <span className="text-lg font-bold">{option.label}</span>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          answers[assessment.questions[currentStep].id] === option.value
                            ? 'bg-white border-white text-oku-purple-dark'
                            : 'border-oku-darkgrey/10 text-transparent'
                        }`}>
                          <ChevronRight size={18} strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 hover:text-oku-purple-dark transition-colors mx-auto pt-8"
                  >
                    <ArrowLeft size={14} /> Previous Question
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* FINISHED / SIGNUP HOOK SCREEN */
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <div className="card-glass-3d !p-12 !bg-white/80 !rounded-[4rem] text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-oku-mint rounded-3xl flex items-center justify-center text-oku-mint-dark mx-auto mb-10 shadow-lg">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="heading-display text-5xl text-oku-darkgrey mb-6 tracking-tighter leading-tight">
                        Insights <span className="text-oku-purple-dark italic">Ready.</span>
                    </h2>
                    <p className="text-lg text-oku-darkgrey/60 font-display italic mb-10 leading-relaxed">
                        We've analyzed your responses. To protect your clinical privacy and unlock your **Personalized OKU AI Report**, please create your secure sanctuary.
                    </p>

                    <div className="space-y-4 mb-12">
                        <Link 
                          href={`/auth/signup?callbackUrl=/assessments/${slug}/results`}
                          className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 text-lg pulse-cta flex items-center justify-center gap-3"
                        >
                            <Sparkles size={20} /> Unlock My Report <ArrowRight size={20} />
                        </Link>
                        
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-oku-darkgrey/10"></span>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-[9px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/20">Fast Access</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="btn-pill-3d bg-white border-oku-darkgrey/5 text-oku-darkgrey !py-4 flex items-center justify-center gap-2">
                                <img src="/google.svg" className="w-5 h-5" alt="Google" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                            </button>
                            <button className="btn-pill-3d bg-white border-oku-darkgrey/5 text-oku-darkgrey !py-4 flex items-center justify-center gap-2">
                                <img src="/apple.svg" className="w-5 h-5" alt="Apple" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Apple</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-oku-darkgrey/30">
                        <div className="flex items-center gap-2">
                            <Lock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">256-bit HIPAA Encryption</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">Already have an account? <Link href="/auth/login" className="text-oku-purple-dark underline">Sign In</Link></p>
                    </div>
                </div>
                
                {/* Decorative background for finished state */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[80px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
