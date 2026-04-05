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
    TrendingUp,
    ChevronRight
} from 'lucide-react'
import { motion as m, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { BodyDoublePresence } from './BodyDoublePresence'
import { DopamineMenu } from './DopamineMenu'
import { BrainDump } from './BrainDump'
import { RoutineManager } from './RoutineManager'
import { DailyTracker } from './DailyTracker'

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
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        }
    } finally {
        setIsAtomizing(null)
    }
  }

  return (
    <div className="relative z-10">
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* 1. PRIMARY WORKSPACE */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* AI Strategy Bar */}
          <m.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass-3d !p-12 !bg-oku-darkgrey text-white relative overflow-hidden group shadow-2xl !rounded-[3rem]"
          >
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-4">
                        <Brain className="text-oku-lavender" size={28} />
                        Smart Strategy
                    </h2>
                    <p className="text-sm text-white/40 italic font-display">Let AI align your energy with your goals.</p>
                </div>
                <button 
                    onClick={generateStrategy}
                    disabled={isGeneratingStrategy}
                    className="btn-pill-3d bg-white text-oku-darkgrey !py-4 !px-10 flex items-center gap-3 hover:scale-105 transition-all"
                >
                    {isGeneratingStrategy ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-oku-purple-dark" />}
                    Generate Daily Path
                </button>
             </div>
             {aiStrategy && (
                <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-sm text-oku-lavender font-display leading-relaxed italic">{aiStrategy.strategy}</p>
                </m.div>
             )}
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple-dark/10 rounded-full blur-[100px]" />
          </m.section>

          {/* TASK PLANNER (The 3-Task Rule) */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h2 className="heading-display text-3xl tracking-tight">Today&apos;s <span className="italic">Focus</span></h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">{tasks.filter(t => !t.isCompleted).length}/3 Slots Used</span>
             </div>

             <form onSubmit={addTask} className="relative group">
                <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter a task (Remember: 3 items max)..."
                    className="w-full bg-white/60 backdrop-blur-md border-2 border-white rounded-[2.5rem] p-8 pr-32 text-xl font-display italic focus:outline-none focus:border-oku-purple-dark/30 transition-all shadow-xl placeholder:text-oku-darkgrey/20"
                />
                <button className="absolute right-4 top-4 p-4 rounded-2xl bg-oku-darkgrey text-white hover:bg-oku-darkgrey transition-all">
                    <Plus size={24} />
                </button>
             </form>

             <div className="space-y-6">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <m.div 
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${task.isCompleted ? 'bg-oku-lavender/10 border-transparent opacity-60' : 'bg-white border-white/60 hover:border-oku-purple-dark/30 shadow-sm'}`}
                    >
                        <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-8">
                                <button onClick={() => toggleTask(task.id, task.isCompleted)} className="transition-transform active:scale-90">
                                    {task.isCompleted ? <CheckCircle2 size={32} className="text-oku-purple-dark" /> : <Circle size={32} className="text-oku-darkgrey/10 group-hover:text-oku-purple-dark/40" />}
                                </button>
                                <div>
                                    <h3 className={`text-2xl font-display font-bold tracking-tight ${task.isCompleted ? 'line-through text-oku-darkgrey/40' : ''}`}>{task.title}</h3>
                                    {task.subTasks?.length > 0 && (
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="w-48 h-1.5 bg-oku-lavender/20 rounded-full overflow-hidden border border-white/10">
                                                <m.div 
                                                    className="h-full bg-oku-purple-dark shadow-[0_0_8px_rgba(157,133,179,0.5)]" 
                                                    animate={{ width: `${(task.subTasks.filter((st:any) => st.isCompleted).length / task.subTasks.length) * 100}%` }} 
                                                />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                                                {task.subTasks.filter((st:any) => st.isCompleted).length}/{task.subTasks.length} Atoms
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => atomizeTask(task.id, task.title)}
                                    disabled={isAtomizing === task.id}
                                    className="p-4 rounded-2xl bg-oku-lavender/40 text-oku-purple-dark hover:bg-oku-lavender transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                                >
                                    {isAtomizing === task.id ? <Loader2 size={16} className="animate-spin" /> : <Split size={16} />} 
                                    Atomize
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="p-4 rounded-2xl hover:bg-oku-blush/20 text-oku-darkgrey/20 hover:text-oku-blush transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* SUBTASKS */}
                        <AnimatePresence>
                            {task.subTasks?.length > 0 && (
                                <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 pt-8 border-t border-oku-darkgrey/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {task.subTasks.map((st: any) => (
                                        <button 
                                            key={st.id}
                                            onClick={() => toggleTask(st.id, st.isCompleted)}
                                            className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${st.isCompleted ? 'bg-oku-lavender/5 border-transparent opacity-50' : 'bg-white/40 border-white hover:bg-white hover:shadow-sm'}`}
                                        >
                                            {st.isCompleted ? <CheckCircle2 size={16} className="text-oku-purple-dark" /> : <Circle size={16} className="text-oku-darkgrey/20" />}
                                            <span className={`text-xs font-bold ${st.isCompleted ? 'line-through' : ''}`}>{st.title}</span>
                                        </button>
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

          <RoutineManager />
        </div>

        {/* 2. SIDECAR: ENERGY & LOGS */}
        <div className="lg:col-span-4 space-y-12">
          <DailyTracker />
        </div>
      </div>
    </div>
  )
}
