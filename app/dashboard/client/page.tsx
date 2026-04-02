import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Calendar, Clock, Users, FileText, Heart,
  Video, Search, Sparkles, ClipboardCheck, BookOpen,
  ArrowUpRight, Wind, ShieldCheck, AlertCircle, Shield, Gift, MessageSquare, Plus, Save, Moon,
  Brain, HelpCircle, Smile, ChevronRight, TrendingUp, Zap, CreditCard
} from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'
import { formatCurrency } from '@/lib/currency'
import { AnimatedDashboardStats } from '@/components/AnimatedDashboardStats'
import { LottieWellness } from '@/components/LottieWellness'

export const dynamic = 'force-dynamic'

export default async function ClientDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const [user, intakeForm, totalSessions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        clientAppointments: {
          include: { practitioner: true, service: true },
          where: { startTime: { gte: new Date() }, status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } },
          orderBy: { startTime: 'asc' },
          take: 1,
        },
        assessmentAnswers: {
          orderBy: { completedAt: 'desc' },
          take: 5,
        },
      },
    }),
    prisma.intakeForm.findUnique({ where: { userId: session.user.id }, select: { id: true } }),
    prisma.appointment.count({ where: { clientId: session.user.id, status: 'COMPLETED' } }),
  ])

  if (!user) redirect('/auth/login')

  const nextSession = user.clientAppointments[0]
  const referralCredit = user.clientProfile?.referralCreditBalance || 0
  const hasIntake = !!intakeForm
  const isNewUser = totalSessions === 0 && !nextSession

  // Getting started steps
  const gettingStarted = [
    { done: hasIntake, label: 'Complete intake form', href: '/dashboard/client/intake', desc: 'Takes 3 minutes — required before your first session' },
    { done: user.assessmentAnswers.length > 0, label: 'Take a self-assessment', href: '/dashboard/client/clinical', desc: 'Understand where you are and share it with your therapist' },
    { done: totalSessions > 0 || !!nextSession, label: 'Book your first session', href: '/dashboard/client/therapists', desc: 'First consultation is free — no commitment needed' },
  ]
  const completedSteps = gettingStarted.filter((s) => s.done).length

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      
      {/* ── HEADER: SANCTUARY PULSE ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Sanctuary Hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">
                {nextSession ? "Active Care Mode" : isNewUser ? "Welcome Home" : "Quiet Growth"}
             </span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Peace, <span className="text-oku-purple-dark italic">{user.name?.split(' ')[0] || 'Seeker'}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            {nextSession 
              ? `Your next session is on ${new Date(nextSession.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`
              : "Your secure space for healing and quiet growth."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/client/therapists" className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10">
             <Search size={18} className="mr-3 text-oku-purple-dark" /> Discover Therapists
          </Link>
          <Link href="/dashboard/client/book" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 pulse-cta">
             <Plus size={18} className="mr-3" /> Book Session
          </Link>
        </div>
      </div>

      {/* ── ONBOARDING BANNER (only for truly incomplete new users) ── */}
      {isNewUser && completedSteps < 2 && (
        <div className="mb-12 relative z-10">
          {/* Intake warning */}
          {!hasIntake && (
            <Link href="/dashboard/client/intake" className="flex items-center justify-between p-5 mb-4 bg-oku-peach/40 border border-oku-peach rounded-2xl hover:bg-oku-peach/60 transition-all group">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-black text-oku-darkgrey">Complete your intake form</p>
                  <p className="text-xs text-oku-darkgrey/60">Required before your first session — takes 3 min</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-oku-darkgrey/30 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Getting started card */}
          <div className="card-glass-3d !bg-white/60 !p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-1">Your Journey</p>
                <h3 className="text-xl font-black text-oku-darkgrey">Getting Started</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {gettingStarted.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i < completedSteps ? 'bg-oku-purple-dark w-6' : 'bg-oku-darkgrey/10 w-2'}`} />
                  ))}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">{completedSteps}/{gettingStarted.length}</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {gettingStarted.map((step, i) => (
                <Link
                  key={i}
                  href={step.done ? '#' : step.href}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                    step.done
                      ? 'bg-oku-mint/30 border-oku-mint/50 cursor-default'
                      : 'bg-white/50 border-white/80 hover:border-oku-lavender hover:bg-oku-lavender/10'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5 ${
                    step.done ? 'bg-oku-purple-dark text-white' : 'bg-oku-darkgrey/10 text-oku-darkgrey/40'
                  }`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${step.done ? 'text-oku-darkgrey/50 line-through' : 'text-oku-darkgrey'}`}>{step.label}</p>
                    {!step.done && <p className="text-xs text-oku-darkgrey/40 mt-0.5 leading-snug">{step.desc}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTAKE NUDGE (returning users without intake) ── */}
      {!isNewUser && !hasIntake && (
        <Link href="/dashboard/client/intake" className="flex items-center justify-between p-5 mb-8 bg-oku-peach/30 border border-oku-peach/50 rounded-2xl hover:bg-oku-peach/50 transition-all group relative z-10">
          <div className="flex items-center gap-3">
            <AlertCircle size={16} className="text-orange-500 shrink-0" />
            <div>
              <p className="text-sm font-black text-oku-darkgrey">Your intake form is incomplete</p>
              <p className="text-xs text-oku-darkgrey/60">Some therapists require this before your session</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">Complete Now →</span>
        </Link>
      )}

      {/* ── 1. MISSION CRITICALS (STATS) — animated spring counters ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
        <AnimatedDashboardStats
          assessmentCount={user.assessmentAnswers.length}
          sessionCount={totalSessions}
          referralCredit={referralCredit}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        
        {/* ── LEFT: CORE WORKFLOWS ── */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* NEXT SESSION QUICK-JOIN */}
          {nextSession && (
            <section className="card-glass-3d !p-12 !bg-oku-dark text-white relative overflow-hidden group shadow-2xl !rounded-[3rem]">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/20 shadow-xl">
                        <Video size={40} className="text-oku-lavender animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Next Session</p>
                        <h2 className="text-4xl font-display font-bold tracking-tight">With {nextSession.practitioner.name}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="flex items-center gap-2 text-sm text-white/60 font-display italic"><Calendar size={14} /> {new Date(nextSession.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                            <span className="flex items-center gap-2 text-sm text-white/60 font-display italic"><Clock size={14} /> {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                  </div>
                  <Link 
                    href={`/session/${nextSession.id}`}
                    className="btn-pill-3d bg-white text-oku-dark hover:bg-oku-lavender hover:scale-105 transition-all !py-5 !px-12 flex items-center gap-3"
                  >
                    Enter Care Room <ArrowRight size={18} />
                  </Link>
               </div>
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[100px]" />
            </section>
          )}

          {/* VISION MODULES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ADHD MANAGER */}
            <Link href="/dashboard/client/adhd" className="card-glass-3d !p-10 !bg-oku-peach/20 hover:shadow-2xl transition-all duration-500 group border-oku-peach/10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-oku-peach-dark shadow-sm">
                        <Brain size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">ADHD Manager</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Body doubling, focus tools, and dopamine menus.</p>
            </Link>

            {/* CIRCLES */}
            <Link href="/dashboard/client/circles" className="card-glass-3d !p-10 !bg-oku-mint/20 hover:shadow-2xl transition-all duration-500 group border-oku-mint/10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-oku-mint-dark shadow-sm">
                        <Users size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Support Circles</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Peer support and therapist-led group spaces.</p>
            </Link>

            {/* ASSESSMENTS */}
            <Link href="/dashboard/client/clinical" className="card-glass-3d !p-10 !bg-oku-lavender/20 hover:shadow-2xl transition-all duration-500 group border-oku-lavender/10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-oku-purple-dark shadow-sm">
                        <ClipboardCheck size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Assessment Hub</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Screenings, results, and downloadable clinical reports.</p>
            </Link>

            {/* MESSAGES */}
            <Link href="/dashboard/client/messages" className="card-glass-3d !p-10 !bg-oku-babyblue/20 hover:shadow-2xl transition-all duration-500 group border-oku-babyblue/10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-oku-babyblue-dark shadow-sm">
                        <MessageSquare size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Messages</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Secure, direct channel to your care provider.</p>
            </Link>

            {/* LIBRARY */}
            <Link href="/dashboard/client/resources" className="card-glass-3d !p-10 !bg-oku-cream/20 hover:shadow-2xl transition-all duration-500 group border-oku-cream/10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-oku-taupe shadow-sm">
                        <BookOpen size={28} />
                    </div>
                    <ChevronRight size={20} className="text-oku-darkgrey/20 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="heading-display text-3xl text-oku-darkgrey mb-3">Library</h3>
                <p className="text-sm text-oku-darkgrey/50 italic font-display">Therapeutic exercises and clinical resources.</p>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: PERSONAL UTILITIES ── */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* WELLNESS TRACKING — Lottie + React Spring */}
          <LottieWellness />

          {/* THE VAULT SUMMARY */}
          <section className="card-glass-3d !p-10 !bg-white/40">
            <div className="flex items-center justify-between mb-8">
                <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">The <span className="italic text-oku-purple-dark">Vault</span></h3>
                <ShieldCheck size={20} className="text-oku-darkgrey/20" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Invoices & Payments', href: '/dashboard/client/vault', icon: <CreditCard size={14} /> },
                { label: 'Clinical Records', href: '/dashboard/client/vault?tab=clinical', icon: <FileText size={14} /> },
                { label: 'Safety Plan', href: '/dashboard/client/profile', icon: <Shield size={14} /> },
                { label: 'Emergency Contacts', href: '/dashboard/client/profile', icon: <AlertCircle size={14} /> },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-oku-purple-dark/60">{link.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey">{link.label}</span>
                  </div>
                  <ChevronRight size={12} className="text-oku-darkgrey/20 group-hover:text-oku-purple-dark" />
                </Link>
              ))}
            </div>
          </section>

          {/* AI INSIGHT */}
          <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-dashed border-2">
             <Wind size={24} className="text-oku-purple-dark/40 mb-6 animate-float-3d" />
             <p className="text-sm font-bold text-oku-darkgrey/60 italic leading-relaxed">
               &ldquo;Your nervous system is allowed to rest today. You don't have to earn your place in the world.&rdquo;
             </p>
          </div>

        </div>
      </div>

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}

function ArrowRight({ size }: { size: number }) {
    return <ChevronRight size={size} />
}
