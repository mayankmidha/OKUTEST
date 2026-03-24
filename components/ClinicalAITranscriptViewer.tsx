'use client'

import { motion } from 'framer-motion'
import { Brain, MessageSquare, TrendingUp, AlertCircle, Quote } from 'lucide-react'

interface Transcript {
  id: string
  content: string
  summary: string | null
  sentiment: string | null
  keyInsights: any
  createdAt: Date
  appointment: {
    startTime: Date
    service: { name: string }
    client: { name: string }
  }
}

export function ClinicalAITranscriptViewer({ transcripts }: { transcripts: Transcript[] }) {
  if (transcripts.length === 0) {
    return (
      <div className="bg-oku-cream/30 border border-dashed border-oku-taupe/20 rounded-[2.5rem] p-12 text-center">
        <Brain className="mx-auto text-oku-taupe/20 mb-4" size={48} />
        <p className="text-oku-taupe font-display italic">No AI-processed transcripts available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {transcripts.map((t, i) => (
        <motion.div 
          key={t.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-[2.5rem] border border-oku-taupe/10 shadow-sm overflow-hidden group"
        >
          <div className="p-8 border-b border-oku-taupe/5 flex justify-between items-center bg-oku-ocean/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-oku-navy text-white flex items-center justify-center shadow-lg">
                <Brain size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-navy">OKU CORE AI ANALYSIS</p>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-oku-dark text-lg">{t.appointment.client.name}</p>
                    <span className="text-oku-taupe/40 text-xs">•</span>
                    <p className="text-xs font-bold text-oku-taupe">{new Date(t.appointment.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {t.appointment.service.name}</p>
                </div>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
              t.sentiment === 'POSITIVE' ? 'bg-green-50 text-green-700' :
              t.sentiment === 'NEGATIVE' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              <TrendingUp size={12} />
              {t.sentiment || 'NEUTRAL'} PULSE
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-3 flex items-center gap-2">
                  <Quote size={12} className="text-oku-purple" /> Clinical Summary
                </h4>
                <p className="text-sm text-oku-dark leading-relaxed italic font-display">
                  {t.summary || "Summary pending OCI processing."}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Key Clinical Insights</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(t.keyInsights) && t.keyInsights.map((insight: string, idx: number) => (
                    <span key={idx} className="bg-oku-purple/10 text-oku-purple-dark text-[10px] font-bold px-4 py-2 rounded-xl border border-oku-purple/10">
                      {insight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-oku-cream-warm/20 rounded-[2rem] p-6 border border-oku-taupe/5 relative overflow-hidden">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4 flex items-center gap-2">
                  <MessageSquare size={12} /> Raw Transcript Preview
               </h4>
               <div className="max-h-[150px] overflow-y-auto text-[11px] leading-relaxed text-oku-taupe/80 font-mono scrollbar-hide">
                  {t.content}
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
