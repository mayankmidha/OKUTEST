import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Smile, Heart, TrendingUp, History } from 'lucide-react'
import MoodTrackerForm from './MoodTrackerForm'

export default async function MoodTrackingPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      moodEntries: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!user) redirect('/auth/login')

  const moodMap: Record<number, { emoji: string, label: string, color: string }> = {
    1: { emoji: '😫', label: 'Very Low', color: 'text-red-600 bg-red-50' },
    2: { emoji: '😔', label: 'Low', color: 'text-orange-600 bg-orange-50' },
    3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-600 bg-yellow-50' },
    4: { emoji: '🙂', label: 'Good', color: 'text-green-600 bg-green-50' },
    5: { emoji: '😊', label: 'Great', color: 'text-emerald-600 bg-emerald-50' },
  }

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/dashboard/client" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark flex items-center gap-2 mb-4">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">Wellness Tracker</h1>
            <p className="text-oku-taupe mt-2 font-display italic">"How are you holding space for yourself today?"</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* New Entry */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-xl sticky top-28">
              <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                <Smile className="text-oku-purple" /> Daily Check-in
              </h2>
              <MoodTrackerForm />
            </div>
          </div>

          {/* History & Insights */}
          <div className="lg:col-span-2 space-y-8">
            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <TrendingUp className="text-oku-purple mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Weekly Average</p>
                    <p className="text-4xl font-display font-bold">
                        {user.moodEntries.length > 0 
                            ? (user.moodEntries.reduce((acc, curr) => acc + curr.mood, 0) / user.moodEntries.length).toFixed(1) 
                            : 'N/A'
                        }
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/20 rounded-full blur-3xl" />
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                  <Heart className="text-oku-purple mb-4" />
                  <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Check-in Streak</p>
                  <p className="text-4xl font-display font-bold text-oku-dark">{user.moodEntries.length} Days</p>
               </div>
            </div>

            {/* List */}
            <div className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-oku-dark mb-8 flex items-center gap-3">
                <History className="text-oku-purple" /> Recent Reflections
              </h2>
              
              <div className="space-y-6">
                {user.moodEntries.length === 0 ? (
                  <p className="text-oku-taupe italic text-center py-12">No entries yet. Start tracking your journey above.</p>
                ) : (
                  user.moodEntries.map((entry) => {
                    const mood = moodMap[entry.mood] || moodMap[3]
                    return (
                      <div key={entry.id} className="group border-b border-oku-taupe/5 pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{mood.emoji}</span>
                            <div>
                              <p className="font-bold text-oku-dark">{mood.label}</p>
                              <p className="text-[10px] uppercase tracking-widest text-oku-taupe">
                                {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-oku-taupe leading-relaxed italic bg-oku-cream/30 p-4 rounded-2xl">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
