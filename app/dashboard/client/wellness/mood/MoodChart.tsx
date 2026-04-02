'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface MoodEntry {
  id: string
  mood: number
  notes: string | null
  createdAt: string
}

interface Props {
  entries: MoodEntry[]
}

function moodEmoji(val: number) {
  if (val <= 2) return '😞'
  if (val <= 4) return '😟'
  if (val === 5) return '😐'
  if (val <= 7) return '🙂'
  if (val <= 9) return '😊'
  return '😄'
}

function barColor(val: number) {
  if (val <= 3) return 'bg-red-400'
  if (val <= 5) return 'bg-amber-400'
  if (val <= 7) return 'bg-yellow-400'
  return 'bg-emerald-400'
}

export function MoodChart({ entries }: Props) {
  const [mood, setMood] = useState(5)
  const [energy, setEnergy] = useState(5)
  const [anxiety, setAnxiety] = useState(3)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Prepare last 30 entries for chart (oldest first)
  const chartData = [...entries].reverse()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, energy, anxiety, notes: notes || null }),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
    } catch {
      setError('Could not save mood. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* CSS Bar Chart */}
      <div className="card-glass-3d !p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
              30-Day Mood History
            </p>
            <h2 className="text-2xl font-black text-oku-darkgrey">
              Mood Trends
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-oku-darkgrey/50">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              8–10
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              6–7
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              4–5
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              1–3
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-oku-darkgrey/30 text-sm">
            No mood data yet. Log your first entry below!
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
            {chartData.map((entry, i) => {
              const height = `${(entry.mood / 10) * 100}%`
              const date = new Date(entry.createdAt)
              const label = date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })
              return (
                <div
                  key={entry.id}
                  className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group"
                  title={`${label}: ${entry.mood}/10 ${moodEmoji(entry.mood)}`}
                >
                  <span className="text-[10px] text-oku-darkgrey/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {entry.mood}
                  </span>
                  <div className="w-full flex items-end h-36 relative">
                    <div
                      className={`w-full rounded-t-lg transition-all ${barColor(entry.mood)} opacity-80 group-hover:opacity-100`}
                      style={{ height }}
                    />
                  </div>
                  {i % 5 === 0 && (
                    <span className="text-[9px] text-oku-darkgrey/30 whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Log Form */}
      {success ? (
        <div className="card-glass-3d !p-10 flex flex-col items-center text-center space-y-4">
          <CheckCircle2 size={40} className="text-oku-mint" />
          <h3 className="text-xl font-black text-oku-darkgrey">Mood logged!</h3>
          <p className="text-oku-darkgrey/50 text-sm">
            Your entry has been saved. Come back tomorrow to keep the streak
            going.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card-glass-3d !p-10 space-y-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
              Log Today&apos;s Mood
            </p>
            <h2 className="text-2xl font-black text-oku-darkgrey">
              How are you right now?
            </h2>
          </div>

          {/* Mood Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-oku-darkgrey">
                Mood
              </label>
              <span className="text-2xl">{moodEmoji(mood)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-oku-darkgrey/40">1</span>
              <input
                type="range"
                min={1}
                max={10}
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="flex-1 accent-oku-purple-dark"
              />
              <span className="text-xs text-oku-darkgrey/40">10</span>
            </div>
            <p className="text-center text-sm font-bold text-oku-purple-dark">
              {mood}/10
            </p>
          </div>

          {/* Energy Slider */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-oku-darkgrey block">
              Energy Level
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-oku-darkgrey/40">1</span>
              <input
                type="range"
                min={1}
                max={10}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="flex-1 accent-oku-purple-dark"
              />
              <span className="text-xs text-oku-darkgrey/40">10</span>
            </div>
            <p className="text-center text-sm font-bold text-oku-purple-dark">
              {energy}/10
            </p>
          </div>

          {/* Anxiety Slider */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-oku-darkgrey block">
              Anxiety{' '}
              <span className="text-xs text-oku-darkgrey/40 font-normal">
                (1 = calm, 10 = very anxious)
              </span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-oku-darkgrey/40">1</span>
              <input
                type="range"
                min={1}
                max={10}
                value={anxiety}
                onChange={(e) => setAnxiety(Number(e.target.value))}
                className="flex-1 accent-oku-purple-dark"
              />
              <span className="text-xs text-oku-darkgrey/40">10</span>
            </div>
            <p className="text-center text-sm font-bold text-oku-purple-dark">
              {anxiety}/10
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-oku-darkgrey block">
              Notes{' '}
              <span className="text-xs text-oku-darkgrey/40 font-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Anything you want to note about how you're feeling…"
              className="w-full rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save Mood Entry'}
          </button>
        </form>
      )}
    </div>
  )
}
