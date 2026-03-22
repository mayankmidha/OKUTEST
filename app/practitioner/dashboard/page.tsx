import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Users, Clock, DollarSign, 
  Video, Activity, TrendingUp, 
  FileText, ArrowRight, Sparkles, Heart
} from 'lucide-react'
import { AppointmentStatus, UserRole, Prisma } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'

export default async function PractitionerDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  let practitioner: any = null
  let totalCompleted = 0
  let totalEarnings: any = { _sum: { amount: 0 } }
  let recentNotes: any[] = []
  let needsRedirect = false

  try {
    practitioner = await prisma.practitionerProfile.findUnique({
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

    if (!practitioner) {
      await prisma.practitionerProfile.create({
          data: { userId: session.user.id, bio: '', specialization: [] }
      })
      needsRedirect = true
    } else {
      totalCompleted = await prisma.appointment.count({
          where: { 
              practitionerId: session.user.id,
              status: AppointmentStatus.COMPLETED
          }
      })

      totalEarnings = await prisma.payment.aggregate({
          where: {
              appointment: { practitionerId: session.user.id },
              status: 'COMPLETED'
          },
          _sum: { amount: true }
      })

      recentNotes = await prisma.soapNote.findMany({
          where: { appointment: { practitionerId: session.user.id } },
          include: { appointment: { include: { client: true } } },
          orderBy: { createdAt: 'desc' },
          take: 3
      })
    }
  } catch (error) {
    console.error("Practitioner Dashboard Error:", error)
    return (
      <div className="py-12 px-10">
        <DashboardHeader title="Clinical Command" description="Connecting to secure database..." />
        <div className="p-20 text-center bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl">
           <p className="text-oku-taupe italic">We are finalizing your secure profile. Please refresh in a moment.</p>
        </div>
      </div>
    )
  }

  if (needsRedirect) {
    redirect('/practitioner/dashboard')
  }

  const todaySessions = (practitioner?.appointments || []).filter((a: any) => {
      const today = new Date().setHours(0,0,0,0)
      return new Date(a.startTime).setHours(0,0,0,0) === today
  })

  const upcomingSessions = (practitioner?.appointments || []).filter((a: any) => {
      return new Date(a.startTime) > new Date()
  })

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Clinical Command" 
        description="Your dedicated space for practice management."
        actions={
          <>
            <Link href="/practitioner/schedule" className="bg-white text-oku-dark border border-oku-taupe/10 py-4 px-8 rounded-full font-bold shadow-sm hover:shadow-md transition-all">
              Manage Hours
            </Link>
            <Link href="/practitioner/profile" className="btn-primary py-4 px-8 shadow-xl">
              Profile
            </Link>
          </>
        }
      />

      {/* Stats Grid - Pastel Themed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <DashboardCard subtitle="Today" icon={Video} variant="pastel-purple">
          <p className="text-4xl font-display font-bold">{todaySessions.length}</p>
        </DashboardCard>
        <DashboardCard subtitle="Practice" icon={TrendingUp} variant="pastel-green">
          <p className="text-4xl font-display font-bold">{totalCompleted}</p>
        </DashboardCard>
        <DashboardCard subtitle="Revenue" icon={DollarSign} variant="pastel-peach">
          <p className="text-4xl font-display font-bold">${totalEarnings._sum.amount || 0}</p>
        </DashboardCard>
        <DashboardCard subtitle="Next Up" icon={Clock} variant="dark">
          <p className="text-sm font-bold truncate pr-2">
            {upcomingSessions[0] ? upcomingSessions[0].client?.name : 'Queue clear'}
          </p>
        </DashboardCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-8">Active Schedule</h2>
            <div className="space-y-4">
              {todaySessions.length === 0 ? (
                <DashboardCard className="border-dashed py-20 text-center">
                  <p className="text-oku-taupe font-display italic text-xl opacity-60">The space is quiet today.</p>
                </DashboardCard>
              ) : (
                todaySessions.map((appt: any) => (
                  <DashboardCard key={appt.id} className="group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[80px]">
                           <p className="text-2xl font-display font-bold text-oku-dark">
                             {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Start</p>
                        </div>
                        <div className="h-12 w-px bg-oku-taupe/10" />
                        <div>
                          <p className="font-bold text-oku-dark text-xl">{appt.client?.name || 'Patient'}</p>
                          <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service?.name || 'Session'}</p>
                        </div>
                      </div>
                      <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg active:scale-95">
                        Launch Room
                      </Link>
                    </div>
                  </DashboardCard>
                ))
              )}
            </div>
          </section>

          <DashboardCard title="Practitioner Support" icon={Heart} variant="dark" className="relative overflow-hidden bg-oku-purple shadow-oku-purple/20">
             <div className="relative z-10">
                <p className="text-white/80 leading-relaxed italic mb-8 font-display text-lg">
                   "Your capacity to hold space for others begins with your own gentle returning."
                </p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </DashboardCard>
        </div>

        <div className="space-y-8">
          <DashboardCard title="Clinical Reflections" icon={FileText}>
              <div className="space-y-8 mt-4">
                  {(!recentNotes || recentNotes.length === 0) ? (
                      <p className="text-sm text-oku-taupe italic opacity-60 text-center py-6">No notes recorded yet.</p>
                  ) : (
                      recentNotes.map((note) => (
                          <div key={note.id} className="flex gap-5 border-b border-oku-taupe/5 pb-6 last:border-0 group cursor-pointer">
                              <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-oku-purple shadow-inner">
                                  <FileText size={18} />
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-oku-dark group-hover:text-oku-purple transition-colors truncate max-w-[140px]">{note.appointment.client?.name}</p>
                                  <p className="text-[10px] uppercase tracking-widest text-oku-taupe opacity-60 font-black">
                                      {new Date(note.createdAt).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
              <Link href="/practitioner/clients" className="mt-10 block text-center py-4 rounded-2xl bg-oku-cream-warm/20 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-dark hover:text-white transition-all">View All Patients</Link>
          </DashboardCard>
        </div>
      </div>
      <AIAssistantWidget contextType="practitioner_summary" title="Clinical AI Assistant" />
    </div>
  )
}
