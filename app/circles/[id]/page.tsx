'use client'

import { motion } from 'framer-motion'
import { 
  Users, Calendar, Clock, ArrowRight, ShieldCheck, Heart, 
  Sparkles, Wind, ChevronLeft, Lock, Info, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const circleData: Record<string, any> = {
  'grief-circle': {
    title: 'Grief & Transition',
    facilitator: 'Tanisha Singh',
    description: 'A dedicated space for those navigating loss, moving slowly through the architecture of memory and longing. This circle focuses on relational processing—understanding that while grief is personal, healing happens in connection.',
    details: [
      "Weekly 90-minute sessions",
      "Maximum 10 participants for intimacy",
      "Safe, trauma-informed moderation",
      "Anonymous participation optional"
    ],
    color: 'bg-oku-lavender/60',
    accent: 'text-oku-purple-dark'
  },
  'adhd-focus': {
    title: 'ADHD Collective',
    facilitator: 'Dr. Suraj Singh',
    description: 'Managing the "too-muchness." A collaborative circle for understanding neurodivergent patterns without the shame. We share tools, systems, and stories of navigating a world not built for our brains.',
    details: [
      "Bi-weekly focused workshops",
      "Clinical psychiatrist supervision",
      "Actionable executive function tools",
      "Supportive peer environment"
    ],
    color: 'bg-oku-mint/60',
    accent: 'text-emerald-600'
  },
  'queer-identity': {
    title: 'Queer Unfolding',
    facilitator: 'Rananjay Singh',
    description: 'Affirming care for the LGBTQIA+ community. Explore identity, relationships, and self-presence in a safe sanctuary. This space is strictly affirmative and centered on the lived experiences of queer folk.',
    details: [
      "Weekly community sessions",
      "Identity-affirming framework",
      "Intersectionality-focused dialogue",
      "Safe digital sanctuary"
    ],
    color: 'bg-oku-blush/60',
    accent: 'text-rose-500'
  }
}

export default function CircleDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const circle = circleData[id]

  if (!circle) return (
    <div className="min-h-screen flex items-center justify-center bg-oku-lavender/10">
      <div className="text-center p-12 card-glass-3d !bg-white/60">
        <Wind className="mx-auto animate-float-3d mb-6 text-oku-purple-dark/20" size={48} />
        <h1 className="heading-display text-3xl text-oku-darkgrey">Circle not found.</h1>
        <p className="text-sm text-oku-darkgrey/40 mt-2 mb-8 italic">The sanctuary you seek is currently quiet.</p>
        <Link href="/circles" className="btn-pill-3d bg-oku-darkgrey text-white !py-4 !px-10">Return to Hub</Link>
      </div>
    </div>
  )

  return (
    <div className="oku-page-public min-h-screen bg-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className={`absolute top-0 right-0 w-[60%] h-[60%] ${circle.color} rounded-full blur-[140px] opacity-30 animate-pulse`} />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-lavender/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-32 relative z-10">
        <Link 
          href="/circles" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors mb-16 bg-white/40 px-6 py-3 rounded-full border border-white/60 shadow-sm"
        >
          <ChevronLeft size={14} /> Back to Hub
        </Link>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <span className={`chip bg-white/60 border-white/80 ${circle.accent}`} style={{ marginBottom: 28, display: "inline-block" }}>Verified Circle</span>
                <h1 className="heading-display text-7xl md:text-8xl text-oku-darkgrey tracking-tighter leading-[0.85] mb-8">
                  {circle.title.split(' ')[0]} <br />
                  <span className={`${circle.accent} italic`}>{circle.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed border-l-4 border-oku-purple-dark/10 pl-10 max-w-2xl">
                  {circle.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                 <div className="card-glass-3d !p-10 !bg-oku-lavender/20 flex flex-col justify-between group">
                    <Users size={32} className={`${circle.accent} mb-8 group-hover:scale-110 transition-transform`} />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Facilitated by</p>
                       <p className="text-2xl font-bold text-oku-darkgrey">{circle.facilitator}</p>
                    </div>
                 </div>
                 <div className="card-glass-3d !p-10 !bg-oku-mint/20 flex flex-col justify-between group">
                    <ShieldCheck size={32} className={`${circle.accent} mb-8 group-hover:scale-110 transition-transform`} />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Privacy Tier</p>
                       <p className="text-2xl font-bold text-oku-darkgrey">High-Safety</p>
                    </div>
                 </div>
              </div>

              <section className="card-glass-3d !p-12 !bg-white/40">
                 <h3 className="heading-display text-3xl text-oku-darkgrey mb-10">Sanctuary <span className="italic opacity-40">Protocol</span></h3>
                 <div className="space-y-6">
                    {circle.details.map((detail: string, i: number) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:translate-x-2 transition-transform">
                         <div className={`w-8 h-8 rounded-xl ${circle.color} flex items-center justify-center ${circle.accent}`}>
                            <CheckCircle2 size={16} />
                         </div>
                         <p className="text-sm font-bold text-oku-darkgrey/70 italic">{detail}</p>
                      </div>
                    ))}
                 </div>
              </section>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-32 card-glass-3d !p-12 !bg-white shadow-2xl !rounded-[4rem] border-2 border-white"
            >
               <div className="text-center mb-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Immediate Access</span>
                  <div className="flex items-center justify-center gap-4 mt-4">
                     <p className="heading-display text-6xl text-oku-darkgrey">₹500</p>
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">Introductory Rate</p>
                        <p className="text-[9px] font-bold text-oku-darkgrey/40 italic">per 90-min session</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6 mb-12">
                  <div className="p-6 bg-oku-lavender/20 rounded-3xl border border-oku-lavender/40 flex justify-between items-center group cursor-pointer hover:bg-oku-lavender/30 transition-all">
                     <div className="flex items-center gap-4">
                        <Calendar size={20} className="text-oku-purple-dark" />
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Upcoming Session</p>
                           <p className="text-xs font-bold text-oku-darkgrey">Next Tuesday, Mar 31</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="opacity-20 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-6 bg-oku-mint/20 rounded-3xl border border-oku-mint/40 flex justify-between items-center group cursor-pointer hover:bg-oku-mint/30 transition-all">
                     <div className="flex items-center gap-4">
                        <Clock size={20} className="text-oku-purple-dark" />
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Time Window</p>
                           <p className="text-xs font-bold text-oku-darkgrey">7:00 PM — 8:30 PM (IST)</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="opacity-20 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>

               <Link 
                 href={`/checkout/circle-${id}?amount=500`}
                 className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 pulse-cta flex items-center justify-center gap-4 text-xs"
               >
                 Confirm Seat in Circle <Lock size={16} />
               </Link>

               <div className="mt-8 flex justify-center items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <ShieldCheck size={14} className="text-oku-purple-dark" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">Verified Clinical Engine</span>
               </div>

               <div className="mt-10 p-6 bg-oku-babyblue/20 rounded-3xl border border-dashed border-oku-babyblue/60">
                  <p className="text-[10px] text-oku-darkgrey/60 italic font-display leading-relaxed text-center">
                    "A circle is a place where we meet eye to eye, heart to heart—sharing the burden of being human."
                  </p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
