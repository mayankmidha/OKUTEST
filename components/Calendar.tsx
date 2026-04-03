'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

interface CalendarProps {
  appointments: any[]
}

export default function Calendar({ appointments }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i)

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
  }

  const hasAppointment = (day: number) => {
    return appointments.some(apt => {
      const d = new Date(apt.date)
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    })
  }

  const getAppointmentsForDate = (day: number | null) => {
    if (!day) return []
    return appointments.filter(apt => {
      const d = new Date(apt.date)
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    })
  }

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate.getDate()) : []

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-display font-bold text-oku-dark uppercase tracking-tighter">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-oku-cream-warm rounded-full transition-colors"
          >
            ←
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-oku-cream-warm rounded-full transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] uppercase tracking-widest font-black text-oku-taupe/50 py-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div 
            key={i}
            onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            className={`
              relative aspect-square flex items-center justify-center rounded-2xl cursor-pointer transition-all text-sm font-medium
              ${!day ? 'invisible' : 'hover:bg-oku-purple/10'}
              ${day && isToday(day) ? 'bg-oku-dark text-white shadow-lg scale-110 z-10' : 'text-oku-dark'}
              ${day && selectedDate?.getDate() === day ? 'border-2 border-oku-purple' : ''}
            `}
          >
            {day}
            {day && hasAppointment(day) && (
              <div className={`absolute bottom-2 w-1 h-1 rounded-full ${isToday(day) ? 'bg-white' : 'bg-oku-purple'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-[0.3em] font-black text-oku-taupe">
          Schedule for {selectedDate?.toLocaleDateString()}
        </h4>
        {selectedAppointments.length === 0 ? (
          <p className="text-sm italic text-oku-taupe font-display">No sessions scheduled.</p>
        ) : (
          selectedAppointments.map((apt: any) => (
            <div key={apt.id} className="bg-white p-4 rounded-2xl border border-oku-taupe/5 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-bold text-oku-dark text-sm">{apt.client.name}</p>
                <p className="text-[10px] text-oku-taupe uppercase tracking-widest">
                  {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter bg-oku-cream-warm px-2 py-1 rounded-md text-oku-dark">
                {apt.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
