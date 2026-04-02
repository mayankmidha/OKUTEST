'use client'

import { useState } from 'react'
import { ClipboardList, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function RoutineManager() {
  const [routines, setRoutines] = useState([
    { 
      id: '1', 
      title: 'Morning Momentum', 
      type: 'MORNING',
      items: [
        { id: 'i1', text: 'Hydrate (500ml)', done: false },
        { id: 'i2', text: 'Step outside for 2 mins', done: false },
        { id: 'i3', text: 'Eat high-protein breakfast', done: false }
      ]
    }
  ])

  const toggleItem = (routineId: string, itemId: string) => {
    setRoutines(routines.map(r => {
      if (r.id !== routineId) return r
      return {
        ...r,
        items: r.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i)
      }
    }))
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-oku-taupe/10 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-oku-babyblue/20 flex items-center justify-center text-oku-babyblue-dark">
            <ClipboardList size={24} />
        </div>
        <div>
            <h2 className="text-xl font-display font-bold text-oku-dark">Focus Routines</h2>
            <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40">Checklists for your autopilot</p>
        </div>
      </div>

      <div className="space-y-6">
        {routines.map(routine => (
          <div key={routine.id} className="bg-oku-lavender/10 rounded-3xl p-6 border border-oku-lavender/20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-oku-dark flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-oku-purple animate-pulse" />
                    {routine.title}
                </h3>
                <span className="text-[9px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-oku-lavender/30 text-oku-purple-dark">
                    {routine.type}
                </span>
            </div>
            
            <div className="space-y-3">
                {routine.items.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => toggleItem(routine.id, item.id)}
                        className="w-full flex items-center gap-3 p-3 bg-white/60 hover:bg-white rounded-2xl transition-all group border border-transparent hover:border-oku-lavender/30"
                    >
                        {item.done ? (
                            <CheckCircle2 size={18} className="text-oku-purple" />
                        ) : (
                            <Circle size={18} className="text-oku-darkgrey/20 group-hover:text-oku-purple/40" />
                        )}
                        <span className={`text-sm font-medium ${item.done ? 'text-oku-darkgrey/40 line-through' : 'text-oku-dark'}`}>
                            {item.text}
                        </span>
                    </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-4 bg-white border-2 border-dashed border-oku-lavender/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:bg-oku-lavender/10 transition-all flex items-center justify-center gap-2">
        <Plus size={14} /> Design New Routine
      </button>
    </div>
  )
}
