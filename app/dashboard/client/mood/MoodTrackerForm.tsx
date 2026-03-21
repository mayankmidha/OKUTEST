'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function MoodTrackerForm() {
  const [mood, setMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const moodOptions = [
    { value: 1, emoji: '😫', label: 'Very Low' },
    { value: 2, emoji: '😔', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mood === null) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, notes })
      })

      if (res.ok) {
        setMood(null)
        setNotes('')
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe mb-4">
          Energy Level
        </label>
        <div className="flex justify-between items-center gap-2">
          {moodOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border ${
                mood === opt.value 
                ? 'bg-oku-purple border-oku-purple text-white shadow-lg scale-105' 
                : 'bg-oku-cream/50 border-oku-taupe/10 text-oku-dark hover:border-oku-purple/50'
              }`}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-[8px] uppercase tracking-tighter font-bold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe mb-4">
          Reflections (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific triggers or highlights today?"
          rows={4}
          className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={mood === null || isSubmitting}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Complete Check-in
      </button>
    </form>
  )
}
