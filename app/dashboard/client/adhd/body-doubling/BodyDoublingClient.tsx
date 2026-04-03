'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Check, Coffee } from 'lucide-react'

type Phase = 'idle' | 'focus' | 'break'

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

interface BodyDoublingClientProps {
  onSessionChange?: (isActive: boolean, task: string) => void
}

export function BodyDoublingClient({ onSessionChange }: BodyDoublingClientProps) {
  const [task, setTask] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [cycles, setCycles] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const syncPresence = useCallback(async (taskTitle: string, status: string) => {
    try {
      await fetch('/api/adhd/body-double', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, status }),
      })
    } catch {}
  }, [])

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          if (phase === 'focus') {
            setCycles(c => c + 1)
            setPhase('break')
            setSecondsLeft(BREAK_SECONDS)
            syncPresence(task || 'Break', 'BREAK')
          } else {
            setPhase('focus')
            setSecondsLeft(FOCUS_SECONDS)
            syncPresence(task || 'Focusing', 'FOCUSING')
          }
          setIsActive(true) // auto-start next phase
          return phase === 'focus' ? BREAK_SECONDS : FOCUS_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isActive, phase, task, syncPresence])

  const handleStart = () => {
    const activeTask = task.trim() || 'Deep work'
    setTask(activeTask)
    setPhase('focus')
    setSecondsLeft(FOCUS_SECONDS)
    setIsActive(true)
    syncPresence(activeTask, 'FOCUSING')
    onSessionChange?.(true, activeTask)
  }

  const handlePause = () => {
    setIsActive(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    onSessionChange?.(false, task)
  }

  const handleReset = () => {
    setIsActive(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase('idle')
    setSecondsLeft(FOCUS_SECONDS)
    onSessionChange?.(false, '')
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const totalSecs = phase === 'break' ? BREAK_SECONDS : FOCUS_SECONDS
  const progress = ((totalSecs - secondsLeft) / totalSecs) * 100

  return (
    <div className="card-glass-3d !bg-white/60 !p-10 space-y-8">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-oku-darkgrey mb-2">Set Your Intention</h3>
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="What are you working on today?"
          className="input-pastel w-full"
          disabled={isActive}
        />
      </div>

      {/* Timer display */}
      <div className="text-center relative">
        {/* Circular progress */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={phase === 'break' ? '#d1fae5' : '#ede9fe'} strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={phase === 'break' ? '#10b981' : '#7c3aed'}
              strokeWidth="2.5"
              strokeDasharray={`${progress} 100`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="heading-display text-4xl text-oku-darkgrey">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">
              {phase === 'idle' ? 'Ready' : phase === 'focus' ? 'Focus' : 'Break'}
            </span>
          </div>
        </div>

        {phase === 'break' && (
          <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-black uppercase tracking-widest mb-2">
            <Coffee size={14} /> Break time — step away, stretch, breathe
          </div>
        )}

        {cycles > 0 && (
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: Math.min(cycles, 8) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-oku-purple-dark/40" />
            ))}
            <span className="text-[9px] text-oku-darkgrey/30 font-black uppercase tracking-widest ml-2">{cycles} cycles</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {phase === 'idle' ? (
          <button
            onClick={handleStart}
            className="flex-1 btn-pill-3d bg-oku-darkgrey text-white !py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Play size={14} /> Start Focus
          </button>
        ) : (
          <>
            <button
              onClick={isActive ? handlePause : () => setIsActive(true)}
              className="flex-1 btn-pill-3d bg-oku-darkgrey text-white !py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              {isActive ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
            </button>
            <button
              onClick={handleReset}
              className="p-4 rounded-full border border-oku-darkgrey/10 hover:bg-oku-peach/20 transition-all"
            >
              <RotateCcw size={16} className="text-oku-darkgrey/40" />
            </button>
          </>
        )}
      </div>

      {cycles >= 4 && (
        <div className="flex items-center gap-3 p-4 bg-oku-mint/40 rounded-2xl border border-oku-mint">
          <Check size={16} className="text-green-600" />
          <p className="text-xs font-bold text-green-700">4 cycles complete — take a long 15–30 min break.</p>
        </div>
      )}
    </div>
  )
}
