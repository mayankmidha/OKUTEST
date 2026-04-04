import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { updateAppointmentStatus } from '../actions'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED:   'bg-oku-babyblue/40 text-oku-darkgrey',
  CONFIRMED:   'bg-oku-mint/60 text-oku-darkgrey',
  COMPLETED:   'bg-oku-lavender/60 text-oku-purple-dark',
  CANCELLED:   'bg-oku-peach/40 text-oku-darkgrey/60',
  NO_SHOW:     'bg-oku-blush/40 text-oku-darkgrey/60',
  RESCHEDULED: 'bg-white/60 text-oku-darkgrey/60',
  PENDING:     'bg-white/40 text-oku-darkgrey/40',
}

export default async function AdminSessionsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const [appointments, stats] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        client: { select: { name: true, email: true } },
        practitioner: { select: { name: true } },
        service: { select: { name: true, duration: true } },
        payments: { select: { amount: true, status: true }, take: 1 },
      },
      orderBy: { startTime: 'desc' },
      take: 200,
    }),
    Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      prisma.appointment.count({
        where: { startTime: { gte: new Date() }, status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } }
      }),
      prisma.appointment.count({ where: { status: AppointmentStatus.NO_SHOW } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
    ]).then(([total, completed, upcoming, noShows, revenue]) => ({
      total, completed, upcoming, noShows,
      revenue: revenue._sum.amount ?? 0,
    })),
  ])

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] bg-oku-lavender/5 px-4 py-8 sm:px-6 sm:py-12 lg:px-12">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 lg:flex-row lg:items-end lg:gap-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60">
              <ChevronLeft size={13} /> Command Hub
            </Link>
            <span className="chip bg-white/60 border-white/80">Session Ledger</span>
          </div>
          <h1 className="heading-display text-4xl tracking-tighter text-oku-darkgrey sm:text-5xl lg:text-7xl">
            All <span className="text-oku-purple-dark italic">Sessions.</span>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Sessions', value: stats.total, color: 'bg-white/40' },
          { label: 'Completed', value: stats.completed, color: 'bg-oku-lavender/30' },
          { label: 'Upcoming', value: stats.upcoming, color: 'bg-oku-mint/30' },
          { label: 'No-Shows', value: stats.noShows, color: stats.noShows > 0 ? 'bg-oku-peach/30' : 'bg-white/40' },
          { label: 'Gross Revenue', value: formatCurrency(stats.revenue, 'INR'), color: 'bg-oku-babyblue/30' },
        ].map((s) => (
          <div key={s.label} className={`card-glass-3d !p-6 sm:!p-8 ${s.color}`}>
            <p className="text-2xl font-display font-bold text-oku-darkgrey sm:text-3xl">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/60 p-5 sm:p-8 lg:p-10">
          <div>
            <h2 className="heading-display text-3xl text-oku-darkgrey">Session Ledger</h2>
            <p className="text-sm text-oku-darkgrey/40 mt-1 font-display italic">Last 200 sessions · newest first</p>
          </div>
        </div>

        <div className="space-y-4 p-5 xl:hidden">
          {appointments.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-white/70 bg-white/60 px-5 py-12 text-center text-sm italic text-oku-darkgrey/35">
              No sessions found.
            </div>
          ) : appointments.map((appt) => (
            <div
              key={appt.id}
              className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-oku-darkgrey">
                    {appt.client?.name || '—'}
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-oku-darkgrey/40">
                    {appt.client?.email || 'No email'}
                  </p>
                  <p className="mt-3 text-sm text-oku-darkgrey/70">
                    {appt.practitioner?.name || '—'}
                  </p>
                  <p className="mt-1 text-xs text-oku-darkgrey/55">
                    {appt.service?.name || '—'}
                  </p>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[appt.status] || 'bg-white/40 text-oku-darkgrey/40'}`}>
                  {appt.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    Date
                  </p>
                  <p className="mt-2 text-sm font-bold text-oku-darkgrey">
                    {new Date(appt.startTime).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="mt-1 text-xs text-oku-darkgrey/50">
                    {new Date(appt.startTime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    Amount
                  </p>
                  <p className="mt-2 text-sm font-bold text-oku-darkgrey">
                    {appt.priceSnapshot ? formatCurrency(appt.priceSnapshot, 'INR') : '—'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    Payment
                  </p>
                  <p className="mt-2 text-sm font-bold text-oku-darkgrey">
                    {appt.payments[0]?.status || 'No payment'}
                  </p>
                </div>
              </div>

              {appt.status !== AppointmentStatus.COMPLETED && appt.status !== AppointmentStatus.CANCELLED && (
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <form action={async () => {
                    'use server'
                    await updateAppointmentStatus(appt.id, AppointmentStatus.COMPLETED)
                  }}>
                    <button type="submit" className="w-full rounded-lg bg-oku-mint/40 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey transition-all hover:bg-oku-mint">
                      Complete
                    </button>
                  </form>
                  <form action={async () => {
                    'use server'
                    await updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)
                  }}>
                    <button type="submit" className="w-full rounded-lg bg-oku-peach/40 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/60 transition-all hover:bg-oku-peach">
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-oku-lavender/20 text-[9px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Practitioner</th>
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-oku-darkgrey/30 font-display italic">
                    No sessions found.
                  </td>
                </tr>
              ) : appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-white/30 transition-all">
                  <td className="px-8 py-5">
                    <p className="font-bold text-oku-darkgrey text-sm">{appt.client?.name || '—'}</p>
                    <p className="text-xs text-oku-darkgrey/40 font-mono">{appt.client?.email}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-oku-darkgrey/70">{appt.practitioner?.name || '—'}</td>
                  <td className="px-8 py-5 text-xs text-oku-darkgrey/60">{appt.service?.name || '—'}</td>
                  <td className="px-8 py-5 text-xs text-oku-darkgrey/60">
                    {new Date(appt.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <span className="block opacity-60">{new Date(appt.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-oku-darkgrey">
                    {appt.priceSnapshot ? formatCurrency(appt.priceSnapshot, 'INR') : '—'}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[appt.status] || 'bg-white/40 text-oku-darkgrey/40'}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {appt.status !== AppointmentStatus.COMPLETED && appt.status !== AppointmentStatus.CANCELLED && (
                      <div className="flex gap-2 justify-end">
                        <form action={async () => {
                          'use server'
                          await updateAppointmentStatus(appt.id, AppointmentStatus.COMPLETED)
                        }}>
                          <button type="submit" className="px-3 py-1.5 rounded-lg bg-oku-mint/40 hover:bg-oku-mint text-[9px] font-black uppercase tracking-widest text-oku-darkgrey transition-all">
                            Complete
                          </button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)
                        }}>
                          <button type="submit" className="px-3 py-1.5 rounded-lg bg-oku-peach/40 hover:bg-oku-peach text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/60 transition-all">
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
