'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
    Plus, 
    Sparkles, 
    Split, 
    CheckCircle2, 
    Circle, 
    Trash2, 
    Zap, 
    PartyPopper,
    Play,
    Pause,
    RotateCcw,
    Loader2,
    Clock,
    Wind,
    Battery,
    Brain,
    Volume2,
    Coffee,
    ArrowRight,
    TrendingUp
} from 'lucide-react'
import { motion as m, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { BodyDoublePresence } from './BodyDoublePresence'
import { DopamineMenu } from './DopamineMenu'
import { BrainDump } from './BrainDump'

export function ADHDWorkspace({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAtomizing, setIsAtomizing] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [energy, setEnergy] = useState(80) 
  
  // Advanced Features State
  const [aiStrategy, setAiStrategy] = useState<any>(null)
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false)
  const [soundscape, setSoundscape] = useState('none') // 'white', 'rain', 'forest'
  const [isSignalingFocus, setIsSignalingFocus] = useState(false)
  
  // Pomodoro State
  const [timerMode, setTimerMode] = useState<'work' | 'break' | 'transition'>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  // ─── INITIALIZATION ────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/adhd/energy')
      .then(res => res.json())
      .then(data => setEnergy(data.energy))
      .catch(e => console.error("Could not fetch energy", e))
  }, [])

  const updateEnergy = async (val: number) => {
    setEnergy(val)
    await fetch('/api/adhd/energy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energy: val })
    })
  }

  const generateStrategy = async () => {
    if (tasks.length === 0) return
    setIsGeneratingStrategy(true)
    try {
        const res = await fetch('/api/adhd/strategy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tasks, energy })
        })
        const data = await res.json()
        setAiStrategy(data)
    } finally {
        setIsGeneratingStrategy(false)
    }
  }

  // ─── TIMER LOGIC ───────────────────────────────────────────────────────────

  useEffect(() => {
    let interval: any = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(interval)
      setIsActive(false)
      if (timerMode === 'work') {
          confetti({ particleCount: 150, spread: 100 })
          setStreak(s => s + 1)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, timerMode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // ─── TASK LOGIC ────────────────────────────────────────────────────────────

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    
    // 3-task max rule (Vision: "Focus: 3-task max rule")
    const activeTasks = tasks.filter(t => !t.isCompleted)
    if (activeTasks.length >= 3) {
      alert("Sanctuary Focus Rule: You already have 3 active tasks. Break the cycle by finishing or deleting one before adding more. This protects your working memory from overwhelm. 💜")
      return
    }

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle })
    })
    if (res.ok) {
        const data = await res.json()
        setTasks([{ ...data, subTasks: [] }, ...tasks])
        setNewTaskTitle('')
    }
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const updateTasks = (list: any[]): any[] => {
        return list.map(t => {
            if (t.id === id) return { ...t, isCompleted: !currentStatus }
            if (t.subTasks) return { ...t, subTasks: updateTasks(t.subTasks) }
            return t
        })
    }
    setTasks(updateTasks(tasks))
    if (!currentStatus) {
        setStreak(prev => prev + 1)
        confetti({ particleCount: 100, spread: 70 })
    }
    await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus })
    })
  }

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        const removeById = (list: any[]): any[] => {
            return list.filter(t => t.id !== id).map(t => ({
                ...t,
                subTasks: t.subTasks ? removeById(t.subTasks) : []
            }))
        }
        setTasks(removeById(tasks))
    }
  }

  const atomizeTask = async (taskId: string, title: string) => {
    setIsAtomizing(taskId)
    try {
        const res = await fetch('/api/tasks/atomize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, title })
        })
        if (res.ok) {
            const subtasks = await res.json()
            setTasks(tasks.map(t => t.id === taskId ? { ...t, subTasks: subtasks } : t))
        }
    } finally {
        setIsAtomizing(null)
    }
  }

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen text-oku-darkgrey bg-oku-lavender/5 relative overflow-hidden">
      
      {/* ── HEADER (Unified UIUX) ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <m.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Executive Support</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">ADHD Workspace</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter leading-[0.85]">
            Focus <span className="text-oku-purple-dark italic">Protocol.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 max-w-2xl leading-relaxed">
            A gentle sanctuary designed for the neurodivergent flow. Navigate overwhelm through tiny wins and persistent energy awareness.
          </p>
        </m.div>

        <m.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass-3d !p-10 !bg-oku-darkgrey text-white flex items-center gap-8 shadow-2xl"
        >
           <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-oku-lavender">
              <Zap size={32} strokeWidth={1.5} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Dopamine Streak</p>
              <p className="text-4xl font-bold tracking-tighter">{streak} <span className="text-sm font-display italic opacity-60 ml-2">Wins</span></p>
           </div>
        </m.div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 relative z-10">
        
        {/* 1. PRIMARY WORKSPACE */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* AI Strategy Bar */}
          <m.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass-3d !p-12 !bg-oku-dark text-white relative overflow-hidden group shadow-2xl !rounded-[3rem]"
          >
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                        <Brain className="text-oku-lavender" size={28} />
                        Smart Strategy
                    </h2>
                    {aiStrategy ? (
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-xl">
                            <p className="text-sm text-white/70 italic leading-relaxed">"{aiStrategy.strategy}"</p>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-oku-purple/20 px-3 py-1 rounded-full border border-oku-purple/30">Next Win: {aiStrategy.focusTask}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">{aiStrategy.tip}</span>
                            </div>
                        </m.div>
                    ) : (
                        <p className="text-sm text-white/50">Feeling stuck? Let Oku Core analyze your list and energy levels.</p>
                    )}
                </div>
                <button 
                    onClick={generateStrategy}
                    disabled={isGeneratingStrategy || tasks.length === 0}
                    className="btn-pill-3d bg-white text-oku-dark hover:bg-oku-lavender hover:scale-105 transition-all !py-4 !px-10"
                >
                    {isGeneratingStrategy ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles className="mr-2" size={18} /> Plan My Day</>}
                </button>
             </div>
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px]" />
          </m.section>

          {/* Task Ledger */}
          <section className="card-glass-3d !p-16 !bg-white/60 border-none shadow-xl !rounded-[4rem]">
             <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Today's <span className="italic text-oku-purple-dark">Atoms.</span></h2>
                  <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 mt-2">Executive Load Tracker</p>
                </div>
                <form onSubmit={addTask} className="flex-1 max-w-md ml-12 relative group">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="What's weighing on you?"
                        className="w-full bg-white/80 border border-white rounded-full px-8 py-5 text-lg outline-none focus:ring-4 focus:ring-oku-lavender/50 shadow-sm group-hover:shadow-lg transition-all pr-20 font-display italic"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-oku-dark text-white px-6 rounded-full hover:bg-oku-purple transition-all shadow-xl active:scale-95">
                        <Plus size={24} />
                    </button>
                </form>
             </div>

             <div className="space-y-8">
                <AnimatePresence>
                  {tasks.length === 0 ? (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center border-2 border-dashed border-oku-purple-dark/5 rounded-[3rem]">
                        <Wind className="mx-auto text-oku-purple-dark/10 mb-6 animate-float-3d" size={48} />
                        <p className="text-2xl font-display italic text-oku-darkgrey/20">The horizon is clear. Add a task to begin.</p>
                    </m.div>
                  ) : tasks.map(task => (
                    <m.div 
                      key={task.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-10 rounded-[3rem] border-2 transition-all duration-700 ${task.isCompleted ? 'bg-oku-cream-warm/20 border-transparent opacity-40' : 'bg-white border-white shadow-premium hover:shadow-2xl hover:border-oku-lavender'}`}
                    >
                      <div className="flex items-center justify-between gap-8">
                         <div className="flex items-center gap-10 flex-1">
                            <button onClick={() => toggleTask(task.id, task.isCompleted)} className={`transition-all duration-500 scale-[1.8] ${task.isCompleted ? 'text-oku-matcha-dark' : 'text-oku-lavender-dark hover:scale-[2]'}`}>
                               {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <div>
                              <p className={`text-3xl font-display font-bold tracking-tight ${task.isCompleted ? 'line-through text-oku-taupe font-medium' : 'text-oku-darkgrey'}`}>{task.title}</p>
                              {task.subTasks?.length > 0 && (
                                  <div className="mt-4 flex items-center gap-4">
                                      <div className="w-48 h-1.5 bg-oku-lavender/20 rounded-full overflow-hidden border border-white/10">
                                          <m.div 
                                              className="h-full bg-oku-purple-dark shadow-[0_0_10px_rgba(157,133,179,0.5)]" 
                                              initial={{ width: 0 }}
                                              animate={{ width: `${(task.subTasks.filter((s:any) => s.isCompleted).length / task.subTasks.length) * 100}%` }}
                                              transition={{ duration: 1 }}
                                          />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">
                                          {task.subTasks.filter((s:any) => s.isCompleted).length} / {task.subTasks.length} ATOMS DONE
                                      </span>
                                  </div>
                              )}
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-4">
                            {!task.isCompleted && task.subTasks?.length === 0 && (
                               <button 
                                 onClick={() => atomizeTask(task.id, task.title)}
                                 disabled={isAtomizing === task.id}
                                 className="btn-pill-3d bg-oku-lavender/40 border-oku-lavender text-oku-purple-dark !py-3 !px-8 !text-[9px]"
                               >
                                  {isAtomizing === task.id ? <Loader2 size={14} className="animate-spin" /> : <Split size={14} className="mr-2" />}
                                  Atomize
                               </button>
                            )}
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-4 text-oku-darkgrey/10 hover:text-red-500 transition-all hover:bg-red-50 rounded-full"
                            >
                              <Trash2 size={20} />
                            </button>
                         </div>
                      </div>

                      <AnimatePresence>
                        {task.subTasks?.length > 0 && (
                            <m.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-10 ml-20 space-y-6 pt-10 border-t border-oku-darkgrey/5"
                            >
                                {task.subTasks.map((sub: any) => (
                                    <div key={sub.id} className="flex items-center gap-8 group">
                                        <button onClick={() => toggleTask(sub.id, sub.isCompleted)} className={`transition-all duration-500 scale-[1.4] ${sub.isCompleted ? 'text-oku-matcha-dark' : 'text-oku-babyblue-dark hover:scale-[1.6]'}`}>
                                            {sub.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </button>
                                        <span className={`text-xl font-display italic flex-1 ${sub.isCompleted ? 'line-through text-oku-taupe opacity-50' : 'text-oku-darkgrey/80'}`}>{sub.title}</span>
                                        <button 
                                            onClick={() => deleteTask(sub.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-oku-darkgrey/10 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </m.div>
                        )}
                      </AnimatePresence>
                    </m.div>
                  ))}
                </AnimatePresence>
             </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DopamineMenu />
            <BrainDump />
          </div>
        </div>

        {/* 2. SIDECAR: SENSORY & ENERGY */}
        <div className="lg:col-span-4 space-y-12">
          
          <div className="relative group">
            <BodyDoublePresence 
              isActive={isSignalingFocus || (isActive && timerMode === 'work')} 
              currentTask={tasks.find(t => !t.isCompleted)?.title} 
            />
            <button 
                onClick={() => setIsSignalingFocus(!isSignalingFocus)}
                className={`absolute top-10 right-10 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shadow-sm ${isSignalingFocus ? 'bg-oku-matcha text-white' : 'bg-oku-lavender text-oku-purple-dark hover:bg-white border border-oku-lavender'}`}
            >
                {isSignalingFocus ? 'Focus Signaling Active' : 'Signal Focus'}
            </button>
          </div>

          {/* Spons (Energy) Tracker */}
          <m.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass-3d !p-12 !bg-white/60 border-none shadow-xl !rounded-[3rem]">
              <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-oku-darkgrey/40 uppercase tracking-[0.3em] text-[10px]">Spoon Reserves</h3>
                  <Battery size={24} className={energy < 30 ? 'text-red-500' : 'text-oku-purple-dark animate-pulse'} />
              </div>
              <div className="space-y-10">
                  <div className="h-6 bg-oku-lavender/20 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <m.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${energy}%` }}
                          className={`h-full transition-all duration-1000 ${energy < 30 ? 'bg-gradient-to-r from-red-400 to-rose-500' : 'bg-gradient-to-r from-oku-purple-dark to-oku-lavender-dark'} shadow-[0_0_20px_rgba(157,133,179,0.3)]`}
                      />
                  </div>
                  <div className="flex justify-between gap-2">
                      {[20, 40, 60, 80, 100].map(val => (
                          <button 
                              key={val} 
                              onClick={() => updateEnergy(val)}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all border ${energy === val ? 'bg-oku-dark text-white border-oku-dark shadow-2xl scale-110 z-10' : 'bg-white/40 text-oku-darkgrey/40 border-white hover:bg-white'}`}
                          >
                              {val}%
                          </button>
                      ))}
                  </div>
                  <div className="p-6 bg-oku-lavender/20 rounded-[2rem] border border-oku-lavender/40">
                    <p className="text-xs text-oku-darkgrey/60 italic text-center leading-relaxed font-display">
                        {energy < 40 ? "Energy is quiet. Move slowly. Stick to 'Atoms' only." : "Dopamine is high. A rare window for deep unfolding."}
                    </p>
                  </div>
              </div>
          </m.section>

          {/* Pomodoro Protocol */}
          <m.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-oku-dark text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-white/5 backdrop-blur-md">
                   <Clock size={14} className="text-oku-lavender animate-spin-slow" /> {timerMode === 'work' ? 'Phase: Deep Flow' : 'Phase: Dopamine Reset'}
                </div>
                <p className="text-9xl font-display font-bold tracking-tighter mb-12 tabular-nums text-white shadow-text-glow">{formatTime(timeLeft)}</p>
                <div className="flex items-center justify-center gap-8">
                   <button 
                     onClick={() => setIsActive(!isActive)} 
                     className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90 ${isActive ? 'bg-white/10 text-white border border-white/20' : 'bg-white text-oku-dark hover:scale-110'}`}
                   >
                      {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                   </button>
                   <button onClick={() => { setIsActive(false); setTimeLeft(25*60); }} className="p-6 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/5">
                      <RotateCcw size={28} />
                   </button>
                </div>
             </div>
             {/* Animated Progress Ring Background */}
             <m.div 
                className="absolute bottom-0 left-0 w-full h-2 bg-oku-purple-dark" 
                initial={{ width: '0%' }} 
                animate={{ width: `${(timeLeft / (timerMode === 'work' ? 25*60 : 5*60)) * 100}%` }}
             />
          </m.section>

          {/* Sensory Support */}
          <m.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card-glass-3d !p-12 !bg-oku-babyblue/30 border-none !rounded-[3rem]">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-oku-purple-dark">
                    <Volume2 size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-oku-darkgrey tracking-tight">Soundscape</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Sensory Shield</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {['White Noise', 'Soft Rain', 'Deep Forest', 'Brownian'].map(sound => (
                    <button 
                        key={sound}
                        onClick={() => setSoundscape(sound.toLowerCase())}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${soundscape === sound.toLowerCase() ? 'bg-oku-darkgrey text-white border-oku-darkgrey' : 'bg-white/40 text-oku-darkgrey/40 border-white hover:bg-white'}`}
                    >
                        {sound}
                    </button>
                ))}
             </div>
          </m.section>

          {/* Transition Support */}
          <m.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="card-glass-3d !p-12 !bg-oku-peach/30 border-none !rounded-[3rem]">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-orange-400">
                    <Wind size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-oku-darkgrey tracking-tight">Gear Shift</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Transition Support</p>
                </div>
             </div>
             <p className="text-xs italic text-oku-darkgrey/60 font-display leading-relaxed mb-8">
                "Transitions take more dopamine than we realize. Shift gears gently."
             </p>
             <div className="flex flex-col gap-3">
                <button 
                    onClick={() => { setTimerMode('break'); setTimeLeft(5*60); setIsActive(true); }}
                    className="w-full py-5 rounded-2xl bg-white/60 border border-white text-[10px] font-black uppercase tracking-widest text-oku-darkgrey hover:bg-white transition-all shadow-sm"
                >
                    5 Min Mind Exhale
                </button>
                <button 
                    onClick={() => { setTimerMode('transition'); setTimeLeft(15*60); setIsActive(true); }}
                    className="w-full py-5 rounded-2xl bg-white/60 border border-white text-[10px] font-black uppercase tracking-widest text-oku-darkgrey hover:bg-white transition-all shadow-sm"
                >
                    15 Min Reality Shift
                </button>
             </div>
          </m.section>
        </div>
      </div>
    </div>
  )
}
