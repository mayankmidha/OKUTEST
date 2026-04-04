import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { ChevronLeft, Check, X, FileText } from 'lucide-react'
import { toggleTherapistVerification } from '../actions'
import { getPractitionerDisciplineLabel } from '@/lib/practitioner-type'
import { formatCurrency } from '@/lib/currency'

export const dynamic = 'force-dynamic'

export default async function AdminPractitionersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const [practitioners, stats, kycDocs] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.THERAPIST },
      include: {
        practitionerProfile: true,
        _count: { select: { practitionerAppointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    Promise.all([
      prisma.user.count({ where: { role: UserRole.THERAPIST } }),
      prisma.practitionerProfile.count({ where: { isVerified: true } }),
      prisma.practitionerProfile.count({ where: { isVerified: false } }),
    ]).then(([total, verified, pending]) => ({ total, verified, pending })),
    prisma.document.findMany({
      where: { type: 'KYC_LICENSE' },
      orderBy: { createdAt: 'desc' },
      select: { practitionerId: true, name: true, createdAt: true, id: true },
    }),
  ])

  // Group KYC docs by practitioner
  const kycByPractitioner = kycDocs.reduce<Record<string, typeof kycDocs>>((acc, doc) => {
    if (!doc.practitionerId) return acc
    acc[doc.practitionerId] = acc[doc.practitionerId] || []
    acc[doc.practitionerId].push(doc)
    return acc
  }, {})

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] bg-oku-lavender/5 px-4 py-8 sm:px-6 sm:py-12 lg:px-12">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 lg:flex-row lg:items-end lg:gap-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60">
              <ChevronLeft size={13} /> Command Hub
            </Link>
            <span className="chip bg-white/60 border-white/80">Practitioner Network</span>
          </div>
          <h1 className="heading-display text-4xl tracking-tighter text-oku-darkgrey sm:text-6xl lg:text-7xl">
            Network <span className="text-oku-purple-dark italic">Integrity.</span>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: 'Total Practitioners', value: stats.total, color: 'bg-oku-lavender/30' },
          { label: 'Verified', value: stats.verified, color: 'bg-oku-mint/30' },
          { label: 'Pending KYC', value: stats.pending, color: stats.pending > 0 ? 'bg-oku-peach/30' : 'bg-white/40' },
        ].map((s) => (
          <div key={s.label} className={`card-glass-3d !p-6 sm:!p-8 ${s.color}`}>
            <p className="text-3xl font-display font-bold text-oku-darkgrey sm:text-4xl">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Practitioners Table */}
      <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden">
        <div className="border-b border-white/60 p-5 sm:p-8 lg:p-10">
          <h2 className="heading-display text-3xl text-oku-darkgrey">All Practitioners</h2>
          <p className="text-sm text-oku-darkgrey/40 mt-1 font-display italic">{practitioners.length} registered practitioners</p>
        </div>

        <div className="space-y-4 p-5 lg:hidden">
          {practitioners.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-white/70 bg-white/60 px-5 py-12 text-center text-sm italic text-oku-darkgrey/35">
              No practitioners registered yet.
            </div>
          ) : practitioners.map((p) => {
            const profile = p.practitionerProfile
            const docs = kycByPractitioner[p.id] || []

            return (
              <div
                key={p.id}
                className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-oku-darkgrey">{p.name || '—'}</p>
                    <p className="mt-1 break-all font-mono text-xs text-oku-darkgrey/40">
                      {p.email}
                    </p>
                    <p className="mt-3 text-sm text-oku-darkgrey/70">
                      {getPractitionerDisciplineLabel(profile) || '—'}
                    </p>
                  </div>
                  <span className={`self-start rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                    profile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60'
                  }`}>
                    {profile?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                      License
                    </p>
                    <p className="mt-2 break-all font-mono text-xs text-oku-darkgrey/50">
                      {profile?.licenseNumber || 'NOT PROVIDED'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                      Sessions
                    </p>
                    <p className="mt-2 text-sm font-bold text-oku-darkgrey">
                      {p._count.practitionerAppointments}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                      Rate
                    </p>
                    <p className="mt-2 text-sm font-bold text-oku-darkgrey">
                      {profile?.hourlyRate ? formatCurrency(profile.hourlyRate, 'INR') : '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#faf7f2] px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                    KYC docs
                  </p>
                  {docs.length === 0 ? (
                    <p className="mt-2 text-xs font-black uppercase tracking-widest text-oku-darkgrey/30">
                      None
                    </p>
                  ) : (
                    <div className="mt-2 space-y-1.5">
                      {docs.slice(0, 2).map((doc) => (
                        <p key={doc.id} className="inline-flex items-center gap-1.5 text-[10px] font-black text-oku-purple-dark">
                          <FileText size={11} /> {doc.name}
                        </p>
                      ))}
                      {docs.length > 2 && (
                        <p className="text-[9px] text-oku-darkgrey/40">+{docs.length - 2} more</p>
                      )}
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="mt-5">
                    <form action={async () => {
                      'use server'
                      await toggleTherapistVerification(profile.id, !profile.isVerified)
                    }}>
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          profile.isVerified
                            ? 'bg-oku-peach/40 hover:bg-oku-peach text-oku-darkgrey/60'
                            : 'bg-oku-mint/40 hover:bg-oku-mint text-oku-darkgrey'
                        }`}
                      >
                        {profile.isVerified ? <><X size={12} /> Revoke</> : <><Check size={12} /> Verify</>}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-oku-lavender/20 text-[9px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                <th className="px-8 py-5">Practitioner</th>
                <th className="px-8 py-5">Discipline</th>
                <th className="px-8 py-5">License</th>
                <th className="px-8 py-5">Sessions</th>
                <th className="px-8 py-5">Rate (INR/hr)</th>
                <th className="px-8 py-5">KYC Docs</th>
                <th className="px-8 py-5">KYC Status</th>
                <th className="px-8 py-5 text-right">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {practitioners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center text-oku-darkgrey/30 font-display italic">
                    No practitioners registered yet.
                  </td>
                </tr>
              ) : practitioners.map((p) => {
                const profile = p.practitionerProfile
                const docs = kycByPractitioner[p.id] || []
                return (
                  <tr key={p.id} className="hover:bg-white/30 transition-all">
                    <td className="px-8 py-5">
                      <p className="font-bold text-oku-darkgrey">{p.name || '—'}</p>
                      <p className="text-xs text-oku-darkgrey/40 font-mono mt-0.5">{p.email}</p>
                    </td>
                    <td className="px-8 py-5 text-xs text-oku-darkgrey/60">
                      {getPractitionerDisciplineLabel(profile) || '—'}
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-oku-darkgrey/40">
                      {profile?.licenseNumber || 'NOT PROVIDED'}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-oku-darkgrey">
                      {p._count.practitionerAppointments}
                    </td>
                    <td className="px-8 py-5 text-xs text-oku-darkgrey/60">
                      {profile?.hourlyRate ? formatCurrency(profile.hourlyRate, 'INR') : '—'}
                    </td>
                    <td className="px-8 py-5">
                      {docs.length === 0 ? (
                        <span className="text-[9px] text-oku-darkgrey/30 font-black uppercase tracking-widest">None</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {docs.slice(0, 2).map((doc) => (
                            <span key={doc.id} className="inline-flex items-center gap-1.5 text-[9px] font-black text-oku-purple-dark">
                              <FileText size={10} /> {doc.name.length > 20 ? doc.name.slice(0, 20) + '…' : doc.name}
                            </span>
                          ))}
                          {docs.length > 2 && (
                            <span className="text-[9px] text-oku-darkgrey/40">+{docs.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        profile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60'
                      }`}>
                        {profile?.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {profile && (
                        <form action={async () => {
                          'use server'
                          await toggleTherapistVerification(profile.id, !profile.isVerified)
                        }}>
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              profile.isVerified
                                ? 'bg-oku-peach/40 hover:bg-oku-peach text-oku-darkgrey/60'
                                : 'bg-oku-mint/40 hover:bg-oku-mint text-oku-darkgrey'
                            }`}
                          >
                            {profile.isVerified ? <><X size={12} /> Revoke</> : <><Check size={12} /> Verify</>}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
