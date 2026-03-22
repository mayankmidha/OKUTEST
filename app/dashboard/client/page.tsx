import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Clock, Users, FileText, Heart, 
  Video, Search, Sparkles, ClipboardCheck, BookOpen
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'

export default async function ClientDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Ultra-defensive fetch
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        clientAppointments: {
          where: {
            startTime: { gte: new Date() },
            status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] }
          },
          include: { practitioner: true, service: true },
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
  } catch (e) {
    console.error("Dashboard fetch error:", e)
  }

  if (!user) {
    // If user record doesn't exist yet or DB error, try to show minimal dashboard
    return (
      <div className="py-12 px-10">
        <DashboardHeader title="Welcome to Oku" description="Setting up your sanctuary..." />
        <div className="p-20 text-center bg-white rounded-[3rem] border border-oku-taupe/10">
           <p className="text-oku-taupe italic">We are finalizing your profile. Please refresh in a moment.</p>
        </div>
      </div>
    )
  }

  const upcomingAppointments = user.clientAppointments || []
  const recentAssessments = user.assessmentAnswers || []
  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true },
    where: { isVerified: true },
    take: 3
  })

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title={`Welcome, ${user.name?.split(' ')[0] || 'Seeker'}`}
        description="Your sanctuary for healing, reflection, and growth."
        actions={
          <Link href="/therapists" className="btn-pastel py-4 px-10 flex items-center gap-2 shadow-xl active:scale-95">
            <Search size={18} /> Browse Specialists
          </Link>
        }
      />

      {/* Stats Grid - Pastel Themed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <DashboardCard subtitle="Upcoming" icon={Calendar} variant="pastel-purple">
          <p className="text-4xl font-display font-bold">{upcomingAppointments.length}</p>
        </DashboardCard>
        <DashboardCard subtitle="Clinical" icon={ClipboardCheck} variant="pastel-green">
          <p className="text-4xl font-display font-bold">{recentAssessments.length}</p>
        </DashboardCard>
        <DashboardCard subtitle="Wellness" icon={Heart} variant="pastel-peach">
          <p className="text-4xl font-display font-bold">{user.clientProfile?.noShowCount === 0 ? 'Optimal' : 'Standard'}</p>
        </DashboardCard>
        <DashboardCard subtitle="Today's Mood" icon={Sparkles} variant="dark">
          <p className="text-sm font-bold opacity-80 mb-1">
            {user.moodEntries?.[0] ? `Feeling Better` : 'Start Tracking'}
          </p>
          <Link href="/dashboard/client/mood" className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">Update Journey →</Link>
        </DashboardCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Your Care Journey</h2>
              <Link href="/dashboard/client/book" className="text-[10px] uppercase tracking-widest font-black text-oku-purple hover:underline">Full History</Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <DashboardCard className="border-dashed py-20 text-center">
                  <p className="text-oku-taupe font-display italic text-xl opacity-60">The schedule is open.</p>
                  <Link href="/therapists" className="text-oku-purple font-bold text-sm hover:underline mt-4 inline-block">Find your therapist →</Link>
                </DashboardCard>
              ) : (
                upcomingAppointments.map((appt) => (
                  <DashboardCard key={appt.id} className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-oku-purple/30 flex items-center justify-center text-oku-purple-dark group-hover:bg-oku-purple-dark group-hover:text-white transition-all duration-500 shadow-inner">
                          <Video size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-oku-dark text-xl">{appt.practitioner?.name || 'Practitioner'}</p>
                          <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service?.name || 'Therapy Session'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right border-r border-oku-taupe/10 pr-10">
                          <p className="font-bold text-oku-dark">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <p className="text-[10px] text-oku-taupe font-black uppercase tracking-widest mt-1 opacity-60">Confirmed</p>
                        </div>
                        <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple-dark transition-all shadow-lg active:scale-95">
                          Enter Room
                        </Link>
                      </div>
                    </div>
                  </DashboardCard>
                ))
              )}
            </div>
          </section>

          <DashboardCard title="Clinical Resource Library" icon={BookOpen} variant="dark" className="relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-white/60 mb-10 max-w-md italic font-display">Worksheets and tools curated specifically for your profile.</p>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <p className="font-bold text-sm mb-1">Trauma Response Guide</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Article • 8 min</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <p className="font-bold text-sm mb-1">Somatic Grounding Worksheet</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-40">PDF • 2 pages</p>
                   </div>
                </div>
             </div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
          </DashboardCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <DashboardCard title="Care Records" icon={FileText}>
            <div className="space-y-8 mt-4">
              {recentAssessments.length === 0 ? (
                <p className="text-sm text-oku-taupe italic opacity-60">No screenings recorded yet.</p>
              ) : (
                recentAssessments.map((ans) => (
                  <div key={ans.id} className="border-b border-oku-taupe/5 pb-6 last:border-0 group cursor-pointer">
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe group-hover:text-oku-purple transition-colors mb-1">{ans.assessment?.title}</p>
                    <p className="font-bold text-oku-dark leading-tight">{ans.result}</p>
                    <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest font-black">{new Date(ans.completedAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
            <Link href="/assessments" className="mt-8 block text-center py-4 rounded-2xl bg-oku-cream-warm/30 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-dark hover:text-white transition-all active:scale-95">New Screening</Link>
          </DashboardCard>

          <DashboardCard title="Suggested for You" icon={Sparkles} className="bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]">
            <div className="space-y-6 mt-4">
              {practitioners.map(p => (
                <Link key={p.id} href={`/book/${p.id}/trial`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {p.user?.avatar ? <img src={p.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl text-oku-purple bg-oku-purple/10">🧘</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-current group-hover:text-oku-purple transition-colors truncate">{p.user?.name || 'Specialist'}</p>
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-60">Trauma-Informed</p>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
      <AIAssistantWidget contextType="client_insight" title="Wellness Insights" />
    </div>
  )
}
