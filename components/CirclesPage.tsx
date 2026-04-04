'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Heart, Sparkles, Wind, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
    >
      {children}
    </div>
  );
}

const CIRCLES = [
  {
    title: "Trauma Survivors",
    desc: "A safe space to process shared history and find collective resonance.",
    icon: <Heart size={24} />,
    image: "/wp-content/uploads/2025/06/ChatGPT-Image-May-25-2025-02_30_11-PM-1.png"
  },
  {
    title: "Queer & Neurodivergent",
    desc: "Affirming spaces where your identity is celebrated, not explained.",
    icon: <Sparkles size={24} />,
    image: "/wp-content/uploads/2025/06/Frame-108.png"
  },
  {
    title: "Grief & Loss",
    desc: "Holding the weight of what's gone, together, in the quiet.",
    icon: <Wind size={24} />,
    image: "/wp-content/uploads/2025/06/Group.png"
  }
];

export default function CirclesPage() {
  return (
    <div className="oku-page-public">
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-48 pb-32">
        <SectionReveal>
          <div className="max-w-4xl mb-32">
            <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter mb-4">
              <b>You’re not</b> alone.
            </h2>
            <div className="flex flex-wrap items-center gap-4">
               <h3 className="heading-display text-6xl md:text-8xl text-oku-darkgrey tracking-tight">
                 We hold space for
               </h3>
               <span className="heading-display text-6xl md:text-8xl text-oku-purple-dark italic tracking-tight underline decoration-zigzag">
                 belonging
               </span>
            </div>
            <p className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic mt-12 max-w-2xl border-l-4 border-oku-purple-dark/20 pl-8">
               Oku | People is a collective space for those who ache for connection. A space to share the weight, find community, and gently begin again.
            </p>
          </div>
        </SectionReveal>

        {/* Support Groups Grid */}
        <div className="mb-48">
           <SectionReveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                 <div className="max-w-2xl">
                    <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey tracking-tighter">
                       <b>Support</b> Groups
                    </h2>
                    <p className="text-lg text-oku-darkgrey/50 font-display italic mt-4">
                       For trauma survivors, queer individuals, chronically ill folks, and those navigating loss, loneliness, change, or addictions.
                    </p>
                 </div>
                 <Link href="/book" className="btn-pill-3d bg-oku-darkgrey text-white !px-12 !py-6 text-[11px] tracking-[0.3em]">
                    Request a Circle
                 </Link>
              </div>
           </SectionReveal>

           <div className="grid md:grid-cols-3 gap-8">
              {CIRCLES.map((circle, idx) => (
                <SectionReveal key={circle.title} className={`delay-${idx * 200}`}>
                   <div className="group clinic-surface h-full bg-white/60 hover:bg-white transition-all duration-700 hover:-translate-y-4">
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 relative">
                         <img src={circle.image} alt={circle.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                         <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-oku-purple-dark shadow-xl">
                            {circle.icon}
                         </div>
                      </div>
                      <h3 className="heading-display text-3xl text-oku-darkgrey mb-4">{circle.title}</h3>
                      <p className="text-oku-darkgrey/60 font-display italic leading-relaxed">{circle.desc}</p>
                      <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/60 opacity-0 group-hover:opacity-100 transition-opacity">
                         Join Waiting List <ArrowRight size={14} />
                      </div>
                   </div>
                </SectionReveal>
              ))}
           </div>
        </div>

        {/* Narrative Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
           <SectionReveal>
            <div className="space-y-10">
                <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey leading-tight tracking-tighter">
                   <b>This space</b> is <br />
                   <span className="italic text-oku-purple-dark underline decoration-zigzag">for you</span>
                </h2>
                
                <div className="space-y-8 text-oku-darkgrey/70 text-lg leading-relaxed font-display italic">
                    <p>
                        We’re not meant to heal in isolation. You’re not the only one carrying this. At Oku, we believe that witness is a form of medicine.
                    </p>
                    <p>
                        In our Circles, we don't fix. We listen. We echo. We hold. It is a slower, softer way of being together.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                       <span className="chip bg-oku-lavender/40 border-oku-purple/20">Peer Led</span>
                       <span className="chip bg-oku-mint/40 border-oku-darkgrey/10">Clinically Supervised</span>
                       <span className="chip bg-white/60 border-oku-darkgrey/10">Sliding Scale</span>
                    </div>
                </div>
            </div>
          </SectionReveal>

          <SectionReveal>
             <div className="relative aspect-square">
                <div className="absolute inset-0 bg-oku-lavender rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-12 bg-white/80 backdrop-blur-3xl rounded-full shadow-2xl flex items-center justify-center text-center p-12">
                   <div className="space-y-6">
                      <div className="w-16 h-16 rounded-3xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark mx-auto shadow-inner">
                         <MessageCircle size={32} />
                      </div>
                      <p className="heading-display text-2xl md:text-3xl text-oku-darkgrey italic leading-relaxed">
                         "The most radical thing we can do is stay in the room with each other."
                      </p>
                   </div>
                </div>
             </div>
          </SectionReveal>
        </div>

        {/* CTA */}
        <SectionReveal>
          <div className="bg-oku-darkgrey rounded-[4rem] p-12 md:p-24 lg:p-32 text-white text-center relative overflow-hidden group shadow-2xl">
             <div className="relative z-10">
                <h2 className="heading-display text-5xl md:text-7xl mb-8">Ready to find <b>your people?</b></h2>
                <p className="text-xl text-white/60 font-display italic mb-16 max-w-2xl mx-auto">
                   Our next cohort of Circles starts soon. Join the waiting list to get early access to registration.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                   <Link href="/auth/signup" className="btn-pill-3d bg-white text-oku-darkgrey !px-16 !py-6 text-[11px] tracking-[0.3em] hover:bg-oku-purple transition-all">
                      Join Waiting List
                   </Link>
                   <Link href="/contact" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]">
                      Ask a Question
                   </Link>
                </div>
             </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}