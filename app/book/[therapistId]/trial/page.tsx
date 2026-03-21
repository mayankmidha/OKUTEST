import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import Header from '@/components/Header'
import { AppointmentStatus } from '@prisma/client'
import TrialBookingForm from './TrialBookingForm'

export default async function TrialBookingPage({ params }: { params: Promise<{ therapistId: string }> }) {
  const session = await auth()
  const { therapistId } = await params
  
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

  // Generate 15-min trial slots
  const slots = []
  const today = new Date()
  const trialDuration = 15
  const buffer = 5
  
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
            const isBooked = practitioner.appointments.some(s => {
                const sTime = s.startTime.getTime()
                const cTime = current.getTime()
                // Simple overlap check (assuming 15 mins for trial)
                return cTime >= sTime && cTime < s.endTime.getTime()
            })
            
            if (!isBooked) {
                daySlots.push(new Date(current).toISOString())
            }
            
            current.setMinutes(current.getMinutes() + trialDuration + buffer)
        }

        if (daySlots.length > 0) {
            slots.push({ 
                date: daySlots[0], 
                label: new Date(daySlots[0]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'}),
                times: daySlots.map(iso => ({
                    iso,
                    label: new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                }))
            })
        }
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <div className="mb-8">
                        <Link href="/therapists" className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe hover:text-oku-dark transition-colors">← Back to Directory</Link>
                    </div>
                    <h1 className="text-5xl font-display font-bold text-oku-dark mb-4 tracking-tighter">15-Min Trial Call</h1>
                    <p className="text-oku-taupe mb-8 italic">"A brief space to see if we click."</p>
                    
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
                        <div className="bg-oku-purple/5 p-6 rounded-2xl text-sm text-oku-taupe">
                            <p className="mb-2 font-bold text-oku-dark uppercase tracking-widest text-[10px]">What to expect:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Introduction & your goals for therapy</li>
                                <li>Therapist's approach & expertise</li>
                                <li>Ask any questions you have</li>
                                <li>No obligation to continue</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <TrialBookingForm 
                        practitionerId={practitioner.id} 
                        slots={slots} 
                        isLoggedIn={!!session?.user}
                        userEmail={session?.user?.email || ''}
                        userName={session?.user?.name || ''}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}
