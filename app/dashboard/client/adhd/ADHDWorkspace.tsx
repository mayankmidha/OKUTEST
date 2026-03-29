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
    Focus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function ADHDWorkspace({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAtomizing, setIsAtomizing] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  
  // Pomodoro State
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work')
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
      // Play a subtle sound or notification here
      if (timerMode === 'work') {
          confetti({ particleCount: 150, spread: 100 })
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

  const toggleTask = async (id: string, currentStatus: boolean, parentId?: string | null) => {
    // Optimistic Update
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
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#A5B4FC', '#6366F1', '#4F46E5']
        })
    }

    await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus })
    })
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
      
      {/* 1. The Main Focus Center */}
      <div className="lg:col-span-8 space-y-8">
        <section className="bg-white p-10 rounded-[3rem] border border-oku-taupe/5 shadow-premium">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Focus Ledger</h2>
              <Zap className="text-oku-purple opacity-40" />
           </div>

           <form onSubmit={addTask} className="relative mb-10">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What is the ONE thing right now?"
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-6 pr-20 text-lg outline-none focus:border-oku-purple transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-3 bottom-3 bg-oku-dark text-white px-6 rounded-xl hover:bg-oku-purple transition-all shadow-xl">
                 <Plus size={20} />
              </button>
           </form>

           <div className="space-y-6">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div 
                    key={task.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-[2rem] border transition-all ${task.isCompleted ? 'bg-oku-cream/30 border-transparent opacity-60' : 'bg-white border-oku-taupe/10 shadow-sm hover:shadow-md'}`}
                  >
                    <div className="flex items-center justify-between gap-6">
                       <div className="flex items-center gap-6 flex-1">
                          <button onClick={() => toggleTask(task.id, task.isCompleted)} className="text-oku-purple scale-125">
                             {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>
                          <div>
                            <p className={`text-xl font-bold ${task.isCompleted ? 'line-through text-oku-taupe' : 'text-oku-dark'}`}>{task.title}</p>
                            {task.subTasks?.length > 0 && (
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple-dark mt-1">
                                    {task.subTasks.filter((s:any) => s.isCompleted).length} / {task.subTasks.length} ATOMS COMPLETE
                                </p>
                            )}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          {!task.isCompleted && task.subTasks?.length === 0 && (
                             <button 
                               onClick={() => atomizeTask(task.id, task.title)}
                               disabled={isAtomizing === task.id}
                               className="flex items-center gap-2 px-4 py-2 bg-oku-purple/10 text-oku-purple-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple hover:text-white transition-all"
                             >
                                {isAtomizing === task.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                Atomize
                             </button>
                          )}
                          <button className="p-2 text-oku-taupe/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </div>

                    {/* Subtasks (Atoms) */}
                    {task.subTasks?.length > 0 && (
                        <div className="mt-6 ml-12 space-y-3 pt-6 border-t border-oku-taupe/5">
                            {task.subTasks.map((sub: any) => (
                                <div key={sub.id} className="flex items-center gap-4 group">
                                    <button onClick={() => toggleTask(sub.id, sub.isCompleted, task.id)} className="text-oku-ocean">
                                        {sub.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                    </button>
                                    <span className={`text-sm ${sub.isCompleted ? 'line-through text-oku-taupe' : 'text-oku-dark font-medium'}`}>{sub.title}</span>
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

      {/* 2. Sidecar: Dopamine & Pacing */}
      <div className="lg:col-span-4 space-y-8">
        {/* Pomodoro Timer */}
        <section className="bg-oku-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                 <Clock size={12} /> {timerMode === 'work' ? 'Sprint Phase' : 'Dopamine Break'}
              </div>
              <p className="text-7xl font-display font-bold tracking-tighter mb-8">{formatTime(timeLeft)}</p>
              <div className="flex items-center justify-center gap-4">
                 <button 
                   onClick={toggleTimer} 
                   className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-white text-oku-dark'}`}
                 >
                    {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                 </button>
                 <button onClick={resetTimer} className="p-4 bg-white/5 rounded-full hover:bg-white/10">
                    <RotateCcw size={20} />
                 </button>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
                <motion.div 
                    className="h-full bg-oku-purple" 
                    initial={{ width: '0%' }} 
                    animate={{ width: `${(timeLeft / (timerMode === 'work' ? 25*60 : 5*60)) * 100}%` }}
                />
           </div>
        </section>

        {/* Body Doubling Placeholder */}
        <section className="bg-oku-ocean p-10 rounded-[3rem] text-white">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <Focus size={24} />
                 <h3 className="font-bold">Body Doubling</h3>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                 <PartyPopper size={14} className="text-oku-matcha" />
                 <span className="text-[10px] font-black">{streak} Streak</span>
              </div>
           </div>
           
           <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 mb-8 flex flex-col items-center text-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-oku-lavender rounded-full flex items-center justify-center text-oku-dark text-3xl mb-4 shadow-xl"
              >
                🧠
              </motion.div>
              <p className="font-bold mb-1">OCI Buddy</p>
              <p className="text-[10px] text-white/50 italic leading-relaxed">"I'm focusing with you. Let's get through this next atom together."</p>
           </div>
           
           <p className="text-xs text-white/60 leading-relaxed mb-6">
              Knowing someone else is working increases your completion rate by 80%.
           </p>
        </section>
      </div>
    </div>
  )
}
