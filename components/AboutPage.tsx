'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Wind, ShieldCheck, Zap } from 'lucide-react';

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

export default function AboutPage() {
  return (
    <div className="oku-page-public">
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-48 pb-32">
        <SectionReveal>
          <div className="max-w-4xl mb-32">
            <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter mb-4">
              <b>The heart</b> behind
            </h2>
            <div className="flex items-center gap-4">
               <h3 className="heading-display text-7xl md:text-9xl text-oku-purple-dark italic leading-[0.85] tracking-tight">
                 oku therapy
               </h3>
            </div>
          </div>
        </SectionReveal>

        {/* Narrative Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-start mb-48">
          <SectionReveal>
            <div className="space-y-10 pr-12">
                <div className="flex items-center gap-3">
                   <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey leading-tight tracking-tighter">The <b>Oku</b></h2>
                </div>
                <h2 className="heading-display text-5xl md:text-6xl text-oku-purple-dark italic -mt-6">philosophy</h2>
                
                <div className="space-y-8 text-oku-darkgrey/70 text-lg leading-relaxed font-display italic">
                    <p>
                        At Oku, therapy isn’t about managing symptoms. It’s about listening to what those symptoms are trying to say.
                    </p>
                    <p>
                        We believe the patterns you repeat, the fears you carry, the ways you shut down — they’re not faults. They’re maps. Maps of what hasn’t yet been heard.
                    </p>
                    <p>
                        That’s why we don’t rush toward change. We begin with curiosity. With what it feels like to be you — in your body, in your relationships, in your history.
                    </p>
                    <p>
                        Rooted in depth-oriented psychotherapy, we hold space for what doesn’t yet have words, for the layers beneath survival.
                    </p>
                    <p className="text-xl text-oku-darkgrey font-bold not-italic">
                        Because healing doesn’t happen in performance. <br />
                        It happens in presence.
                    </p>
                </div>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="aspect-video bg-oku-cream rounded-[4rem] overflow-hidden relative group shadow-2xl border border-white/40">
              <video 
                src="/wp-content/uploads/2025/07/Calm.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oku-darkgrey/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                 <p className="heading-display text-3xl md:text-4xl text-white italic leading-tight">
                    "Healing is not a destination, but a returning."
                 </p>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* People Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
           <SectionReveal>
             <div className="relative">
                <img 
                  src="/wp-content/uploads/2025/07/Group-33.png" 
                  alt="People" 
                  className="w-full h-auto rounded-[3rem] shadow-xl"
                />
                <img 
                  src="/wp-content/uploads/2025/07/Frame-200.png" 
                  alt="Sticker" 
                  className="absolute -bottom-10 -right-10 w-64 h-auto drop-shadow-2xl animate-float"
                />
             </div>
           </SectionReveal>

           <SectionReveal>
            <div className="space-y-10">
                <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey leading-tight tracking-tighter">A little <br /><b>about us</b></h2>
                <h3 className="heading-display text-4xl text-oku-purple-dark italic -mt-6">as people first</h3>
                
                <div className="space-y-8 text-oku-darkgrey/70 text-lg leading-relaxed font-display italic">
                    <p>
                        We are a collective of clinical psychologists, psycho-dynamic psychotherapists, trauma-informed, queer affirmative practitioners, narrative practitioners, and more.
                    </p>
                    <p>
                        But more than that, we are people who have known ache—who bring our humanity into the room with you. Your therapist will not disappear behind jargon or expertise.
                    </p>
                    <p>
                        They will sit with you. They will care.
                    </p>
                    <p>
                        We are a collective because we believe in collaboration. We meet as a team, we offer case discussions, we stay supervised.
                    </p>
                </div>
            </div>
          </SectionReveal>
        </div>

        {/* Closing Section */}
        <SectionReveal>
            <div className="bg-oku-darkgrey rounded-[4rem] p-12 md:p-24 lg:p-32 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 max-w-4xl">
                    <h2 className="heading-display text-5xl md:text-8xl mb-12 tracking-tight leading-[0.9]">
                       <b>who stay</b> <br />
                       <span className="italic text-oku-purple">when it hurts</span>
                    </h2>
                    <p className="text-xl text-white/60 font-display italic leading-relaxed mb-16 max-w-2xl">
                        At OKU, we don’t assume who you are before you arrive. We wait with you — curiously, respectfully — until your story is ready to unfold.
                    </p>
                    <Link 
                        href="/therapists" 
                        className="inline-flex items-center gap-6 bg-white text-oku-darkgrey py-6 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-oku-lavender transition-all shadow-2xl active:scale-95 group"
                    >
                        Meet the Collective <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
                
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                   <img 
                     src="/wp-content/uploads/2025/06/Vector-1.png" 
                     className="w-full h-full object-contain scale-150 rotate-12"
                   />
                </div>
            </div>
        </SectionReveal>
      </div>
    </div>
  );
}
