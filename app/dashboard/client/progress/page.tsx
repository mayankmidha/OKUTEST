import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TrendingUp, TrendingDown, Minus, BarChart3, Heart, Brain, Calendar, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function moodEmoji(val: number) {
  if (val <= 2) return '😞'
  if (val <= 4) return '😟'
  if (val === 5) return '😐'
  if (val <= 7) return '🙂'
  if (val <= 9) return '😊'
  return '😄'
}

function moodColor(val: number) {
  if (val <= 3) return 'bg-red-400'
  if (val <= 5) return 'bg-oku-butter'
  if (val <= 7) return 'bg-oku-lavender'
  return 'bg-oku-mint'
}

export default async function ClientProgressPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')
  const userId = session.user.id

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [moodEntries, assessmentAnswers, appointments, adhdLogs] = await Promise.all([
    prisma.moodEntry.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.assessmentAnswer.findMany({
      where: { userId },
      include: { assessment: { select: { title: true } } },
      orderBy: { completedAt: 'desc' },
      take: 20,
    }),
    prisma.appointment.findMany({
      where: { clientId: userId, status: 'COMPLETED' },
      include: { practitioner: { select: { name: true } } },
      orderBy: { startTime: 'desc' },
      take: 10,
    }),
    prisma.adhdDailyLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }).catch(() => []),
  ])

  // Mood analytics
  const avgMood = moodEntries.length > 0
    ? Math.round(moodEntries.reduce((s, e) => s + e.mood, 0) / moodEntries.length * 10) / 10
    : null

  const firstHalf = moodEntries.slice(0, Math.floor(moodEntries.length / 2))
  const secondHalf = moodEntries.slice(Math.floor(moodEntries.length / 2))
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, e) => s + e.mood, 0) / firstHalf.length : 0
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, e) => s + e.mood, 0) / secondHalf.length : 0
  const moodTrend = moodEntries.length >= 4
    ? secondAvg > firstAvg + 0.5 ? 'up' : secondAvg < firstAvg - 0.5 ? 'down' : 'flat'
    : 'flat'

  // Assessment history grouped by instrument
  const assessmentGroups = new Map<string, typeof assessmentAnswers>()
  for (const ans of assessmentAnswers) {
    const key = ans.assessment.title
    if (!assessmentGroups.has(key)) assessmentGroups.set(key, [])
    assessmentGroups.get(key)!.push(ans)
  }

  // ADHD energy trend
  const avgEnergy = adhdLogs.length > 0
    ? Math.round(adhdLogs.reduce((s, l) => s + l.energyLevel, 0) / adhdLogs.length)
    : null

  const medicationDays = adhdLogs.filter(l => l.medicationTaken).length

  return (
    <div className="min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-oku-mint/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24 relative z-10">
        <Link
          href="/dashboard/client"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey mb-10"
        >
          <ArrowLeft size={13} /> My Dashboard
        </Link>

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">
              Progress
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Your Journey</span>
          </div>
          <h1 className="heading-display text-5xl lg:text-7xl text-oku-darkgrey tracking-tighter">
            My <span className="text-oku-purple-dark italic">Progress.</span>
          </h1>
          <p className="text-lg text-oku-darkgrey/60 font-display italic mt-3 max-w-lg">
            30 days of your mental wellness journey — mood trends, clinical assessments, and session milestones.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          <div className="card-glass-3d !bg-oku-lavender/60 !p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Avg. Mood</p>
            <p className="heading-display text-4xl text-oku-darkgrey">{avgMood ?? '—'}</p>
            <p className="text-2xl mt-1">{avgMood ? moodEmoji(Math.round(avgMood)) : '💭'}</p>
          </div>
          <div className="card-glass-3d !bg-oku-mint/60 !p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Mood Logs</p>
            <p className="heading-display text-4xl text-oku-darkgrey">{moodEntries.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">Last 30 days</p>
          </div>
          <div className="card-glass-3d !bg-oku-butter/60 !p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Sessions</p>
            <p className="heading-display text-4xl text-oku-darkgrey">{appointments.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">Completed</p>
          </div>
          <div className="card-glass-3d !bg-oku-peach/60 !p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Assessments</p>
            <p className="heading-display text-4xl text-oku-darkgrey">{assessmentAnswers.length}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1">Completed</p>
          </div>
        </div>

        {/* Mood Chart — 30 day bar */}
        {moodEntries.length > 0 && (
          <div className="card-glass-3d !bg-white/60 !p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">Mood Journey</p>
                <h2 className="text-2xl font-black text-oku-darkgrey flex items-center gap-2">
                  <Heart size={18} className="text-oku-purple-dark" />
                  Last 30 Days
                  <span className="ml-3 flex items-center gap-1 text-sm font-bold">
                    {moodTrend === 'up' ? <><TrendingUp size={14} className="text-emerald-500" /> <span className="text-emerald-500">Improving</span></> :
                     moodTrend === 'down' ? <><TrendingDown size={14} className="text-red-500" /> <span className="text-red-500">Declining</span></> :
                     <><Minus size={14} className="text-oku-darkgrey/40" /> <span className="text-oku-darkgrey/40">Stable</span></>}
                  </span>
                </h2>
              </div>
              <Link href="/dashboard/client/mood/history" className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">
                Full History →
              </Link>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1 h-24">
              {moodEntries.map((entry, i) => (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={`w-full rounded-t-lg ${moodColor(entry.mood)} opacity-80 group-hover:opacity-100 transition-all`}
                    style={{ height: `${(entry.mood / 10) * 100}%`, minHeight: '4px' }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-oku-darkgrey text-white text-[9px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                    {moodEmoji(entry.mood)} {entry.mood}/10
                    <br />
                    {entry.createdAt.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-oku-darkgrey/30 font-black uppercase tracking-widest">
              <span>{moodEntries[0]?.createdAt.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}</span>
              <span>Today</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment History */}
          <div>
            <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-oku-purple-dark" /> Clinical Assessments
            </h2>
            <div className="space-y-4">
              {assessmentGroups.size === 0 ? (
                <div className="card-glass-3d !bg-white/60 !p-8 text-center">
                  <p className="text-oku-darkgrey/40 italic font-display text-sm">No assessments completed yet.</p>
                  <Link href="/dashboard/client/assessments" className="inline-block mt-4 text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">
                    Take an assessment →
                  </Link>
                </div>
              ) : (
                Array.from(assessmentGroups.entries()).map(([title, answers]) => {
                  const scores = answers.filter(a => a.score !== null).map(a => a.score as number).reverse()
                  const latest = scores[scores.length - 1]
                  const prev = scores[scores.length - 2]
                  const trend = scores.length >= 2
                    ? latest < prev - 1 ? 'up' : latest > prev + 1 ? 'down' : 'flat'
                    : 'flat'
                  return (
                    <div key={title} className="card-glass-3d !bg-white/60 !p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-black text-oku-darkgrey text-sm">{title}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-0.5">
                            {answers.length} attempt{answers.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {latest !== undefined && (
                            <span className="text-2xl font-black text-oku-darkgrey">{Math.round(latest)}</span>
                          )}
                          {trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                          {trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                          {trend === 'flat' && <Minus size={14} className="text-oku-darkgrey/30" />}
                        </div>
                      </div>
                      {/* Score history dots */}
                      {scores.length > 1 && (
                        <div className="flex items-end gap-1 h-8 mt-2">
                          {scores.map((s, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-oku-lavender/60 rounded-sm"
                              style={{ height: `${Math.min((s / 60) * 100, 100)}%`, minHeight: '2px' }}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-[9px] text-oku-darkgrey/30 font-black uppercase tracking-widest mt-2">
                        Last: {answers[0].completedAt.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Session History */}
            <div>
              <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-oku-purple-dark" /> Recent Sessions
              </h2>
              <div className="card-glass-3d !bg-white/60 !p-0 overflow-hidden">
                {appointments.length === 0 ? (
                  <div className="p-8 text-center text-oku-darkgrey/30 italic font-display text-sm">
                    No completed sessions yet.
                  </div>
                ) : (
                  <div className="divide-y divide-white/40">
                    {appointments.slice(0, 5).map(appt => (
                      <div key={appt.id} className="flex items-center justify-between px-6 py-4">
                        <div>
                          <p className="font-bold text-oku-darkgrey text-sm">{appt.practitioner.name}</p>
                          <p className="text-xs text-oku-darkgrey/40">
                            {appt.startTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-oku-mint/40 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ADHD Tracker (only if logs exist) */}
            {adhdLogs.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-oku-darkgrey uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Brain size={16} className="text-oku-purple-dark" /> ADHD Tracker
                </h2>
                <div className="card-glass-3d !bg-oku-lavender/40 !p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-oku-darkgrey">Avg. Energy</p>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 rounded-full bg-oku-darkgrey/10 overflow-hidden">
                        <div className="h-full rounded-full bg-oku-purple-dark/60" style={{ width: `${avgEnergy}%` }} />
                      </div>
                      <span className="text-sm font-black text-oku-darkgrey">{avgEnergy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-oku-darkgrey">Medication Days</p>
                    <span className="text-sm font-black text-oku-darkgrey">{medicationDays} / {adhdLogs.length}</span>
                  </div>
                  <Link href="/dashboard/client/adhd" className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline block mt-2">
                    Open ADHD Manager →
                  </Link>
                </div>
              </div>
            )}

            {/* Encouragement card */}
            <div className="card-glass-3d !bg-oku-darkgrey !p-8">
              <Star size={20} className="text-oku-butter mb-4" />
              <h3 className="font-black text-white text-lg mb-2">You&apos;re showing up.</h3>
              <p className="text-white/50 text-sm font-display italic leading-relaxed">
                {moodEntries.length >= 7
                  ? `${moodEntries.length} mood logs this month. Consistency is the most powerful thing you can do for your mental health.`
                  : 'Every log, every session, every breath — it all counts. Keep going.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
