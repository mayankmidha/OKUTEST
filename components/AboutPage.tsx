'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .oku-page-public {
          background: #F7F4EF;
          color: #2D2D2D;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .heading-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
      `}</style>

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-48 pb-32">
        <SectionReveal>
          <div className="max-w-4xl mb-32">
            <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
              Our Essence
            </span>
            <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
              The Heart <br />
              <span className="italic text-oku-taupe">of things.</span>
            </h1>
            <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed max-w-2xl border-l-2 border-oku-purple/20 pl-8">
              "Oku" is a concept of inner space. We created this collective to provide a sanctuary for that space to breathe, unfold, and heal.
            </p>
          </div>
        </SectionReveal>

        {/* Narrative Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
          <SectionReveal>
            <div className="aspect-[4/5] bg-oku-cream rounded-[4rem] overflow-hidden relative group shadow-sm border border-oku-taupe/10">
              <img 
                src="/uploads/2025/06/x31_.png" 
                alt="Oku Philosophy" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oku-navy/40 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                 <p className="text-white font-display italic text-3xl leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    "Healing is not a destination, but a returning."
                 </p>
              </div>
            </div>
          </SectionReveal>
          
          <SectionReveal>
            <div className="space-y-10">
                <h2 className="heading-display text-5xl md:text-6xl text-oku-dark leading-tight tracking-tighter">Beyond the <br /><strong>clinical</strong> surface.</h2>
                <div className="space-y-8 text-oku-taupe text-lg leading-relaxed font-display italic">
                    <p>
                        In a world that demands performance, Oku offers a space for the opposite. We move at the pace your story asks for—never rushed, never prescribed.
                    </p>
                    <p>
                        Our collective was born from a need for therapy that actually sees you. Not just your symptoms, but your culture, your identity, your history, and your body.
                    </p>
                </div>
                
                <div className="pt-10 grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-oku-purple/20 flex items-center justify-center text-oku-purple-dark shadow-inner">
                            <Heart size={20} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-dark">Radical Empathy</h4>
                        <p className="text-xs text-oku-taupe leading-relaxed">Sitting beside your story with deep, non-judgmental presence.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-oku-ocean flex items-center justify-center text-oku-navy shadow-inner">
                            <Wind size={20} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-dark">Somatic Depth</h4>
                        <p className="text-xs text-oku-taupe leading-relaxed">Acknowledging the wisdom of the body in the healing process.</p>
                    </div>
                </div>
            </div>
          </SectionReveal>
        </div>

        {/* Commitment Banner */}
        <SectionReveal>
            <div className="bg-oku-navy rounded-[4rem] p-16 md:p-24 lg:p-32 text-white relative overflow-hidden group">
                <div className="relative z-10 max-w-4xl">
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck size={20} className="text-oku-purple animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Our Professional Oath</span>
                    </div>
                    <h2 className="heading-display text-5xl md:text-7xl mb-12 tracking-tight">Qualified, Ethical, and <br /><span className="italic text-oku-purple">Deeply Human.</span></h2>
                    <p className="text-xl text-white/60 font-display italic leading-relaxed mb-16 max-w-2xl">
                        Every practitioner in our collective is fully licensed and professionally vetted. We combine clinical precision with cultural humility to ensure you are in grounded hands.
                    </p>
                    <Link 
                        href="/people" 
                        className="inline-flex items-center gap-4 bg-white text-oku-navy py-6 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-purple transition-all shadow-2xl active:scale-95"
                    >
                        Meet the Collective <ArrowRight size={16} />
                    </Link>
                </div>
                
                <Zap size={300} className="absolute right-[-50px] bottom-[-50px] text-white opacity-5 group-hover:rotate-12 transition-transform duration-[3s]" />
            </div>
        </SectionReveal>

        {/* CTA Section */}
        <SectionReveal>
          <div className="text-center py-32 mt-24">
            <h2 className="heading-display text-5xl md:text-7xl text-oku-dark mb-12 leading-tight">Ready to begin?</h2>
            <Link href="/auth/signup" className="inline-flex items-center gap-4 bg-oku-dark text-white py-6 px-16 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-navy transition-all shadow-2xl active:scale-95">
              Start Your Journey <ArrowRight size={16} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
