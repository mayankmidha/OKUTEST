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
    <div className="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-oku-lavender/10 px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-8 lg:mb-20 lg:flex-row lg:items-end lg:gap-10">
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
            <h1 className="heading-display text-4xl tracking-tighter text-oku-darkgrey sm:text-5xl lg:text-7xl xl:text-8xl">
              Your <span className="text-oku-purple-dark italic">Sessions.</span>
            </h1>
            <p className="border-l-4 border-oku-purple-dark/10 pl-5 font-display text-base italic text-oku-darkgrey/60 sm:pl-8 sm:text-lg lg:text-xl">
              Every session is a step deeper into yourself.
            </p>
          </div>

          <Link
            href="/dashboard/client/therapists"
            className="btn-pill-3d pulse-cta w-full self-start bg-oku-darkgrey border-oku-darkgrey !px-6 text-center text-white sm:w-auto sm:!px-10 lg:self-auto"
          >
            <Plus size={16} className="mr-3" /> Book New Session
          </Link>
        </div>

        {/* Stats row */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-16 xl:grid-cols-4 xl:gap-6">
          {[
            { label: 'Upcoming', value: upcoming.length, bg: 'bg-oku-babyblue/60' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, bg: 'bg-oku-mint/60' },
            { label: 'Total Sessions', value: appointments.length, bg: 'bg-oku-lavender/60' },
            { label: 'Hours in Care', value: Math.round(appointments.filter(a=>a.status==='COMPLETED').reduce((acc, a) => acc + (a.service?.duration || 50), 0) / 60), bg: 'bg-oku-peach/60' },
          ].map((stat, i) => (
            <div key={i} className={`card-glass-3d flex flex-col justify-between !p-6 sm:!p-8 ${stat.bg}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">{stat.label}</p>
              <p className="mt-4 text-4xl heading-display text-oku-darkgrey sm:mt-6 sm:text-5xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <section className="card-glass-3d mb-10 !bg-white/40 !p-6 sm:mb-12 sm:!p-8 lg:!p-12">
          <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="heading-display text-3xl tracking-tight text-oku-darkgrey sm:text-4xl">
              Upcoming <span className="italic text-oku-purple-dark">Windows</span>
            </h2>
            <Link
              href="/dashboard/client/therapists"
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
                  href="/dashboard/client/therapists"
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
                    className="group card-glass-3d !bg-white/70 !p-6 transition-all duration-700 hover:shadow-2xl sm:!p-8"
                  >
                    <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center xl:gap-8">
                      <div className="flex items-start gap-5 sm:items-center sm:gap-8">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-[1.5rem] bg-oku-babyblue overflow-hidden border-4 border-white shadow-xl">
                            {appt.practitioner?.avatar ? (
                              <img src={appt.practitioner?.avatar || ''} className="w-full h-full object-cover" alt={appt.practitioner?.name || 'Practitioner'} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl bg-oku-lavender/40">🧘</div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-oku-darkgrey text-white flex items-center justify-center border-2 border-white animate-pulse shadow-lg">
                            <Video size={14} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xl heading-display text-oku-darkgrey sm:text-2xl">{appt.practitioner?.name || 'Specialist'}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-oku-purple-dark/10 text-oku-purple-dark rounded-full border border-oku-purple-dark/10">
                              {appt.service?.name || 'Session'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-1">
                              <Clock size={10} /> {duration} min
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-1">
                              <ShieldCheck size={10} /> Protected Session
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-oku-darkgrey/5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 xl:border-l xl:border-t-0 xl:pt-0 xl:pl-8">
                        <div className="min-w-0 text-left sm:text-right">
                          <p className="text-lg font-bold text-oku-darkgrey sm:text-xl">
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
                          className="btn-pill-3d pulse-cta w-full bg-oku-babyblue border-oku-babyblue text-center text-oku-darkgrey sm:w-auto sm:min-w-[160px]"
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
        <section className="card-glass-3d !bg-white/40 !p-6 sm:!p-8 lg:!p-12">
          <h2 className="mb-8 text-3xl heading-display tracking-tight text-oku-darkgrey sm:mb-12 sm:text-4xl">
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
                    className="flex flex-col justify-between gap-4 rounded-[2rem] border border-white/60 bg-white/40 p-5 transition-all duration-300 hover:bg-white/60 sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-14 h-14 rounded-[1rem] bg-oku-lavender/40 overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        {appt.practitioner?.avatar ? (
                          <img src={appt.practitioner?.avatar || ''} className="w-full h-full object-cover" alt={appt.practitioner?.name || 'Practitioner'} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🧘</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-oku-darkgrey">{appt.practitioner?.name || 'Specialist'}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                            {appt.service?.name || 'Session'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                            {duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:ml-auto sm:flex-row sm:items-center sm:gap-6">
                      <div className="text-left sm:text-right">
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
