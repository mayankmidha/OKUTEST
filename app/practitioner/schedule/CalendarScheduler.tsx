'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ShieldAlert, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react'
import { updateWeeklyAvailability, addAvailabilityOverride, blockDate, deleteOverride, deleteBlockedDate } from './actions'
import { DashboardCard } from '@/components/DashboardCard'

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
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Standard Weekly Hours</h2>
          <button onClick={saveWeekly} className="btn-primary py-3 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Save Template</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {days.map((day, idx) => {
            const avail = weekly.find(w => w.dayOfWeek === idx)
            return (
              <DashboardCard key={idx} className="p-6 group hover:border-oku-purple/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-oku-dark">{day}</span>
                  <div className="flex items-center gap-3">
                    <input 
                      type="time" 
                      value={avail?.startTime || '09:00'} 
                      onChange={(e) => handleWeeklyChange(idx, 'startTime', e.target.value)}
                      className="bg-oku-cream/50 border border-oku-taupe/10 px-3 py-2 rounded-xl text-xs outline-none focus:border-oku-purple font-bold"
                    />
                    <span className="text-oku-taupe text-[8px] font-black uppercase tracking-widest opacity-40">to</span>
                    <input 
                      type="time" 
                      value={avail?.endTime || '17:00'} 
                      onChange={(e) => handleWeeklyChange(idx, 'endTime', e.target.value)}
                      className="bg-oku-cream/50 border border-oku-taupe/10 px-3 py-2 rounded-xl text-xs outline-none focus:border-oku-purple font-bold"
                    />
                  </div>
                </div>
              </DashboardCard>
            )
          })}
        </div>
      </section>

      {/* 2. Overrides & Blocked Dates */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Specific Date Overrides */}
        <DashboardCard title="Exceptions" subtitle="Specific Date Overrides" icon={CalendarIcon}>
          <div className="space-y-4 mt-4">
            {overrides.length === 0 && !isAddingOverride && (
              <p className="text-xs text-oku-taupe italic opacity-60 py-10 text-center">No specific date overrides found.</p>
            )}

            {isAddingOverride && (
              <div className="p-6 bg-oku-purple/5 border border-oku-purple/20 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">New Exception</p>
                   <button onClick={() => setIsAddingOverride(false)} className="p-1 hover:bg-white rounded-full transition-colors"><X size={14} /></button>
                </div>
                <input 
                  type="date" 
                  value={newOverride.date}
                  onChange={(e) => setNewOverride({...newOverride, date: e.target.value})}
                  className="w-full bg-white border border-oku-taupe/10 p-4 rounded-2xl text-xs outline-none focus:border-oku-purple"
                />
                <div className="flex items-center gap-3">
                  <input 
                    type="time" 
                    value={newOverride.startTime}
                    onChange={(e) => setNewOverride({...newOverride, startTime: e.target.value})}
                    className="flex-1 bg-white border border-oku-taupe/10 p-4 rounded-2xl text-xs outline-none focus:border-oku-purple font-bold"
                  />
                  <input 
                    type="time" 
                    value={newOverride.endTime}
                    onChange={(e) => setNewOverride({...newOverride, endTime: e.target.value})}
                    className="flex-1 bg-white border border-oku-taupe/10 p-4 rounded-2xl text-xs outline-none focus:border-oku-purple font-bold"
                  />
                </div>
                <button 
                  onClick={async () => {
                    await addAvailabilityOverride({ date: new Date(newOverride.date), startTime: newOverride.startTime, endTime: newOverride.endTime, isAvailable: true })
                    setIsAddingOverride(false)
                  }}
                  className="w-full bg-oku-dark text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-all shadow-lg"
                >
                  Confirm Override
                </button>
              </div>
            )}

            {!isAddingOverride && (
               <button onClick={() => setIsAddingOverride(true)} className="w-full py-4 border-2 border-dashed border-oku-taupe/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-purple hover:border-oku-purple/30 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Add One-time Exception
               </button>
            )}

            {overrides.map(ov => (
              <div key={ov.id} className="flex items-center justify-between p-5 bg-oku-cream/30 rounded-[2rem] border border-oku-taupe/5 group hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-oku-purple shadow-sm">
                      <CalendarIcon size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-oku-dark">{new Date(ov.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                     <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black mt-0.5">{ov.startTime} - {ov.endTime}</p>
                   </div>
                </div>
                <button onClick={() => deleteOverride(ov.id)} className="p-2 text-oku-taupe hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Blocked Dates / Vacation */}
        <DashboardCard title="Away Mode" subtitle="Time Off & Vacation" icon={AlertTriangle} variant="dark" className="relative overflow-hidden group shadow-oku-purple/10">
          <div className="relative z-10 mt-4 space-y-4">
            <button 
              onClick={async () => {
                const date = prompt('Enter date (YYYY-MM-DD):')
                if(date) await blockDate({ date: new Date(date), reason: 'Out of office' })
              }}
              className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Plus size={14} /> Schedule Time Off
            </button>

            {blockedDates.length === 0 && (
              <p className="text-xs text-white/40 italic py-10 text-center">No time off scheduled.</p>
            )}
            {blockedDates.map(bd => (
              <div key={bd.id} className="flex items-center justify-between p-5 bg-white/5 rounded-[2rem] border border-white/5 group/bd hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <Clock size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-bold">{new Date(bd.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                     <p className="text-[10px] opacity-40 uppercase tracking-widest font-black mt-0.5">{bd.reason || 'Blocked'}</p>
                   </div>
                </div>
                <button onClick={() => deleteBlockedDate(bd.id)} className="opacity-0 group-hover/bd:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/5 rounded-full blur-3xl" />
        </DashboardCard>
      </div>
    </div>
  )
}
