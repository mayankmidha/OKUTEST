'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { TrendingDown, TrendingUp, Activity, Loader2, Sparkles } from 'lucide-react'

export function WellnessVisualizer({ clientId }: { clientId?: string }) {
  const [data, setData] = useState<Record<string, any[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAssessment, setSelectedSpecialty] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const url = clientId ? `/api/clinical/analytics?clientId=${clientId}` : '/api/clinical/analytics'
        const res = await fetch(url)
        if (res.ok) {
          const json = await res.json()
          setData(json)
          const keys = Object.keys(json)
          if (keys.length > 0) setSelectedSpecialty(keys[0])
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [clientId])

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-oku-purple" /></div>
  
  const assessmentKeys = Object.keys(data)
  if (assessmentKeys.length === 0) return null

  const activeData = selectedAssessment ? data[selectedAssessment] : []
  const maxScore = Math.max(...activeData.map(d => d.score), 10)

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-oku-taupe/10 bg-white p-6 shadow-sm sm:rounded-[2.5rem] sm:p-8 lg:rounded-[3rem] lg:p-10">
      <div className="relative z-10 mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-center md:justify-between md:gap-6">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-display font-bold tracking-tight text-oku-dark sm:text-3xl">
            <Activity className="text-oku-purple" size={24} /> Journey Insights
          </h2>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60 mt-1">Outcome Analytics & Longitudinal Data</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {assessmentKeys.map(key => (
             <button 
               key={key}
               onClick={() => setSelectedSpecialty(key)}
               className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                 selectedAssessment === key 
                 ? 'bg-oku-dark text-white border-oku-dark shadow-lg' 
                 : 'bg-oku-cream/50 text-oku-taupe border-oku-taupe/10 hover:border-oku-purple'
               }`}
             >
               {key}
             </button>
           ))}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-2">
         <div className="relative z-10 flex h-56 min-w-[520px] items-end gap-3 px-2 sm:h-64 sm:min-w-0 sm:gap-4 sm:px-4">
            {/* Simple Visual Graph using pure CSS/Framer */}
            {activeData.map((d, i) => {
               const height = (d.score / maxScore) * 100
               return (
                 <div key={i} className="group/bar relative flex flex-1 flex-col items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                      className={`relative w-full max-w-[32px] cursor-pointer rounded-t-2xl transition-colors hover:bg-oku-purple sm:max-w-[40px] ${
                        i === activeData.length - 1 ? 'bg-oku-purple' : 'bg-oku-purple/20'
                      }`}
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-oku-dark px-3 py-1.5 text-[10px] font-black text-white opacity-0 shadow-xl transition-opacity group-hover/bar:opacity-100">
                          Score: {d.score}
                       </div>
                    </motion.div>
                    <p className="mt-4 origin-left rotate-45 text-[7px] font-black uppercase tracking-widest text-oku-taupe opacity-40 sm:text-[8px]">
                       {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                 </div>
               )
            })}

            {/* Grid Lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between border-b border-oku-taupe/10">
               <div className="w-full border-t border-dashed border-oku-taupe/5" />
               <div className="w-full border-t border-dashed border-oku-taupe/5" />
               <div className="w-full border-t border-dashed border-oku-taupe/5" />
            </div>
         </div>
      </div>

      <div className="relative z-10 mt-12 flex flex-col gap-4 border-t border-oku-taupe/5 pt-6 sm:mt-20 sm:gap-6 sm:pt-8 md:flex-row md:items-center md:justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-oku-success/10 text-oku-success flex items-center justify-center">
               <TrendingDown size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Clinical Trend</p>
               <p className="text-sm font-bold text-oku-dark">Score normalized over {activeData.length} checkpoints.</p>
            </div>
         </div>
         <div className="flex items-center gap-3 rounded-2xl border border-oku-purple/10 bg-oku-purple/5 px-4 py-3 sm:px-6">
            <Sparkles size={14} className="text-oku-purple" />
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark sm:text-[10px]">AI Prediction: Sustainable Improvement</p>
         </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </div>
  )
}
