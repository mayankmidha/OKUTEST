'use client'

import { useState, useEffect } from 'react'
import { Brain, RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Loader2, Zap } from 'lucide-react'
import type { ClientBehaviourReport } from '@/lib/oku-ai'

type ReportWithCache = ClientBehaviourReport & { cached?: boolean }

const TREND_CONFIG = {
  improving:        { icon: TrendingUp,   color: 'text-green-600',  bg: 'bg-green-50',  label: 'Improving'  },
  declining:        { icon: TrendingDown, color: 'text-red-600',    bg: 'bg-red-50',    label: 'Declining'  },
  stable:           { icon: Minus,        color: 'text-amber-600',  bg: 'bg-amber-50',  label: 'Stable'     },
  volatile:         { icon: AlertTriangle,color: 'text-orange-600', bg: 'bg-orange-50', label: 'Volatile'   },
  insufficient_data:{ icon: Minus,        color: 'text-gray-400',   bg: 'bg-gray-50',   label: 'Not enough data' },
}

export function ClientBehaviourReport({ clientId }: { clientId: string }) {
  const [report, setReport] = useState<ReportWithCache | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cached report from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`behaviour-report-${clientId}`)
    if (stored) {
      try { setReport(JSON.parse(stored)) } catch {}
    }
  }, [clientId])

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/practitioner/clients/${clientId}/behaviour-report`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to generate report')
      const data: ReportWithCache = await res.json()
      setReport(data)
      localStorage.setItem(`behaviour-report-${clientId}`, JSON.stringify(data))
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const trendCfg = report ? (TREND_CONFIG[report.moodTrend] ?? TREND_CONFIG.insufficient_data) : null
  const TrendIcon = trendCfg?.icon ?? Minus

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-oku-dark flex items-center gap-3">
          <Brain className="text-oku-purple" size={24} /> AI Behaviour Report
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-oku-purple/10 hover:bg-oku-purple/20 text-oku-purple text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          {loading ? 'Analysing…' : report ? 'Regenerate' : 'Generate Report'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 mb-4">{error}</div>
      )}

      {!report && !loading && (
        <div className="bg-white/50 border border-dashed border-oku-taupe/20 rounded-3xl p-12 text-center">
          <Brain size={40} className="text-oku-taupe/30 mx-auto mb-4" />
          <p className="text-sm text-oku-taupe italic">Click "Generate Report" to analyse this client's behavioural patterns, mood trends, and engagement using AI.</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe/40 mt-2">Powered by OCI — OKU Clinical Intelligence</p>
        </div>
      )}

      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-oku-taupe/10 text-center">
          <div className="w-16 h-16 bg-oku-lavender rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain size={28} className="text-oku-purple" />
          </div>
          <p className="text-sm font-display italic text-oku-taupe">Analysing mood patterns, assessment history, ADHD logs, and session data…</p>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {report.cached && (
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/40 text-right">Cached report — regenerate for latest data</p>
          )}

          {/* Top row: Engagement + Mood Trend */}
          <div className="grid grid-cols-2 gap-4">
            {/* Engagement Score */}
            <div className="bg-white p-6 rounded-3xl border border-oku-taupe/10 shadow-sm text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe mb-3">Engagement Score</p>
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f0ff" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={report.engagementScore >= 70 ? '#7c3aed' : report.engagementScore >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${report.engagementScore} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-oku-dark">
                  {report.engagementScore}
                </span>
              </div>
              <p className="text-[10px] text-oku-taupe">/100</p>
            </div>

            {/* Mood Trend */}
            <div className={`p-6 rounded-3xl border shadow-sm flex flex-col items-center justify-center gap-3 ${trendCfg?.bg} border-transparent`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe">Mood Trend</p>
              <TrendIcon size={32} className={trendCfg?.color} />
              <p className={`text-sm font-bold ${trendCfg?.color}`}>{trendCfg?.label}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl border border-oku-taupe/10 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-purple mb-3 flex items-center gap-2">
              <Zap size={11} /> Clinical Summary
            </p>
            <p className="text-sm text-oku-dark leading-relaxed italic">"{report.summary}"</p>
          </div>

          {/* Risk Flags */}
          {report.riskFlags.length > 0 && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                <AlertTriangle size={11} /> Risk Flags
              </p>
              <ul className="space-y-1.5">
                {report.riskFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="text-red-400 mt-0.5">•</span> {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patterns + Recommendations */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-oku-taupe/10 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-oku-purple mb-3">Behavioural Patterns</p>
              <ul className="space-y-2">
                {report.patterns.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-oku-dark">
                    <span className="w-5 h-5 rounded-full bg-oku-lavender flex items-center justify-center text-[9px] font-black text-oku-purple shrink-0">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-oku-dark text-white p-6 rounded-3xl shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Recommendations</p>
              <ul className="space-y-2">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                    <CheckCircle2 size={14} className="text-oku-purple shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Session Focus */}
          <div className="bg-oku-lavender/30 border border-oku-lavender/40 p-6 rounded-3xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark mb-2">Next Session Focus</p>
            <p className="text-sm font-bold text-oku-purple-dark">{report.nextSessionFocus}</p>
          </div>
        </div>
      )}
    </section>
  )
}
