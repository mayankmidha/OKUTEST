import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DashboardCard } from '@/components/DashboardCard'
import { VisualCalendar } from '@/components/VisualCalendar'
import { Calendar, Video, Clock, CheckCircle2, FileText, AlertTriangle, Search, Sun, UserX } from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { NoShowButton } from '@/components/NoShowButton'

export const dynamic = 'force-dynamic'

export default async function PractitionerAppointmentsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [appointments, profile] = await Promise.all([
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      include: {
        client: true,
        service: true,
        soapNote: true
      },
      orderBy: { startTime: 'asc' }
    }),
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      select: { canPostBlogs: true }
    })
  ])

  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0)
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)

  const todayAppointments = appointments.filter(a =>
    new Date(a.startTime) >= todayStart &&
    new Date(a.startTime) <= todayEnd &&
    a.status !== AppointmentStatus.CANCELLED
  )
  const upcoming = appointments.filter(a =>
    new Date(a.startTime) > todayEnd &&
    a.status !== AppointmentStatus.CANCELLED &&
    a.status !== AppointmentStatus.COMPLETED &&
    a.status !== AppointmentStatus.NO_SHOW
  )
  const completed = appointments.filter(a =>
    a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.NO_SHOW
  ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return (
    <PractitionerShell
      title="Session Ledger"
      description="Clinical appointment schedule and session record management."
      badge="Schedule"
      currentPath="/practitioner/appointments"
      canPostBlogs={profile?.canPostBlogs}
      heroActions={
        <Link href="/practitioner/schedule" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 text-[10px]">Manage Hours</Link>
      }
    >
      <VisualCalendar appointments={appointments} />

      <div className="space-y-12 mt-12">

        {/* Today's Sessions */}
        <section className="card-glass-3d !p-10 !bg-oku-lavender/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-oku-purple-dark/10 flex items-center justify-center">
                <Sun size={18} className="text-oku-purple-dark" />
              </div>
              <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">Today's <span className="italic text-oku-purple-dark">Sessions</span></h2>
            </div>
            <span className="chip bg-white/60 border-white/80">{todayAppointments.length} scheduled</span>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[2rem]">
              <p className="text-lg font-display italic text-oku-darkgrey/40">No sessions scheduled for today.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {todayAppointments.map((appt) => {
                const isNow = new Date(appt.startTime) <= now && new Date(appt.endTime) >= now
                const isPast = new Date(appt.endTime) < now
                return (
                  <div key={appt.id} className={`card-glass-3d !p-8 !bg-white/70 group ${isNow ? 'ring-2 ring-oku-purple-dark/30' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm ${isNow ? 'bg-oku-purple-dark text-white' : 'bg-oku-lavender/60 text-oku-darkgrey/60'}`}>
                          {appt.client?.name?.substring(0, 1) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-oku-darkgrey text-xl">{appt.client?.name || 'Unknown Patient'}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{appt.service.name}</span>
                            {isNow && <span className="text-[9px] bg-oku-purple-dark text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Live Now</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-oku-darkgrey">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mt-1">
                            {appt.status === AppointmentStatus.COMPLETED ? 'Completed' : appt.status === AppointmentStatus.NO_SHOW ? 'No Show' : isPast ? 'Ended' : 'Upcoming'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {appt.status !== AppointmentStatus.COMPLETED && appt.status !== AppointmentStatus.NO_SHOW && (
                            <>
                              <Link href={`/session/${appt.id}`} className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-2 !px-6 text-[9px]">
                                Enter Room
                              </Link>
                              <NoShowButton appointmentId={appt.id} />
                            </>
                          )}
                          {(appt.status === AppointmentStatus.COMPLETED || appt.status === AppointmentStatus.NO_SHOW) && (
                            <Link href={`/practitioner/sessions/${appt.id}/notes`} className="btn-pill-3d bg-white border-white/80 text-oku-darkgrey !py-2 !px-6 text-[9px]">
                              <FileText size={12} className="mr-2" /> {appt.soapNote ? 'Edit Note' : 'Add Note'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Upcoming Queue */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 ml-2">Upcoming Queue</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="card-glass-3d !p-12 !bg-white/40 text-center border-dashed">
              <p className="text-oku-darkgrey/40 font-display italic text-lg mb-2">The queue is clear.</p>
              <p className="text-xs text-oku-darkgrey/30">New sessions will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((appt) => (
                <div key={appt.id} className="card-glass-3d !p-8 !bg-white/60 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-oku-lavender/60 flex items-center justify-center text-oku-purple-dark font-bold text-xl border-2 border-white shadow-sm">
                        {appt.client?.name?.substring(0, 1) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-oku-darkgrey text-xl">{appt.client?.name || 'Unknown Patient'}</p>
                        <p className="text-xs text-oku-darkgrey/40 uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-bold text-oku-darkgrey">{new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-oku-darkgrey/40 font-black uppercase tracking-widest mt-1">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        appt.status === AppointmentStatus.CONFIRMED ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-lavender/60 text-oku-purple-dark'
                      }`}>
                        {appt.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Clinical History */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 mb-6 ml-2">Clinical History</h2>
          <div className="card-glass-3d !bg-white/60 overflow-hidden">
            {completed.length === 0 ? (
              <p className="p-20 text-center text-oku-darkgrey/40 italic">No completed session records found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-oku-lavender/30 text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/40">
                  <tr>
                    <th className="p-8">Patient</th>
                    <th className="p-8">Session Type</th>
                    <th className="p-8">Date</th>
                    <th className="p-8">Status</th>
                    <th className="p-8 text-right">Clinical Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {completed.map((appt) => (
                    <tr key={appt.id} className="hover:bg-white/40 transition-all group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-oku-blush/60 flex items-center justify-center text-xs font-black text-oku-darkgrey/60">
                            {appt.client?.name?.substring(0, 1) || '?'}
                          </div>
                          <p className="font-bold text-oku-darkgrey">{appt.client?.name || 'Unknown Patient'}</p>
                        </div>
                      </td>
                      <td className="p-8 text-sm text-oku-darkgrey/60">{appt.service.name}</td>
                      <td className="p-8 text-sm text-oku-darkgrey/60">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          appt.status === AppointmentStatus.COMPLETED ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-red-50 text-red-600'
                        }`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <Link href={`/practitioner/sessions/${appt.id}/notes`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">
                          <FileText size={14} /> {appt.soapNote ? 'Review Note' : 'Add SOAP Note'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </PractitionerShell>
  )
}
