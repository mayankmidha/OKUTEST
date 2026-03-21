import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Calendar, Clock, Users, FileText, Heart, 
  Video, Settings, Bell, Search, Star, 
  ArrowRight, CheckCircle2 
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
    <div className="min-h-screen bg-oku-cream">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-20">
        
        {/* Header with Real Data */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
              Welcome back, {user.name?.split(' ')[0]}
            </h1>
            <p className="text-oku-taupe mt-2 font-display italic">"Your healing is not a destination, but a journey."</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/therapists" className="btn-primary py-4 px-8 flex items-center gap-2">
              <Search size={18} /> Find a Therapist
            </Link>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Upcoming</span>
              <Calendar className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">{upcomingAppointments.length}</p>
            <p className="text-sm text-oku-taupe mt-2">Scheduled sessions</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Wellness</span>
              <Heart className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">
              {user.clientProfile?.noShowCount === 0 ? '100%' : 'Good'}
            </p>
            <p className="text-sm text-oku-taupe mt-2">Attendance health</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Assessments</span>
              <FileText className="text-oku-purple" size={20} />
            </div>
            <p className="text-4xl font-display font-bold text-oku-dark">{recentAssessments.length}</p>
            <p className="text-sm text-oku-taupe mt-2">Screenings completed</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Real Upcoming Appointments List */}
            <section>
              <h2 className="text-2xl font-display font-bold text-oku-dark mb-6">Your Sessions</h2>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="bg-white/50 border border-dashed border-oku-taupe/30 p-12 rounded-[2.5rem] text-center">
                    <p className="text-oku-taupe font-display italic mb-6">No sessions scheduled yet.</p>
                    <Link href="/therapists" className="text-oku-purple font-bold hover:underline">Browse our therapists →</Link>
                  </div>
                ) : (
                  upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="bg-white p-6 rounded-[2rem] border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple">
                            <Video size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-oku-dark">{appt.practitioner.name}</p>
                            <p className="text-sm text-oku-taupe">{appt.service.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="font-bold text-oku-dark">
                              {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-oku-taupe">
                              {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-colors">
                            Join Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Recommended Content */}
            <section className="bg-oku-dark text-white p-12 rounded-[3.5rem] relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-3xl font-display font-bold mb-4 tracking-tighter">Feeling overwhelmed?</h2>
                  <p className="text-oku-cream/60 mb-8 max-w-md">Our ADHD and Anxiety assessments are designed to help you understand your patterns better.</p>
                  <Link href="/assessments" className="inline-flex items-center gap-2 text-oku-purple font-black uppercase tracking-[0.2em] text-[10px] hover:translate-x-2 transition-transform">
                    View All Screenings <ArrowRight size={14} />
                  </Link>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Assessment Results */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
              <h3 className="text-xl font-display font-bold text-oku-dark mb-6">Recent Results</h3>
              <div className="space-y-6">
                {recentAssessments.length === 0 ? (
                  <p className="text-sm text-oku-taupe italic">No assessments taken yet.</p>
                ) : (
                  recentAssessments.map((ans) => (
                    <div key={ans.id} className="border-b border-oku-taupe/10 pb-4 last:border-0">
                      <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">{ans.assessment.title}</p>
                      <p className="font-bold text-oku-dark mb-1">{ans.result}</p>
                      <p className="text-xs text-oku-taupe">{new Date(ans.completedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="bg-oku-purple/5 p-8 rounded-[2.5rem] border border-oku-purple/10">
              <h3 className="text-xl font-display font-bold text-oku-dark mb-6">Suggested for You</h3>
              <div className="space-y-4">
                {practitioners.map(p => (
                  <Link key={p.id} href={`/book/${p.id}/trial`} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-oku-purple/20 overflow-hidden">
                      {p.user.avatar ? <img src={p.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🧘</div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-oku-dark group-hover:text-oku-purple transition-colors">{p.user.name}</p>
                      <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black">Trial Available</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
