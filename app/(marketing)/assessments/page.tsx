'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ASSESSMENTS } from '@/lib/assessments';
import { 
  ArrowRight, Search, Sparkles, Brain, 
  Wind, Activity, Heart, Shield, Clock,
  ChevronRight, Filter, Info, Lock, ShieldCheck
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'ADHD': Brain,
  'Anxiety & Depression': Heart,
  'Trauma': Shield,
  'Executive Function': Activity,
  'General': Wind,
};

const categories = ['All', 'ADHD', 'Anxiety & Depression', 'Trauma', 'Executive Function', 'General'];

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

export default function PublicAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAssessments = ASSESSMENTS.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="oku-page-public min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        .oku-page-public {
          background: #F7F4EF;
          color: #2D2D2D;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        .heading-display {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-48 pb-32">
        <SectionReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
            <div className="max-w-3xl">
              <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
                Clinical Intelligence
              </span>
              <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
                Diagnostic <br />
                <span className="italic text-oku-taupe">discovery.</span>
              </h1>
              <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed border-l-2 border-oku-purple/20 pl-8">
                "Self-awareness is the architect of change. Use these validated clinical screenings to map your landscape and begin your journey."
              </p>
            </div>
            
            <div className="relative group w-full lg:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-oku-taupe/40 group-focus-within:text-oku-navy transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search clinical tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-oku-taupe/10 rounded-[2rem] py-6 pl-16 pr-8 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-sm placeholder:text-oku-taupe/30"
              />
            </div>
          </div>
        </SectionReveal>

        {/* Category Filters */}
        <SectionReveal>
          <div className="flex gap-3 overflow-x-auto pb-12 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                  ? 'bg-oku-navy text-white shadow-2xl scale-105 border-oku-navy' 
                  : 'bg-white border-oku-taupe/10 text-oku-taupe hover:border-oku-navy hover:text-oku-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredAssessments.map((a, index) => {
              const Icon = categoryIcons[a.category] || Wind;
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Link href={`/auth/signup?callbackUrl=/assessments/${a.slug}`}>
                    <div className="group bg-white rounded-[3.5rem] p-12 border border-oku-taupe/10 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                      {/* Background Accent */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 group-hover:bg-oku-purple/10 transition-colors" />
                      
                      <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-oku-cream text-oku-navy flex items-center justify-center transition-all duration-700 group-hover:bg-oku-navy group-hover:text-white shadow-inner">
                          <Icon size={32} strokeWidth={1.5} />
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe/60 bg-oku-cream-warm/30 px-4 py-1.5 rounded-full">
                             {a.category}
                           </span>
                           <div className="flex items-center gap-1.5 mt-3 justify-end text-[10px] text-oku-taupe opacity-40 font-black uppercase tracking-widest">
                              <Clock size={12} />
                              {a.timeEstimate}
                           </div>
                        </div>
                      </div>

                      <h3 className="text-3xl font-display font-bold text-oku-dark mb-6 leading-tight group-hover:text-oku-navy transition-colors relative z-10 tracking-tight">
                        {a.title}
                      </h3>
                      
                      <p className="text-base text-oku-taupe leading-relaxed mb-12 flex-grow relative z-10 italic font-display opacity-80">
                        "{a.description}"
                      </p>

                      <div className="mt-auto pt-10 border-t border-oku-taupe/5 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple text-[10px] font-black">
                               <ShieldCheck size={14} />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">{a.questionCount} Clinical Items</span>
                         </div>
                         <div className="flex items-center gap-3 text-oku-navy font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-700">
                           Begin <ArrowRight size={16} className="text-oku-purple" />
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAssessments.length === 0 && (
          <SectionReveal>
            <div className="py-40 text-center bg-white/40 rounded-[4rem] border-2 border-dashed border-oku-taupe/10">
               <Info className="mx-auto text-oku-taupe/20 mb-6" size={64} strokeWidth={1} />
               <p className="text-3xl font-display font-bold text-oku-taupe/60">No screenings match "{searchTerm}"</p>
               <button 
                 onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                 className="mt-8 text-oku-navy font-black uppercase tracking-[0.3em] text-[11px] hover:underline bg-white px-10 py-4 rounded-full shadow-sm"
               >
                 Clear all filters
               </button>
            </div>
          </SectionReveal>
        )}

        {/* Commitment Banner */}
        <SectionReveal className="mt-48">
            <div className="bg-oku-dark rounded-[4rem] p-16 md:p-24 lg:p-32 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 max-w-4xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Lock size={20} className="text-oku-purple animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Secure & Confidential</span>
                    </div>
                    <h2 className="heading-display text-5xl md:text-7xl mb-12 tracking-tight">Validated tools for <br /><span className="italic text-oku-purple">inner mapping.</span></h2>
                    <p className="text-xl text-white/60 font-display italic leading-relaxed mb-16 max-w-2xl">
                        Our assessments use clinically validated scales (PHQ-9, GAD-7, etc.) to help you and your future therapist understand your clinical profile before you even meet. 
                    </p>
                    <Link 
                        href="/auth/signup" 
                        className="inline-flex items-center gap-4 bg-white text-oku-navy py-6 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-purple transition-all shadow-2xl active:scale-95"
                    >
                        Create Secure Record <ArrowRight size={16} />
                    </Link>
                </div>
                <Brain size={400} className="absolute right-[-100px] bottom-[-100px] text-white opacity-5 group-hover:scale-110 transition-transform duration-[5s]" />
            </div>
        </SectionReveal>
      </div>
    </div>
  );
}
