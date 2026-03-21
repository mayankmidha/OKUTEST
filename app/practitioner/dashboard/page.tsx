import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Bell, Activity, TrendingUp, 
  Star, MessageSquare, ArrowRight, CheckCircle2,
  AlertCircle, FileText
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

  // Calculate stats
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

  // Recent client notes activity
  const recentNotes = await prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
  })

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
              Practice Command
            </h1>
            <p className="text-oku-taupe mt-2 font-display italic">Manage your clinical space and patient care journey.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/practitioner/schedule" className="bg-white text-oku-dark border border-oku-taupe/10 py-4 px-8 rounded-full font-bold shadow-sm hover:shadow-md transition-all">
              Edit Schedule
            </Link>
            <Link href="/practitioner/profile" className="btn-primary py-4 px-8 shadow-xl">
              Public Profile
            </Link>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Today's Sessions</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-display font-bold text-oku-dark">{todaySessions.length}</p>
              <Video className="text-oku-purple opacity-40" size={28} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Practice Growth</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-display font-bold text-oku-dark">{totalCompleted}</p>
              <TrendingUp className="text-oku-purple opacity-40" size={28} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Revenue (USD)</p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-display font-bold text-oku-dark">${totalEarnings._sum.amount || 0}</p>
              <DollarSign className="text-oku-purple opacity-40" size={28} />
            </div>
          </div>
          <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Next Patient</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold truncate pr-2">
                {upcomingSessions[0] ? upcomingSessions[0].client.name : 'No sessions'}
              </p>
              <Clock className="text-oku-purple" size={24} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <section className="bg-white p-10 rounded-[3.5rem] border border-oku-taupe/10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Active Schedule</h2>
                <div className="flex items-center gap-2 bg-oku-cream-warm/30 px-4 py-2 rounded-full border border-oku-taupe/5">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">
                      Live • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                   </span>
                </div>
              </div>

              <div className="space-y-6">
                {todaySessions.length === 0 ? (
                  <div className="py-20 text-center bg-oku-cream/20 rounded-[2.5rem] border border-dashed border-oku-taupe/20">
                    <p className="text-oku-taupe font-display italic text-xl">The space is quiet today.</p>
                    <Link href="/practitioner/schedule" className="text-oku-purple font-bold text-sm hover:underline mt-4 inline-block">Manage Availability →</Link>
                  </div>
                ) : (
                  todaySessions.map((session) => (
                    <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-oku-cream/30 rounded-[2.5rem] border border-oku-taupe/5 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[80px]">
                           <p className="text-2xl font-display font-bold text-oku-dark">
                             {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">Start Time</p>
                        </div>
                        <div className="h-12 w-px bg-oku-taupe/10" />
                        <div>
                          <p className="font-bold text-oku-dark text-xl">{session.client.name}</p>
                          <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{session.service.name}</p>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0 flex items-center gap-4">
                        <Link href={`/practitioner/sessions/${session.id}/notes`} className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark transition-colors px-6 py-4">
                           View Notes
                        </Link>
                        <Link href={`/session/${session.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg active:scale-95">
                          Launch Room
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Clinical Oversight */}
          <div className="space-y-8">
            <section className="bg-oku-dark text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold mb-6 tracking-tighter">Practice Health</h3>
                  <div className="space-y-8 mt-10">
                     <div className="group/stat">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-3 opacity-40 group-hover/stat:opacity-100 transition-opacity">
                           <span>Attendance Rate</span>
                           <span>94%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-oku-purple w-[94%] shadow-[0_0_15px_rgba(168,133,212,0.5)]" />
                        </div>
                     </div>
                     <div className="group/stat">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-3 opacity-40 group-hover/stat:opacity-100 transition-opacity">
                           <span>Profile Visibility</span>
                           <span>100%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-oku-purple w-full shadow-[0_0_15px_rgba(168,133,212,0.5)]" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 w-48 h-48 bg-oku-purple/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                <h3 className="text-xl font-display font-bold text-oku-dark mb-8">Clinical Reflections</h3>
                <div className="space-y-8">
                    {recentNotes.length === 0 ? (
                        <p className="text-sm text-oku-taupe italic opacity-60">No clinical notes recorded yet.</p>
                    ) : (
                        recentNotes.map((note) => (
                            <div key={note.id} className="flex gap-5 group cursor-pointer">
                                <div className="mt-1">
                                    <div className="w-10 h-10 rounded-2xl bg-oku-purple/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all">
                                        <FileText size={18} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-oku-dark group-hover:text-oku-purple transition-colors">Note for {note.appointment.client.name}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-oku-taupe mt-1 opacity-60">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <Link href="/practitioner/dashboard" className="mt-10 block text-center py-4 rounded-2xl bg-oku-cream-warm/20 text-[10px] uppercase tracking-widest font-black text-oku-taupe hover:bg-oku-dark hover:text-white transition-all">View All Patients</Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
