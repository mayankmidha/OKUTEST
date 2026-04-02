'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ExistingLog {
  id: string
  moodScore: number | null
  energyLevel: number
  medicationTaken: boolean
  sleepHours: number | null
  notes: string | null
}

interface Props {
  existing: ExistingLog | null
}

function moodEmoji(val: number) {
  if (val <= 2) return '😞'
  if (val <= 4) return '😟'
  if (val === 5) return '😐'
  if (val <= 7) return '🙂'
  if (val <= 9) return '😊'
  return '😄'
}

function energyColor(val: number) {
  if (val <= 3) return 'bg-red-400'
  if (val <= 5) return 'bg-amber-400'
  if (val <= 7) return 'bg-yellow-400'
  return 'bg-emerald-400'
}

function anxietyLabel(val: number) {
  if (val <= 2) return 'Very calm'
  if (val <= 4) return 'Calm'
  if (val === 5) return 'Mild tension'
  if (val <= 7) return 'Anxious'
  if (val <= 9) return 'Very anxious'
  return 'Overwhelmed'
}

export function LogForm({ existing }: Props) {
  const router = useRouter()
  const [mood, setMood] = useState(existing?.moodScore ?? 5)
  const [energy, setEnergy] = useState(
    existing ? Math.round(existing.energyLevel / 10) : 5
  )
  const [anxiety, setAnxiety] = useState(5)
  const [sleepHours, setSleepHours] = useState(existing?.sleepHours ?? 7)
  const [medicationTaken, setMedicationTaken] = useState(
    existing?.medicationTaken ?? false
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/adhd/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodScore: mood,
          energyLevel: energy * 10,
          medicationTaken,
          sleepHours,
          notes: notes || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setSuccess(true)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a78bfa', '#6ee7b7', '#f9fafb'],
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-oku-mint/20 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-oku-mint" />
        </div>
        <h2 className="heading-display text-4xl text-oku-darkgrey">
          Log saved!
        </h2>
        <p className="text-oku-darkgrey/60 max-w-xs">
          Your daily check-in is recorded. Keep showing up for yourself.
        </p>
        <button
          onClick={() => router.push('/dashboard/client/adhd')}
          className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10"
        >
          Back to ADHD Hub
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Mood */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
              Mood
            </p>
            <p className="text-oku-darkgrey/60 text-sm">
              How are you feeling overall?
            </p>
          </div>
          <span className="text-4xl">{moodEmoji(mood)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-oku-darkgrey/40">😞 1</span>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="flex-1 accent-oku-purple-dark"
          />
          <span className="text-xs text-oku-darkgrey/40">10 😊</span>
        </div>
        <p className="text-center text-lg font-bold text-oku-purple-dark">
          {mood}/10
        </p>
      </div>

      {/* Energy */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Energy
          </p>
          <p className="text-oku-darkgrey/60 text-sm">
            What&apos;s your battery level?
          </p>
        </div>
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
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-oku-darkgrey/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${energyColor(energy)}`}
              style={{ width: `${energy * 10}%` }}
            />
          </div>
          <span className="text-sm font-bold text-oku-darkgrey w-8 text-right">
            {energy}
          </span>
        </div>
      </div>

      {/* Anxiety */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
              Anxiety
            </p>
            <p className="text-oku-darkgrey/60 text-sm">
              1 = calm, 10 = very anxious
            </p>
          </div>
          <span className="chip !text-xs">{anxietyLabel(anxiety)}</span>
        </div>
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
        <p className="text-center text-lg font-bold text-oku-purple-dark">
          {anxiety}/10
        </p>
      </div>

      {/* Sleep */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Sleep Hours
          </p>
          <p className="text-oku-darkgrey/60 text-sm">
            How many hours did you sleep last night?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-oku-darkgrey/40">0h</span>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="flex-1 accent-oku-purple-dark"
          />
          <span className="text-xs text-oku-darkgrey/40">12h</span>
        </div>
        <p className="text-center text-lg font-bold text-oku-purple-dark">
          {sleepHours}h
        </p>
      </div>

      {/* Medication */}
      <div className="card-glass-3d !p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
              Medication Taken
            </p>
            <p className="text-oku-darkgrey/60 text-sm">
              Did you take your medication today?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMedicationTaken(!medicationTaken)}
            className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 ${
              medicationTaken ? 'bg-oku-purple-dark' : 'bg-oku-darkgrey/20'
            }`}
            aria-pressed={medicationTaken}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                medicationTaken ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
            <span className="sr-only">
              {medicationTaken ? 'Yes' : 'No'}
            </span>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="card-glass-3d !p-8 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40">
          Notes{' '}
          <span className="font-normal normal-case tracking-normal text-oku-darkgrey/30">
            (optional)
          </span>
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 200))}
          maxLength={200}
          rows={3}
          placeholder="Anything on your mind today…"
          className="w-full rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 resize-none"
        />
        <p className="text-xs text-oku-darkgrey/30 text-right">
          {notes.length}/200
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5 disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save Daily Log'}
      </button>
    </form>
  )
}
