'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

const DISMISS_KEY = 'oku_onboarding_dismissed'

type Step = {
  label: string
  href: string
  done: boolean
}

export function PractitionerOnboardingBanner({
  hasBio,
  hasRates,
  hasAvailability,
}: {
  hasBio: boolean
  hasRates: boolean
  hasAvailability: boolean
}) {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [marking, setMarking] = useState(false)
  const [onboarded, setOnboarded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1')
    }
  }, [])

  if (dismissed || onboarded) return null

  const steps: Step[] = [
    { label: 'Account created', href: '/practitioner/profile', done: true },
    { label: 'Complete your profile (bio, rates, specializations)', href: '/practitioner/profile', done: hasBio && hasRates },
    { label: 'Set your availability', href: '/practitioner/schedule', done: hasAvailability },
    { label: 'Await admin verification', href: '/practitioner/profile', done: false },
  ]

  const allDone = hasBio && hasRates && hasAvailability

  const markComplete = async () => {
    setMarking(true)
    try {
      const res = await fetch('/api/practitioner/onboarding-complete', { method: 'POST' })
      const data = await res.json()
      if (data.onboarded) setOnboarded(true)
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="xl:col-span-12 card-glass-3d !p-8 !bg-gradient-to-br from-oku-lavender/60 to-oku-mint/30 !border-oku-lavender">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/50">Getting Started</p>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-oku-lavender text-oku-purple-dark border border-oku-lavender">
              {steps.filter(s => s.done).length}/{steps.length} complete
            </span>
          </div>
          <h3 className="heading-display text-2xl text-oku-darkgrey">Complete Your <span className="text-oku-purple-dark italic">Profile</span></h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-2 rounded-full hover:bg-white/40 transition-all text-oku-darkgrey/40"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => { localStorage.setItem(DISMISS_KEY, '1'); setDismissed(true) }}
            className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 hover:text-oku-darkgrey transition-all"
          >
            Dismiss
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {step.done ? (
                <CheckCircle2 size={16} className="text-oku-purple-dark shrink-0" />
              ) : (
                <Circle size={16} className="text-oku-darkgrey/20 shrink-0" />
              )}
              {step.done ? (
                <span className="text-sm text-oku-darkgrey/50 line-through">{step.label}</span>
              ) : (
                <Link href={step.href} className="text-sm text-oku-darkgrey hover:text-oku-purple-dark transition-colors font-medium">
                  {step.label} →
                </Link>
              )}
            </div>
          ))}

          {allDone && (
            <button
              onClick={markComplete}
              disabled={marking}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-oku-darkgrey text-white text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple-dark transition-all disabled:opacity-60"
            >
              {marking ? <><Loader2 size={12} className="animate-spin" /> Saving…</> : 'Mark Profile Complete'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
