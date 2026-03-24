'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Briefcase, Award, BookOpen, ArrowRight, Zap, Linkedin, Globe } from 'lucide-react';
import { formatCurrency, autoConvert } from '@/lib/currency';

const TEAM = [
  {
    name: 'Dr. Suraj Singh',
    role: 'Consultant Psychiatrist',
    specialization: 'Psychiatry & Medication Management',
    experience: '12+',
    education: 'MD Psychiatry',
    bio: 'Focuses on grounded, ethical psychiatric care and medication management with a trauma-informed lens.',
    avatar: '/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg',
    color: 'bg-oku-purple/20',
    rate: 200
  },
  {
    name: 'Tanisha Singh',
    role: 'Clinical Psychologist',
    specialization: 'Psychodynamic Psychotherapy & Trauma',
    experience: '8+',
    education: 'M.Phil Clinical Psychology',
    bio: 'Specializes in psychodynamic work, exploring depth and history to understand current patterns.',
    avatar: '/uploads/2025/07/Tanisha_-821x1024.jpg',
    color: 'bg-oku-blue/20',
    rate: 150
  },
  {
    name: 'Rananjay Singh',
    role: 'Family Therapist',
    specialization: 'Queer Affirmative & Family Therapy',
    experience: '6+',
    education: 'MA Counseling Psychology',
    bio: 'Dedicated to queer-affirmative spaces and systemic family healing.',
    avatar: '/uploads/2025/07/Rananjay--579x1024.jpg',
    color: 'bg-oku-green/20',
    rate: 120
  },
  {
    name: 'Amna Ansari',
    role: 'Clinical Psychologist',
    specialization: 'Anxiety, OCD & Clinical Psychology',
    experience: '5+',
    education: 'M.Phil Clinical Psychology',
    bio: 'Evidence-based care for anxiety and OCD with a compassionate, slow approach.',
    avatar: '/uploads/2025/07/Amna-670x1024.jpg',
    color: 'bg-oku-pink/20',
    rate: 150
  },
  {
    name: 'Mohit Dudeja',
    role: 'Queer Affirmative Therapist',
    specialization: 'Grief & Individual Therapy',
    experience: '7+',
    education: 'MA Psychology',
    bio: 'Holding space for grief and identity exploration.',
    avatar: '/uploads/2025/07/Mohit-911x1024.jpg',
    color: 'bg-oku-sage/20',
    rate: 100
  },
  {
    name: 'Gursheel Kaur',
    role: 'Psychodynamic Psychotherapist',
    specialization: 'Relational Therapy & Self-Esteem',
    experience: '6+',
    education: 'MA Clinical Psychology',
    bio: 'Focuses on relational patterns and the unfolding of self-esteem.',
    avatar: '/uploads/2025/07/gursheel_pfp-1024x980.jpg',
    color: 'bg-oku-peach/20',
    rate: 120
  }
];

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

export default function PeoplePage() {
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

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-48 pb-32">
        <SectionReveal>
          <div className="max-w-4xl mb-32">
            <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
              Our Collective
            </span>
            <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
              People <br />
              <span className="italic text-oku-taupe">first.</span>
            </h1>
            <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed max-w-2xl border-l-2 border-oku-purple/20 pl-8">
              Oku is a diverse group of clinicians, thinkers, and healers committed to your growth—holding space for all parts of who you are.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-24">
          {TEAM.map((member, i) => (
            <SectionReveal key={member.name}>
              <div className="group bg-white rounded-[4rem] overflow-hidden shadow-sm border border-oku-taupe/10 hover:shadow-2xl transition-all duration-1000 flex flex-col md:flex-row min-h-[500px]">
                {/* Visual Side */}
                <div className="md:w-2/5 relative overflow-hidden bg-oku-cream">
                  <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-oku-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="absolute top-8 left-8">
                     <div className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl border border-white w-fit">
                        <ShieldCheck size={14} className="text-oku-purple" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-dark">Verified Specialist</span>
                     </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex justify-between items-center">
                      <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                            <ShieldCheck size={18}/>
                         </div>
                      </div>
                      <span className="bg-white text-oku-dark px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                          {(() => {
                              const conv = autoConvert(member.rate);
                              return formatCurrency(conv.amount, conv.currency);
                          })()} / HR
                      </span>
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="flex-1 p-12 md:p-16 lg:p-20 flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="heading-display text-5xl md:text-6xl text-oku-dark tracking-tighter group-hover:text-oku-navy transition-colors">{member.name}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <p className="text-oku-purple font-script text-2xl italic opacity-80">{member.role}</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-oku-taupe/20" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-oku-taupe opacity-60 flex items-center gap-2">
                                <Briefcase size={12} /> {member.experience} Experience
                            </p>
                        </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-oku-taupe mb-12 line-clamp-4 leading-relaxed font-display italic opacity-80">
                    "{member.bio}"
                  </p>

                  <div className="grid grid-cols-2 gap-12 mb-12">
                      <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-navy/40 mb-4 flex items-center gap-2"><Award size={14}/> Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.specialization.split('&').map((spec, idx) => (
                                <span key={idx} className="text-[9px] uppercase tracking-widest font-black bg-oku-ocean text-oku-navy-light px-4 py-2 rounded-xl border border-oku-blue-mid/10">
                                    {spec.trim()}
                                </span>
                            ))}
                          </div>
                      </div>
                      <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-navy/40 mb-4 flex items-center gap-2"><BookOpen size={14}/> Background</h4>
                          <p className="text-xs font-bold text-oku-dark leading-relaxed">
                              {member.education}
                          </p>
                      </div>
                  </div>

                  <div className="mt-auto pt-10 border-t border-oku-taupe/5">
                    <Link 
                        href="/auth/signup" 
                        className="inline-flex items-center gap-4 bg-oku-dark text-white py-6 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-navy transition-all shadow-2xl active:scale-95"
                    >
                      Establish Care with {member.name.split(' ')[0]} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <div className="text-center py-32 mt-24 border-t border-oku-taupe/10">
            <h2 className="heading-display text-5xl md:text-7xl text-oku-dark mb-12 leading-tight">Want to join our collective?</h2>
            <Link href="/auth/practitioner-signup" className="inline-flex px-16 py-8 border border-oku-taupe/20 text-oku-dark rounded-full text-xs font-black tracking-[0.3em] uppercase hover:bg-white transition-all duration-700 hover:border-oku-dark shadow-sm hover:shadow-2xl">
              Professional Inquiries
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
