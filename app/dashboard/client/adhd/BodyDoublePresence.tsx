'use client'

import { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { Users, Zap, Heart, Wind } from 'lucide-react'

export function BodyDoublePresence({ currentTask, isActive }: { currentTask?: string, isActive: boolean }) {
  const [others, setOthers] = useState<any[]>([])

  // Sync my state
  useEffect(() => {
    if (!isActive) return
    
    const sync = async () => {
      await fetch('/api/adhd/body-double', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskTitle: currentTask || 'Planning...',
          status: 'FOCUSING'
        })
      })
    }
    
    sync()
    const interval = setInterval(sync, 30000) // Sync every 30s
    return () => clearInterval(interval)
  }, [currentTask, isActive])

  // Fetch others
  useEffect(() => {
    const fetchOthers = async () => {
      const res = await fetch('/api/adhd/body-double')
      if (res.ok) {
        const data = await res.json()
        // Filter out self would be better if we had userId here, but for now just show list
        setOthers(data)
      }
    }
    
    fetchOthers()
    const interval = setInterval(fetchOthers, 10000) // Update list every 10s
    return () => clearInterval(interval)
  }, [])
return (
  <section className="card-glass-3d !p-10 !bg-white/40 border-none shadow-xl !rounded-[3rem] overflow-hidden">
    <div className="flex items-center justify-between mb-10">
      <div>
        <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Active <span className="italic text-oku-purple-dark">Sanctuary.</span></h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">Community Body Doubling</p>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
        <Users size={20} />
      </div>
    </div>

    {/* Community Intent Reel */}
    {others.length > 1 && (
      <div className="mb-10 -mx-10 bg-oku-dark overflow-hidden py-3 transform -rotate-1 border-y border-white/10 shadow-2xl">
          <m.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex gap-12 whitespace-nowrap px-10"
          >
              {Array(5).fill(others).flat().map((o, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-lavender/60 flex items-center gap-4">
                      <Zap size={12} className="text-oku-mint" /> {o.user.name.split(' ')[0]} is {o.context}
                  </span>
              ))}
          </m.div>
      </div>
    )}

    <div className="space-y-4">
...
        {others.length <= 1 ? (
          <div className="py-10 text-center">
             <Wind className="mx-auto text-oku-darkgrey/10 mb-4 animate-pulse" size={32} />
             <p className="text-sm font-display italic text-oku-darkgrey/40">You're the first one here. <br/> Your focus will light the way.</p>
          </div>
        ) : (
          others.map((other, i) => (
            <m.div 
              key={other.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white group hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-oku-lavender flex items-center justify-center text-xs font-bold text-oku-purple-dark border-2 border-white shadow-sm overflow-hidden">
                {other.user.avatar ? <img src={other.user.avatar} className="w-full h-full object-cover" /> : other.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{other.user.name.split(' ')[0]} is focusing on</p>
                <p className="text-sm font-bold text-oku-darkgrey truncate italic font-display">{other.context}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-oku-matcha animate-pulse shadow-[0_0_8px_rgba(124,140,116,0.6)]" />
            </m.div>
          ))
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-oku-darkgrey/5">
         <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-oku-purple-dark/60">
            <Zap size={12} />
            <span>Mirroring focus increases dopamine by 30%</span>
         </div>
      </div>
    </section>
  )
}
