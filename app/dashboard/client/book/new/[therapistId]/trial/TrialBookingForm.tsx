'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Calendar, AlertCircle } from 'lucide-react'

interface Slot {
  date: string;
  label: string;
  times: { iso: string; label: string }[];
}

interface TrialBookingFormProps {
  practitionerId: string;
  slots: Slot[];
  isLoggedIn: boolean;
  userEmail?: string;
  userName?: string;
}

export default function TrialBookingForm({ practitionerId, slots, isLoggedIn, userEmail, userName }: TrialBookingFormProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [name, setName] = useState(userName || '')
  const [email, setEmail] = useState(userEmail || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/book/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practitionerId,
          startTime: selectedSlot,
          guestName: isLoggedIn ? undefined : name,
          guestEmail: isLoggedIn ? undefined : email,
        })
      })

      if (res.ok) {
        setIsSuccess(true)
        if (!isLoggedIn) {
          sessionStorage.setItem('pending_trial_booking', JSON.stringify({
            practitionerId,
            startTime: selectedSlot,
            guestName: name,
            guestEmail: email
          }))
        }
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Something went wrong. Please try another slot.')
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('Failed to book trial call. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-12 rounded-card border border-oku-taupe/10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-oku-purple/10 text-oku-purple rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-display font-bold text-oku-dark mb-4">Trial Call Requested!</h2>
        <p className="text-oku-taupe mb-10 leading-relaxed">
          Your 15-minute consultation has been scheduled. You'll receive a calendar invite shortly.
        </p>
        {!isLoggedIn && (
          <div className="bg-oku-cream-warm/30 p-8 rounded-2xl mb-8">
            <p className="text-sm text-oku-dark font-bold mb-4 uppercase tracking-widest">Next Step</p>
            <p className="text-sm text-oku-taupe mb-6">Create an account to manage your booking and complete your intake form.</p>
            <button 
              onClick={() => router.push('/auth/signup')}
              className="btn-primary w-full py-4"
            >
              Sign Up Now
            </button>
          </div>
        )}
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-oku-taupe hover:text-oku-dark font-bold transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-card border border-oku-taupe/10 shadow-xl">
      <h3 className="text-2xl font-display font-bold text-oku-dark mb-8">Select a Time</h3>
      
      {!isLoggedIn && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Your Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 p-4 rounded-xl focus:outline-none focus:border-oku-purple"
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 p-4 rounded-xl focus:outline-none focus:border-oku-purple"
              placeholder="email@example.com"
            />
          </div>
        </div>
      )}

      <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {slots.map((day, idx) => (
          <div key={idx}>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe mb-4 sticky top-0 bg-white py-1">
              {day.label}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {day.times.map((time, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => setSelectedSlot(time.iso)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedSlot === time.iso 
                    ? 'bg-oku-purple text-white border-oku-purple shadow-lg' 
                    : 'bg-white text-oku-dark border-oku-taupe/10 hover:border-oku-purple/50'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {slots.length === 0 && (
           <p className="text-oku-taupe italic text-center py-10">No available slots found for trial calls this week.</p>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedSlot || isSubmitting}
        className="btn-primary w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setErrorMsg(null)}
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Calendar size={18} />
        )}
        Confirm Trial Call
      </button>
      <p className="text-[10px] text-center text-oku-taupe mt-4 uppercase tracking-widest">
        Free 15-minute consultation • No payment required
      </p>
    </form>
  )
}
