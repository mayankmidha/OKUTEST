'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Clock, ArrowRight, ShieldCheck, Heart, Sparkles, Wind, Info } from 'lucide-react'
import Link from 'next/link'

const circles = [
  {
    id: 'grief-circle',
    title: 'Grief & Transition',
    facilitator: 'Tanisha Singh',
    facilitatorRole: 'Clinical Psychologist',
    description: 'A dedicated space for those navigating loss, moving slowly through the architecture of memory and longing.',
    startTime: 'Every Tuesday, 7:00 PM',
    capacity: 10,
    spotsLeft: 3,
    price: 500,
    color: 'bg-oku-lavender/60'
  },
  {
    id: 'adhd-focus',
    title: 'ADHD Collective',
    facilitator: 'Dr. Suraj Singh',
    facilitatorRole: 'Psychiatrist',
    description: 'Managing the "too-muchness." A collaborative circle for understanding neurodivergent patterns without the shame.',
    startTime: 'Every Thursday, 6:00 PM',
    capacity: 12,
    spotsLeft: 5,
    price: 500,
    color: 'bg-oku-mint/60'
  },
  {
    id: 'queer-identity',
    title: 'Queer Unfolding',
    facilitator: 'Rananjay Singh',
    facilitatorRole: 'Family Therapist',
    description: 'Affirming care for the LGBTQIA+ community. Explore identity, relationships, and self-presence in a safe sanctuary.',
    startTime: 'Saturdays, 11:00 AM',
    capacity: 8,
    spotsLeft: 2,
    price: 500,
    color: 'bg-oku-blush/60'
  }
]

export default function CirclesPage() {
  return (
    <div className="oku-page-public min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-blush/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-4 mb-8">
             <span className="chip bg-white/60 border-white/80">Support Circles</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Group Healing</span>
          </div>
          <h1 className="heading-display text-7xl md:text-9xl text-oku-darkgrey tracking-tighter leading-[0.85] mb-12">
            Heal in <br />
            <span className="text-oku-purple-dark italic">community.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 leading-relaxed max-w-2xl">
            You don't have to carry it alone. Join a circle of people walking similar paths—facilitated by our expert clinical team in a secure, digital sanctuary.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-24">
          {circles.map((circle, idx) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card-glass-3d !p-10 ${circle.color} flex flex-col group hover:shadow-2xl transition-all duration-700 tilt-card`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm group-hover:rotate-12 transition-transform">
                  <Users size={28} strokeWidth={1.5} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Sanctuary Spots</p>
                   <p className="text-sm font-bold text-oku-darkgrey">{circle.spotsLeft} / {circle.capacity} left</p>
                </div>
              </div>

              <h3 className="heading-display text-4xl text-oku-darkgrey mb-4">{circle.title}</h3>
              <p className="text-lg text-oku-darkgrey/60 italic font-display mb-8 leading-relaxed">"{circle.description}"</p>
              
              <div className="mt-auto space-y-6">
                 <div className="p-6 bg-white/40 rounded-[2rem] border border-white/60 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-oku-darkgrey">
                       <Calendar size={16} className="text-oku-purple-dark" />
                       {circle.startTime}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-oku-darkgrey">
                       <Heart size={16} className="text-oku-purple-dark" />
                       Led by {circle.facilitator}
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-2">
                    <span className="text-2xl font-bold text-oku-darkgrey">₹{circle.price}<span className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">/ Session</span></span>
                    <Link href={`/circles/${circle.id}`} className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-4 !px-8 text-[10px] pulse-cta">
                       Join Circle <ArrowRight size={14} className="ml-2" />
                    </Link>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card-glass-3d !p-16 md:!p-24 !bg-oku-darkgrey text-white relative overflow-hidden !rounded-[4rem]">
           <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="heading-display text-5xl md:text-7xl tracking-tight mb-8 leading-[0.9]">Why Circles <br /><span className="text-oku-lavender italic">work.</span></h2>
                <p className="text-white/60 text-xl leading-relaxed italic font-display border-l-4 border-oku-lavender/20 pl-8">
                  Evidence shows that shared vulnerability in a safe, moderated space significantly reduces social isolation and accelerates the unfolding of personal healing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 animate-float-3d">
                    <ShieldCheck size={32} className="text-oku-lavender mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">100% Anonymous</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 animate-float-3d" style={{ animationDelay: '0.5s' }}>
                    <Sparkles size={32} className="text-oku-lavender mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Moderated Space</p>
                 </div>
              </div>
           </div>
           <Wind size={300} strokeWidth={0.5} className="absolute -top-20 -right-20 text-oku-lavender/5" />
        </div>
      </div>
    </div>
  )
}
