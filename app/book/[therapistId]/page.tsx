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

  const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
  })

  // Generate Slots
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
            
            current.setMinutes(current.getMinutes() + practitioner.sessionDuration + practitioner.bufferDuration)
        }

        if (daySlots.length > 0) {
            slots.push({ date: new Date(date), times: daySlots })
        }
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="mb-8">
                <Link href="/therapists" className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe hover:text-oku-dark transition-colors">← Back to Directory</Link>
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
