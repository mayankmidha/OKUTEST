'use client'

import { useState, use, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ASSESSMENTS } from '@/lib/assessments'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, CheckCircle2, Calendar, Loader2, Sparkles } from 'lucide-react'

function AssessmentContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')
  
  const assessment = ASSESSMENTS.find(a => a.slug === slug)
  const [currentStep, setCurrentStep] = useState(-1)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultData, setResultData] = useState<{ score: number, result: string, description: string } | null>(null)
  const [matchedTherapists, setMatchedTherapists] = useState<any[]>([])
  const router = useRouter()

  if (!assessment) {
    return (
        <div className="min-h-screen bg-oku-cream flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-display font-bold text-oku-dark mb-4">Assessment not found</h1>
                <Link href="/assessments" className="text-oku-purple hover:underline">Return to Hub</Link>
            </div>
        </div>
    )
  }

  const handleStart = () => setCurrentStep(0)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    if (currentStep < assessment.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateAndShowResult(newAnswers)
    }
  }

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/therapists/match?category=${encodeURIComponent(assessment.category)}`)
      if (res.ok) {
        const data = await res.json()
        setMatchedTherapists(data)
      }
    } catch (e) {
      console.error("Match fetch failed", e)
    }
  }

  const calculateAndShowResult = async (finalAnswers: number[]) => {
    setIsSubmitting(true)
    const score = finalAnswers.reduce((a, b) => a + b, 0)
    
    const scoringRange = assessment.scoring.find(range => score >= range.min && score <= range.max) 
                         || assessment.scoring[assessment.scoring.length - 1]

    const data = {
      score,
      result: scoringRange.result,
      description: scoringRange.description
    }

    setResultData(data)
    setShowResult(true)
    fetchMatches()

    // Try to save to DB if logged in
    try {
      await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: assessment.title,
          responses: finalAnswers,
          score,
          result: scoringRange.result,
          assignmentId: assignmentId
        })
      })
    } catch (error) {
      // If not logged in, we'll store in session storage for after login/signup
      sessionStorage.setItem('pending_assessment', JSON.stringify({
        type: assessment.title,
        responses: finalAnswers,
        score,
        result: scoringRange.result
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl"
            >
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-oku-purple/10 text-oku-purple rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="4" fill="none" className="text-oku-taupe/10" />
                    <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="289" strokeDashoffset={289 - (289 * resultData!.score / (assessment.questionCount * 4))} className="text-oku-purple transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="text-3xl font-display font-bold text-oku-dark">{resultData?.score}</span>
                </div>
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-2">Clinical Indication</h2>
                <h1 className="text-5xl font-display font-bold text-oku-dark mb-4 tracking-tighter">{resultData?.result}</h1>
                <p className="text-xl text-oku-taupe font-display italic max-w-2xl mx-auto">
                  {resultData?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-oku-purple/5 p-10 rounded-[2.5rem] border border-oku-purple/10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-oku-dark mb-4">Your Next Step</h3>
                    <p className="text-oku-taupe leading-relaxed mb-6">
                      These results indicate you might benefit from professional support. We recommend a brief, free consultation to discuss these feelings in a safe space.
                    </p>
                    <div className="bg-white/50 p-4 rounded-xl border border-oku-taupe/10 mb-8">
                      <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1 flex items-center gap-1"><CheckCircle2 size={12} className="text-oku-purple"/> Clinical Disclaimer</p>
                      <p className="text-xs text-oku-taupe/80 italic leading-snug">This screening is an informational tool and does not serve as a medical or psychological diagnosis.</p>
                    </div>
                  </div>
                  <Link href="/dashboard/client/therapists" className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl mt-auto">
                    <Calendar size={18} /> View All Therapists
                  </Link>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] font-black text-oku-taupe mb-6 ml-2">Matched Specialists</h3>
                  <div className="space-y-4">
                    {matchedTherapists.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-white p-6 rounded-3xl border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-oku-purple/10 overflow-hidden border-2 border-white shadow-sm">
                            {t.user.avatar ? <img src={t.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🧘</div>}
                          </div>
                          <div>
                            <span className="font-bold text-oku-dark text-lg group-hover:text-oku-purple transition-colors">{t.user.name}</span>
                            <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black mt-1">Specialist</p>
                          </div>
                        </div>
                        <Link href={`/book/${t.id}/trial`} className="p-3 bg-oku-cream-warm/50 rounded-full text-oku-dark hover:bg-oku-purple hover:text-white transition-all">
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-oku-taupe/10 text-center">
                    <Link href="/auth/signup" className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                      Save my results & Create Profile
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : currentStep === -1 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl text-center max-w-2xl mx-auto"
            >
              <Link href={assignmentId ? "/dashboard/client/clinical" : "/assessments"} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark mb-10 transition-colors">
                <ChevronLeft size={14} /> Back
              </Link>
              <div className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">{assessment.category}</span>
              </div>
              <h1 className="text-5xl font-display font-bold text-oku-dark mb-6 tracking-tighter">{assessment.title}</h1>
              <p className="text-xl text-oku-taupe mb-12 font-display italic leading-relaxed">
                "{assessment.longDescription || assessment.description}"
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12 text-left">
                <div className="bg-oku-cream-warm/30 p-6 rounded-3xl border border-oku-taupe/5">
                   <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Estimated Time</p>
                   <p className="text-lg font-bold text-oku-dark">{assessment.timeEstimate || '~3 mins'}</p>
                </div>
                <div className="bg-oku-cream-warm/30 p-6 rounded-3xl border border-oku-taupe/5">
                   <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Clinical Items</p>
                   <p className="text-lg font-bold text-oku-dark">{assessment.questions.length}</p>
                </div>
              </div>
              <button onClick={handleStart} className="btn-primary w-full py-5 text-lg shadow-xl">
                Begin Clinical Screening
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl"
            >
              <div className="mb-16">
                <div className="flex justify-between items-end mb-6">
                  <div>
                     <span className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-purple">Course Progress</span>
                     <p className="text-sm font-bold text-oku-dark mt-1">Question {currentStep + 1} of {assessment.questions.length}</p>
                  </div>
                  <span className="text-2xl font-display font-bold text-oku-taupe/40">{Math.round(((currentStep) / assessment.questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-oku-cream-warm rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-oku-dark transition-all duration-700 ease-out" 
                    style={{ width: `${((currentStep) / assessment.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h2 className="text-4xl font-display font-bold text-oku-dark leading-snug mb-12 tracking-tighter">
                {assessment.questions[currentStep].text}
              </h2>

              <div className="grid gap-4">
                {assessment.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={isSubmitting}
                    className="w-full text-left p-6 rounded-[2rem] border-2 border-oku-taupe/10 hover:border-oku-dark hover:bg-oku-dark hover:text-white transition-all duration-300 group flex items-center gap-6 bg-white/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-oku-cream-warm/50 text-oku-taupe group-hover:bg-white/20 group-hover:text-white flex items-center justify-center font-bold transition-colors">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-bold text-lg">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function SingleAssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-oku-cream flex items-center justify-center italic text-oku-taupe">Loading Clinical Module...</div>}>
      <AssessmentContent params={params} />
    </Suspense>
  )
}
