'use client'

import { useState, useEffect, useRef } from 'react'
import { motion as m, AnimatePresence } from 'motion/react'
import { 
    Users, Zap, Timer, Play, Pause, RotateCcw, 
    Volume2, ShieldCheck, X, Sparkles, Loader2,
    Heart, Wind, Sun, Coffee
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface BodyDoubleRoomProps {
  user: { id: string, name: string, role: string }
  isTherapist?: boolean
}

export function BodyDoubleRoom({ user, isTherapist = false }: BodyDoubleRoomProps) {
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work')
  
  // Presence State
  const [others, setOthers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSignaling, setIsSignaling] = useState(false)
  
  // AI Chaos Breaker State
  const [aiChaosResult, setAiChaosResult] = useState<any>(null)
  const [isAiBreaking, setIsAiLoading] = useState(false)
  
  // Soundscape
  const [soundscape, setSoundscape] = useState('none')

  // ─── SYNC PRESENCE ─────────────────────────────────────────────────────────
  
  useEffect(() => {
    const sync = async () => {
      try {
        // Post self status if signaling
        if (isSignaling) {
          await fetch('/api/adhd/body-double', {
            method: 'POST',
            body: JSON.stringify({ status: isActive ? (timerMode === 'work' ? 'FOCUSING' : 'BREAK') : 'INACTIVE' })
          })
        }

        // Fetch others
        const res = await fetch('/api/adhd/body-double')
        if (res.ok) setOthers(await res.json())
      } catch (e) {
        console.error("Sync error", e)
      } finally {
        setLoading(false)
      }
    }

    sync()
    const interval = setInterval(sync, 8000)
    return () => clearInterval(interval)
  }, [isSignaling, isActive, timerMode])

  // ─── TIMER LOGIC ───────────────────────────────────────────────────────────

  useEffect(() => {
    let interval: any = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      clearInterval(interval)
      setIsActive(false)
      if (timerMode === 'work') {
        confetti({ particleCount: 150, spread: 100, colors: ['#9D85B3', '#EBE6DE'] })
        alert("Deep Focus Session Complete. Time for a Dopamine Reset.")
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, timerMode])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const breakChaos = async () => {
    setIsAiLoading(true)
    try {
      const res = await fetch('/api/adhd/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: [{ title: 'Current Chaos' }], energy: 50 })
      })
      if (res.ok) setAiChaosResult(await res.json())
    } catch (e) {
      console.error("AI Error", e)
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-oku-lavender/5 rounded-[4rem] border-2 border-white shadow-2xl p-12 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-oku-purple-dark/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-oku-mint/5 blur-[120px] rounded-full" />

      {/* Header Info */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-10">
         <div className="space-y-2">
            <h2 className="heading-display text-4xl text-oku-darkgrey">Focus <span className="italic text-oku-purple-dark">Sanctuary.</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Anonymous Body Doubling Room</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white flex items-center gap-3 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-oku-green animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">{others.length + 1} Present</span>
            </div>
            <button 
              onClick={() => setIsSignaling(!isSignaling)}
              className={`px-6 py-3 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${isSignaling ? 'bg-oku-mint text-white border-oku-mint shadow-lg shadow-oku-mint/20' : 'bg-white/60 text-oku-darkgrey/40 border-white hover:bg-white'}`}
            >
               {isSignaling ? 'Signaling Active' : 'Signaling Off'}
            </button>
         </div>
      </div>

      {/* Primary Focus UI */}
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-20 items-center">
         
         {/* Timer Block */}
         <div className="text-center space-y-12">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-6 py-2 bg-oku-darkgrey text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                  {timerMode === 'work' ? <Sparkles size={12} /> : <Coffee size={12} />}
                  {timerMode === 'work' ? 'Deep Flow Phase' : 'Dopamine Reset'}
               </div>
               <p className="text-[10rem] font-display font-bold tracking-tighter text-oku-darkgrey leading-none tabular-nums drop-shadow-xl">{formatTime(timeLeft)}</p>
            </div>

            <div className="flex items-center justify-center gap-8">
               <button 
                 onClick={toggleTimer}
                 className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 ${isActive ? 'bg-white border-2 border-oku-lavender text-oku-purple-dark' : 'bg-oku-darkgrey text-white'}`}
               >
                  {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
               </button>
               <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-white border border-oku-darkgrey/10 text-oku-darkgrey/40 hover:text-oku-darkgrey transition-all flex items-center justify-center">
                  <RotateCcw size={24} />
               </button>
            </div>

            <div className="flex justify-center gap-4">
               <button 
                 onClick={() => { setTimerMode('work'); resetTimer(); }}
                 className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${timerMode === 'work' ? 'bg-oku-lavender text-oku-purple-dark border-2 border-oku-lavender' : 'bg-white/40 text-oku-darkgrey/30 border border-white'}`}
               >
                  Focus (25m)
               </button>
               <button 
                 onClick={() => { setTimerMode('break'); resetTimer(); }}
                 className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${timerMode === 'break' ? 'bg-oku-lavender text-oku-purple-dark border-2 border-oku-lavender' : 'bg-white/40 text-oku-darkgrey/30 border border-white'}`}
               >
                  Break (5m)
               </button>
            </div>
         </div>

         {/* Presence & Sensory Block */}
         <div className="space-y-12">
            
            {/* The Presence List */}
            <div className="card-glass-3d !p-10 !bg-white/40 border-none relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="font-bold text-oku-darkgrey tracking-tight flex items-center gap-3">
                        <Users size={20} className="text-oku-purple-dark" />
                        Communal Mirroring
                     </h3>
                     <ShieldCheck size={16} className="text-oku-mint" />
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                     {others.length === 0 && !aiChaosResult ? (
                        <div className="py-12 text-center">
                           <div className="w-16 h-16 bg-oku-lavender/30 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Zap className="text-oku-purple-dark animate-pulse" size={32} />
                           </div>
                           <h4 className="font-bold text-oku-darkgrey text-lg mb-2">Personal Focus Window</h4>
                           <p className="text-xs font-display italic text-oku-darkgrey/40 px-8 mb-8">You&apos;re in the flow. Mirroring will begin as soon as others join anonymously.</p>
                           
                           <button 
                             onClick={breakChaos}
                             disabled={isAiBreaking}
                             className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 flex items-center gap-2 mx-auto disabled:opacity-50"
                           >
                              {isAiBreaking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                              Break the Chaos with AI
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {aiChaosResult && (
                              <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-oku-darkgrey text-white rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group mb-4">
                                 <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-oku-purple-dark flex items-center justify-center text-white text-[10px] font-black shadow-lg">AI</div>
                                          <span className="text-[9px] font-black uppercase tracking-widest text-oku-lavender">Clinical Strategist</span>
                                       </div>
                                       <button onClick={() => setAiChaosResult(null)} className="text-white/20 hover:text-white"><X size={14} /></button>
                                    </div>
                                    <p className="text-sm font-display italic leading-relaxed mb-4">"{aiChaosResult.strategy}"</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 p-3 rounded-xl border border-white/5">
                                       <Zap size={12} className="text-oku-mint" /> Focus Task: {aiChaosResult.focusTask}
                                    </div>
                                 </div>
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                              </m.div>
                           )}
                           {others.map((other, i) => (
                           <m.div 
                             key={other.id}
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white group transition-all"
                           >
                              <div className="w-10 h-10 rounded-full bg-oku-lavender flex items-center justify-center text-xs font-black text-oku-purple-dark border-2 border-white shadow-sm">
                                 {other.alias?.substring(0, 1)}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{other.alias}</p>
                                 <p className="text-sm font-bold text-oku-darkgrey truncate italic font-display">{other.statusLabel}</p>
                              </div>
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                           </m.div>
                        ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Sensory Shield */}
            <div className="card-glass-3d !p-10 !bg-oku-babyblue/20 border-none">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
                     <Volume2 size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-oku-darkgrey tracking-tight">Sensory Shield</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Audio Masking</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {['White Noise', 'Soft Rain', 'Deep Forest', 'Brownian'].map(s => (
                     <button 
                       key={s}
                       onClick={() => setSoundscape(s.toLowerCase())}
                       className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${soundscape === s.toLowerCase() ? 'bg-oku-darkgrey text-white border-oku-darkgrey' : 'bg-white/40 text-oku-darkgrey/40 border-white hover:bg-white'}`}
                     >
                        {s}
                     </button>
                  ))}
               </div>
            </div>

         </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  )
}
