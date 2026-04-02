'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardCheck, ArrowRight, Shield, Zap, Heart, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

const staticAssessments = [
  {
    slug: 'adhd-asrs',
    title: 'ADHD Screening (ASRS)',
    description: 'Understand your focus, organization, and executive function patterns.',
    time: '5 mins',
    questions: 6,
    price: 0
  },
  {
    slug: 'depression-phq9',
    title: 'PHQ-9 Depression',
    description: 'A clinical standard for measuring your recent mood and energy levels.',
    time: '5 mins',
    questions: 9,
    price: 0
  },
  {
    slug: 'anxiety-gad7',
    title: 'GAD-7 Anxiety',
    description: 'A gentle look at your recent feelings of worry and tension.',
    time: '4 mins',
    questions: 7,
    price: 0
  },
  {
    slug: 'wellness-dass21',
    title: 'Burnout & Stress (DASS-21)',
    description: 'Measure the impact of chronic stress, anxiety, and low mood.',
    time: '8 mins',
    questions: 21,
    price: 0
  }
]

export default function AssessmentsPage() {
  const router = useRouter()
  const [dbAssessments, setDbAssessments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPublicAssessments() {
      try {
        const response = await fetch('/api/assessments/public')
        const data = await response.json()
        setDbAssessments(data)
      } catch (error) {
        console.error("Failed to fetch public assessments", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPublicAssessments()
  }, [])

  const handleBegin = (slug: string, isPaid: boolean, id?: string) => {
    if (isPaid && id) {
      router.push(`/dashboard/client/checkout?type=assessment&id=${id}`)
    } else {
      router.push(`/assessments/${slug}/take`)
    }
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-mint relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-butter/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 text-center">
            <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>
              Public Marketplace
            </span>
            <h1 className="heading-display text-oku-darkgrey text-5xl md:text-8xl leading-[0.85] tracking-tight mb-8">
              Gentle <span className="text-oku-purple-dark italic">Self-Checks.</span>
            </h1>
            <p className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-2xl mx-auto border-l-4 border-oku-purple-dark/10 pl-8">
              Explore our core clinical screeners and premium practitioner-designed assessments.
            </p>
          </div>

          <div className="space-y-24">
            {/* 1. Core Assessments */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple-dark/40 mb-12 ml-4">Standard Clinical Hub</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {staticAssessments.map((assessment, index) => (
                  <motion.div 
                    key={assessment.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-glass-3d !p-8 !bg-white/60 group hover:shadow-2xl transition-all"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-oku-purple-dark/40 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <ClipboardCheck size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-oku-darkgrey mb-3">{assessment.title}</h3>
                    <p className="text-xs text-oku-darkgrey/50 italic font-display mb-8 leading-relaxed">{assessment.description}</p>
                    <button 
                      onClick={() => handleBegin(assessment.slug, false)}
                      className="w-full py-4 bg-oku-darkgrey text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-oku-purple-dark transition-all"
                    >
                      Begin <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 2. Premium / Practitioner Assessments */}
            {dbAssessments.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12 ml-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-peach-dark/60">Premium Diagnostic Suite</h2>
                  <div className="h-px flex-1 bg-oku-peach/20" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {dbAssessments.map((assessment: any, index: number) => (
                    <motion.div 
                      key={assessment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-glass-3d !p-10 !bg-oku-dark text-white relative overflow-hidden group shadow-2xl"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                              <Sparkles size={24} className="text-oku-lavender" />
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Premium</p>
                              <p className="text-lg font-bold text-oku-mint">₹{assessment.price}</p>
                           </div>
                        </div>
                        <h3 className="heading-display text-3xl mb-4 leading-tight">{assessment.title}</h3>
                        <p className="text-sm text-white/50 mb-10 italic font-display leading-relaxed">
                          {assessment.description || "In-depth clinical assessment designed for formal diagnostic support."}
                        </p>
                        <button 
                          onClick={() => handleBegin(assessment.id, true, assessment.id)}
                          className="w-full py-5 bg-white text-oku-dark rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-oku-lavender transition-all group"
                        >
                          Unlock Report <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-oku-purple-dark/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
