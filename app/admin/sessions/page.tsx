import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'
import Link from 'next/link'
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, ChevronLeft, DollarSign } from 'lucide-react'
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
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60">
              <ChevronLeft size={13} /> Command Hub
            </Link>
            <span className="chip bg-white/60 border-white/80">Session Ledger</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-7xl text-oku-darkgrey tracking-tighter">
            All <span className="text-oku-purple-dark italic">Sessions.</span>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {[
          { label: 'Total Sessions', value: stats.total, color: 'bg-white/40' },
          { label: 'Completed', value: stats.completed, color: 'bg-oku-lavender/30' },
          { label: 'Upcoming', value: stats.upcoming, color: 'bg-oku-mint/30' },
          { label: 'No-Shows', value: stats.noShows, color: stats.noShows > 0 ? 'bg-oku-peach/30' : 'bg-white/40' },
          { label: 'Gross Revenue', value: formatCurrency(stats.revenue, 'INR'), color: 'bg-oku-babyblue/30' },
        ].map((s) => (
          <div key={s.label} className={`card-glass-3d !p-8 ${s.color}`}>
            <p className="text-3xl font-display font-bold text-oku-darkgrey">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden">
        <div className="p-10 border-b border-white/60 flex justify-between items-center">
          <div>
            <h2 className="heading-display text-3xl text-oku-darkgrey">Session Ledger</h2>
            <p className="text-sm text-oku-darkgrey/40 mt-1 font-display italic">Last 200 sessions · newest first</p>
          </div>
        </div>
        <div className="overflow-x-auto">
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
