'use client'

import { useState } from 'react'
import { Sparkles, Loader2, X, Brain, Activity, Target, ShieldCheck, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface AiCareBriefingButtonProps {
  appointmentId: string
}

export function AiCareBriefingButton({ appointmentId }: AiCareBriefingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [briefing, setBriefing] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchBriefing = async () => {
    setIsOpen(true)
    if (briefing) return // Already fetched
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/practitioner/care-briefing?appointmentId=${appointmentId}`)
      const data = await res.json()
      setBriefing(data.briefing)
    } catch (error) {
      console.error("Failed to fetch briefing", error)
      setBriefing("Error loading clinical briefing.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={fetchBriefing}
        className="flex items-center gap-2 px-5 py-2.5 bg-oku-purple/10 text-oku-purple-dark text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-oku-purple/20 transition-all group"
      >
        <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
        Pre-Session Briefing
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-oku-dark/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-oku-cream rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              {/* Header */}
              <div className="bg-oku-purple-dark p-10 text-white relative overflow-hidden">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-20"
                >
                  <X size={18} />
                </button>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-oku-lavender text-oku-purple-dark text-[9px] font-black uppercase tracking-widest rounded-full">OKU AI Insight</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Pre-Session Briefing</span>
                  </div>
                  <h3 className="heading-display text-4xl tracking-tighter">Clinical <span className="text-oku-lavender italic">Intelligence.</span></h3>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-oku-lavender/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              </div>

              {/* Content */}
              <div className="p-10">
                {isLoading ? (
                  <div className="py-20 text-center space-y-6">
                    <Loader2 size={40} className="animate-spin text-oku-purple mx-auto opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-taupe">Synthesizing clinical signals...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-oku-purple/10 flex items-center justify-center text-oku-purple-dark shrink-0">
                        <Brain size={24} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark/60">Patient Trajectory Summary</h4>
                        <p className="text-lg text-oku-darkgrey/80 font-display italic leading-relaxed">
                          {briefing}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-10 border-t border-oku-darkgrey/5">
                       <div className="text-center space-y-2">
                          <Activity size={16} className="mx-auto text-oku-mint-dark opacity-40" />
                          <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">Mood Logs</p>
                          <p className="text-[9px] font-bold text-oku-darkgrey">Analyzed</p>
                       </div>
                       <div className="text-center space-y-2">
                          <Target size={16} className="mx-auto text-oku-peach-dark opacity-40" />
                          <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">Assessments</p>
                          <p className="text-[9px] font-bold text-oku-darkgrey">Included</p>
                       </div>
                       <div className="text-center space-y-2">
                          <ShieldCheck size={16} className="mx-auto text-oku-purple-dark opacity-40" />
                          <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">HIPAA Data</p>
                          <p className="text-[9px] font-bold text-oku-darkgrey">PII Scrubbed</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 bg-oku-darkgrey text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-oku-dark transition-all"
                    >
                      Enter Session Prepared
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
