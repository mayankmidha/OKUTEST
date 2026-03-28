'use client'

import { useState } from 'react'
import { Calendar, Clock, ArrowRight, CheckCircle2, Loader2, Info } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { type ExchangeRateTable, formatCurrency, localizeAmount } from '@/lib/currency'

export default function BookingClient({
  practitioner,
  services,
  availableSlots,
  sessionPriceInInr,
  pricingRegion,
  viewerCurrency,
  exchangeRates,
}: {
  practitioner: any
  services: any[]
  availableSlots: any[]
  sessionPriceInInr: number
  pricingRegion: string
  viewerCurrency: string
  exchangeRates: ExchangeRateTable
}) {
    const [selectedService, setSelectedService] = useState(services[0]?.id)
    const [selectedDate, setSelectedDate] = useState(availableSlots[0]?.date)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const activeService = services.find(s => s.id === selectedService)
    const activeDay = availableSlots.find(d => d.date === selectedDate)
    const localizedSessionPrice = localizeAmount(
        sessionPriceInInr,
        undefined,
        'INR',
        exchangeRates,
        viewerCurrency
    )
    const displaySessionPrice = formatCurrency(localizedSessionPrice.amount, localizedSessionPrice.currency)
    const baseSessionPrice = formatCurrency(sessionPriceInInr, 'INR')

    const handleConfirm = () => {
        if(!selectedService || !selectedDate || !selectedTime) return;
        setIsSubmitting(true)
        
        // create a form and submit it to use the existing server action
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = '/api/sessions/create'

        const therapistIdInput = document.createElement('input')
        therapistIdInput.type = 'hidden'
        therapistIdInput.name = 'therapistId'
        therapistIdInput.value = practitioner.id
        form.appendChild(therapistIdInput)

        const dateInput = document.createElement('input')
        dateInput.type = 'hidden'
        dateInput.name = 'date'
        dateInput.value = new Date(selectedDate).toISOString()
        form.appendChild(dateInput)

        const timeInput = document.createElement('input')
        timeInput.type = 'hidden'
        timeInput.name = 'time'
        timeInput.value = selectedTime
        form.appendChild(timeInput)

        const serviceIdInput = document.createElement('input')
        serviceIdInput.type = 'hidden'
        serviceIdInput.name = 'serviceId'
        serviceIdInput.value = selectedService
        form.appendChild(serviceIdInput)

        document.body.appendChild(form)
        form.submit()
    }

    return (
        <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Details & Service Selection */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border border-oku-taupe/10 shadow-xl">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-oku-cream shadow-inner">
                            {practitioner.user.avatar ? (
                                <img src={practitioner.user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-oku-purple/10 flex items-center justify-center text-3xl">🧘</div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-oku-dark">{practitioner.user.name}</h2>
                            <p className="text-oku-purple font-script text-xl">Psychotherapist</p>
                        </div>
                    </div>
                    <p className="text-sm text-oku-taupe leading-relaxed italic border-l-2 border-oku-purple/20 pl-4 py-1">"{practitioner.bio}"</p>
                </div>

                <div className="bg-oku-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h3 className="text-2xl font-display font-bold mb-6 tracking-tighter relative z-10">Select Session Type</h3>
                    <div className="space-y-4 relative z-10">
                        {services.map(s => {
                            const isSelected = selectedService === s.id
                            return (
                                <button 
                                    key={s.id}
                                    onClick={() => setSelectedService(s.id)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all ${
                                        isSelected ? 'bg-white text-oku-dark border-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold">{s.name}</p>
                                        <p className={`font-display font-bold text-xl ${isSelected ? 'text-oku-purple' : ''}`}>{displaySessionPrice}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-black ${isSelected ? 'text-oku-taupe' : 'text-white/40'}`}>
                                        <Clock size={12} /> {s.duration} minutes
                                    </div>
                                    <p className={`mt-3 text-[10px] uppercase tracking-widest ${isSelected ? 'text-oku-taupe/80' : 'text-white/40'}`}>
                                        {pricingRegion === 'INDIA' ? 'India pricing' : 'International pricing'} • Base {baseSessionPrice}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            </div>

            {/* Right Column: Calendar & Slots */}
            <div className="lg:col-span-7 bg-white p-10 md:p-12 rounded-[3.5rem] border border-oku-taupe/10 shadow-xl">
                <h3 className="text-3xl font-display font-bold text-oku-dark tracking-tighter mb-8 flex items-center gap-3">
                    <Calendar className="text-oku-purple" /> Select Date & Time
                </h3>

                {availableSlots.length === 0 ? (
                    <div className="py-20 text-center bg-oku-cream/30 rounded-3xl border border-dashed border-oku-taupe/20">
                        <p className="text-oku-taupe font-display italic text-xl">No available slots found for this therapist.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Date Carousel */}
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4">Available Days</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {availableSlots.map(day => {
                                    const dateObj = new Date(day.date)
                                    const isSelected = selectedDate === day.date
                                    return (
                                        <button
                                            key={day.date}
                                            onClick={() => { setSelectedDate(day.date); setSelectedTime(null); }}
                                            className={`flex flex-col items-center min-w-[80px] p-4 rounded-2xl border transition-all ${
                                                isSelected 
                                                ? 'bg-oku-dark border-oku-dark text-white shadow-xl scale-105' 
                                                : 'bg-oku-cream/50 border-oku-taupe/10 text-oku-taupe hover:border-oku-purple/50 hover:text-oku-dark'
                                            }`}
                                        >
                                            <span className="text-[10px] uppercase tracking-widest font-black mb-1">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            <span className="text-2xl font-display font-bold">{dateObj.getDate()}</span>
                                            <span className="text-[10px] uppercase tracking-widest mt-1">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <AnimatePresence mode="wait">
                            {activeDay && (
                                <motion.div
                                    key={activeDay.date}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4">Available Times</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {activeDay.times.map((time: string) => {
                                            const isSelected = selectedTime === time
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-3 rounded-xl text-xs font-black tracking-widest transition-all border ${
                                                        isSelected
                                                        ? 'bg-oku-purple border-oku-purple text-white shadow-lg scale-105'
                                                        : 'bg-white border-oku-taupe/20 text-oku-dark hover:border-oku-purple/50'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Summary & Confirm */}
                        <div className="pt-8 border-t border-oku-taupe/10 mt-8">
                            <div className="bg-oku-cream-warm/30 p-6 rounded-2xl border border-oku-taupe/5 mb-8">
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Booking Summary</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="font-bold text-oku-dark text-lg">{activeService?.name}</p>
                                        <p className="text-sm text-oku-taupe">
                                            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'}) : 'Select a date'} 
                                            {selectedTime ? ` at ${selectedTime}` : ''}
                                        </p>
                                    </div>
                                    <p className="text-2xl font-display font-bold text-oku-purple">
                                        {displaySessionPrice}
                                    </p>
                                </div>
                                <p className="mt-3 text-xs text-oku-taupe">
                                    Stored in INR and converted into your local currency at live exchange rates.
                                </p>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedTime || isSubmitting}
                                className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>Proceed to Payment <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
