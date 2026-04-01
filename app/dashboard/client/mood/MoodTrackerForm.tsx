'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const moodOptions = [
  { value: 1, emoji: '😫', label: 'Very Low' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
]

export default function MoodTrackerForm() {
  const [mood, setMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mood === null) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, notes }),
      })

      if (res.ok) {
        setSuccess(true)
        setMood(null)
        setNotes('')
        setTimeout(() => {
          setSuccess(false)
          router.refresh()
        }, 1800)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="text-5xl mb-4 animate-float-3d">🌿</div>
        <p className="heading-display text-2xl text-oku-darkgrey">Recorded.</p>
        <p className="text-sm font-display italic text-oku-darkgrey/40 mt-2">Your check-in has been saved.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40 mb-6">
          Energy Level
        </label>
        <div className="flex justify-between items-center gap-2">
          {moodOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                mood === opt.value
                  ? 'bg-oku-purple-dark border-oku-purple-dark text-white shadow-xl scale-110'
                  : 'bg-white/60 border-white/80 text-oku-darkgrey hover:border-oku-purple-dark/30 hover:bg-white hover:scale-105'
              }`}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-[8px] uppercase tracking-tight font-black">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40 mb-4">
          Reflections <span className="opacity-40">(Optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific triggers or highlights today?"
          rows={4}
          className="w-full bg-white/60 border border-white/80 rounded-2xl p-4 text-sm font-display italic text-oku-darkgrey focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all resize-none placeholder:text-oku-darkgrey/20"
        />
      </div>

      <button
        type="submit"
        disabled={mood === null || isSubmitting}
        className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="mr-3 animate-spin" />}
        {isSubmitting ? 'Saving...' : 'Complete Check-in'}
      </button>
    </form>
  )
}
