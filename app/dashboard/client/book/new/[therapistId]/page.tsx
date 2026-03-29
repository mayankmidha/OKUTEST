import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppointmentStatus } from '@prisma/client'
import BookingClient from './BookingClient'
import { detectCurrency, getLiveExchangeRates } from '@/lib/currency'
import { resolvePractitionerSessionPrice } from '@/lib/pricing'

export default async function BookingPage({ params }: { params: Promise<{ therapistId: string }> }) {
  const session = await auth()
  const { therapistId } = await params
  
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/book/${therapistId}`)
  }

  const [practitioner, user, exchangeRates] = await Promise.all([
    prisma.practitionerProfile.findUnique({
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
  }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { location: true },
    }),
    getLiveExchangeRates('INR'),
  ])

  if (!practitioner) return <div>Practitioner not found</div>
  const sessionPricing = resolvePractitionerSessionPrice(practitioner, user?.location)
  const viewerCurrency = detectCurrency(user?.location)

  const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
  })

  // Generate Slots (Timezone-Aware)
  const slots = []
  const today = new Date()
  const tz = practitioner.timezone || 'UTC'
  
  for(let i=0; i<=14; i++) {
    // Generate date in practitioner's timezone
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // Convert to local components to get correct dayOfWeek and start/end times
    const localDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(date)
    const [m, d, y] = localDateStr.split('/')
    const dayOfWeek = new Date(parseInt(y), parseInt(m)-1, parseInt(d)).getDay()
    
    let availability = practitioner.availability.find(a => a.dayOfWeek === dayOfWeek)
    const effectiveAvailability = availability || { startTime: '09:00', endTime: '18:00' }
    
    const daySlots = []
    const [startH, startM] = effectiveAvailability.startTime.split(':').map(Number)
    const [endH, endM] = effectiveAvailability.endTime.split(':').map(Number)

    // Helper to get UTC from local components
    const getUTC = (h: number, min: number) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        })
        let utc = Date.UTC(parseInt(y), parseInt(m)-1, parseInt(d), h, min)
        const parts = formatter.formatToParts(new Date(utc))
        const offsetH = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
        const diff = h - offsetH
        return new Date(utc + diff * 3600000)
    }

    let currentUTC = getUTC(startH, startM)
    const endUTC = getUTC(endH, endM)
    const now = new Date()

    while (currentUTC < endUTC) {
        const isBooked = practitioner.user.practitionerAppointments.some(s => 
            Math.abs(s.startTime.getTime() - currentUTC.getTime()) < 1000
        )
        const isPast = currentUTC < now
        
        if (!isBooked && !isPast) {
            // Send as ISO string for client-side local conversion
            daySlots.push(currentUTC.toISOString())
        }
        
        currentUTC = new Date(currentUTC.getTime() + (practitioner.sessionDuration || 50) * 60000 + (practitioner.bufferDuration || 10) * 60000)
    }

    if (daySlots.length > 0) {
        slots.push({ date: new Date(date).toISOString(), times: daySlots })
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
                sessionPriceInInr={sessionPricing.amountInInr}
                pricingRegion={sessionPricing.pricingRegion}
                viewerCurrency={viewerCurrency}
                exchangeRates={exchangeRates}
            />
        </div>
    </div>
  )
}
