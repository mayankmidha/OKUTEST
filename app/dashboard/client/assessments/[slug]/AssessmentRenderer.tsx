'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Loader2, Save } from 'lucide-react'
import confetti from 'canvas-confetti'

export function AssessmentRenderer({ assessment }: { assessment: any }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const questions = (assessment.questions as any[]) || []
  const currentQ = questions[currentStep]

  const handleSelect = (val: number) => {
    setAnswers({ ...answers, [currentQ.id]: val })
    if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
        const res = await fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assessmentId: assessment.id,
                answers
            })
        })
        if (res.ok) {
            confetti({ particleCount: 150, spread: 70 })
            router.push('/dashboard/client/clinical?success=true')
        }
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="card-pebble min-h-[500px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-oku-purple transition-all duration-1000" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
        
        <AnimatePresence mode="wait">
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
        </AnimatePresence>

        <div className="mt-16 flex justify-between items-center pt-8 border-t border-oku-taupe/5">
            <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark disabled:opacity-20"
            >
                Previous
            </button>
            
            {currentStep === questions.length - 1 && (
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || answers[currentQ.id] === undefined}
                    className="btn-pebble bg-oku-dark text-white"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={16} />}
                    Submit Screening
                </button>
            )}
        </div>
    </div>
  )
}
