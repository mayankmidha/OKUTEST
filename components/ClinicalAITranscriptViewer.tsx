'use client'

import { motion } from 'framer-motion'
import { Brain, MessageSquare, TrendingUp, Quote } from 'lucide-react'

interface Transcript {
  id: string
  content: string
  detectedLanguage: string | null
  summary: string | null
  sentiment: string | null
  riskLevel: string | null
  keyInsights: any
  sentimentScores: {
    distress?: number
    hope?: number
    regulation?: number
    engagement?: number
  } | null
  clinicalSignals: any
  adhdSignals: any
  careRecommendations: any
  createdAt: Date
  appointment: {
    startTime: Date
    service: { name: string }
    client: { name: string | null } | null
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
      {transcripts.map((t, i) => {
        const clientName = t.appointment.client?.name || 'Client'

        return (
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
                    <p className="font-bold text-oku-dark text-lg">{clientName}</p>
                    <span className="text-oku-taupe/40 text-xs">•</span>
                    <p className="text-xs font-bold text-oku-taupe">{new Date(t.appointment.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {t.appointment.service.name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                t.sentiment === 'IMPROVING' ? 'bg-green-50 text-green-700' :
                t.sentiment === 'ELEVATED' ? 'bg-amber-50 text-amber-700' :
                t.sentiment === 'DISTRESSED' || t.sentiment === 'AT_RISK' ? 'bg-red-50 text-red-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                <TrendingUp size={12} />
                {t.sentiment || 'STABLE'} PULSE
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                t.riskLevel === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                t.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                t.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                'bg-oku-matcha/40 text-oku-matcha-dark'
              }`}>
                {t.riskLevel || 'LOW'} RISK
              </div>
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-oku-taupe/5 bg-oku-cream/40 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Language</p>
                  <p className="mt-2 text-sm font-bold text-oku-dark">{t.detectedLanguage || 'Unknown'}</p>
                </div>
                <div className="rounded-2xl border border-oku-taupe/5 bg-oku-cream/40 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Signals</p>
                  <p className="mt-2 text-sm font-bold text-oku-dark">
                    {Array.isArray(t.clinicalSignals) ? t.clinicalSignals.length : 0} tracked
                  </p>
                </div>
              </div>

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

              {t.sentimentScores && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Sentiment Map</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Distress', value: t.sentimentScores.distress || 0 },
                      { label: 'Hope', value: t.sentimentScores.hope || 0 },
                      { label: 'Regulation', value: t.sentimentScores.regulation || 0 },
                      { label: 'Engagement', value: t.sentimentScores.engagement || 0 },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-oku-taupe/5 bg-white p-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-oku-taupe">
                          <span>{metric.label}</span>
                          <span>{metric.value}</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-oku-cream overflow-hidden">
                          <div className="h-full rounded-full bg-oku-purple" style={{ width: `${metric.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-oku-cream-warm/20 rounded-[2rem] p-6 border border-oku-taupe/5 relative overflow-hidden">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4 flex items-center gap-2">
                    <MessageSquare size={12} /> Raw Transcript Preview
                 </h4>
                 <div className="max-h-[150px] overflow-y-auto text-[11px] leading-relaxed text-oku-taupe/80 font-mono scrollbar-hide">
                    {t.content}
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {Array.isArray(t.clinicalSignals) && t.clinicalSignals.length > 0 && (
                <div className="rounded-[2rem] border border-oku-taupe/5 bg-white p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Clinical Signals</h4>
                  <div className="flex flex-wrap gap-2">
                    {t.clinicalSignals.map((signal: string, index: number) => (
                      <span key={`${signal}-${index}`} className="rounded-xl bg-oku-ocean/20 px-3 py-2 text-[10px] font-bold text-oku-navy">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(t.adhdSignals) && t.adhdSignals.length > 0 && (
                <div className="rounded-[2rem] border border-oku-taupe/5 bg-oku-lilac/20 p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">ADHD / Executive Function Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {t.adhdSignals.map((signal: string, index: number) => (
                      <span key={`${signal}-${index}`} className="rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-oku-purple-dark border border-oku-purple/10">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(t.careRecommendations) && t.careRecommendations.length > 0 && (
                <div className="rounded-[2rem] border border-oku-taupe/5 bg-oku-matcha/15 p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Care Recommendations</h4>
                  <ul className="space-y-2 text-sm text-oku-dark">
                    {t.careRecommendations.map((item: string, index: number) => (
                      <li key={`${item}-${index}`} className="rounded-2xl bg-white/80 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        )
      })}
    </div>
  )
}
