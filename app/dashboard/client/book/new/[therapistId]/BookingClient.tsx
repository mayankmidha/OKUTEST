'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Calendar, Clock, ArrowRight, CheckCircle2, Loader2, ShieldCheck, X, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { type ExchangeRateTable, formatCurrency, localizeAmount } from '@/lib/currency'

function Toast({ message, type, onClose }: { message: string; type: 'error' | 'success'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border max-w-sm w-full ${
        type === 'error'
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-oku-mint/80 border-oku-mint text-green-700'
      }`}
    >
      {type === 'error' ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <p className="text-sm font-bold flex-1">{message}</p>
      <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  )
}

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
  const router = useRouter()
  const [selectedService, setSelectedService] = useState(services[0]?.id)
  const [selectedDate, setSelectedDate] = useState(availableSlots[0]?.date)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  const activeService = services.find((s) => s.id === selectedService)
  const activeDay = availableSlots.find((d) => d.date === selectedDate)
  const localizedPrice = localizeAmount(sessionPriceInInr, undefined, 'INR', exchangeRates, viewerCurrency)
  const displaySessionPrice = formatCurrency(localizedPrice.amount, localizedPrice.currency)
  const baseSessionPrice = formatCurrency(sessionPriceInInr, 'INR')

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          therapistId: practitioner.id,
          date: new Date(selectedDate).toISOString(),
          time: selectedTime,
          serviceId: selectedService,
        }),
      })

      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.url) {
          router.push(data.url)
        } else if (res.url) {
          const url = new URL(res.url)
          router.push(url.pathname + url.search)
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        showToast(errData.message || 'Could not book this slot. Please try another time.', 'error')
      }
    } catch {
      showToast('Connection error. Please check your internet and try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: Therapist info + service selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Therapist card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-lg"
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-oku-cream shadow-inner shrink-0">
                {practitioner.user.avatar ? (
                  <img src={practitioner.user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-oku-lavender/30 flex items-center justify-center text-3xl">🧘</div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-oku-dark">{practitioner.user.name}</h2>
                <p className="text-oku-purple-dark text-sm font-display italic opacity-80">
                  {practitioner.specialization?.[0] || 'Psychotherapist'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck size={11} className="text-oku-purple-dark" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Verified Specialist</span>
                </div>
              </div>
            </div>
            {practitioner.bio && (
              <p className="text-sm text-oku-taupe leading-relaxed italic border-l-2 border-oku-purple/20 pl-4 py-1 line-clamp-3">
                &ldquo;{practitioner.bio}&rdquo;
              </p>
            )}
          </motion.div>

          {/* Service selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden"
          >
            <h3 className="text-xl font-display font-bold mb-5 relative z-10">Session Type</h3>
            <div className="space-y-3 relative z-10">
              {services.map((s) => {
                const isSelected = selectedService === s.id
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white text-oku-dark border-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className={`font-display font-bold ${isSelected ? 'text-oku-purple-dark' : 'text-white/70'}`}>
                        {displaySessionPrice}
                      </p>
                    </div>
                    <p className={`text-[9px] uppercase tracking-widest font-black flex items-center gap-1.5 ${isSelected ? 'text-oku-taupe' : 'text-white/30'}`}>
                      <Clock size={10} /> {s.duration} min · {pricingRegion === 'INDIA' ? 'India rate' : 'Intl rate'}
                    </p>
                  </motion.button>
                )
              })}
            </div>

            {/* Trust note */}
            <div className="flex items-center gap-2 mt-5 relative z-10">
              <Lock size={11} className="text-white/30" />
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">
                Secure payment · Cancel 24h before free
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </motion.div>
        </div>

        {/* RIGHT: Calendar & slots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] border border-oku-taupe/10 shadow-lg"
        >
          <h3 className="text-2xl font-display font-bold text-oku-dark tracking-tighter mb-7 flex items-center gap-3">
            <Calendar className="text-oku-purple-dark" size={22} /> Choose Your Time
          </h3>

          {availableSlots.length === 0 ? (
            <div className="py-16 text-center bg-oku-cream/30 rounded-3xl border border-dashed border-oku-taupe/20">
              <Calendar size={32} className="text-oku-taupe/40 mx-auto mb-4" />
              <p className="text-oku-taupe font-display italic text-lg mb-2">No slots available right now.</p>
              <p className="text-sm text-oku-taupe/60">Check back soon or explore another therapist.</p>
              <Link href="/dashboard/client/therapists" className="inline-block mt-6 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">
                Browse other therapists →
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Date strip */}
              <div>
                <p className="text-[9px] uppercase tracking-widest font-black text-oku-taupe/60 mb-3">Select Day</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableSlots.map((day) => {
                    const dateObj = new Date(day.date)
                    const isSelected = selectedDate === day.date
                    return (
                      <motion.button
                        key={day.date}
                        onClick={() => { setSelectedDate(day.date); setSelectedTime(null) }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex flex-col items-center min-w-[70px] p-3.5 rounded-2xl border transition-all shrink-0 ${
                          isSelected
                            ? 'bg-oku-darkgrey border-oku-darkgrey text-white shadow-lg'
                            : 'bg-oku-cream/40 border-oku-taupe/10 text-oku-taupe hover:border-oku-purple/30 hover:text-oku-dark'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-widest font-black mb-0.5">
                          {dateObj.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })}
                        </span>
                        <span className="text-2xl font-display font-bold leading-none">{dateObj.getDate()}</span>
                        <span className="text-[9px] uppercase tracking-widest mt-0.5">
                          {dateObj.toLocaleDateString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' })}
                        </span>
                        <span className="text-[8px] mt-1 opacity-50">{day.times.length} slots</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Time slots */}
              <AnimatePresence mode="wait">
                {activeDay && (
                  <motion.div
                    key={activeDay.date}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[9px] uppercase tracking-widest font-black text-oku-taupe/60 mb-3">
                      Available Times <span className="text-oku-darkgrey/30 ml-2">IST</span>
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {activeDay.times.map((time: string) => {
                        const isSelected = selectedTime === time
                        return (
                          <motion.button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`py-3 rounded-xl text-xs font-black tracking-widest border transition-all ${
                              isSelected
                                ? 'bg-oku-purple-dark border-oku-purple-dark text-white shadow-md'
                                : 'bg-white border-oku-taupe/15 text-oku-dark hover:border-oku-purple-dark/40 hover:text-oku-purple-dark'
                            }`}
                          >
                            {new Date(time).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'Asia/Kolkata',
                            })}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary + CTA */}
              <div className="pt-6 border-t border-oku-taupe/10">
                <AnimatePresence>
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="bg-oku-lavender/20 border border-oku-lavender/40 p-5 rounded-2xl mb-5"
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Your Booking</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-bold text-oku-dark">{activeService?.name}</p>
                          <p className="text-sm text-oku-taupe mt-0.5">
                            {new Date(selectedTime).toLocaleDateString('en-IN', {
                              weekday: 'long', day: 'numeric', month: 'long',
                              timeZone: 'Asia/Kolkata',
                            })}{' '}
                            at{' '}
                            {new Date(selectedTime).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit', hour12: true,
                              timeZone: 'Asia/Kolkata',
                            })} IST
                          </p>
                        </div>
                        <p className="text-2xl font-display font-bold text-oku-purple-dark">{displaySessionPrice}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleConfirm}
                  disabled={!selectedTime || isSubmitting}
                  whileHover={selectedTime && !isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={selectedTime && !isSubmitting ? { scale: 0.99 } : {}}
                  className="w-full py-5 bg-oku-darkgrey text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-oku-purple-dark shadow-lg"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {selectedTime ? 'Confirm & Proceed to Payment' : 'Select a time to continue'}
                      {selectedTime && <ArrowRight size={16} />}
                    </>
                  )}
                </motion.button>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-5 mt-4">
                  {[
                    { icon: Lock, text: 'Encrypted payment' },
                    { icon: ShieldCheck, text: 'Cancel 24h free' },
                    { icon: CheckCircle2, text: 'Instant confirmation' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-oku-taupe/50">
                      <Icon size={10} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
