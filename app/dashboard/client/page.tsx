import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Calendar, Clock, Users, FileText, Heart, 
  Video, Search, Sparkles, ClipboardCheck, BookOpen,
  ArrowUpRight, Wind, ShieldCheck, AlertCircle, Pill, Shield
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'
import { WellnessVisualizer } from '@/components/WellnessVisualizer'
import { ReferralShareCard } from '@/components/ReferralShareCard'
import { ensureUserReferralCode, getReferralSummaryForUser } from '@/lib/referrals'

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
        insurancePolicies: true,
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
    return (
      <div className="py-20 px-10 bg-oku-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wind className="animate-float mx-auto text-oku-purple-dark mb-6" size={48} />
          <h1 className="text-3xl font-display font-bold">Setting up your sanctuary...</h1>
          <p className="text-oku-taupe italic mt-2">Finalizing your secure profile. Please refresh in a moment.</p>
        </div>
      </div>
    )
  }

  const upcomingAppointments = user.clientAppointments || []
  const recentAssessments = user.assessmentAnswers || []
  const hasIncompleteIntake = !user.intakeForm
  const hasIncompleteConsent = !user.hasSignedConsent
  const referralCode = await ensureUserReferralCode(user.id, user.name)
  const referralSummary = await getReferralSummaryForUser(user.id)
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const inviteUrl = `${protocol}://${host}/auth/signup?ref=${referralCode}`

  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true },
    where: { isVerified: true },
    take: 3
  })

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-oku-navy text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">Secure Space</span>
             <span className="text-oku-taupe/40 text-[10px] font-black uppercase tracking-[0.3em]">Client Dashboard</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-oku-dark">
            Peace, {user.name?.split(' ')[0] || 'Seeker'}.
          </h1>
          <p className="text-xl text-oku-taupe font-display italic opacity-80 max-w-xl">
            A sanctuary for healing, reflection, and quiet growth.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard/client/therapists" className="btn-navy group flex items-center gap-3">
             <Search size={18} className="group-hover:rotate-12 transition-transform" /> Browse Specialists
          </Link>
          <Link href="/dashboard/client/book" className="btn-sky hidden md:flex items-center gap-2">
             <Calendar size={18} /> Schedule
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Core Activities */}
        <div className="lg:col-span-8 space-y-10">
          
          {(hasIncompleteIntake || hasIncompleteConsent) && (
            <div className="bg-oku-navy p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <AlertCircle size={20} className="text-oku-purple animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Action Required</span>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-tight">Onboarding Incomplete</h2>
                  <p className="text-white/60 italic font-display text-lg mb-8">Please finalize your secure credentials to unlock full clinical features.</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                     {hasIncompleteConsent && (
                        <Link href="/consent" className="bg-oku-purple text-oku-dark p-6 rounded-3xl flex items-center justify-between group/btn hover:bg-white transition-all">
                           <div>
                              <p className="font-bold text-sm">Clinical Consent</p>
                              <p className="text-[10px] uppercase tracking-widest opacity-60">Needs Signature</p>
                           </div>
                           <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Link>
                     )}
                     {hasIncompleteIntake && (
                        <Link href="/dashboard/client/intake" className="bg-white/10 backdrop-blur-md text-white p-6 rounded-3xl flex items-center justify-between group/btn hover:bg-white/20 transition-all border border-white/5">
                           <div>
                              <p className="font-bold text-sm text-white">Medical Intake</p>
                              <p className="text-[10px] uppercase tracking-widest opacity-40">Incomplete</p>
                           </div>
                           <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Link>
                     )}
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glass p-8 flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Upcoming</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{upcomingAppointments.length}</p>
                <p className="text-xs text-oku-taupe font-medium mt-1">Scheduled Sessions</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-oku-purple/20 text-oku-purple-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
            </div>

            <div className="card-glass p-8 flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Recordings</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{recentAssessments.length}</p>
                <p className="text-xs text-oku-taupe font-medium mt-1">Clinical Screenings</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-oku-ocean text-oku-navy-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardCheck size={24} />
              </div>
            </div>

            <div className="card-glass p-8 flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Wellbeing</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{user.moodEntries?.[0] ? `Level ${user.moodEntries[0].mood}` : '---'}</p>
                <p className="text-xs text-oku-taupe font-medium mt-1">Latest Mood Pulse</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-oku-pink/20 text-oku-pink-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
            </div>
          </div>

          {/* Primary Action: Active Sessions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-display font-bold text-oku-dark">Session Windows</h2>
              <Link href="/dashboard/client/book" className="text-[10px] font-black uppercase tracking-widest text-oku-navy hover:text-oku-purple-dark transition-colors flex items-center gap-1">Full Calendar <ArrowUpRight size={14} /></Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="card-glass py-24 text-center border-dashed">
                  <p className="text-oku-taupe font-display italic text-2xl opacity-40">The schedule is open.</p>
                  <Link href="/dashboard/client/therapists" className="text-oku-navy font-bold text-sm hover:underline mt-6 inline-block">Find a dedicated therapist →</Link>
                </div>
              ) : (
                upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="card-glass p-1 group hover:border-oku-navy/20 transition-all">
                    <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-3xl bg-oku-ocean overflow-hidden border-4 border-white shadow-inner">
                            {appt.practitioner?.avatar ? (
                              <img src={appt.practitioner.avatar} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">🧘</div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-oku-navy text-white flex items-center justify-center border-4 border-oku-cream animate-pulse">
                            <Video size={14} />
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-display font-bold text-oku-dark leading-tight">{appt.practitioner?.name || 'Practitioner'}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-oku-navy/5 text-oku-navy-light rounded-full border border-oku-navy/5">{appt.service?.name || 'Session'}</span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe flex items-center gap-1"><ShieldCheck size={10} /> Secure Video</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 pl-8 md:pl-0 border-t md:border-t-0 md:border-l border-oku-taupe/10 pt-8 md:pt-0">
                        <div className="text-right">
                          <p className="text-xl font-display font-bold text-oku-dark">
                             {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-oku-taupe font-black uppercase tracking-widest mt-0.5">
                             at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Link href={`/session/${appt.id}`} className="btn-navy min-w-[160px] text-center">
                          Join Room
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* New Insight Section */}
          <WellnessVisualizer />

          {/* Clinical Records: Insurance */}
          <div className="pt-4">
             <div className="card-glass p-8 group hover:border-oku-green/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-oku-green/10 text-oku-green-dark flex items-center justify-center">
                      <Shield size={18} />
                   </div>
                   <h3 className="font-bold text-oku-dark">Insurance & Billing</h3>
                </div>
                {(!user.insurancePolicies || user.insurancePolicies.length === 0) ? (
                   <div className="text-center py-2">
                     <p className="text-xs text-oku-taupe italic opacity-60 mb-4">No insurance on file.</p>
                     <button className="text-[9px] font-black uppercase tracking-widest text-oku-navy bg-oku-navy/5 px-4 py-2 rounded-full hover:bg-oku-navy/10 transition-colors">Add Coverage</button>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {user.insurancePolicies.map((policy: any) => (
                         <div key={policy.id} className="pb-4 border-b border-oku-taupe/5 last:border-0 last:pb-0">
                            <p className="font-bold text-oku-dark text-sm flex items-center justify-between">
                               {policy.providerName}
                               <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest ${policy.status === 'ACTIVE' ? 'bg-oku-green/10 text-oku-green-dark' : 'bg-oku-pink/10 text-oku-pink-dark'}`}>
                                  {policy.status.replace('_', ' ')}
                               </span>
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/60 mt-1">Policy: ••••{policy.policyNumber.slice(-4)}</p>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>

        </div>

        {/* Right Column: Insights & Recommendations */}
        <div className="lg:col-span-4 space-y-10">
          {referralCode && (
            <ReferralShareCard
              inviteUrl={inviteUrl}
              referralCode={referralCode}
              referralCount={referralSummary.referralCount}
              recentRewards={referralSummary.rewards.slice(0, 3)}
              totalEarned={referralSummary.totalEarned}
              availableCredit={referralSummary.availableCredit}
            />
          )}
          
          <div className="card-navy group">
             <div className="relative z-10">
                <Sparkles className="text-oku-purple mb-6 animate-pulse" size={32} />
                <h3 className="text-3xl font-display font-bold mb-4">Journey Reflection</h3>
                <p className="text-white/70 italic font-display text-lg leading-relaxed mb-8">
                  "The curve of healing is not a circle, but a spiral. Every return is a deeper understanding."
                </p>
                <Link href="/dashboard/client/mood" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple hover:text-white transition-all group-hover:translate-x-2">
                   Log Today's Pulse <ArrowUpRight size={14} />
                </Link>
             </div>
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-oku-blue-dark/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <section className="card-glass p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-oku-dark">Clinical Vault</h2>
              <BookOpen size={20} className="text-oku-taupe/30" />
            </div>
            <div className="space-y-8">
              {recentAssessments.length === 0 ? (
                <p className="text-sm text-oku-taupe italic opacity-60">No screenings recorded yet.</p>
              ) : (
                recentAssessments.map((ans) => (
                  <Link key={ans.id} href="/dashboard/client/clinical" className="group cursor-pointer block">
                    <p className="text-[9px] uppercase tracking-widest font-black text-oku-taupe/40 group-hover:text-oku-navy-light transition-colors mb-1.5">{ans.assessment?.title}</p>
                    <p className="font-bold text-lg text-oku-dark group-hover:text-oku-navy transition-colors">{ans.result}</p>
                    <div className="flex items-center justify-between mt-2">
                       <p className="text-[10px] opacity-40 uppercase tracking-widest font-black">{new Date(ans.completedAt).toLocaleDateString()}</p>
                       <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-oku-ocean text-oku-navy-light rounded opacity-0 group-hover:opacity-100 transition-opacity">View Detail</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link href="/dashboard/client/clinical" className="mt-10 btn-sky w-full block text-center py-4">New Screening</Link>
          </section>

          <section className="card-glass p-10 bg-oku-sage/20 border-oku-sage-dark/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-oku-dark">Aligned Care</h2>
              <Heart size={20} className="text-oku-pink-dark" />
            </div>
            <div className="space-y-6">
              {practitioners.map(p => (
                <Link key={p.id} href={`/dashboard/client/book/new/${p.id}/trial`} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {p.user?.avatar ? <img src={p.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl text-oku-purple bg-oku-purple/10">🧘</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-oku-dark group-hover:text-oku-navy transition-colors truncate">{p.user?.name || 'Specialist'}</p>
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mt-1">Matched Specialization</p>
                  </div>
                  <ArrowUpRight size={18} className="text-oku-taupe opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
      
      {/* Footer Space AI */}
      <div className="mt-20">
         <AIAssistantWidget contextType="client_insight" title="Wellness Insights" />
      </div>
    </div>
  )
}
