'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Link from 'next/link'
import { ASSESSMENTS } from '@/lib/assessments'
import { ArrowRight, ClipboardCheck, Brain, Wind, Activity } from 'lucide-react'

const icons: Record<string, any> = {
  'Mood': ClipboardCheck,
  'Anxiety': Wind,
  'Neurodivergence': Brain,
  'OCD': Activity,
}

export default function AssessmentsListPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold text-oku-dark mb-6 tracking-tighter"
          >
            Mental Health Assessments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-oku-taupe max-w-2xl mx-auto font-display italic"
          >
            "Self-awareness is the first step toward positive change. Take a clinically-validated assessment to understand your mental well-being."
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ASSESSMENTS.map((assessment, index) => {
            const Icon = icons[assessment.category] || ClipboardCheck
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/assessments/${assessment.slug}`}>
                  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 rounded-2xl bg-oku-purple/10 text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-colors duration-500">
                        <Icon size={28} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe/50 bg-oku-cream-warm/30 px-3 py-1 rounded-full">
                        {assessment.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-oku-dark mb-3 group-hover:text-oku-purple transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-oku-taupe mb-8 flex-grow">
                      {assessment.description}
                    </p>
                    <div className="flex items-center text-oku-purple font-bold gap-2">
                      Start Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
