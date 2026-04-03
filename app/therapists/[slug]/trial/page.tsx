import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Clock, Heart } from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
import TrialBookingForm from '@/app/dashboard/client/book/new/[therapistId]/trial/TrialBookingForm'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id: slug },
    include: { user: { select: { name: true } } },
  })
  const name = practitioner?.user?.name ?? 'a Therapist'
  return {
    title: `Free 15-Min Consultation with ${name} | OKU Therapy`,
    description: `Book a free introductory call with ${name}. No commitment. No payment required.`,
  }
}

export default async function PublicTrialBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [session, practitioner] = await Promise.all([
    auth(),
    prisma.practitionerProfile.findUnique({
      where: { id: slug },
      include: {
        user: {
          include: {
            practitionerAppointments: {
              where: {
                startTime: { gte: new Date() },
                status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
              },
            },
          },
        },
        availability: true,
      },
    }),
  ])

  if (!practitioner || !practitioner.isVerified) notFound()

  const name = practitioner.user.name || 'Your Therapist'
  const firstName = name.split(' ')[0]

  // Generate 15-min trial slots across next 7 days
  const slots: { date: string; label: string; times: { iso: string; label: string }[] }[] = []
  const today = new Date()
  const bookedTimes = practitioner.user.practitionerAppointments.map((a) => a.startTime.getTime())

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    date.setHours(0, 0, 0, 0)

    const dayOfWeek = date.getDay()
    const availability = practitioner.availability.find((a) => a.dayOfWeek === dayOfWeek)
    if (!availability) continue

    const daySlots: { iso: string; label: string }[] = []
    const [startH, startM] = availability.startTime.split(':').map(Number)
    const [endH, endM] = availability.endTime.split(':').map(Number)

    let current = new Date(date)
    current.setHours(startH, startM, 0, 0)
    const end = new Date(date)
    end.setHours(endH, endM, 0, 0)

    while (current < end) {
      const slotEnd = new Date(current.getTime() + 15 * 60 * 1000)
      const isBooked = bookedTimes.some(
        (t) => Math.abs(t - current.getTime()) < 20 * 60 * 1000
      )
      if (!isBooked && slotEnd <= end) {
        daySlots.push({
          iso: current.toISOString(),
          label: current.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        })
      }
      current = new Date(current.getTime() + 30 * 60 * 1000) // 30-min apart
    }

    if (daySlots.length > 0) {
      slots.push({
        date: date.toISOString(),
        label: date.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        times: daySlots,
      })
    }
  }

  const isLoggedIn = !!session?.user?.id

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-oku-lavender/30 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-oku-mint/20 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 pt-40 pb-32 relative z-10">
        <Link
          href={`/therapists/${slug}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/50 hover:text-oku-darkgrey transition-colors mb-16 bg-white/50 px-5 py-3 rounded-full backdrop-blur-md border border-white/60"
        >
          <ChevronLeft size={13} /> Back to Profile
        </Link>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Context */}
          <div className="space-y-10">
            <div>
              <span className="px-4 py-1.5 bg-oku-mint/40 border border-oku-mint rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-green-800 inline-block mb-6">
                Free Consultation
              </span>
              <h1 className="heading-display text-5xl md:text-6xl text-oku-darkgrey leading-[0.9] tracking-tighter mb-6">
                Begin with <br />
                <span className="text-oku-purple-dark italic">{firstName}.</span>
              </h1>
              <p className="text-lg text-oku-darkgrey/60 font-display italic leading-relaxed">
                A gentle 15-minute conversation — no commitment, no payment. Just space to meet each other.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Clock, text: '15 minutes · Free of charge' },
                { icon: Heart, text: 'No commitment required' },
                { icon: ShieldCheck, text: 'Secure & confidential' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white/70 border border-white rounded-full flex items-center justify-center shadow-sm">
                    <Icon size={15} className="text-oku-purple-dark" />
                  </div>
                  <span className="text-sm text-oku-darkgrey/70 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Therapist badge */}
            <div className="card-glass-3d !p-6 !rounded-[2rem] flex items-center gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-oku-lavender/40 shrink-0">
                <img
                  src={practitioner.user.avatar || '/wp-content/uploads/2025/07/placeholder.jpg'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-0.5">Your Therapist</p>
                <p className="font-bold text-oku-darkgrey">{name}</p>
                <p className="text-xs text-oku-darkgrey/50 italic">{practitioner.specialization.slice(0, 2).join(' · ')}</p>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div>
            <TrialBookingForm
              practitionerId={practitioner.id}
              slots={slots}
              isLoggedIn={isLoggedIn}
              userEmail={session?.user?.email ?? undefined}
              userName={session?.user?.name ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
