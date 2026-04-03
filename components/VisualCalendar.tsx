'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Video, User } from 'lucide-react'
import Link from 'next/link'

export function VisualCalendar({ appointments }: { appointments: any[] }) {
  // Start with current date, find Monday of this week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    return new Date(d.setDate(diff))
  })

  const nextWeek = () => {
    const next = new Date(currentWeekStart)
    next.setDate(next.getDate() + 7)
    setCurrentWeekStart(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentWeekStart)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeekStart(prev)
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Generate dates for the current view
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  // Format YYYY-MM-DD for easy comparison
  const formatDateStr = (d: Date) => d.toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden mb-12">
      {/* Calendar Header */}
      <div className="p-8 border-b border-oku-taupe/10 flex items-center justify-between bg-oku-cream-warm/30">
        <div>
          <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Schedule Viewer</h2>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-3 bg-white rounded-full border border-oku-taupe/10 hover:border-oku-purple hover:text-oku-purple transition-all shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentWeekStart(new Date())} className="px-6 py-3 bg-white rounded-full border border-oku-taupe/10 text-[10px] font-black uppercase tracking-widest hover:border-oku-purple hover:text-oku-purple transition-all shadow-sm">
            Today
          </button>
          <button onClick={nextWeek} className="p-3 bg-white rounded-full border border-oku-taupe/10 hover:border-oku-purple hover:text-oku-purple transition-all shadow-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-oku-taupe/5 bg-white min-h-[400px]">
        {weekDates.map((date, idx) => {
          const dateStr = formatDateStr(date)
          const isToday = dateStr === formatDateStr(new Date())
          
          // Find appointments for this specific day
          const dayAppointments = appointments.filter(a => {
             const apptDateStr = new Date(a.startTime).toISOString().split('T')[0]
             return apptDateStr === dateStr && a.status !== 'CANCELLED'
          }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

          return (
            <div key={dateStr} className={`flex flex-col ${isToday ? 'bg-oku-purple/5' : ''}`}>
              {/* Day Header */}
              <div className={`p-4 text-center border-b border-oku-taupe/5 ${isToday ? 'border-oku-purple/20' : ''}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isToday ? 'text-oku-purple' : 'text-oku-taupe'}`}>
                  {days[idx]}
                </p>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${isToday ? 'bg-oku-purple text-white shadow-md' : 'text-oku-dark'}`}>
                  {date.getDate()}
                </div>
              </div>

              {/* Day Slots */}
              <div className="flex-1 p-2 space-y-2 relative">
                {dayAppointments.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                     <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/40">Open</span>
                  </div>
                ) : (
                  dayAppointments.map(appt => {
                    const time = new Date(appt.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                    const isCompleted = appt.status === 'COMPLETED' || appt.status === 'NO_SHOW'
                    
                    return (
                      <Link key={appt.id} href={isCompleted ? `/practitioner/sessions/${appt.id}/notes` : `/session/${appt.id}`}>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-colors shadow-sm ${
                            isCompleted 
                              ? 'bg-oku-cream-warm/50 border-oku-taupe/10 opacity-70' 
                              : 'bg-oku-dark text-white border-oku-dark shadow-oku-purple/20 hover:bg-oku-purple hover:border-oku-purple'
                          }`}
                        >
                          <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-oku-taupe' : 'text-white/60'}`}>
                            {time}
                          </p>
                          <p className="text-xs font-bold truncate leading-tight mb-1">
                            {appt.client.name}
                          </p>
                          {!isCompleted && (
                             <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-black text-white/50">
                                <Video size={10} /> Video
                             </div>
                          )}
                        </motion.div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
