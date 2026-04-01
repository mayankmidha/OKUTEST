import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Calendar, Heart, ClipboardCheck, TrendingUp,
  Download, Award, Star, Zap, Shield, ArrowUpRight,
  Wind, CheckCircle2
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

const MOOD_EMOJI: Record<number, string> = {
  1: '😔', 2: '😟', 3: '😐', 4: '🙂', 5: '😊',
  6: '😄', 7: '🌟', 8: '✨', 9: '💫', 10: '🌈'
}

function MoodChart({ entries }: { entries: { mood: number; createdAt: Date }[] }) {
  const last14 = entries.slice(0, 14).reverse()
  if (last14.length === 0) return (
    <div className="py-12 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[2.5rem]">
      <p className="text-oku-darkgrey/30 italic font-display">No mood entries yet. Start tracking today.</p>
    </div>
  )

  const max = 10
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3 h-36">
        {last14.map((entry, i) => {
          const heightPct = (entry.mood / max) * 100
          const colors = ['bg-oku-lavender', 'bg-oku-mint', 'bg-oku-peach', 'bg-oku-babyblue', 'bg-oku-blush']
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-all font-black text-oku-darkgrey">{entry.mood}</span>
              <div
                className={`w-full ${colors[i % colors.length]} rounded-t-xl transition-all duration-700 relative`}
                style={{ height: `${heightPct}%`, minHeight: '8px' }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-base opacity-0 group-hover:opacity-100 transition-all">
                  {MOOD_EMOJI[entry.mood] || '😐'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 px-1">
        <span>{last14.length > 0 ? new Date(last14[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
        <span className="text-oku-purple-dark">14-Day Trend</span>
        <span>{last14.length > 0 ? new Date(last14[last14.length - 1].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
      </div>
    </div>
  )
}

function AchievementBadge({ label, earned, icon }: { label: string; earned: boolean; icon: React.ReactNode }) {
  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all duration-300 ${
      earned
        ? 'bg-white/80 border-oku-purple-dark/20 shadow-lg'
        : 'bg-white/20 border-white/40 opacity-40 grayscale'
    }`}>
      <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${earned ? 'bg-oku-lavender' : 'bg-oku-darkgrey/10'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-relaxed ${earned ? 'text-oku-darkgrey' : 'text-oku-darkgrey/40'}`}>{label}</span>
      {earned && <CheckCircle2 size={12} className="text-oku-purple-dark" />}
    </div>
  )
}

export default async function ClientProgressPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      clientAppointments: {
        include: { practitioner: true, service: true },
        orderBy: { startTime: 'desc' },
        take: 10,
      },
      moodEntries: {
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
      assessmentAnswers: {
        include: { assessment: true },
        orderBy: { completedAt: 'desc' },
      },
      clientTreatmentPlans: {
        where: { status: 'ACTIVE' },
        take: 1,
      },
    },
  })

  if (!user) redirect('/auth/login')

  const completedSessions = user.clientAppointments.filter(a => a.status === AppointmentStatus.COMPLETED)
  const recentMoods = user.moodEntries.filter(m => new Date(m.createdAt) >= fourteenDaysAgo)
  const avgMood = recentMoods.length > 0
    ? Math.round((recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length) * 10) / 10
    : null

  const daysSinceJoining = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  // Streak: consecutive days with mood entries
  const moodDates = [...new Set(user.moodEntries.map(m => new Date(m.createdAt).toDateString()))]
  let streakDays = 0
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (moodDates.includes(d.toDateString())) {
      streakDays++
    } else {
      break
    }
  }

  const achievements = [
    { label: 'First Step', earned: completedSessions.length >= 1, icon: <Star size={22} className="text-oku-purple-dark" /> },
    { label: '5 Sessions', earned: completedSessions.length >= 5, icon: <Zap size={22} className="text-oku-purple-dark" /> },
    { label: '10 Sessions', earned: completedSessions.length >= 10, icon: <Award size={22} className="text-oku-purple-dark" /> },
    { label: 'Mood Tracker', earned: user.moodEntries.length >= 7, icon: <Heart size={22} className="text-oku-purple-dark" /> },
    { label: '30-Day Journey', earned: daysSinceJoining >= 30, icon: <Calendar size={22} className="text-oku-purple-dark" /> },
    { label: 'Assessment', earned: user.assessmentAnswers.length >= 1, icon: <ClipboardCheck size={22} className="text-oku-purple-dark" /> },
    { label: '7-Day Streak', earned: streakDays >= 7, icon: <TrendingUp size={22} className="text-oku-purple-dark" /> },
    { label: 'Vault Ready', icon: <Shield size={22} className="text-oku-purple-dark" />, earned: true },
  ]

  const treatmentPlan = user.clientTreatmentPlans[0]

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="chip bg-white/60 border-white/80">Your Journey</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Progress Sanctuary</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Your <span className="text-oku-purple-dark italic">unfolding.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 max-w-xl">
            A reflection of how far you have come, and how much more awaits.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/api/client/progress-report"
            className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10 flex items-center gap-3"
          >
            <Download size={18} className="text-oku-purple-dark" /> Download Report
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-8 flex flex-col justify-between animate-float-3d">
          <div className="w-12 h-12 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm mb-8">
            <Calendar size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-5xl heading-display text-oku-darkgrey mb-1">{completedSessions.length}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Sessions Done</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-8 flex flex-col justify-between animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-12 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm mb-8">
            <Heart size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-5xl heading-display text-oku-darkgrey mb-1">
              {avgMood !== null ? avgMood : '—'}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Avg Mood (14d)</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-peach/60 !p-8 flex flex-col justify-between animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="w-12 h-12 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm mb-8">
            <ClipboardCheck size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-5xl heading-display text-oku-darkgrey mb-1">{user.assessmentAnswers.length}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Assessments</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-babyblue/60 !p-8 flex flex-col justify-between animate-float-3d" style={{ animationDelay: '0.6s' }}>
          <div className="w-12 h-12 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm mb-8">
            <TrendingUp size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-5xl heading-display text-oku-darkgrey mb-1">{daysSinceJoining}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Days Since Start</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        {/* Left Column */}
        <div className="xl:col-span-8 space-y-12">

          {/* Mood Chart */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <div className="flex items-center justify-between mb-10">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
                Mood <span className="italic text-oku-purple-dark">Trend</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">{streakDays > 0 ? `${streakDays}-day streak` : 'No streak'}</span>
                {streakDays >= 3 && <span className="text-base">🔥</span>}
              </div>
            </div>
            <MoodChart entries={user.moodEntries.slice(0, 14)} />
            <div className="mt-8 flex justify-end">
              <Link
                href="/dashboard/client/mood"
                className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2"
              >
                View Full Journal <ArrowUpRight size={14} />
              </Link>
            </div>
          </section>

          {/* Recent Sessions */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <div className="flex items-center justify-between mb-10">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
                Session <span className="italic text-oku-purple-dark">History</span>
              </h2>
              <Link href="/dashboard/client/sessions" className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2">
                All Sessions <ArrowUpRight size={14} />
              </Link>
            </div>

            {completedSessions.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[2.5rem]">
                <Wind className="mx-auto text-oku-purple-dark/20 mb-4 animate-float-3d" size={40} />
                <p className="text-xl font-display italic text-oku-darkgrey/30">Your story is just beginning.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedSessions.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-6 bg-white/60 rounded-[2rem] border border-white hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-[1rem] bg-oku-mint/60 flex items-center justify-center text-oku-darkgrey">
                        <CheckCircle2 size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-oku-darkgrey">{appt.service?.name || 'Session'}</p>
                        <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/40 font-black mt-1">
                          with {appt.practitioner?.name || 'Therapist'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                      {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Treatment Plan Goals */}
          {treatmentPlan && (
            <section className="card-glass-3d !p-12 !bg-oku-lavender/40">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-10">
                Treatment <span className="italic text-oku-purple-dark">Goals</span>
              </h2>
              <div className="space-y-6">
                {treatmentPlan.goals.split('\n').filter(Boolean).map((goal, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white/60 rounded-[2rem] border border-white">
                    <div className="w-8 h-8 rounded-full bg-oku-lavender flex items-center justify-center text-oku-purple-dark font-black text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-oku-darkgrey/80 leading-relaxed font-display italic">{goal}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-12">

          {/* Achievements */}
          <section className="card-glass-3d !p-10 !bg-white/40">
            <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight mb-8">
              Mile<span className="italic text-oku-purple-dark">stones</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((a) => (
                <AchievementBadge key={a.label} label={a.label} earned={a.earned} icon={a.icon} />
              ))}
            </div>
          </section>

          {/* Summary Card */}
          <section className="card-glass-3d !p-10 !bg-oku-butter/60">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <Wind size={22} className="text-oku-purple-dark/60 animate-float-3d" />
                <h3 className="heading-display text-2xl text-oku-darkgrey">Summary</h3>
              </div>
              {[
                { label: 'Total mood entries', value: user.moodEntries.length },
                { label: 'Current streak', value: `${streakDays} days` },
                { label: 'Days on platform', value: daysSinceJoining },
                { label: 'Assessments taken', value: user.assessmentAnswers.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-4 border-b border-oku-darkgrey/5 last:border-0">
                  <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey/50">{label}</span>
                  <span className="text-lg font-bold text-oku-darkgrey">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Download CTA */}
          <div className="card-glass-3d !p-10 !bg-oku-darkgrey text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <Download size={28} className="text-white/60 mx-auto mb-6 animate-float-3d" strokeWidth={1.5} />
              <h3 className="heading-display text-2xl text-white mb-4">Full Report</h3>
              <p className="text-white/40 text-sm italic font-display mb-8 leading-relaxed">Download your complete progress data in JSON format.</p>
              <a
                href="/api/client/progress-report"
                className="btn-pill-3d bg-white border-white text-oku-darkgrey w-full !py-4 text-[9px] flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download Progress Report
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
