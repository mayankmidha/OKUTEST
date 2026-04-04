'use client'

import { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'motion/react'
import { Users, Zap, Heart, Wind, Loader2 } from 'lucide-react'

export function BodyDoublePresence({ currentTask, isActive }: { currentTask?: string, isActive: boolean }) {
  const [others, setOthers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch others
  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const res = await fetch('/api/adhd/body-double')
        if (res.ok) {
          const data = await res.json()
          setOthers(data)
        }
      } catch (e) {
        console.error("Failed to fetch focus sessions", e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOthers()
    const interval = setInterval(fetchOthers, 8000) // Update list every 8s
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="card-glass-3d !p-6 sm:!p-8 lg:!p-10 !bg-white/40 border-none shadow-xl !rounded-[3rem] overflow-hidden">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:mb-10">
        <div>
          <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Active <span className="italic text-oku-purple-dark">Sanctuary.</span></h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">Anonymous Body Doubling</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-oku-darkgrey/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/40">
            {others.length} peers active
          </div>
          <div className="w-10 h-10 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Users size={20} />}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-[1.4rem] border border-oku-lavender/40 bg-oku-lavender/15 px-4 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-oku-purple-dark">
          Privacy first
        </p>
        <p className="mt-2 text-sm leading-relaxed text-oku-darkgrey/65">
          Everyone in this room appears anonymously. Names and exact task titles are hidden from other participants.
        </p>
      </div>

      {/* Community Intent Reel */}
      <AnimatePresence>
        {others.length > 0 && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 hidden sm:block -mx-8 lg:-mx-10 bg-oku-darkgrey overflow-hidden py-3 transform -rotate-1 border-y border-white/10 shadow-2xl"
          >
              <m.div 
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="flex gap-12 whitespace-nowrap px-8 lg:px-10"
              >
                  {Array(10).fill(others).flat().map((o, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-lavender/60 flex items-center gap-4">
                          <Zap size={12} className="text-oku-mint" /> {o.alias || 'Focus peer'} is {o.statusLabel || 'in a focus sprint'}
                      </span>
                  ))}
              </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading && others.length === 0 ? (
           <div className="py-10 text-center flex flex-col items-center gap-4">
              <Loader2 className="text-oku-purple-dark/20 animate-spin" size={32} />
              <p className="text-sm font-display italic text-oku-darkgrey/40">Sensing the sanctuary...</p>
           </div>
        ) : others.length === 0 ? (
          <div className="py-10 text-center">
             <div className="w-16 h-16 bg-oku-lavender/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-oku-purple-dark animate-pulse" size={32} />
             </div>
             <h4 className="font-bold text-oku-darkgrey text-lg mb-2">Personal Focus Window</h4>
             <p className="text-sm font-display italic text-oku-darkgrey/40">You&apos;re in the flow. The room is active and mirroring will begin as soon as others join anonymously.</p>
          </div>
        ) : (
          others.map((other, i) => (
            <m.div 
              key={other.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white group hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-oku-lavender text-xs font-bold text-oku-purple-dark border-2 border-white shadow-sm flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                  {other.alias || 'Focus peer'}
                </p>
                <p className="text-sm font-bold text-oku-darkgrey truncate italic font-display">
                  {other.taskLabel || 'doing focused work'}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-oku-purple-dark/65">
                  {other.statusLabel || 'in a focus sprint'}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </m.div>
          ))
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-oku-darkgrey/5">
         <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-widest text-oku-purple-dark/60">
            <Zap size={12} />
            <span>Mirroring focus increases dopamine by 30%</span>
            {isActive && currentTask && (
              <span className="rounded-full bg-oku-darkgrey/5 px-3 py-1 text-oku-darkgrey/45">
                Your focus: {currentTask}
              </span>
            )}
         </div>
      </div>
    </section>
  )
}
