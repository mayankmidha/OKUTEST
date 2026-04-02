import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Heart,
  ShieldCheck,
  CalendarCheck,
  ArrowUpRight,
  Plus,
  Smile,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function moodEmoji(val: number) {
  if (val <= 2) return '😞'
  if (val <= 4) return '😟'
  if (val === 5) return '😐'
  if (val <= 7) return '🙂'
  if (val <= 9) return '😊'
  return '😄'
}

function moodLabel(val: number) {
  if (val <= 2) return 'Very low'
  if (val <= 4) return 'Low'
  if (val === 5) return 'Neutral'
  if (val <= 7) return 'Good'
  if (val <= 9) return 'Great'
  return 'Amazing'
}

export default async function WellnessPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [recentMoods, todayMood] = await Promise.all([
    prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 7,
    }),
    prisma.moodEntry.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today, lt: tomorrow },
      },
    }),
  ])

  const last3 = recentMoods.slice(0, 3)

  const navCards = [
    {
      title: 'Mood Tracker',
      description: 'Log and chart your emotional patterns over 30 days.',
      href: '/dashboard/client/wellness/mood',
      icon: Heart,
      color: 'bg-oku-lavender/60',
      iconColor: 'text-oku-purple-dark',
    },
    {
      title: 'Safety Plan',
      description: 'Your personal crisis support and coping toolkit.',
      href: '/dashboard/client/wellness/safety-plan',
      icon: ShieldCheck,
      color: 'bg-oku-mint/20',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Weekly Check-In',
      description: 'Reflect on your week and set intentions.',
      href: '/dashboard/client/wellness/mood',
      icon: CalendarCheck,
      color: 'bg-white/60',
      iconColor: 'text-oku-darkgrey',
    },
  ]

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      {/* Header */}
      <div className="mb-16 space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">
            Wellness
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">
            Your Inner Garden
          </span>
        </div>
        <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
          Wellness <span className="text-oku-purple-dark italic">Hub.</span>
        </h1>
        <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-6 max-w-xl">
          Track your mood, build resilience, and find calm in the chaos.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {navCards.map((card) => (
          <Link
            key={card.href + card.title}
            href={card.href}
            className={`card-glass-3d !p-10 group flex flex-col justify-between min-h-[240px] hover:scale-[1.02] transition-all ${card.color}`}
          >
            <div className="flex justify-between items-start">
              <div
                className={`w-14 h-14 rounded-[1.5rem] bg-white/60 flex items-center justify-center shadow-sm ${card.iconColor}`}
              >
                <card.icon size={28} strokeWidth={1.5} />
              </div>
              <ArrowUpRight
                size={20}
                className="text-oku-darkgrey/30 group-hover:text-oku-purple-dark transition-colors"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-oku-darkgrey mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-oku-darkgrey/50">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Mood Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Moods */}
        <div className="lg:col-span-2 card-glass-3d !p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
                Mood Snapshot
              </p>
              <h2 className="text-2xl font-black text-oku-darkgrey">
                Recent Entries
              </h2>
            </div>
            <Link
              href="/dashboard/client/wellness/mood"
              className="text-xs font-bold text-oku-purple-dark hover:underline uppercase tracking-widest"
            >
              View All
            </Link>
          </div>

          {last3.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Smile size={40} className="text-oku-darkgrey/20 mb-4" />
              <p className="text-oku-darkgrey/40 text-sm">
                No mood entries yet. Start tracking today!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {last3.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/40 border border-oku-darkgrey/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{moodEmoji(entry.mood)}</span>
                    <div>
                      <p className="font-semibold text-oku-darkgrey">
                        {moodLabel(entry.mood)}
                      </p>
                      <p className="text-xs text-oku-darkgrey/40">
                        {entry.createdAt.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-oku-darkgrey/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-oku-purple-dark/60"
                        style={{ width: `${entry.mood * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-oku-darkgrey/60 w-6 text-right">
                      {entry.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's CTA */}
        <div className="card-glass-3d !p-10 flex flex-col justify-between !bg-oku-dark">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
              Today
            </p>
            {todayMood ? (
              <>
                <span className="text-5xl block mb-4">
                  {moodEmoji(todayMood.mood)}
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  {moodLabel(todayMood.mood)}
                </h3>
                <p className="text-white/50 text-sm">
                  Mood logged at{' '}
                  {todayMood.createdAt.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </>
            ) : (
              <>
                <span className="text-5xl block mb-4">🌤️</span>
                <h3 className="text-2xl font-black text-white mb-2">
                  Not logged yet
                </h3>
                <p className="text-white/50 text-sm">
                  Track how you&apos;re feeling today.
                </p>
              </>
            )}
          </div>
          <Link
            href="/dashboard/client/wellness/mood"
            className="btn-pill-3d bg-white border-white text-oku-darkgrey mt-8 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {todayMood ? 'Update Mood' : 'Log Today\'s Mood'}
          </Link>
        </div>
      </div>
    </div>
  )
}
