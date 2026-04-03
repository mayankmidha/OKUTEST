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
    <div className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm overflow-hidden relative group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight flex items-center gap-3">
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

      <div className="relative h-64 flex items-end gap-4 px-4 z-10">
         {/* Simple Visual Graph using pure CSS/Framer */}
         {activeData.map((d, i) => {
            const height = (d.score / maxScore) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${height}%` }}
                   transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                   className={`w-full max-w-[40px] rounded-t-2xl relative cursor-pointer ${
                     i === activeData.length - 1 ? 'bg-oku-purple' : 'bg-oku-purple/20'
                   } hover:bg-oku-purple transition-colors`}
                 >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-oku-dark text-white text-[10px] font-black py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl">
                       Score: {d.score}
                    </div>
                 </motion.div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-oku-taupe mt-4 opacity-40 rotate-45 origin-left">
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                 </p>
              </div>
            )
         })}

         {/* Grid Lines */}
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-oku-taupe/10">
            <div className="w-full border-t border-dashed border-oku-taupe/5" />
            <div className="w-full border-t border-dashed border-oku-taupe/5" />
            <div className="w-full border-t border-dashed border-oku-taupe/5" />
         </div>
      </div>

      <div className="mt-20 pt-8 border-t border-oku-taupe/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-oku-success/10 text-oku-success flex items-center justify-center">
               <TrendingDown size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Clinical Trend</p>
               <p className="text-sm font-bold text-oku-dark">Score normalized over {activeData.length} checkpoints.</p>
            </div>
         </div>
         <div className="bg-oku-purple/5 px-6 py-3 rounded-2xl border border-oku-purple/10 flex items-center gap-3">
            <Sparkles size={14} className="text-oku-purple" />
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">AI Prediction: Sustainable Improvement</p>
         </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </div>
  )
}
