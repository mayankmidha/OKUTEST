'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingWidgetProps {
  appointmentId: string
  existingRating?: { score: number; comment?: string | null } | null
}

export function RatingWidget({ appointmentId, existingRating }: RatingWidgetProps) {
  const [open, setOpen] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ score: number } | null>(
    existingRating ? { score: existingRating.score } : null
  )
  const [error, setError] = useState<string | null>(null)

  // Already rated — show static stars
  if (submitted) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={14}
              className={
                i <= submitted.score
                  ? 'fill-oku-purple-dark text-oku-purple-dark'
                  : 'fill-none text-oku-darkgrey/20'
              }
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">
          Rated
        </span>
      </div>
    )
  }

  async function handleSubmit() {
    if (selectedStar === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          score: selectedStar,
          comment: comment.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Failed to submit rating.')
        return
      }
      setSubmitted({ score: selectedStar })
      setOpen(false)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:text-oku-darkgrey transition-colors bg-oku-lavender/60 hover:bg-oku-lavender px-4 py-2 rounded-full border border-oku-purple-dark/20"
      >
        <Star size={12} className="fill-oku-purple-dark text-oku-purple-dark" />
        Rate Session
      </button>
    )
  }

  return (
    <div className="mt-4 p-5 rounded-[1.5rem] bg-white/70 border border-oku-purple-dark/10 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Star selector */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-3">
          How was your session?
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoveredStar(i)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedStar(i)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                className={
                  i <= (hoveredStar || selectedStar)
                    ? 'fill-oku-purple-dark text-oku-purple-dark transition-colors'
                    : 'fill-none text-oku-darkgrey/20 transition-colors'
                }
              />
            </button>
          ))}
        </div>
        {selectedStar > 0 && (
          <p className="text-[10px] text-oku-purple-dark font-black uppercase tracking-widest mt-2">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][selectedStar]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">
          Share your experience (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="What made this session meaningful..."
          className="w-full rounded-[1rem] bg-white/60 border border-white/80 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/20 resize-none font-display"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 font-bold">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={selectedStar === 0 || submitting}
          className="btn-primary text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        <button
          onClick={() => {
            setOpen(false)
            setSelectedStar(0)
            setHoveredStar(0)
            setComment('')
            setError(null)
          }}
          className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
