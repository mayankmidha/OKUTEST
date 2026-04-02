'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardCheck, ArrowRight, Shield, Zap, Heart, Sparkles, Loader2, Clock, ShieldCheck } from 'lucide-react'
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
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden font-sans">
      {/* Animated Background Architecture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-oku-lavender/40 rounded-full blur-[160px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], y: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-oku-blush/30 rounded-full blur-[140px]"
          />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-32 text-center space-y-10">
            <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-oku-purple-dark shadow-sm inline-block"
            >
              Clinical Marketplace
            </motion.span>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-display text-oku-darkgrey text-7xl md:text-[10rem] leading-[0.8] tracking-tighter"
            >
              Gentle <br />
              <span className="text-oku-purple-dark italic">Insights.</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl text-oku-darkgrey/50 font-display italic leading-relaxed max-w-2xl mx-auto border-l-4 border-oku-purple-dark/10 pl-10"
            >
              Explore clinically validated screeners and premium practitioner-designed assessments.
            </motion.p>
          </div>

          <div className="space-y-40">
            {/* 1. Core Assessments */}
            <section>
              <div className="flex items-center gap-6 mb-20 ml-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-oku-purple-dark/40 shrink-0">Clinical Foundations</h2>
                <div className="h-px w-full bg-oku-purple-dark/10" />
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                {staticAssessments.map((assessment, index) => (
                  <motion.div 
                    key={assessment.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="card-glass-3d !p-12 !bg-white/60 group hover:shadow-2xl transition-all border border-white/80 !rounded-[4rem]"
                  >
                    <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-oku-lavender/40 rounded-3xl flex items-center justify-center text-oku-purple-dark shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <ClipboardCheck size={32} />
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">Completion Time</p>
                            <div className="flex items-center gap-2 justify-end text-oku-darkgrey">
                                <Clock size={14} className="text-oku-purple" />
                                <span className="text-sm font-bold">{assessment.time}</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="heading-display text-4xl text-oku-darkgrey mb-6 tracking-tight">{assessment.title}</h3>
                    <p className="text-lg text-oku-darkgrey/50 italic font-display mb-12 leading-relaxed min-h-[4rem]">{assessment.description}</p>
                    <button 
                      onClick={() => handleBegin(assessment.slug, false)}
                      className="w-full py-6 bg-oku-darkgrey text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-oku-purple-dark transition-all shadow-xl group/btn"
                    >
                      Begin Screening <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 2. Premium / Practitioner Assessments */}
            {dbAssessments.length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-20 ml-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-oku-peach-dark/60 shrink-0">Premium Suite</h2>
                  <div className="h-px w-full bg-oku-peach/20" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {dbAssessments.map((assessment: any, index: number) => (
                    <motion.div 
                      key={assessment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="card-glass-3d !p-12 !bg-oku-dark text-white relative overflow-hidden group shadow-2xl !rounded-[4rem]"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                           <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                              <Sparkles size={32} className="text-oku-lavender" />
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Premium Fee</p>
                              <p className="text-3xl heading-display text-oku-mint">₹{assessment.price}</p>
                           </div>
                        </div>
                        <h3 className="heading-display text-4xl mb-6 leading-tight tracking-tight">{assessment.title}</h3>
                        <p className="text-base text-white/50 mb-12 italic font-display leading-relaxed line-clamp-3">
                          {assessment.description || "In-depth clinical assessment designed for formal diagnostic support and specialized reporting."}
                        </p>
                        <button 
                          onClick={() => handleBegin(assessment.id, true, assessment.id)}
                          className="w-full py-6 bg-white text-oku-dark rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-oku-lavender transition-all group/btn shadow-lg"
                        >
                          Unlock Report <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {isLoading && (
              <div className="flex justify-center py-32">
                <Loader2 className="w-12 h-12 animate-spin text-oku-purple-dark/20" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Bar Footer */}
      <div className="max-w-5xl mx-auto px-12 py-20 border-t border-oku-darkgrey/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700 relative z-10">
          <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-oku-purple-dark" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">Verified Clinical Engine</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey">Privacy by Design &copy; 2026</p>
      </div>
    </div>
  )
}
