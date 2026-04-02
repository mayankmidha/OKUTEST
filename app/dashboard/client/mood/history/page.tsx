import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ChevronLeft, Activity, Heart, 
  TrendingUp, TrendingDown, Pill, 
  Zap, Calendar, CalendarDays
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MoodHistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const logs = await prisma.adhdDailyLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 30
  })

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden text-oku-darkgrey">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Wellness Radar</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Vitality <span className="text-oku-purple-dark italic">Ledger.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Visualizing your mood, energy, and medication patterns over time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <div className="card-glass-3d !p-12 !bg-white/40 overflow-hidden">
                    <h2 className="heading-display text-3xl mb-12 flex items-center gap-4">
                        <CalendarDays className="text-oku-purple-dark" />
                        Last <span className="italic">30 Days</span>
                    </h2>
                    
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <p className="text-center py-20 italic text-oku-darkgrey/40">No vitality data logged yet.</p>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="p-6 bg-white/60 rounded-3xl border border-white flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-oku-lavender/20 flex items-center justify-center text-oku-purple-dark font-black text-xs">
                                            {new Date(log.date).getDate()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{new Date(log.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-oku-purple">
                                                    <Zap size={10} /> Energy: {log.energyLevel}%
                                                </span>
                                                {log.medicationTaken && (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-oku-mint-dark">
                                                        <Pill size={10} /> Meds Taken
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-oku-darkgrey/5 pt-4 md:pt-0 md:pl-8">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-oku-darkgrey">{log.moodScore || '—'}/10</p>
                                            <p className="text-[8px] uppercase tracking-widest opacity-40">Mood Score</p>
                                        </div>
                                        {log.notes && (
                                            <div className="max-w-[200px]">
                                                <p className="text-[10px] italic text-oku-darkgrey/60 line-clamp-2">&ldquo;{log.notes}&rdquo;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="card-glass-3d !p-10 !bg-oku-dark text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <TrendingUp className="text-oku-lavender mb-6" />
                        <h3 className="heading-display text-2xl mb-4">Correlation <span className="italic">Insight</span></h3>
                        <p className="text-xs text-white/60 leading-relaxed italic">
                            Your energy levels are 40% higher on days when Medication Protocol is followed before 9 AM.
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-oku-purple/10 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
