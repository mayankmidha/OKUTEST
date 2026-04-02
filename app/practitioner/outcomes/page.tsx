import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { TrendingUp, TrendingDown, Minus, Users, Star, AlertTriangle, BarChart3, Target, Calendar } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function trendIcon(trend: 'up' | 'down' | 'flat') {
  if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />
  if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />
  return <Minus size={14} className="text-oku-darkgrey/40" />
}

function scoreTrend(scores: number[]): 'up' | 'down' | 'flat' {
  if (scores.length < 2) return 'flat'
  const first = scores[0]
  const last = scores[scores.length - 1]
  if (last < first - 2) return 'up'   // lower score = improvement for PHQ/GAD
  if (last > first + 2) return 'down'
  return 'flat'
}

export default async function PractitionerOutcomesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) redirect('/auth/login')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [profile, clients, recentAnswers, ratings] = await Promise.all([
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      select: { canPostBlogs: true },
    }),
    // All unique clients with appointments
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      select: {
        clientId: true,
        status: true,
        startTime: true,
        client: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startTime: 'desc' },
    }),
    // Recent assessment answers across all clients
    prisma.assessmentAnswer.findMany({
      where: {
        user: {
          clientAppointments: { some: { practitionerId: session.user.id } },
        },
        completedAt: { gte: thirtyDaysAgo },
      },
      include: {
        assessment: { select: { title: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { completedAt: 'desc' },
    }),
    // Session ratings
    prisma.rating.findMany({
      where: { practitionerId: session.user.id },
      orderBy: { id: 'desc' },
      take: 50,
    }),
  ])

  // Deduplicate clients
  const clientMap = new Map<string, { id: string; name: string | null; email: string | null; sessionCount: number; lastSession: Date | null }>()
  for (const appt of clients) {
    if (!appt.clientId || !appt.client) continue
    const existing = clientMap.get(appt.clientId)
    if (!existing) {
      clientMap.set(appt.clientId, {
        id: appt.clientId,
        name: appt.client.name,
        email: appt.client.email,
        sessionCount: 1,
        lastSession: appt.startTime,
      })
    } else {
      existing.sessionCount++
      if (appt.startTime > (existing.lastSession ?? new Date(0))) {
        existing.lastSession = appt.startTime
      }
    }
  }
  const uniqueClients = Array.from(clientMap.values())

  // Clients inactive >30 days
  const inactiveClients = uniqueClients.filter(c => {
    if (!c.lastSession) return true
    return c.lastSession < thirtyDaysAgo
  })

  // Assessment trends per client
  const assessmentsByClient = new Map<string, { name: string; assessmentTitle: string; scores: number[]; latest: number | null; trend: 'up' | 'down' | 'flat' }[]>()
  for (const ans of recentAnswers) {
    const clientId = ans.userId
    const clientName = ans.user.name ?? 'Unknown'
    if (!assessmentsByClient.has(clientId)) assessmentsByClient.set(clientId, [])
    const existing = assessmentsByClient.get(clientId)!
    const found = existing.find(e => e.assessmentTitle === ans.assessment.title)
    if (found) {
      if (ans.score !== null) found.scores.push(ans.score)
    } else {
      existing.push({
        name: clientName,
        assessmentTitle: ans.assessment.title,
        scores: ans.score !== null ? [ans.score] : [],
        latest: ans.score,
        trend: 'flat',
      })
    }
  }
  // Compute trends
  for (const entries of assessmentsByClient.values()) {
    for (const e of entries) {
      e.trend = scoreTrend(e.scores)
      e.latest = e.scores[e.scores.length - 1] ?? null
    }
  }

  // Flatten for display — clients improving vs at risk
  const allTrends: { clientId: string; clientName: string; assessment: string; score: number | null; trend: 'up' | 'down' | 'flat' }[] = []
  for (const [clientId, entries] of assessmentsByClient.entries()) {
    for (const e of entries) {
      allTrends.push({ clientId, clientName: e.name, assessment: e.assessmentTitle, score: e.latest, trend: e.trend })
    }
  }

  const improving = allTrends.filter(t => t.trend === 'up')
  const atRisk = allTrends.filter(t => t.trend === 'down')

  // Average session rating
  const avgRating = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
    : null

  return (
    <PractitionerShell
      title="Outcome Tracking"
      badge="Clinical Excellence"
      currentPath="/practitioner/outcomes"
      description="Track clinical outcomes, engagement trends, and session effectiveness across your caseload."
      canPostBlogs={profile?.canPostBlogs}
    >
      <div className="space-y-12">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-glass-3d !bg-oku-lavender/60 !p-8 animate-float-3d">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Active Caseload</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{uniqueClients.length}</p>
            <div className="mt-3 flex items-center gap-1.5 text-oku-purple-dark">
              <Users size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Total Clients</span>
            </div>
          </div>

          <div className="card-glass-3d !bg-oku-mint/60 !p-8 animate-float-3d" style={{ animationDelay: '0.15s' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Improving</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{improving.length}</p>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Score declining (good)</span>
            </div>
          </div>

          <div className="card-glass-3d !bg-oku-peach/60 !p-8 animate-float-3d" style={{ animationDelay: '0.3s' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Needs Attention</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{atRisk.length + inactiveClients.length}</p>
            <div className="mt-3 flex items-center gap-1.5 text-red-500">
              <AlertTriangle size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">At risk + inactive</span>
            </div>
          </div>

          <div className="card-glass-3d !bg-oku-butter/60 !p-8 animate-float-3d" style={{ animationDelay: '0.45s' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Avg. Rating</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{avgRating ?? '—'}</p>
            <div className="mt-3 flex items-center gap-1.5 text-oku-darkgrey/50">
              <Star size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">{ratings.length} sessions rated</span>
            </div>
          </div>
        </div>

        {/* Inactive Clients Alert */}
        {inactiveClients.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-orange-500" /> Inactive Clients (30+ days)
            </h2>
            <div className="card-glass-3d !bg-orange-50/60 !p-0 overflow-hidden">
              <div className="divide-y divide-orange-100">
                {inactiveClients.map(c => (
                  <div key={c.id} className="flex items-center justify-between px-8 py-4">
                    <div>
                      <p className="font-bold text-oku-darkgrey text-sm">{c.name}</p>
                      <p className="text-xs text-oku-darkgrey/40">
                        Last session: {c.lastSession
                          ? c.lastSession.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Never'}
                      </p>
                    </div>
                    <Link
                      href={`/practitioner/clients/${c.id}`}
                      className="px-4 py-2 rounded-xl bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-widest hover:bg-orange-200 transition-all"
                    >
                      View Client
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assessment Trends */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Improving */}
          <div>
            <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" /> Improving (Last 30 Days)
            </h2>
            <div className="card-glass-3d !bg-white/60 !p-0 overflow-hidden">
              {improving.length === 0 ? (
                <div className="px-8 py-12 text-center text-oku-darkgrey/30 italic font-display text-sm">
                  Not enough assessment data yet.
                </div>
              ) : (
                <div className="divide-y divide-white/40">
                  {improving.map((t, i) => (
                    <Link key={i} href={`/practitioner/clients/${t.clientId}`} className="flex items-center justify-between px-8 py-4 hover:bg-oku-mint/20 transition-all">
                      <div>
                        <p className="font-bold text-oku-darkgrey text-sm">{t.clientName}</p>
                        <p className="text-xs text-oku-darkgrey/40">{t.assessment}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-oku-darkgrey">{t.score ?? '—'}</span>
                        {trendIcon(t.trend)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* At Risk */}
          <div>
            <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Needs Clinical Attention
            </h2>
            <div className="card-glass-3d !bg-white/60 !p-0 overflow-hidden">
              {atRisk.length === 0 ? (
                <div className="px-8 py-12 text-center text-oku-darkgrey/30 italic font-display text-sm">
                  No worsening trends detected.
                </div>
              ) : (
                <div className="divide-y divide-white/40">
                  {atRisk.map((t, i) => (
                    <Link key={i} href={`/practitioner/clients/${t.clientId}`} className="flex items-center justify-between px-8 py-4 hover:bg-red-50/40 transition-all">
                      <div>
                        <p className="font-bold text-oku-darkgrey text-sm">{t.clientName}</p>
                        <p className="text-xs text-oku-darkgrey/40">{t.assessment}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-oku-darkgrey">{t.score ?? '—'}</span>
                        {trendIcon(t.trend)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Caseload Overview */}
        <div>
          <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-oku-purple-dark" /> Full Caseload Overview
          </h2>
          <div className="card-glass-3d !bg-white/60 !p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Client</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Sessions</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Last Session</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Assessment Trend</th>
                  <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {uniqueClients.map(c => {
                  const clientTrends = allTrends.filter(t => t.clientId === c.id)
                  const worstTrend = clientTrends.find(t => t.trend === 'down')?.trend
                    ?? clientTrends.find(t => t.trend === 'up')?.trend
                    ?? 'flat'
                  const isInactive = !c.lastSession || c.lastSession < thirtyDaysAgo
                  return (
                    <tr key={c.id} className="hover:bg-white/30 transition-all">
                      <td className="px-8 py-4">
                        <p className="font-bold text-oku-darkgrey text-sm">{c.name}</p>
                        <p className="text-xs text-oku-darkgrey/40">{c.email}</p>
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-oku-darkgrey">{c.sessionCount}</td>
                      <td className="px-8 py-4">
                        <span className={`text-xs font-bold ${isInactive ? 'text-orange-500' : 'text-oku-darkgrey/60'}`}>
                          {c.lastSession
                            ? c.lastSession.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })
                            : 'Never'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        {clientTrends.length === 0 ? (
                          <span className="text-xs text-oku-darkgrey/20 italic">No data</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {trendIcon(worstTrend as 'up' | 'down' | 'flat')}
                            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/50">
                              {worstTrend === 'up' ? 'Improving' : worstTrend === 'down' ? 'Worsening' : 'Stable'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <Link
                          href={`/practitioner/clients/${c.id}`}
                          className="px-4 py-2 rounded-xl bg-oku-lavender/30 hover:bg-oku-lavender text-oku-purple-dark text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {uniqueClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-oku-darkgrey/30 italic font-display text-sm">
                      No clients in your caseload yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PractitionerShell>
  )
}
