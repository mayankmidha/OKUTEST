import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Clock, Users, FileText, Heart, 
  Video, Settings, Bell, Search, Star, 
  ArrowRight, CheckCircle2, BookOpen, Sparkles
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'

export default async function ClientDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Fetch REAL data from Prisma
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      clientProfile: true,
      clientAppointments: {
        where: {
          startTime: { gte: new Date() },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
        },
        include: {
          practitioner: true,
          service: true
        },
        orderBy: { startTime: 'asc' },
        take: 5
      },
      assessmentAnswers: {
        include: { assessment: true },
        orderBy: { completedAt: 'desc' },
        take: 3
      },
      moodEntries: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) redirect('/auth/login')

  const upcomingAppointments = user.clientAppointments
  const recentAssessments = user.assessmentAnswers
  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true },
    take: 3
  })

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Real Data */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
              Welcome back, {user.name?.split(' ')[0]}
            </h1>
            <p className="text-oku-taupe mt-2 font-display italic">"Your healing is not a destination, but a journey."</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/therapists" className="btn-primary py-4 px-8 flex items-center gap-2 shadow-xl">
              <Search size={18} /> Find a Therapist
            </Link>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Upcoming</span>
              <Calendar className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">{upcomingAppointments.length}</p>
            <p className="text-xs text-oku-taupe mt-2">Scheduled sessions</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Wellness</span>
              <Heart className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">
              {user.clientProfile?.noShowCount === 0 ? 'Good' : 'Review'}
            </p>
            <p className="text-xs text-oku-taupe mt-2">Attendance status</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Assessments</span>
              <FileText className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">{recentAssessments.length}</p>
            <p className="text-xs text-oku-taupe mt-2">Clinical screenings</p>
          </div>

          <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Today's Mood</span>
              <Sparkles className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold">
                {user.moodEntries[0]?.mood === 5 ? 'Great' : user.moodEntries[0]?.mood === 4 ? 'Good' : 'TBD'}
            </p>
            <Link href="/dashboard/client/mood" className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline mt-2 inline-block">Update Mood →</Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Real Upcoming Appointments List */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Your Sessions</h2>
                <Link href="/therapists" className="text-[10px] uppercase tracking-widest font-black text-oku-purple hover:underline">Book New</Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="bg-white/50 border border-dashed border-oku-taupe/30 p-12 rounded-[2.5rem] text-center">
                    <p className="text-oku-taupe font-display italic mb-6">No sessions scheduled yet.</p>
                    <Link href="/therapists" className="btn-primary py-3 px-6 inline-block shadow-lg">Browse Therapists</Link>
                  </div>
                ) : (
                  upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-colors duration-500">
                            <Video size={28} />
                          </div>
                          <div>
                            <p className="font-bold text-oku-dark text-xl">{appt.practitioner.name}</p>
                            <p className="text-sm text-oku-taupe italic">{appt.service.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="font-bold text-oku-dark">
                              {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-oku-taupe uppercase tracking-widest font-black">
                              {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg">
                            Enter Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Wellness Library */}
            <section className="bg-oku-dark text-white p-12 rounded-[3.5rem] relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-3xl font-display font-bold mb-4 tracking-tighter">Clinical Resource Library</h2>
                  <p className="text-oku-cream/60 mb-10 max-w-md">Curated articles, somatic exercises, and worksheets tailored to your healing journey.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <BookOpen size={20} className="text-oku-purple mb-3" />
                        <p className="font-bold text-sm group-hover:text-oku-purple transition-colors">Understanding Trauma Responses</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Article • 8 min read</p>
                     </div>
                     <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <Heart size={20} className="text-oku-purple mb-3" />
                        <p className="font-bold text-sm group-hover:text-oku-purple transition-colors">Grounding Techniques Worksheet</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">PDF • 2 pages</p>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Assessment Results */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
              <h3 className="text-xl font-display font-bold text-oku-dark mb-6">Care History</h3>
              <div className="space-y-6">
                {recentAssessments.length === 0 ? (
                  <p className="text-sm text-oku-taupe italic">No screenings completed.</p>
                ) : (
                  recentAssessments.map((ans) => (
                    <div key={ans.id} className="border-b border-oku-taupe/10 pb-4 last:border-0 group">
                      <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1 group-hover:text-oku-purple transition-colors">{ans.assessment.title}</p>
                      <p className="font-bold text-oku-dark mb-1">{ans.result}</p>
                      <p className="text-[10px] text-oku-taupe uppercase tracking-widest opacity-60">{new Date(ans.completedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
              <Link href="/assessments" className="mt-8 block text-center py-4 rounded-2xl bg-oku-cream-warm/20 text-[10px] uppercase tracking-widest font-black text-oku-taupe hover:bg-oku-purple hover:text-white transition-all">New Screening</Link>
            </div>

            {/* Quick Suggestions */}
            <div className="bg-oku-purple/5 p-10 rounded-[3rem] border border-oku-purple/10 relative overflow-hidden">
              <h3 className="text-xl font-display font-bold text-oku-dark mb-6 relative z-10">Matched for You</h3>
              <div className="space-y-6 relative z-10">
                {practitioners.map(p => (
                  <Link key={p.id} href={`/book/${p.id}/trial`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                      {p.user.avatar ? <img src={p.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🧘</div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-oku-dark group-hover:text-oku-purple transition-colors">{p.user.name}</p>
                      <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black">Clinical Specialist</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
