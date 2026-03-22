import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Activity, TrendingUp, 
  FileText, ArrowRight, Sparkles, Heart
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'

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

  const recentNotes = await prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
  })

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Clinical Command" 
        description="Manage your practice with gentleness and clinical precision."
        actions={
          <>
            <Link href="/practitioner/schedule" className="bg-white text-oku-dark border border-oku-taupe/10 py-4 px-8 rounded-full font-bold shadow-sm hover:shadow-md transition-all">
              Manage Hours
            </Link>
            <Link href="/practitioner/profile" className="btn-primary py-4 px-8 shadow-xl">
              Professional Profile
            </Link>
          </>
        }
      />

      {/* Stats Grid - Pastel Themed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <DashboardCard subtitle="Today" icon={Video} variant="pastel-purple">
          <p className="text-4xl font-display font-bold">{todaySessions.length}</p>
        </DashboardCard>
        <DashboardCard subtitle="Active Patients" icon={Users} variant="pastel-green">
          <p className="text-4xl font-display font-bold">12</p>
        </DashboardCard>
        <DashboardCard subtitle="Revenue" icon={DollarSign} variant="pastel-peach">
          <p className="text-4xl font-display font-bold">${totalEarnings._sum.amount || 0}</p>
        </DashboardCard>
        <DashboardCard subtitle="Next Up" icon={Clock} variant="dark">
          <p className="text-sm font-bold truncate pr-2">
            {upcomingSessions[0] ? upcomingSessions[0].client.name : 'Clear queue'}
          </p>
        </DashboardCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Active Schedule</h2>
              <Link href="/practitioner/appointments" className="text-[10px] uppercase tracking-widest font-black text-oku-purple hover:underline">Full Ledger</Link>
            </div>

            <div className="space-y-4">
              {todaySessions.length === 0 ? (
                <DashboardCard className="border-dashed py-20 text-center">
                  <p className="text-oku-taupe font-display italic text-xl opacity-60">The clinical space is quiet today.</p>
                  <Link href="/practitioner/schedule" className="text-oku-purple font-bold text-sm hover:underline mt-4 inline-block">Edit Availability →</Link>
                </DashboardCard>
              ) : (
                todaySessions.map((session) => (
                  <DashboardCard key={session.id} className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[80px]">
                           <p className="text-2xl font-display font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
                             {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Session Start</p>
                        </div>
                        <div className="h-12 w-px bg-oku-taupe/10" />
                        <div>
                          <Link href={`/practitioner/clients/${session.clientId}`} className="font-bold text-oku-dark text-xl hover:text-oku-purple transition-colors">{session.client.name}</Link>
                          <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{session.service.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Link href={`/practitioner/sessions/${session.id}/notes`} className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark transition-colors px-6 py-4">
                           SOAP Note
                        </Link>
                        <Link href={`/session/${session.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg active:scale-95">
                          Launch Room
                        </Link>
                      </div>
                    </div>
                  </DashboardCard>
                ))
              )}
            </div>
          </section>

          {/* Practitioner Care Card */}
          <DashboardCard title="Practitioner Wellness" icon={Heart} variant="dark" className="relative overflow-hidden bg-oku-purple shadow-oku-purple/20">
             <div className="relative z-10">
                <p className="text-white/80 leading-relaxed italic mb-8 font-display text-lg">
                   "Your capacity to hold space for others begins with your own gentle returning. Take a moment to breathe between sessions today."
                </p>
                <div className="flex gap-4">
                   <div className="bg-white/10 p-4 rounded-2xl flex-1 border border-white/10">
                      <p className="text-[8px] uppercase tracking-widest font-black text-white/40 mb-1">Practice Health</p>
                      <p className="text-sm font-bold">Stable & Growing</p>
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl flex-1 border border-white/10">
                      <p className="text-[8px] uppercase tracking-widest font-black text-white/40 mb-1">Focus Mode</p>
                      <p className="text-sm font-bold">Restorative</p>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </DashboardCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <DashboardCard title="Patient Insights" icon={Activity} className="relative overflow-hidden group">
             <div className="space-y-8 mt-4 relative z-10">
                <div className="group/stat">
                   <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-3 opacity-40 group-hover/stat:opacity-100 transition-opacity">
                      <span>Roster Growth</span>
                      <span>+12% This month</span>
                   </div>
                   <div className="h-1 w-full bg-oku-cream-warm rounded-full overflow-hidden">
                      <div className="h-full bg-oku-purple w-[70%] shadow-[0_0_10px_rgba(168,133,212,0.5)]" />
                   </div>
                </div>
                <div className="group/stat">
                   <div className="flex justify-between text-[10px] uppercase tracking-widest font-black mb-3 opacity-40 group-hover/stat:opacity-100 transition-opacity">
                      <span>Clinical Documentation</span>
                      <span>100% Filed</span>
                   </div>
                   <div className="h-1 w-full bg-oku-cream-warm rounded-full overflow-hidden">
                      <div className="h-full bg-oku-purple w-full shadow-[0_0_10px_rgba(168,133,212,0.5)]" />
                   </div>
                </div>
             </div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          </DashboardCard>

          <DashboardCard title="Recent Reflections" icon={FileText}>
              <div className="space-y-8 mt-4">
                  {recentNotes.length === 0 ? (
                      <p className="text-sm text-oku-taupe italic opacity-60 text-center py-6">No clinical notes recorded yet.</p>
                  ) : (
                      recentNotes.map((note) => (
                          <div key={note.id} className="flex gap-5 group cursor-pointer border-b border-oku-taupe/5 pb-6 last:border-0">
                              <div className="mt-1">
                                  <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all duration-500 shadow-inner">
                                      <FileText size={18} />
                                  </div>
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-oku-dark group-hover:text-oku-purple transition-colors truncate max-w-[140px]">Note: {note.appointment.client.name}</p>
                                  <p className="text-[10px] uppercase tracking-widest text-oku-taupe mt-1 opacity-60 font-black">
                                      {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
              <Link href="/practitioner/clients" className="mt-10 block text-center py-4 rounded-2xl bg-oku-cream-warm/20 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-dark hover:text-white transition-all active:scale-95">View Full Roster</Link>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
