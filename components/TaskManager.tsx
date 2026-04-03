'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Loader2, CheckSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface Task {
  id: string
  title: string
  isCompleted: boolean
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        setTasks(await res.json())
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const tempId = Math.random().toString()
    setTasks([{ id: tempId, title: newTaskTitle, isCompleted: false }, ...tasks])
    setNewTaskTitle('')

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      })
      fetchTasks()
    } catch (e) {
      console.error(e)
    }
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !currentStatus } : t))
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus })
      })
    } catch (e) {
      console.error(e)
    }
  }

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-oku-cream-warm p-8 rounded-[2.5rem] border border-oku-taupe/10 flex flex-col h-full shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white rounded-2xl text-oku-purple-dark shadow-sm border border-oku-taupe/5">
          <CheckSquare size={20} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-oku-dark tracking-tight">To-Do List</h3>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60">Practice Management</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-6 relative">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-white border border-oku-taupe/10 rounded-full py-3 pl-5 pr-12 text-xs focus:outline-none focus:ring-2 focus:ring-oku-purple/20 transition-all shadow-sm"
        />
        <button type="submit" disabled={!newTaskTitle.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-oku-purple text-white rounded-full hover:bg-oku-dark transition-all disabled:opacity-50">
          <Plus size={14} strokeWidth={3} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10 text-oku-taupe"><Loader2 className="animate-spin" size={20} /></div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-xs italic text-oku-taupe opacity-60 py-10">You're all caught up!</p>
        ) : (
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center justify-between p-4 bg-white rounded-2xl border transition-all group ${task.isCompleted ? 'border-transparent opacity-50' : 'border-oku-taupe/5 shadow-sm hover:border-oku-purple/30'}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button onClick={() => toggleTask(task.id, task.isCompleted)} className="text-oku-purple hover:scale-110 transition-transform flex-shrink-0">
                    {task.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <span className={`text-sm font-medium truncate ${task.isCompleted ? 'line-through text-oku-taupe' : 'text-oku-dark'}`}>
                    {task.title}
                  </span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-oku-taupe hover:text-red-500 transition-all flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
