import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Clock, Users, FileText, Heart, 
  Video, Search, Sparkles, ClipboardCheck, BookOpen,
  ArrowUpRight, Wind, ShieldCheck, AlertCircle, Shield, Gift, MessageSquare, Plus, Save, Moon
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
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
        intakeForm: true,
        clientAppointments: {
          include: { practitioner: true, service: true },
          orderBy: { startTime: 'desc' },
        },
        assessmentAnswers: {
          include: { assessment: true },
          orderBy: { completedAt: 'desc' },
        }
      }
    })
  } catch (e) {
    console.error("Dashboard fetch error:", e)
  }

  if (!user) {
    return (
      <div className="py-20 px-10 bg-oku-lavender min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wind className="animate-float-3d mx-auto text-oku-purple-dark mb-6" size={48} />
          <h1 className="heading-display text-3xl">Setting up your sanctuary...</h1>
        </div>
      </div>
    )
  }

  const upcomingAppointments = user.clientAppointments.filter(a => 
    new Date(a.startTime) >= new Date() && 
    (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED)
  )
  const completedAppointmentsCount = user.clientAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length
  const recentAssessments = user.assessmentAnswers || []

  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true },
    where: { isVerified: true },
    take: 1
  })
  const matchedTherapist = practitioners[0]

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Redesign Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="chip bg-white/60 border-white/80">Sanctuary Alpha</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Client Experience</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Peace, <span className="text-oku-purple-dark italic">{user.name?.split(' ')[0] || 'Seeker'}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Holding space for your journey of unfolding.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/client/therapists" className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10">
             <Search size={18} className="mr-3 text-oku-purple-dark" /> Browse Collective
          </Link>
          <Link href="/dashboard/client/book" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 pulse-cta">
             <Plus size={18} className="mr-3" /> New Session
          </Link>
        </div>
      </div>

      {/* 1. 3D Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Calendar size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/40">Active</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{upcomingAppointments.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Upcoming Sessions</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Archive</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{completedAppointmentsCount}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Completed Care</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-peach/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <ClipboardCheck size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Clinical</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{recentAssessments.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Self-Checks Taken</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        {/* Left Section */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* Upcoming Bookings Timeline */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Upcoming <span className="italic text-oku-purple-dark">Windows</span></h2>
              <Link href="/dashboard/client/book" className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2">Full History <ArrowUpRight size={14} /></Link>
            </div>
            
            <div className="space-y-6">
              {upcomingAppointments.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                  <Moon className="mx-auto text-oku-purple-dark/20 mb-6 animate-float-3d" size={48} />
                  <p className="text-2xl font-display italic text-oku-darkgrey/30">The schedule is open.</p>
                  <Link href="/dashboard/client/therapists" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-4 mt-8">Explore Collective</Link>
                </div>
              ) : (
                upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="card-glass-3d !p-8 !bg-white/60 group hover:shadow-2xl transition-all duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="flex items-center gap-8">
                        <div className="relative tilt-card">
                          <div className="w-24 h-24 rounded-[2rem] bg-oku-babyblue overflow-hidden border-4 border-white shadow-xl tilt-card-content">
                            {appt.practitioner?.avatar ? (
                              <img src={appt.practitioner.avatar} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl bg-oku-babyblue/20">🧘</div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-oku-darkgrey text-white flex items-center justify-center border-4 border-white animate-pulse shadow-lg">
                            <Video size={16} />
                          </div>
                        </div>
                        <div>
                          <p className="text-3xl heading-display text-oku-darkgrey">{appt.practitioner?.name || 'Specialist'}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-oku-purple-dark/10 text-oku-purple-dark rounded-full border border-oku-purple-dark/10">{appt.service?.name || 'Session'}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-2"><ShieldCheck size={12} /> HIPAA Secure</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-oku-darkgrey/5 pt-8 md:pt-0 md:pl-10">
                        <div className="text-right min-w-[120px]">
                          <p className="text-2xl font-bold text-oku-darkgrey">
                             {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-oku-darkgrey/40 font-black uppercase tracking-widest mt-1">
                             at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Link href={`/session/${appt.id}`} className="btn-pill-3d bg-oku-babyblue border-oku-babyblue text-oku-darkgrey min-w-[180px] pulse-cta">
                          Join Session Room
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Assessment History with Progress Bars */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-12">Recent <span className="italic text-oku-purple-dark">Insights</span></h2>
            <div className="grid md:grid-cols-2 gap-8">
              {recentAssessments.length === 0 ? (
                <p className="text-xl font-display italic text-oku-darkgrey/30 col-span-2 text-center py-10">No clinical recordings yet.</p>
              ) : (
                recentAssessments.slice(0, 4).map((ans, idx) => {
                  const colors = ['bg-oku-lavender', 'bg-oku-mint', 'bg-oku-peach', 'bg-oku-babyblue']
                  const score = parseInt(ans.result || '0') || 0
                  const max = 27 // PHQ-9 max
                  const percentage = Math.min((score / max) * 100, 100)
                  return (
                    <div key={ans.id} className="card-glass-3d !p-8 !bg-white/60">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-1">{ans.assessment?.title}</p>
                          <p className="text-xl font-bold text-oku-darkgrey">{ans.result}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{new Date(ans.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-oku-darkgrey/5 shadow-inner">
                        <div 
                          className={`h-full ${colors[idx % colors.length]} transition-all duration-1000 shadow-sm`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Section */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* 4. Session Reflections (Butter Yellow) */}
          <section className="card-glass-3d !bg-oku-butter !p-10 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Sparkles className="text-oku-purple-dark/60 animate-float-3d" size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Personal Space</span>
              </div>
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-6">Session <span className="italic text-oku-purple-dark">Reflections</span></h3>
              <textarea 
                placeholder="What stayed with you after the last session?"
                className="w-full h-40 bg-white/40 border border-white/60 rounded-[2rem] p-6 text-sm italic font-display focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all shadow-sm placeholder:text-oku-darkgrey/30"
              />
              <button className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 mt-6 group">
                <Save size={16} className="mr-3 group-hover:scale-110 transition-transform" /> Save Reflection
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          </section>

          {/* 5. Therapist Match Card (Lavender) */}
          <section className="card-glass-3d !bg-oku-lavender/60 !p-10 group">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Your <span className="italic text-oku-purple-dark">Specialist</span></h2>
              <Heart size={20} className="text-oku-purple-dark/40 animate-pulse" />
            </div>
            
            {matchedTherapist ? (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                    <img src={matchedTherapist.user.avatar || '/uploads/2025/07/placeholder.jpg'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-oku-darkgrey">{matchedTherapist.user.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/60">{matchedTherapist.specialization[0]}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {matchedTherapist.specialization.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/60 rounded-full border border-white">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/dashboard/client/messages" className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-4 !px-4 text-[9px]">
                    <MessageSquare size={14} className="mr-2" /> Message
                  </Link>
                  <Link href={`/dashboard/client/book/new/${matchedTherapist.id}`} className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-4 !px-4 text-[9px]">
                    Rebook
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-oku-darkgrey/40 italic font-display">No matches yet. Browse the collective to find your path.</p>
            )}
          </section>

          {/* AI Insight Placeholder */}
          <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-dashed border-2">
             <Wind size={24} className="text-oku-purple-dark/40 mb-6 animate-float-3d" />
             <p className="text-sm font-bold text-oku-darkgrey/60 italic leading-relaxed">
               "Healing is not a race. You are unfolding at the exact pace you need to."
             </p>
          </div>

        </div>
      </div>
      
      {/* 3D Background Objects */}
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
