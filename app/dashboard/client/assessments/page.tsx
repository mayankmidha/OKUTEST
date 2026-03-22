'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ASSESSMENTS } from '@/lib/assessments'
import { 
  ArrowRight, Search, Sparkles, Brain, 
  Wind, Activity, Heart, Shield, Clock,
  ChevronRight, Filter, Info
} from 'lucide-react'

const categoryIcons: Record<string, any> = {
  'ADHD': Brain,
  'Anxiety & Depression': Heart,
  'Trauma': Shield,
  'Executive Function': Activity,
  'General': Wind,
}

const categories = ['All', 'ADHD', 'Anxiety & Depression', 'Trauma', 'Executive Function', 'General']

export default function ClientAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredAssessments = ASSESSMENTS.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="py-12 px-10">
      {/* Header Section */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-oku-purple/10 rounded-full mb-6">
              <Sparkles size={14} className="text-oku-purple" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-purple">Clinical Intelligence Hub</span>
            </div>
            <h1 className="text-6xl font-display font-bold text-oku-dark tracking-tighter mb-6 leading-none">
              Diagnostic <span className="text-oku-taupe/40 font-script text-5xl lowercase">Record.</span>
            </h1>
            <p className="text-xl text-oku-taupe font-display italic leading-relaxed">
              "Self-awareness is the architect of change. Use these validated screenings to map your landscape and find the right path forward."
            </p>
          </div>
          
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe group-focus-within:text-oku-purple transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search screenings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-oku-taupe/10 rounded-3xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/10 transition-all placeholder:text-oku-taupe/40"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-8 mb-12 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeCategory === cat 
              ? 'bg-oku-dark border-oku-dark text-white shadow-xl scale-105' 
              : 'bg-white border-oku-taupe/10 text-oku-taupe hover:border-oku-purple hover:text-oku-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredAssessments.map((a, index) => {
            const Icon = categoryIcons[a.category] || Wind
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/dashboard/client/assessments/${a.slug}`}>
                  <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-oku-purple/5 transition-all duration-700 hover:-translate-y-2 h-full flex flex-col group relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-oku-purple/10 transition-colors" />
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-oku-purple/10 text-oku-purple flex items-center justify-center transition-all duration-700 group-hover:bg-oku-purple group-hover:text-white shadow-inner">
                        <Icon size={28} strokeWidth={1.5} />
                      </div>
                      <div className="text-right">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-taupe/60 bg-oku-cream-warm/30 px-3 py-1 rounded-full">
                           {a.category}
                         </span>
                         <div className="flex items-center gap-1 mt-2 justify-end text-[9px] text-oku-taupe opacity-40 font-black uppercase tracking-widest">
                            <Clock size={10} />
                            {a.timeEstimate}
                         </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 leading-tight group-hover:text-oku-purple transition-colors relative z-10 tracking-tight">
                      {a.title}
                    </h3>
                    
                    <p className="text-sm text-oku-taupe leading-relaxed mb-10 flex-grow relative z-10 opacity-80 font-medium">
                      {a.description}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-oku-taupe/5 relative z-10">
                       <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-6 h-6 rounded-full bg-oku-cream border-2 border-white flex items-center justify-center text-[8px] font-black text-oku-taupe">
                                 {i}
                               </div>
                             ))}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/60">{a.questionCount} Questions</span>
                       </div>
                       <div className="flex items-center gap-2 text-oku-purple font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-500">
                         Begin <ArrowRight size={14} />
                       </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredAssessments.length === 0 && (
        <div className="py-40 text-center bg-white/40 rounded-[4rem] border-2 border-dashed border-oku-taupe/10">
           <Info className="mx-auto text-oku-taupe/20 mb-6" size={48} strokeWidth={1} />
           <p className="text-2xl font-display font-bold text-oku-taupe/60">No results found for "{searchTerm}"</p>
           <button 
             onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
             className="mt-6 text-oku-purple font-black uppercase tracking-widest text-[10px] hover:underline"
           >
             Clear all filters
           </button>
        </div>
      )}
    </div>
  )
}
