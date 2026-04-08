'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react'

const faqs = [
  {
    q: 'How do I book a session with a therapist?',
    a: 'Go to "Browse Collective" or click "Book New Session" from your dashboard. Select a therapist, choose a service, pick a date and time that works for you, and confirm your booking. You will receive a confirmation email immediately.'
  },
  {
    q: 'What happens if I need to reschedule or cancel?',
    a: 'You can reschedule or cancel up to 24 hours before your session at no charge. Sessions cancelled within 24 hours may incur a late cancellation fee as per our policy. Contact our support team if you have an emergency.'
  },
  {
    q: 'How do I join a session on the day?',
    a: 'On your session day, go to the Sessions page (or Dashboard → Upcoming Windows) and click "Join Session Room." The video room will open in your browser — no additional software needed.'
  },
  {
    q: 'Is my data private and secure?',
    a: 'Your data is protected with encrypted transport, access controls, and therapist confidentiality obligations. We do not sell personal data or use therapy content for marketing.'
  },
  {
    q: 'How does the mood tracker help my therapy?',
    a: 'Your mood journal gives you and your therapist a longitudinal picture of your emotional patterns. With consent, your therapist can review trends to personalise their approach and notice early warning signs.'
  },
  {
    q: 'What is the Circles feature?',
    a: 'Circles are facilitated group therapy sessions led by verified practitioners. They are smaller, intimate, and focused on specific themes (anxiety, relationships, grief, etc.). Join at a fraction of the individual session cost.'
  },
  {
    q: 'Can I use insurance to pay for sessions?',
    a: 'We support superbill generation for clients with insurance. Go to the Clinical section of your dashboard to access your superbill, which you can submit to your insurer for reimbursement. Direct billing depends on your plan.'
  },
  {
    q: 'How do I change my therapist?',
    a: 'Browse our Collective from the Therapists page and book a new practitioner whenever you feel ready. We encourage open conversations with your current therapist about your needs — transitions are handled with care.'
  },
]

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${
            open === i
              ? 'card-glass-3d !bg-oku-lavender/40 border-oku-purple-dark/10 shadow-xl'
              : 'bg-white/50 border-white/60 hover:bg-white/70'
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-8 text-left"
          >
            <span className="text-sm font-black text-oku-darkgrey tracking-tight pr-6">{faq.q}</span>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center border border-white shadow-sm">
              {open === i ? (
                <ChevronUp size={14} className="text-oku-purple-dark" />
              ) : (
                <ChevronDown size={14} className="text-oku-darkgrey/40" />
              )}
            </div>
          </button>
          {open === i && (
            <div className="px-8 pb-8">
              <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function ContactForm() {
  const [subject, setSubject] = useState('Booking Issue')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Could not send support message')
      }

      setSubmitted(true)
      setMessage('')
      setSubject('Booking Issue')
    } catch (submissionError: any) {
      setError(submissionError.message || 'Could not send support message')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-6 animate-float-3d">🕊️</div>
        <h3 className="heading-display text-3xl text-oku-darkgrey mb-4">Message Received</h3>
        <p className="text-oku-darkgrey/50 font-display italic">
          Our team will reach out within 24 hours. You're in good hands.
        </p>
        <button
          onClick={() => { setSubmitted(false); setMessage('') }}
          className="btn-pill-3d bg-white border-white text-oku-darkgrey mt-8"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 ml-2">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 text-sm text-oku-darkgrey focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all"
        >
          <option>Booking Issue</option>
          <option>Technical Problem</option>
          <option>Billing Question</option>
          <option>Clinical Feedback</option>
          <option>Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 ml-2">Message</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="How can we hold space for you today?"
          className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 text-sm text-oku-darkgrey font-display italic focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all placeholder:text-oku-darkgrey/20 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm font-bold text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={16} className="mr-3 animate-spin" />
        ) : (
          <Send size={16} className="mr-3" />
        )}
        Send Support Message
      </button>
    </form>
  )
}
