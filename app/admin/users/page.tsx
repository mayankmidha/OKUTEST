import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { Users, UserCheck, UserPlus, Activity, Shield, Trash2, Ban, ChevronLeft } from 'lucide-react'
import { deleteUser, toggleClientAdhd } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const [clients, stats] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.CLIENT },
      include: {
        clientProfile: { select: { adhdDiagnosed: true, referralCreditBalance: true } },
        _count: { select: { clientAppointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    Promise.all([
      prisma.user.count({ where: { role: UserRole.CLIENT } }),
      prisma.user.count({
        where: {
          role: UserRole.CLIENT,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.CLIENT,
          clientAppointments: {
            some: { startTime: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
          },
        },
      }),
      prisma.user.count({
        where: { role: UserRole.CLIENT, deletionRequestedAt: { not: null } },
      }),
    ]).then(([total, newThisWeek, activeThisMonth, pendingDeletion]) => ({
      total, newThisWeek, activeThisMonth, pendingDeletion
    })),
  ])

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60">
              <ChevronLeft size={13} /> Command Hub
            </Link>
            <span className="chip bg-white/60 border-white/80">Client Registry</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-7xl text-oku-darkgrey tracking-tighter">
            Users <span className="text-oku-purple-dark italic">Registry.</span>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Clients', value: stats.total, icon: Users, color: 'bg-oku-lavender/30' },
          { label: 'New This Week', value: stats.newThisWeek, icon: UserPlus, color: 'bg-oku-mint/30' },
          { label: 'Active (30d)', value: stats.activeThisMonth, icon: Activity, color: 'bg-oku-babyblue/30' },
          { label: 'Deletion Requests', value: stats.pendingDeletion, icon: Shield, color: stats.pendingDeletion > 0 ? 'bg-oku-peach/30' : 'bg-white/40' },
        ].map((s) => (
          <div key={s.label} className={`card-glass-3d !p-8 ${s.color}`}>
            <s.icon size={20} className="text-oku-darkgrey/40 mb-4" />
            <p className="text-4xl font-display font-bold text-oku-darkgrey">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden">
        <div className="p-10 border-b border-white/60">
          <h2 className="heading-display text-3xl text-oku-darkgrey">All Clients</h2>
          <p className="text-sm text-oku-darkgrey/40 mt-1 font-display italic">{clients.length} registered clients</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-oku-lavender/20 text-[9px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5">Sessions</th>
                <th className="px-8 py-5">Credits</th>
                <th className="px-8 py-5">ADHD</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-oku-darkgrey/30 font-display italic">
                    No clients registered yet.
                  </td>
                </tr>
              ) : clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/30 transition-all">
                  <td className="px-8 py-5">
                    <p className="font-bold text-oku-darkgrey">{client.name || '—'}</p>
                    <p className="text-xs text-oku-darkgrey/40 font-mono mt-0.5">{client.email}</p>
                  </td>
                  <td className="px-8 py-5 text-xs text-oku-darkgrey/60">
                    {new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-oku-darkgrey">{client._count.clientAppointments}</span>
                  </td>
                  <td className="px-8 py-5 text-xs text-oku-darkgrey/60">
                    ₹{((client.clientProfile?.referralCreditBalance ?? 0)).toFixed(0)}
                  </td>
                  <td className="px-8 py-5">
                    <form action={async () => {
                      'use server'
                      await toggleClientAdhd(client.id, !client.clientProfile?.adhdDiagnosed)
                    }}>
                      <button
                        type="submit"
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                          client.clientProfile?.adhdDiagnosed
                            ? 'bg-oku-lavender text-oku-purple-dark border-oku-lavender hover:bg-oku-lavender/60'
                            : 'bg-white/40 text-oku-darkgrey/30 border-oku-darkgrey/10 hover:bg-oku-lavender/30 hover:text-oku-purple-dark'
                        }`}
                        title={client.clientProfile?.adhdDiagnosed ? 'Revoke ADHD access' : 'Enable ADHD Manager'}
                      >
                        {client.clientProfile?.adhdDiagnosed ? '✓ ADHD On' : 'Enable ADHD'}
                      </button>
                    </form>
                  </td>
                  <td className="px-8 py-5">
                    {client.deletionRequestedAt ? (
                      <span className="px-3 py-1 bg-oku-peach text-oku-darkgrey/60 text-[9px] font-black uppercase tracking-widest rounded-full">Deletion Req.</span>
                    ) : (
                      <span className="px-3 py-1 bg-oku-mint text-oku-darkgrey/60 text-[9px] font-black uppercase tracking-widest rounded-full">Active</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <form action={async () => {
                      'use server'
                      await deleteUser(client.id)
                    }}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-oku-peach/40 hover:bg-oku-peach border border-transparent text-xs font-bold text-oku-darkgrey/60 hover:text-oku-darkgrey transition-all"
                        onClick={(e) => {
                          if (!confirm(`Delete ${client.name}? This cannot be undone.`)) e.preventDefault()
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </form>
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
