import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppointmentStatus } from '@prisma/client'
import BookingClient from './BookingClient'

export default async function BookingPage({ params }: { params: Promise<{ therapistId: string }> }) {
  const session = await auth()
  const { therapistId } = await params
  
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/book/${therapistId}`)
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id: therapistId },
    include: { 
        user: {
            include: {
                practitionerAppointments: {
                    where: {
                        startTime: { gte: new Date() },
                        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
                    }
                }
            }
        },
        availability: true
    }
  })

  if (!practitioner) return <div>Practitioner not found</div>

  const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
  })

  // Generate Slots
  const slots = []
  const today = new Date()
  
  for(let i=0; i<=14; i++) { // Start from 0 (today) and go for 14 days
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    date.setHours(0,0,0,0)
    
    const dayOfWeek = date.getDay()
    // For testing: If no specific availability is set, provide a default 9-5 schedule
    let availability = practitioner.availability.find(a => a.dayOfWeek === dayOfWeek)
    
    // Default testing availability for weekends or unset days
    const effectiveAvailability = availability || { startTime: '09:00', endTime: '18:00' }
    
    const daySlots = []
    const [startH, startM] = effectiveAvailability.startTime.split(':').map(Number)
    const [endH, endM] = effectiveAvailability.endTime.split(':').map(Number)
    
    let current = new Date(date)
    current.setHours(startH, startM, 0, 0)
    
    const endTime = new Date(date)
    endTime.setHours(endH, endM, 0, 0)

    // Don't show past times if the date is today
    const now = new Date()

    while (current < endTime) {
        const isBooked = practitioner.user.practitionerAppointments.some(s => 
            s.startTime.getTime() === current.getTime()
        )
        
        const isPast = current < now
        
        if (!isBooked && !isPast) {
            daySlots.push(new Date(current).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
        }
        
        current.setMinutes(current.getMinutes() + (practitioner.sessionDuration || 50) + (practitioner.bufferDuration || 10))
    }

    if (daySlots.length > 0) {
        slots.push({ date: new Date(date), times: daySlots })
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="mb-8">
                <Link href="/dashboard/client/therapists" className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe hover:text-oku-dark transition-colors">← Back to Directory</Link>
            </div>
            <h1 className="text-5xl font-display font-bold text-oku-dark mb-12 tracking-tighter">Book Session</h1>
            
            <BookingClient 
                practitioner={practitioner} 
                services={services} 
                availableSlots={slots} 
            />
        </div>
    </div>
  )
}
