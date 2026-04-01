import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Calendar, Clock, Video, ShieldCheck, Plus,
  Moon, CheckCircle2, XCircle, AlertCircle, ArrowUpRight,
  Wind, ChevronLeft, RotateCcw
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  SCHEDULED:  { label: 'Scheduled',  bg: 'bg-oku-babyblue/60',   text: 'text-oku-darkgrey',   icon: <Clock size={12} /> },
  CONFIRMED:  { label: 'Confirmed',  bg: 'bg-oku-mint/80',       text: 'text-oku-darkgrey',   icon: <CheckCircle2 size={12} /> },
  COMPLETED:  { label: 'Completed',  bg: 'bg-oku-lavender/80',   text: 'text-oku-purple-dark', icon: <CheckCircle2 size={12} /> },
  CANCELLED:  { label: 'Cancelled',  bg: 'bg-oku-peach/60',      text: 'text-oku-darkgrey',   icon: <XCircle size={12} /> },
  NO_SHOW:    { label: 'No Show',    bg: 'bg-oku-blush/60',      text: 'text-oku-darkgrey',   icon: <AlertCircle size={12} /> },
  RESCHEDULED:{ label: 'Rescheduled',bg: 'bg-white/60',          text: 'text-oku-darkgrey',   icon: <RotateCcw size={12} /> },
  PENDING:    { label: 'Pending',    bg: 'bg-white/60',          text: 'text-oku-darkgrey',   icon: <Clock size={12} /> },
}

export default async function ClientSessionsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  let appointments: any[] = []
  try {
    appointments = await prisma.appointment.findMany({
      where: { clientId: session.user.id },
      include: {
        practitioner: { select: { name: true, avatar: true } },
        service: { select: { name: true, duration: true } },
      },
      orderBy: { startTime: 'desc' },
    })
  } catch (e) {
    console.error('Sessions fetch error:', e)
  }

  const now = new Date()
  const upcoming = appointments.filter(
    (a) =>
      new Date(a.startTime) >= now &&
      (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED)
  )
  const past = appointments.filter(
    (a) =>
      new Date(a.startTime) < now ||
      (a.status !== AppointmentStatus.SCHEDULED && a.status !== AppointmentStatus.CONFIRMED)
  )

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Your Journey</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Your <span className="text-oku-purple-dark italic">Sessions.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Every session is a step deeper into yourself.
            </p>
          </div>

          <Link
            href="/dashboard/client/book"
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 pulse-cta self-start lg:self-auto"
          >
            <Plus size={16} className="mr-3" /> Book New Session
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Upcoming', value: upcoming.length, bg: 'bg-oku-babyblue/60' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, bg: 'bg-oku-mint/60' },
            { label: 'Total Sessions', value: appointments.length, bg: 'bg-oku-lavender/60' },
            { label: 'Hours in Care', value: Math.round(appointments.filter(a=>a.status==='COMPLETED').reduce((acc, a) => acc + (a.service?.duration || 50), 0) / 60), bg: 'bg-oku-peach/60' },
          ].map((stat, i) => (
            <div key={i} className={`card-glass-3d !p-8 ${stat.bg} flex flex-col justify-between`} style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">{stat.label}</p>
              <p className="text-5xl heading-display text-oku-darkgrey mt-6">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <section className="card-glass-3d !p-12 !bg-white/40 mb-12">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
              Upcoming <span className="italic text-oku-purple-dark">Windows</span>
            </h2>
            <Link
              href="/dashboard/client/book"
              className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2"
            >
              Book More <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-6">
            {upcoming.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                <Moon className="mx-auto text-oku-purple-dark/20 mb-6 animate-float-3d" size={48} />
                <p className="text-2xl font-display italic text-oku-darkgrey/30">The schedule is open.</p>
                <p className="text-sm text-oku-darkgrey/20 mt-3 font-display italic">Find a specialist and begin your journey.</p>
                <Link
                  href="/dashboard/client/book"
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-4 mt-8 inline-flex"
                >
                  <Plus size={14} className="mr-2" /> Book a Session
                </Link>
              </div>
            ) : (
              upcoming.map((appt) => {
                const status = statusConfig[appt.status] || statusConfig.SCHEDULED
                const duration = appt.service?.duration || 50
                return (
                  <div
                    key={appt.id}
                    className="card-glass-3d !p-8 !bg-white/70 group hover:shadow-2xl transition-all duration-700"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-[1.5rem] bg-oku-babyblue overflow-hidden border-4 border-white shadow-xl">
                            {appt.practitioner?.avatar ? (
                              <img src={appt.practitioner.avatar} className="w-full h-full object-cover" alt={appt.practitioner.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl bg-oku-lavender/40">🧘</div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-oku-darkgrey text-white flex items-center justify-center border-2 border-white animate-pulse shadow-lg">
                            <Video size={14} />
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl heading-display text-oku-darkgrey">{appt.practitioner?.name || 'Specialist'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-oku-purple-dark/10 text-oku-purple-dark rounded-full border border-oku-purple-dark/10">
                              {appt.service?.name || 'Session'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-1">
                              <Clock size={10} /> {duration} min
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-1">
                              <ShieldCheck size={10} /> HIPAA Secure
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-oku-darkgrey/5 pt-6 md:pt-0 md:pl-8">
                        <div className="text-right min-w-[100px]">
                          <p className="text-xl font-bold text-oku-darkgrey">
                            {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-oku-darkgrey/40 font-black uppercase tracking-widest mt-1">
                            {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                            {status.icon} {status.label}
                          </div>
                        </div>
                        <Link
                          href={`/session/${appt.id}`}
                          className="btn-pill-3d bg-oku-babyblue border-oku-babyblue text-oku-darkgrey min-w-[160px] pulse-cta"
                        >
                          Join Session Room
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Past Sessions */}
        <section className="card-glass-3d !p-12 !bg-white/40">
          <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-12">
            Session <span className="italic text-oku-purple-dark">Archive</span>
          </h2>

          {past.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-oku-darkgrey/5 rounded-[3rem]">
              <Wind className="mx-auto text-oku-darkgrey/10 mb-6 animate-float-3d" size={40} />
              <p className="text-xl font-display italic text-oku-darkgrey/20">No past sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {past.map((appt) => {
                const status = statusConfig[appt.status] || statusConfig.COMPLETED
                const duration = appt.service?.duration || 50
                return (
                  <div
                    key={appt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-white/40 border border-white/60 hover:bg-white/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-[1rem] bg-oku-lavender/40 overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        {appt.practitioner?.avatar ? (
                          <img src={appt.practitioner.avatar} className="w-full h-full object-cover" alt={appt.practitioner.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🧘</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-oku-darkgrey">{appt.practitioner?.name || 'Specialist'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                            {appt.service?.name || 'Session'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                            {duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:ml-auto">
                      <div className="text-right">
                        <p className="text-sm font-bold text-oku-darkgrey">
                          {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-oku-darkgrey/30 uppercase tracking-widest font-black mt-0.5">
                          {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                        {status.icon} {status.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
