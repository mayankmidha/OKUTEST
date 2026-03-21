'use client'

import { useState, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { ASSESSMENTS } from '@/lib/assessments'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, CheckCircle2, Calendar } from 'lucide-react'

export default function SingleAssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const assessment = ASSESSMENTS.find(a => a.slug === slug)
  const [currentStep, setCurrentStep] = useState(-1)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultData, setResultData] = useState<{ score: number, result: string, description: string } | null>(null)
  const [matchedTherapists, setMatchedTherapists] = useState<any[]>([])
  const router = useRouter()

  if (!assessment) {
    return <div>Assessment not found</div>
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
          result: scoringRange.result
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
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-oku-purple/10 text-oku-purple rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-sm uppercase tracking-[0.3em] font-black text-oku-taupe mb-2">Assessment Complete</h2>
              <h1 className="text-4xl font-display font-bold text-oku-dark mb-4">{resultData?.result}</h1>
              <p className="text-xl text-oku-taupe mb-10 font-display italic">
                {resultData?.description}
              </p>

              <div className="bg-oku-purple/5 p-8 rounded-[2rem] mb-10 text-left border border-oku-purple/10">
                <h3 className="font-bold text-oku-dark mb-3">Recommended Next Step</h3>
                <p className="text-oku-taupe leading-relaxed mb-6">
                  Based on your results, we recommend a 15-minute free consultation call with one of our specialized therapists to discuss your symptoms and explore support options.
                </p>
                
                {/* Matched Therapists */}
                {matchedTherapists.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Therapists specialized in {assessment.category}</p>
                    {matchedTherapists.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-oku-taupe/10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-oku-purple/10 overflow-hidden">
                            {t.user.avatar ? <img src={t.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🧘</div>}
                          </div>
                          <span className="font-bold text-oku-dark text-sm">{t.user.name}</span>
                        </div>
                        <Link href={`/book/${t.id}/trial`} className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                          Book Trial
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <Link href="/therapists" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                  <Calendar size={18} /> View All Therapists
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/auth/signup" className="text-oku-purple font-bold hover:underline">
                  Save my results & Create Profile
                </Link>
                <Link href="/assessments" className="text-oku-taupe hover:text-oku-dark transition-colors">
                  Take another assessment
                </Link>
              </div>
            </motion.div>
          ) : currentStep === -1 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl text-center"
            >
              <Link href="/assessments" className="inline-flex items-center gap-2 text-oku-taupe hover:text-oku-dark mb-8 transition-colors">
                <ChevronLeft size={16} /> Back to assessments
              </Link>
              <h1 className="text-4xl font-display font-bold text-oku-dark mb-6 tracking-tighter">{assessment.title}</h1>
              <p className="text-xl text-oku-taupe mb-10 font-display italic">
                "{assessment.description}"
              </p>
              <div className="bg-oku-purple/10 p-8 rounded-[2rem] mb-10 text-left">
                <h3 className="font-bold text-oku-dark mb-2 uppercase tracking-widest text-xs">Clinical Tool</h3>
                <p className="text-sm text-oku-taupe leading-relaxed">
                  This is a standard screening tool used by mental health professionals. Please answer as honestly as possible based on how you've been feeling over the last 2 weeks.
                </p>
              </div>
              <button onClick={handleStart} className="btn-primary w-full py-5">
                Start Screening
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
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe">Question {currentStep + 1} of {assessment.questions.length}</span>
                  <div className="w-32 h-1 bg-oku-cream-warm rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-oku-purple transition-all duration-500" 
                      style={{ width: `${((currentStep + 1) / assessment.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-oku-dark leading-snug">
                  {assessment.questions[currentStep].text}
                </h2>
              </div>

              <div className="space-y-4">
                {assessment.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={isSubmitting}
                    className="w-full text-left p-6 rounded-2xl border border-oku-taupe/10 hover:border-oku-purple hover:bg-oku-purple/5 transition-all group flex justify-between items-center bg-white/50"
                  >
                    <span className="font-bold text-oku-dark group-hover:text-oku-purple transition-colors">{opt.label}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-oku-taupe/20 group-hover:border-oku-purple transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-oku-purple scale-0 group-active:scale-100 transition-transform"></div>
                    </div>
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
