'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
  "Thoughts that you would be better off dead or of hurting yourself in some way?"
]

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
]

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 is landing
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStart = () => setCurrentStep(0)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    if (currentStep < PHQ9_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      submitAssessment(newAnswers)
    }
  }

  const submitAssessment = async (finalAnswers: number[]) => {
    setIsLoading(true)
    const score = finalAnswers.reduce((a, b) => a + b, 0)
    
    let result = ""
    if (score <= 4) result = "Minimal depression"
    else if (score <= 9) result = "Mild depression"
    else if (score <= 14) result = "Moderate depression"
    else if (score <= 19) result = "Moderately severe depression"
    else result = "Severe depression"

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "PHQ-9",
          responses: JSON.stringify(finalAnswers),
          score,
          result
        })
      })
      if (res.ok) {
        router.push('/dashboard?assessment=complete')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {currentStep === -1 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl text-center"
            >
              <h1 className="text-4xl font-display font-bold text-oku-dark mb-6 tracking-tighter">Wellness Check-in</h1>
              <p className="text-xl text-oku-taupe mb-10 font-display italic">
                "The first step towards healing is understanding where you are today."
              </p>
              <div className="bg-oku-purple/10 p-8 rounded-[2rem] mb-10 text-left">
                <h3 className="font-bold text-oku-dark mb-2 uppercase tracking-widest text-xs">About this assessment</h3>
                <p className="text-sm text-oku-taupe leading-relaxed">
                  This PHQ-9 (Patient Health Questionnaire) is a clinically validated tool used by mental health professionals to monitor mood and well-being. It takes about 2 minutes to complete.
                </p>
              </div>
              <button onClick={handleStart} className="btn-primary w-full py-5">
                Begin Assessment
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
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe">Question {currentStep + 1} of {PHQ9_QUESTIONS.length}</span>
                  <div className="w-32 h-1 bg-oku-cream-warm rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-oku-purple transition-all duration-500" 
                      style={{ width: `${((currentStep + 1) / PHQ9_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-oku-dark leading-snug">
                  {PHQ9_QUESTIONS[currentStep]}
                </h2>
              </div>

              <div className="space-y-4">
                {OPTIONS.map((opt) => (
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
