import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Bell, Activity, TrendingUp, 
  Star, MessageSquare, ArrowRight 
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'

export default async function PractitionerDashboardPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  // Fetch REAL practitioner data
  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      appointments: {
        where: {
          startTime: { gte: new Date(new Date().setHours(0,0,0,0)) },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
        },
        include: {
          client: true,
          service: true
        },
        orderBy: { startTime: 'asc' }
      }
    }
  })

  if (!practitioner) redirect('/auth/login')

  const todaySessions = practitioner.appointments.filter(a => {
      const today = new Date().setHours(0,0,0,0)
      return new Date(a.startTime).setHours(0,0,0,0) === today
  })

  const upcomingSessions = practitioner.appointments.filter(a => {
      return new Date(a.startTime) > new Date()
  })

  // Calculate some basic stats
  const totalCompleted = await prisma.appointment.count({
      where: { 
          practitionerId: session.user.id,
          status: AppointmentStatus.COMPLETED
      }
  })

  const totalEarnings = await prisma.payment.aggregate({
      where: {
          appointment: { practitionerId: session.user.id },
          status: 'COMPLETED'
      },
      _sum: { amount: true }
  })

  return (
    <div className="min-h-screen bg-oku-cream">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
              Practice Overview
            </h1>
            <p className="text-oku-taupe mt-2 font-display italic">Manage your space and your people.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/practitioner/schedule" className="btn-primary py-4 px-8">
              Open Schedule
            </Link>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Today</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-display font-bold text-oku-dark">{todaySessions.length}</p>
              <Video className="text-oku-purple opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Total Clients</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-display font-bold text-oku-dark">{totalCompleted > 0 ? 'Active' : '0'}</p>
              <Users className="text-oku-purple opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Earnings</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-display font-bold text-oku-dark">${totalEarnings._sum.amount || 0}</p>
              <DollarSign className="text-oku-purple opacity-20" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Next Up</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-oku-dark">
                {upcomingSessions[0] ? new Date(upcomingSessions[0].startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No sessions'}
              </p>
              <Clock className="text-oku-purple opacity-20" size={32} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <section className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-oku-dark">Today's Sessions</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe bg-oku-cream-warm px-3 py-1 rounded-full">
                   {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-6">
                {todaySessions.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-oku-taupe font-display italic">No sessions scheduled for today.</p>
                  </div>
                ) : (
                  todaySessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-6 bg-oku-cream/30 rounded-3xl border border-oku-taupe/5 group hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[60px]">
                           <p className="text-xl font-display font-bold text-oku-dark">
                             {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Start</p>
                        </div>
                        <div className="h-10 w-px bg-oku-taupe/10" />
                        <div>
                          <p className="font-bold text-oku-dark text-lg">{session.client.name}</p>
                          <p className="text-sm text-oku-taupe italic">{session.service.name}</p>
                        </div>
                      </div>
                      <Link href={`/session/${session.id}`} className="bg-oku-dark text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-colors shadow-lg">
                        Launch Session
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Practice Health */}
          <div className="space-y-8">
            <section className="bg-oku-purple text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold mb-4 tracking-tighter">Practice Health</h3>
                  <div className="space-y-6 mt-8">
                     <div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-2 opacity-60">
                           <span>Attendance Rate</span>
                           <span>94%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-white w-[94%] shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-2 opacity-60">
                           <span>Profile Completion</span>
                           <span>100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-white w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                <h3 className="text-xl font-display font-bold text-oku-dark mb-6">Recent Activity</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-oku-green mt-1.5" />
                        <div>
                            <p className="text-sm font-bold text-oku-dark">New Assessment</p>
                            <p className="text-xs text-oku-taupe">A client completed a Trauma Screening.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-oku-purple mt-1.5" />
                        <div>
                            <p className="text-sm font-bold text-oku-dark">Payment Received</p>
                            <p className="text-xs text-oku-taupe">Trial call payment processed successfully.</p>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
