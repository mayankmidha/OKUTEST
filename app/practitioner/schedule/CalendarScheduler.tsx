'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ShieldAlert, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { updateWeeklyAvailability, addAvailabilityOverride, blockDate, deleteOverride, deleteBlockedDate } from './actions'

export default function CalendarScheduler({ 
  initialAvailability, 
  overrides, 
  blockedDates 
}: { 
  initialAvailability: any[], 
  overrides: any[], 
  blockedDates: any[] 
}) {
  const [weekly, setWeekly] = useState(initialAvailability)
  const [isAddingOverride, setIsAddingOverride] = useState(false)
  const [newOverride, setNewOverride] = useState({ date: '', startTime: '09:00', endTime: '17:00' })
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleWeeklyChange = (dayIdx: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...weekly]
    const existing = updated.find(w => w.dayOfWeek === dayIdx)
    if (existing) {
      existing[field] = value
    } else {
      updated.push({ dayOfWeek: dayIdx, startTime: '09:00', endTime: '17:00', [field]: value })
    }
    setWeekly(updated)
  }

  const saveWeekly = async () => {
    await updateWeeklyAvailability(weekly)
    alert('Weekly hours updated')
  }

  return (
    <div className="space-y-12">
      {/* 1. Recurring Weekly Schedule */}
      <section className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Recurring Weekly Hours</h2>
            <p className="text-sm text-oku-taupe font-display italic mt-1">Set your standard working hours for each day.</p>
          </div>
          <button onClick={saveWeekly} className="btn-primary py-3 px-8 text-[10px] font-black uppercase tracking-widest shadow-lg">Save Weekly</button>
        </div>

        <div className="space-y-4">
          {days.map((day, idx) => {
            const avail = weekly.find(w => w.dayOfWeek === idx)
            return (
              <div key={idx} className="flex items-center justify-between p-6 bg-oku-cream/30 rounded-2xl border border-oku-taupe/5 group hover:bg-white hover:border-oku-purple/20 transition-all">
                <span className="text-sm font-bold text-oku-dark w-32">{day}</span>
                <div className="flex items-center gap-4">
                  <input 
                    type="time" 
                    value={avail?.startTime || '09:00'} 
                    onChange={(e) => handleWeeklyChange(idx, 'startTime', e.target.value)}
                    className="bg-white border border-oku-taupe/10 px-4 py-2 rounded-xl text-xs outline-none focus:border-oku-purple"
                  />
                  <span className="text-oku-taupe text-[10px] font-black uppercase tracking-widest">to</span>
                  <input 
                    type="time" 
                    value={avail?.endTime || '17:00'} 
                    onChange={(e) => handleWeeklyChange(idx, 'endTime', e.target.value)}
                    className="bg-white border border-oku-taupe/10 px-4 py-2 rounded-xl text-xs outline-none focus:border-oku-purple"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. Overrides & Blocked Dates */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Specific Date Overrides */}
        <section className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold text-oku-dark tracking-tight">Date Overrides</h2>
            <button onClick={() => setIsAddingOverride(true)} className="p-2 rounded-full bg-oku-purple/10 text-oku-purple hover:bg-oku-purple hover:text-white transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {overrides.length === 0 && !isAddingOverride && (
              <p className="text-xs text-oku-taupe italic opacity-60 py-4">No specific date overrides set.</p>
            )}

            {isAddingOverride && (
              <div className="p-6 bg-oku-purple/5 border border-oku-purple/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">New Override</p>
                   <button onClick={() => setIsAddingOverride(false)}><X size={14} /></button>
                </div>
                <input 
                  type="date" 
                  value={newOverride.date}
                  onChange={(e) => setNewOverride({...newOverride, date: e.target.value})}
                  className="w-full bg-white border border-oku-taupe/10 p-3 rounded-xl text-xs outline-none"
                />
                <div className="flex items-center gap-3">
                  <input 
                    type="time" 
                    value={newOverride.startTime}
                    onChange={(e) => setNewOverride({...newOverride, startTime: e.target.value})}
                    className="flex-1 bg-white border border-oku-taupe/10 p-3 rounded-xl text-xs outline-none"
                  />
                  <input 
                    type="time" 
                    value={newOverride.endTime}
                    onChange={(e) => setNewOverride({...newOverride, endTime: e.target.value})}
                    className="flex-1 bg-white border border-oku-taupe/10 p-3 rounded-xl text-xs outline-none"
                  />
                </div>
                <button 
                  onClick={async () => {
                    await addAvailabilityOverride({ date: new Date(newOverride.date), startTime: newOverride.startTime, endTime: newOverride.endTime, isAvailable: true })
                    setIsAddingOverride(false)
                  }}
                  className="w-full bg-oku-dark text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-all"
                >
                  Add Override
                </button>
              </div>
            )}

            {overrides.map(ov => (
              <div key={ov.id} className="flex items-center justify-between p-4 bg-oku-cream/30 rounded-2xl border border-oku-taupe/5">
                <div>
                  <p className="text-sm font-bold text-oku-dark">{new Date(ov.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black">{ov.startTime} - {ov.endTime}</p>
                </div>
                <button onClick={() => deleteOverride(ov.id)} className="p-2 text-oku-taupe hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* Blocked Dates / Vacation */}
        <section className="bg-oku-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold tracking-tight">Blocked Dates</h2>
              <button 
                onClick={async () => {
                  const date = prompt('Enter date (YYYY-MM-DD):')
                  if(date) await blockDate({ date: new Date(date), reason: 'Out of office' })
                }}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-oku-purple transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {blockedDates.length === 0 && (
                <p className="text-xs text-white/40 italic py-4">No blocked dates scheduled.</p>
              )}
              {blockedDates.map(bd => (
                <div key={bd.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                  <div>
                    <p className="text-sm font-bold">{new Date(bd.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-black">{bd.reason || 'Blocked'}</p>
                  </div>
                  <button onClick={() => deleteBlockedDate(bd.id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/5 rounded-full blur-3xl" />
        </section>
      </div>
    </div>
  )
}
