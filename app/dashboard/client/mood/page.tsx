import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TrendingUp, Heart, ChevronLeft, Wind, Sparkles } from 'lucide-react'
import MoodTrackerForm from './MoodTrackerForm'

export const dynamic = 'force-dynamic'

const moodMap: Record<number, { emoji: string; label: string; bg: string; bar: string }> = {
  1: { emoji: '😫', label: 'Very Low', bg: 'bg-oku-peach/60',    bar: 'bg-oku-peach' },
  2: { emoji: '😔', label: 'Low',      bg: 'bg-oku-blush/60',    bar: 'bg-oku-blush' },
  3: { emoji: '😐', label: 'Neutral',  bg: 'bg-oku-babyblue/60', bar: 'bg-oku-babyblue' },
  4: { emoji: '🙂', label: 'Good',     bg: 'bg-oku-mint/60',     bar: 'bg-oku-mint' },
  5: { emoji: '😊', label: 'Great',    bg: 'bg-oku-lavender/60', bar: 'bg-oku-lavender' },
}

export default async function MoodTrackingPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  let user: any = null
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        moodEntries: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    })
  } catch (e) {
    console.error('Mood fetch error:', e)
  }

  if (!user) redirect('/auth/login')

  const entries = user.moodEntries || []
  const avgMood =
    entries.length > 0
      ? (entries.reduce((acc: number, e: any) => acc + e.mood, 0) / entries.length).toFixed(1)
      : null

  // Last 14 entries for the visual bar chart
  const chartEntries = [...entries].reverse().slice(-14)

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Wellness Tracker</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Mood <span className="text-oku-purple-dark italic">Journal.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              &ldquo;How are you holding space for yourself today?&rdquo;
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Entry form */}
          <div className="lg:col-span-4 space-y-10">
            <div className="card-glass-3d !p-10 !bg-oku-butter sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <Sparkles className="text-oku-purple-dark/60 animate-float-3d" size={26} />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Daily Check-in</span>
              </div>
              <h2 className="heading-display text-3xl text-oku-darkgrey mb-8">
                Today&rsquo;s <span className="italic text-oku-purple-dark">Feeling</span>
              </h2>
              <MoodTrackerForm />
            </div>
          </div>

          {/* Right: Stats + history */}
          <div className="lg:col-span-8 space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card-glass-3d !p-10 !bg-oku-darkgrey text-white relative overflow-hidden">
                <div className="relative z-10">
                  <TrendingUp className="mb-6 opacity-60" size={26} />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40 mb-2">Average Mood</p>
                  <p className="text-6xl heading-display">
                    {avgMood ?? 'N/A'}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-2">out of 5.0</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple-dark/20 rounded-full blur-3xl" />
              </div>

              <div className="card-glass-3d !p-10 !bg-oku-lavender/60">
                <Heart className="text-oku-purple-dark/60 mb-6 animate-pulse" size={26} />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-darkgrey/40 mb-2">Check-in Streak</p>
                <p className="text-6xl heading-display text-oku-darkgrey">{entries.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-2">Total Entries</p>
              </div>
            </div>

            {/* Visual Mood Bar Chart */}
            {chartEntries.length > 0 && (
              <div className="card-glass-3d !p-10 !bg-white/40">
                <h3 className="heading-display text-2xl text-oku-darkgrey mb-2">
                  Recent <span className="italic text-oku-purple-dark">Pattern</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mb-10">Last {chartEntries.length} entries</p>
                <div className="flex items-end gap-2 h-32">
                  {chartEntries.map((entry: any, i: number) => {
                    const m = moodMap[entry.mood] || moodMap[3]
                    const heightPct = (entry.mood / 5) * 100
                    return (
                      <div key={entry.id} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative" style={{ height: '6rem' }}>
                          <div
                            className={`absolute bottom-0 w-full rounded-t-xl ${m.bar} opacity-80 group-hover:opacity-100 transition-all duration-500`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-base">{m.emoji}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/20 hidden sm:block">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* History List */}
            <div className="card-glass-3d !p-10 !bg-white/40">
              <h3 className="heading-display text-2xl text-oku-darkgrey mb-10">
                Recent <span className="italic text-oku-purple-dark">Reflections</span>
              </h3>

              {entries.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[2rem]">
                  <Wind className="mx-auto text-oku-purple-dark/20 mb-4 animate-float-3d" size={36} />
                  <p className="text-lg font-display italic text-oku-darkgrey/30">
                    No entries yet. Start tracking above.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {entries.map((entry: any) => {
                    const mood = moodMap[entry.mood] || moodMap[3]
                    return (
                      <div
                        key={entry.id}
                        className={`flex items-start gap-6 p-6 rounded-[2rem] border border-white/60 ${mood.bg} transition-all duration-300`}
                      >
                        <div className="text-4xl flex-shrink-0 animate-float-3d">{mood.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <p className="font-black text-oku-darkgrey text-sm uppercase tracking-widest">{mood.label}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex-shrink-0">
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-oku-darkgrey/60 italic font-display leading-relaxed">
                              &ldquo;{entry.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
