'use client'

import { useState, useEffect } from 'react'
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
    ChevronDown,
    ChevronUp,
    Clock,
    Focus,
    Flame,
    Coffee,
    Wind,
    Battery
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function ADHDWorkspace({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAtomizing, setIsAtomizing] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [energy, setEnergy] = useState(80) // "Spoons" tracking
  
  // Fetch initial energy
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
  
  // Pomodoro State
  const [timerMode, setTimerMode] = useState<'work' | 'break' | 'transition'>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

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

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
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
    <div className="grid lg:grid-cols-12 gap-10">
      
      {/* 1. Executive Function Hub */}
      <div className="lg:col-span-8 space-y-10">
        
        {/* The "Wall of Awful" Breaker */}
        <section className="bg-oku-dark text-white p-12 rounded-[4rem] relative overflow-hidden shadow-2xl group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-display font-bold tracking-tight">Stuck on something?</h2>
                    <p className="text-sm text-white/50">Beat the "Wall of Awful" by letting Oku break it down into 5-minute wins.</p>
                </div>
                <button 
                    onClick={() => {
                        const t = prompt("What's feelin' too big right now?");
                        if(t) {
                            addTask({ preventDefault: () => {} } as any); // Simple trigger
                        }
                    }}
                    className="btn-pebble bg-white text-oku-dark hover:bg-oku-lavender hover:scale-105 transition-all flex items-center gap-4"
                >
                    <Flame className="text-orange-500" size={20} /> Break the Wall
                </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </section>

        <section className="card-pebble">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Today's Atoms</h2>
                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/40 mt-1">Dopamine Ledger</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="bg-oku-matcha/20 px-4 py-2 rounded-full flex items-center gap-2 border border-oku-matcha/30">
                    <Zap size={14} className="text-oku-matcha-dark" />
                    <span className="text-[10px] font-black uppercase text-oku-matcha-dark">{streak} Win Streak</span>
                 </div>
              </div>
           </div>

           <form onSubmit={addTask} className="relative mb-12">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What is the ONE thing right now?"
                className="input-pebble text-xl py-8"
              />
              <button type="submit" className="absolute right-4 top-4 bottom-4 bg-oku-dark text-white px-8 rounded-2xl hover:bg-oku-purple transition-all shadow-xl active:scale-95">
                 <Plus size={24} />
              </button>
           </form>

           <div className="space-y-6">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div 
                    key={task.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-8 rounded-[3.5rem] border transition-all duration-700 ${task.isCompleted ? 'bg-oku-cream-warm/30 border-transparent opacity-40' : 'bg-white border-oku-taupe/10 shadow-sm hover:shadow-xl hover:border-oku-purple/20'}`}
                  >
                    <div className="flex items-center justify-between gap-6">
                       <div className="flex items-center gap-8 flex-1">
                          <button onClick={() => toggleTask(task.id, task.isCompleted)} className={`transition-all duration-500 scale-150 ${task.isCompleted ? 'text-oku-matcha-dark' : 'text-oku-purple hover:scale-125'}`}>
                             {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>
                          <div>
                            <p className={`text-2xl font-bold tracking-tight ${task.isCompleted ? 'line-through text-oku-taupe font-medium' : 'text-oku-dark'}`}>{task.title}</p>
                            {task.subTasks?.length > 0 && (
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="w-32 h-1 bg-oku-taupe/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-oku-purple transition-all duration-1000" 
                                            style={{ width: `${(task.subTasks.filter((s:any) => s.isCompleted).length / task.subTasks.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-oku-purple">
                                        {task.subTasks.filter((s:any) => s.isCompleted).length} / {task.subTasks.length} ATOMS
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
                               className="btn-pebble bg-oku-lavender text-oku-purple-dark border border-oku-lavender-dark/10"
                             >
                                {isAtomizing === task.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                Atomize
                             </button>
                          )}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-3 text-oku-taupe/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>

                    {task.subTasks?.length > 0 && (
                        <div className="mt-8 ml-16 space-y-4 pt-8 border-t border-oku-taupe/5">
                            {task.subTasks.map((sub: any) => (
                                <div key={sub.id} className="flex items-center gap-6 group">
                                    <button onClick={() => toggleTask(sub.id, sub.isCompleted)} className={`transition-transform duration-500 ${sub.isCompleted ? 'text-oku-matcha-dark' : 'text-oku-ocean hover:scale-125'}`}>
                                        {sub.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </button>
                                    <span className={`text-lg flex-1 ${sub.isCompleted ? 'line-through text-oku-taupe opacity-50' : 'text-oku-dark font-medium'}`}>{sub.title}</span>
                                    <button 
                                        onClick={() => deleteTask(sub.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-oku-taupe/30 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </section>
      </div>

      {/* 2. Sidecar: Energy & Flow */}
      <div className="lg:col-span-4 space-y-10">
        
        {/* Spoons (Energy) Tracker */}
        <section className="bg-white p-10 rounded-[3rem] border border-oku-taupe/5 shadow-premium">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-oku-dark uppercase tracking-widest text-[10px]">Spoon Level (Energy)</h3>
                <Battery size={18} className={energy < 30 ? 'text-red-500' : 'text-oku-matcha-dark'} />
            </div>
            <div className="space-y-6">
                <div className="h-4 bg-oku-cream-warm rounded-full overflow-hidden border border-oku-taupe/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${energy}%` }}
                        className={`h-full transition-all duration-1000 ${energy < 30 ? 'bg-red-400' : 'bg-oku-purple'}`}
                    />
                </div>
                <div className="flex justify-between">
                    {[20, 40, 60, 80, 100].map(val => (
                        <button 
                            key={val} 
                            onClick={() => updateEnergy(val)}
                            className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${energy === val ? 'bg-oku-dark text-white scale-110 shadow-xl' : 'bg-oku-cream-warm text-oku-taupe hover:bg-oku-lavender'}`}
                        >
                            {val}%
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-oku-taupe italic text-center leading-relaxed">
                    {energy < 40 ? "Energy low. Stick to small 'atoms' only." : "Energy high. Great time for deep focus."}
                </p>
            </div>
        </section>

        {/* Pomodoro Flow */}
        <section className="bg-oku-dark text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest mb-8 border border-white/5">
                 <Clock size={12} className="text-oku-lavender" /> {timerMode === 'work' ? 'Deep Work Phase' : 'Dopamine Reset'}
              </div>
              <p className="text-8xl font-display font-bold tracking-tighter mb-10 tabular-nums">{formatTime(timeLeft)}</p>
              <div className="flex items-center justify-center gap-6">
                 <button 
                   onClick={() => setIsActive(!isActive)} 
                   className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-90 ${isActive ? 'bg-white/10 text-white' : 'bg-white text-oku-dark hover:scale-105'}`}
                 >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </button>
                 <button onClick={() => { setIsActive(false); setTimeLeft(25*60); }} className="p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                    <RotateCcw size={24} />
                 </button>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
                <motion.div 
                    className="h-full bg-oku-purple" 
                    initial={{ width: '0%' }} 
                    animate={{ width: `${(timeLeft / (timerMode === 'work' ? 25*60 : 5*60)) * 100}%` }}
                />
           </div>
        </section>

        {/* Sensory Break / Transition Support */}
        <section className="bg-oku-lavender p-10 rounded-[3rem] text-oku-purple-dark border border-oku-purple/20">
           <div className="flex items-center gap-4 mb-6">
              <Wind size={24} />
              <h3 className="font-bold">Transition Gear</h3>
           </div>
           <p className="text-[11px] font-medium leading-relaxed mb-8 opacity-70">
              ADHD transitions are hard. Need to switch from work to personal?
           </p>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setTimerMode('break'); setTimeLeft(5*60); setIsActive(true); }} className="p-4 bg-white/50 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all">5 Min Reset</button>
              <button onClick={() => { setTimerMode('transition'); setTimeLeft(15*60); setIsActive(true); }} className="p-4 bg-white/50 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all">15 Min Gear Shift</button>
           </div>
        </section>
      </div>
    </div>
  )
}
