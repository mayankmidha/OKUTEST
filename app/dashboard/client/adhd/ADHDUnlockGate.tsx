'use client'

import { useState } from 'react'
import { motion as m } from 'motion/react'
import {
  Brain,
  Sparkles,
  Zap,
  Shuffle,
  FileText,
  CalendarCheck,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from 'lucide-react'

const features = [
  {
    icon: <Brain size={22} />,
    label: 'Body Doubling',
    desc: 'Virtual focus companion to help you stay present and grounded.',
  },
  {
    icon: <Sparkles size={22} />,
    label: 'Dopamine Menu',
    desc: 'A personalised list of activities that restore your energy and focus.',
  },
  {
    icon: <FileText size={22} />,
    label: 'Brain Dump',
    desc: 'Capture the swirl instantly so nothing gets lost and your mind can breathe.',
  },
  {
    icon: <Zap size={22} />,
    label: 'AI Task Atomizer',
    desc: 'Break overwhelming tasks into tiny, dopamine-friendly micro-steps.',
  },
  {
    icon: <CalendarCheck size={22} />,
    label: 'Routine Builder',
    desc: 'Gentle morning, afternoon and evening anchors — no rigid schedules.',
  },
  {
    icon: <Shuffle size={22} />,
    label: 'Pomodoro Flow Timer',
    desc: 'High-dopamine sprints with built-in transition support and confetti wins.',
  },
]

export function ADHDUnlockGate() {
  const [messageSent, setMessageSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const askTherapist = async () => {
    setIsSending(true)
    setError(null)
    try {
      // Fetch the client's assigned practitioner to get a receiverId
      const profileRes = await fetch('/api/user/profile')
      if (!profileRes.ok) throw new Error('Could not load your profile.')
      const profile = await profileRes.json()

      const therapistId = profile?.practitionerId ?? profile?.therapistId ?? null
      if (!therapistId) {
        setError("We couldn't find your assigned therapist. Please reach out to them directly.")
        return
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: therapistId,
          content:
            "Hi! I'd love to unlock the ADHD Manager in my dashboard. Could you confirm my ADHD diagnosis so I can access the full executive workspace? Thank you 💜",
        }),
      })

      if (!res.ok) throw new Error('Message failed to send.')
      setMessageSent(true)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-lavender/10 flex flex-col items-center justify-center px-6 py-20">
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl w-full"
      >
        {/* Lock badge */}
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-oku-lavender/60 backdrop-blur-xl border border-white/60 flex items-center justify-center shadow-xl">
            <Lock size={36} className="text-oku-purple-dark" strokeWidth={1.5} />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-5 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">
            ADHD Manager
          </span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-oku-darkgrey tracking-tight leading-[0.9] mt-4">
            Your neurodiverse{' '}
            <span className="text-oku-purple-dark italic">sanctuary</span> awaits.
          </h1>
          <p className="text-lg text-oku-darkgrey/60 font-display leading-relaxed max-w-xl mx-auto">
            The ADHD Manager is a specialised workspace built for executive function support. It
            unlocks after a clinical ADHD assessment confirms a diagnosis — so every tool is
            calibrated for you.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {features.map((f, i) => (
            <m.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              className="flex items-start gap-5 p-7 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl"
            >
              <div className="w-11 h-11 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-oku-darkgrey tracking-tight">{f.label}</p>
                <p className="text-sm text-oku-darkgrey/50 leading-relaxed mt-1">{f.desc}</p>
              </div>
            </m.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/assessments?slug=adhd-screening"
            className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-oku-darkgrey text-white font-bold text-sm tracking-tight hover:bg-oku-purple-dark transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Brain size={18} />
            Take ADHD Assessment
            <ArrowRight size={16} />
          </a>

          {messageSent ? (
            <div className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-oku-mint border border-oku-mint text-oku-darkgrey font-bold text-sm tracking-tight">
              <CheckCircle2 size={18} className="text-green-600" />
              Message sent to your therapist
            </div>
          ) : (
            <button
              onClick={askTherapist}
              disabled={isSending}
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-white/80 backdrop-blur-md border border-oku-lavender text-oku-purple-dark font-bold text-sm tracking-tight hover:bg-oku-lavender transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <MessageSquare size={18} />
              )}
              Ask my therapist to unlock
            </button>
          )}
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 mt-5 font-display">{error}</p>
        )}

        {/* Reassurance note */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-oku-darkgrey/30 uppercase tracking-widest font-black mt-12"
        >
          Unlocked by clinical assessment · No self-diagnosis · Always private
        </m.p>
      </m.div>
    </div>
  )
}
