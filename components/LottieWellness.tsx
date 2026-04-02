'use client'

import dynamic from 'next/dynamic'
import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import Link from 'next/link'

// Lazy-load Lottie to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((m) => m.Player),
  { ssr: false, loading: () => <div className="w-full h-32 bg-white/20 rounded-3xl animate-pulse" /> }
)

// Mood selections with spring physics
const MOODS = [
  { emoji: '😔', label: 'Low', value: 2, color: '#e4b8c8' },
  { emoji: '😐', label: 'Okay', value: 5, color: '#d4c5f0' },
  { emoji: '🙂', label: 'Good', value: 7, color: '#c5e8d4' },
  { emoji: '✨', label: 'Great', value: 10, color: '#f5e6b8' },
]

export function LottieWellness() {
  const [selected, setSelected] = useState<number | null>(null)
  const [logged, setLogged] = useState(false)

  const containerSpring = useSpring({
    scale: logged ? 1.02 : 1,
    config: { tension: 300, friction: 20 },
  })

  const handleMood = async (value: number) => {
    setSelected(value)
    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: value }),
      })
      setLogged(true)
      setTimeout(() => setLogged(false), 2000)
    } catch {
      // silent fail — user can still navigate to full logger
    }
  }

  return (
    <animated.section
      style={containerSpring}
      className="card-glass-3d !bg-oku-butter !p-8 relative overflow-hidden"
    >
      {/* Lottie background glow animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <Player
          src="https://lottie.host/8d79af73-8af5-4b2c-bb4d-6af0e6e6e4e2/H4pQJHVjf8.json"
          autoplay
          loop
          style={{ width: 220, height: 220 }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-0.5">Daily Check-in</p>
            <h3 className="heading-display text-2xl text-oku-darkgrey">
              How are you <span className="italic text-oku-purple-dark">today?</span>
            </h3>
          </div>
          {logged && (
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-bounce">
              Logged ✓
            </span>
          )}
        </div>

        {/* Mood selector with spring physics */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {MOODS.map((mood) => (
            <MoodButton
              key={mood.value}
              mood={mood}
              isSelected={selected === mood.value}
              onSelect={() => handleMood(mood.value)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/client/mood"
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-3.5 text-center text-[10px]"
          >
            Log Full Entry →
          </Link>
          <Link
            href="/dashboard/client/progress"
            className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 text-center hover:text-oku-purple-dark transition-colors"
          >
            View My Progress →
          </Link>
        </div>
      </div>
    </animated.section>
  )
}

function MoodButton({
  mood,
  isSelected,
  onSelect,
}: {
  mood: typeof MOODS[0]
  isSelected: boolean
  onSelect: () => void
}) {
  const spring = useSpring({
    scale: isSelected ? 1.15 : 1,
    backgroundColor: isSelected ? mood.color : 'rgba(255,255,255,0.4)',
    config: { tension: 400, friction: 18 },
  })

  return (
    <animated.button
      onClick={onSelect}
      style={spring}
      className="flex flex-col items-center py-3 rounded-2xl border border-white/70 hover:border-white cursor-pointer"
    >
      <span className="text-2xl leading-none">{mood.emoji}</span>
      <span className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/50 mt-1">{mood.label}</span>
    </animated.button>
  )
}
