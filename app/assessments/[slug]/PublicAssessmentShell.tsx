'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ArrowRight, Clock, ClipboardCheck } from 'lucide-react'
import type { Assessment } from '@/lib/assessments'

export function PublicAssessmentShell({ assessment }: { assessment: Assessment }) {
  const router = useRouter()

  const handleBegin = () => {
    // Route into the dashboard assessment flow with anonymous mode
    router.push(`/dashboard/client/assessments/${assessment.slug}?mode=anonymous`)
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-mint relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-oku-lavender/30 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-oku-butter/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 pt-48 pb-32 relative z-10">
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60 mb-12"
        >
          <ChevronLeft size={13} /> All Screenings
        </Link>

        <div className="space-y-6 mb-14">
          <span className="chip bg-white/60 border-white/80">{assessment.category}</span>
          <h1 className="heading-display text-oku-darkgrey text-5xl md:text-7xl leading-[0.9] tracking-tight">
            {assessment.title}
          </h1>
          <p className="text-xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-xl border-l-4 border-oku-purple-dark/10 pl-8">
            {assessment.description}
          </p>
        </div>

        <div className="card-glass-3d !p-10 !bg-white/60 mb-10">
          <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/60">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2">Duration</p>
              <div className="flex items-center gap-2 font-bold text-oku-darkgrey">
                <Clock size={14} className="text-oku-purple-dark/60" />
                {assessment.timeEstimate}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2">Questions</p>
              <div className="flex items-center gap-2 font-bold text-oku-darkgrey">
                <ClipboardCheck size={14} className="text-oku-purple-dark/60" />
                {assessment.questionCount}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2">Cost</p>
              <p className="font-bold text-oku-darkgrey">Free</p>
            </div>
          </div>
          <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">
            {assessment.longDescription}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleBegin}
            className="w-full btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-6 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 pulse-cta"
          >
            Begin Screening <ArrowRight size={16} />
          </button>
          <p className="text-center text-[10px] text-oku-darkgrey/30 font-black uppercase tracking-widest">
            Anonymous · No login required · Instant results
          </p>
        </div>

        {/* Safety note for trauma / PHQ-9 severe scores */}
        <div className="mt-12 p-6 bg-white/40 rounded-2xl border border-white/60">
          <p className="text-xs text-oku-darkgrey/50 font-display italic leading-relaxed">
            This screening is for informational purposes and does not constitute a clinical diagnosis.
            If you are in crisis, please call <strong>iCall: 9152987821</strong> or{' '}
            <strong>Vandrevala Foundation: 1860-2662-345</strong> (24/7).
          </p>
        </div>
      </div>
    </div>
  )
}
