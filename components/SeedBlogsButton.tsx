'use client'

import { useState } from 'react'
import { BookOpen, Check, Loader2 } from 'lucide-react'

export function SeedBlogsButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ seeded: number; skipped: number } | null>(null)

  const seed = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/admin/seed-blogs', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done' && result) {
    return (
      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-oku-mint/60 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey border border-oku-mint">
        <Check size={12} /> {result.seeded} seeded, {result.skipped} skipped
      </span>
    )
  }

  return (
    <button
      onClick={seed}
      disabled={state === 'loading'}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-oku-lavender/60 border border-oku-lavender text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:bg-oku-lavender transition-all disabled:opacity-60"
    >
      {state === 'loading' ? (
        <><Loader2 size={12} className="animate-spin" /> Seeding…</>
      ) : (
        <><BookOpen size={12} /> Seed 30 Posts</>
      )}
    </button>
  )
}
