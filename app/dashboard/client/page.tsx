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

export const dynamic = 'force-dynamic'

export default async function ClientDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      clientProfile: true,
      clientAppointments: {
        include: { practitioner: true, service: true },
        where: { startTime: { gte: new Date() }, status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } },
        orderBy: { startTime: 'asc' },
        take: 1
      },
      assessmentAnswers: {
        orderBy: { completedAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) redirect('/auth/login')

  const nextSession = user.clientAppointments[0]
  const referralCredit = user.clientProfile?.referralCreditBalance || 0

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      
      {/* ── HEADER: SANCTUARY PULSE ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Sanctuary Hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Client Dashboard</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Peace, <span className="text-oku-purple-dark italic">{user.name?.split(' ')[0] || 'Seeker'}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Your space for healing, focus, and quiet growth.
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

      {/* ── 1. MISSION CRITICALS (STATS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Zap size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/40" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{user.assessmentAnswers.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Growth Milestones</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Wellness</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">Active</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Care Journey</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-babyblue/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Gift size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Referrals</span>
          </div>
          <div>
            <p className="text-4xl heading-display text-oku-darkgrey mb-2">{formatCurrency(referralCredit, 'INR')}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Available Credits</p>
          </div>
        </div>
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
          
          {/* WELLNESS TRACKING */}
          <section className="card-glass-3d !bg-oku-butter !p-10 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Smile className="text-oku-purple-dark/60 animate-float-3d" size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Daily Check-in</span>
              </div>
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-6">How is your <span className="italic text-oku-purple-dark">rhythm?</span></h3>
              <div className="flex justify-between mb-8">
                {['😔', '😐', '🙂', '✨'].map((emoji, i) => (
                    <button key={i} className="w-14 h-14 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-2xl hover:bg-white hover:scale-110 transition-all shadow-sm">
                        {emoji}
                    </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/client/mood" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 text-center">
                    Log Wellness Data
                </Link>
                <Link href="/dashboard/client/mood/history" className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 text-center hover:text-oku-purple-dark transition-colors">
                    View Vitality Ledger →
                </Link>
              </div>
            </div>
          </section>

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
