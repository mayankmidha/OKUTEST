'use client'

import { useState, useEffect } from 'react'
import { Pill, Zap, Moon, CheckCircle2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function DailyTracker() {
  const [energy, setEnergy] = useState(60)
  const [medsTaken, setMedsTaken] = useState(false)
  const [sleepHours, setSleepHours] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load today's existing log on mount
  useEffect(() => {
    fetch('/api/adhd/daily-log')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setEnergy(data.energyLevel ?? 60)
          setMedsTaken(data.medicationTaken ?? false)
          setSleepHours(data.sleepHours ?? null)
          setLastSaved(
            new Date(data.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          )
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/adhd/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energyLevel: energy,
          medicationTaken: medsTaken,
          sleepHours: sleepHours,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setLastSaved(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-oku-dark text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Zap size={20} className="text-oku-lavender" />
            </div>
            <h2 className="text-lg font-display font-bold tracking-tight">Daily Vitality</h2>
          </div>
          {lastSaved && (
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
              Synced at {lastSaved}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-oku-lavender" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Energy Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Spoon Count
                </span>
                <span className="text-2xl font-display font-bold text-oku-lavender">{energy}%</span>
              </div>
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  animate={{ width: `${energy}%` }}
                  className="h-full bg-gradient-to-r from-oku-purple to-oku-lavender shadow-[0_0_15px_rgba(157,133,179,0.5)]"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20 px-2">
                <span>Empty</span>
                <span>Overflowing</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Moon size={14} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Sleep Last Night
                </span>
                {sleepHours !== null && (
                  <span className="ml-auto text-oku-lavender font-bold text-sm">
                    {sleepHours}h
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[4, 5, 6, 7, 8, 9].map((h) => (
                  <button
                    key={h}
                    onClick={() => setSleepHours(sleepHours === h ? null : h)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      sleepHours === h
                        ? 'bg-oku-lavender text-oku-dark shadow-[0_0_12px_rgba(157,133,179,0.4)]'
                        : 'bg-white/10 text-white/40 hover:bg-white/20'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Meds Toggle */}
            <button
              onClick={() => setMedsTaken(!medsTaken)}
              className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                medsTaken
                  ? 'bg-oku-lavender/20 border-oku-lavender text-oku-lavender shadow-[0_0_20px_rgba(157,133,179,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    medsTaken
                      ? 'bg-oku-lavender text-oku-dark'
                      : 'bg-white/10 text-white/20 group-hover:bg-white/20'
                  }`}
                >
                  <Pill size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm tracking-tight">Medication Protocol</p>
                  <p className="text-[9px] uppercase tracking-widest opacity-60">
                    {medsTaken ? 'Dose recorded for today' : 'Mark as completed'}
                  </p>
                </div>
              </div>
              {medsTaken && <CheckCircle2 size={24} className="animate-pulse" />}
            </button>

            {error && (
              <p className="text-center text-xs text-red-400">{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-white text-oku-dark py-4 rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-lavender transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Syncing...
                </>
              ) : (
                'Log Daily Progress'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px]" />
    </div>
  )
}
