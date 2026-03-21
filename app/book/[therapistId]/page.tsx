import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { AppointmentStatus } from '@prisma/client'

export default async function BookingPage({ params }: { params: Promise<{ therapistId: string }> }) {
  const session = await auth()
  const { therapistId } = await params
  
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/book/${therapistId}`)
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id: therapistId },
    include: { 
        user: true,
        availability: true,
        appointments: {
            where: {
                startTime: { gte: new Date() },
                status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
            }
        }
    }
  })

  if (!practitioner) return <div>Practitioner not found</div>

  // Generate Slots based on REAL availability
  const slots = []
  const today = new Date()
  
  for(let i=1; i<=7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    date.setHours(0,0,0,0)
    
    const dayOfWeek = date.getDay()
    const availability = practitioner.availability.find(a => a.dayOfWeek === dayOfWeek)
    
    if (availability) {
        const daySlots = []
        const [startH, startM] = availability.startTime.split(':').map(Number)
        const [endH, endM] = availability.endTime.split(':').map(Number)
        
        let current = new Date(date)
        current.setHours(startH, startM, 0, 0)
        
        const endTime = new Date(date)
        endTime.setHours(endH, endM, 0, 0)

        while (current < endTime) {
            const isBooked = practitioner.appointments.some(s => 
                s.startTime.getTime() === current.getTime()
            )
            
            if (!isBooked) {
                daySlots.push(new Date(current).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
            }
            
            // Advance by duration + buffer
            current.setMinutes(current.getMinutes() + practitioner.sessionDuration + practitioner.bufferDuration)
        }

        if (daySlots.length > 0) {
            slots.push({ date: new Date(date), times: daySlots })
        }
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream">
        <Header />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="grid md:grid-cols-2 gap-16">
                {/* Therapist Info */}
                <div>
                    <div className="mb-8">
                        <Link href="/therapists" className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe hover:text-oku-dark transition-colors">← Back to Directory</Link>
                    </div>
                    <h1 className="text-5xl font-display font-bold text-oku-dark mb-4 tracking-tighter">Book Session</h1>
                    <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-sm mb-8">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-oku-cream">
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
                        <div className="space-y-4 text-sm text-oku-taupe">
                            <div className="flex justify-between border-b border-oku-taupe/10 pb-2">
                                <span className="font-bold uppercase tracking-widest text-[10px]">Session Length</span>
                                <span>{practitioner.sessionDuration} mins</span>
                            </div>
                            <div className="flex justify-between border-b border-oku-taupe/10 pb-2">
                                <span className="font-bold uppercase tracking-widest text-[10px]">Hourly Rate</span>
                                <span>${practitioner.hourlyRate || 150}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real Time Slots */}
                <div>
                    <h3 className="text-2xl font-display font-bold text-oku-dark mb-8">Available Slots</h3>
                    <div className="space-y-6">
                        {slots.length === 0 ? (
                            <div className="bg-white/50 p-12 rounded-card text-center border border-oku-taupe/10">
                                <p className="text-oku-taupe font-script text-2xl">No available slots this week.</p>
                            </div>
                        ) : (
                            slots.map((day, idx) => (
                                <div key={idx} className="bg-white/50 p-6 rounded-card border border-oku-taupe/10">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe mb-4">
                                        {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {day.times.map((time, tIdx) => (
                                            <form key={tIdx} action="/api/sessions/create" method="POST">
                                                <input type="hidden" name="therapistId" value={practitioner.id} />
                                                <input type="hidden" name="date" value={day.date.toISOString()} />
                                                <input type="hidden" name="time" value={time} />
                                                <button type="submit" className="px-6 py-3 bg-white hover:bg-oku-purple hover:text-oku-dark text-oku-dark border border-oku-taupe/20 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                                    {time}
                                                </button>
                                            </form>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
