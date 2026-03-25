'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
    Heart, Sparkles, Wind, ShieldCheck, 
    Zap, Brain, Users, Compass, 
    ArrowRight, ChevronRight, Flower
} from 'lucide-react';

const SERVICES = [
  {
    id: "individual",
    number: "01",
    title: "Individual Therapy",
    description: "One-on-one sessions held with compassion and curiosity. We explore the patterns of your inner world to help you reconnect with your authentic self.",
    longDesc: "Individual therapy at Oku is a relational journey. We move beyond surface symptoms to understand the root of your distress, whether it's anxiety, depression, or a feeling of being 'stuck'.",
    features: [
      { icon: <Brain size={18} />, label: "Depth-Oriented", desc: "Exploring the 'why' behind your thoughts." },
      { icon: <Wind size={18} />, label: "Trauma-Informed", desc: "Safe, paced processing of past experiences." },
      { icon: <Heart size={18} />, label: "Relational", desc: "The therapeutic bond is our primary tool." }
    ],
    color: "bg-oku-purple/10",
    accent: "text-oku-purple-dark"
  },
  {
    id: "trauma",
    number: "02",
    title: "Trauma & EMDR",
    description: "Specialized support for processing traumatic memories. We use evidence-based practices to help your nervous system find safety again.",
    longDesc: "Trauma lives in the body. Our EMDR-trained clinicians help you gently reprocess distressing life events so they no longer hold the same power over your present life.",
    features: [
      { icon: <ShieldCheck size={18} />, label: "EMDR", desc: "Eye Movement Desensitization and Reprocessing." },
      { icon: <Flower size={18} />, label: "Somatic-Aware", desc: "Listening to the body's physiological signals." },
      { icon: <Zap size={18} />, label: "Regulating", desc: "Tools to manage hyper-vigilance and numbing." }
    ],
    color: "bg-oku-blue/10",
    accent: "text-oku-navy-light"
  },
  {
    id: "movement",
    number: "03",
    title: "Movement Therapy",
    description: "When words feel out of reach, movement speaks. A somatic practice to gently release stored emotions through breath and flow.",
    longDesc: "This isn't about performance or exercise. It's about 'bottom-up' healing—allowing your body to express and release what the mind cannot yet name.",
    features: [
      { icon: <Wind size={18} />, label: "Breathwork", desc: "Using the breath to anchor the self." },
      { icon: <Sparkles size={18} />, label: "Expressive", desc: "Non-linear movement for emotional release." },
      { icon: <Compass size={18} />, label: "Grounded", desc: "Re-establishing your sense of physical safety." }
    ],
    color: "bg-oku-pink/10",
    accent: "text-oku-pink-dark"
  },
  {
    id: "queer",
    number: "04",
    title: "Queer-Affirmative Care",
    description: "Therapy that honors your identity without explanation. We provide a space where you are seen, affirmed, and celebrated.",
    longDesc: "You shouldn't have to educate your therapist. We understand the nuances of minority stress and gender-expansive journeys in a deeply personal way.",
    features: [
      { icon: <Heart size={18} />, label: "Affirming", desc: "Validating your identity as a default state." },
      { icon: <Users size={18} />, label: "Caste-Aware", desc: "Acknowledging intersecting systemic impacts." },
      { icon: <ShieldCheck size={18} />, label: "Safe Haven", desc: "Zero judgment, total lived understanding." }
    ],
    color: "bg-oku-sage/10",
    accent: "text-oku-sage-dark"
  },
  {
    id: "couples",
    number: "05",
    title: "Relational & Couples",
    description: "Healing the spaces between us. We facilitate dialogue to deepen intimacy, resolve conflict, and grow together.",
    longDesc: "Whether you're looking to repair a rift or deepen your connection, we offer a safe third space for couples and families to explore their dynamics.",
    features: [
      { icon: <Users size={18} />, label: "Systemic", desc: "Viewing the relationship as its own entity." },
      { icon: <ChevronRight size={18} />, label: "Facilitated", desc: "Mediating difficult conversations with care." },
      { icon: <Heart size={18} />, label: "Intimacy", desc: "Rebuilding trust and emotional closeness." }
    ],
    color: "bg-oku-peach/10",
    accent: "text-oku-peach-dark"
  },
  {
    id: "assessments",
    number: "06",
    title: "Psychometrics",
    description: "Gaining clarity through gentle, respectful assessment. Conducted by licensed psychologists to map your clinical profile.",
    longDesc: "We use standard clinical tools (ADHD, Anxiety, Depression) not to label you, but to provide a roadmap for your specialized care plan.",
    features: [
      { icon: <FileText size={18} />, label: "Evidence-Based", desc: "Validated clinical screening protocols." },
      { icon: <Brain size={18} />, label: "Insight-Led", desc: "Mapping patterns for better understanding." },
      { icon: <ShieldCheck size={18} />, label: "RCI Licensed", desc: "Conducted by certified clinical psychologists." }
    ],
    color: "bg-oku-ocean/10",
    accent: "text-oku-navy"
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

export default function ServicesPage() {
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

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-48 pb-32">
        <SectionReveal>
          <div className="max-w-4xl mb-32">
            <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
              Pathways to Care
            </span>
            <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
              Different ways <br />
              <span className="italic text-oku-taupe">to begin.</span>
            </h1>
            <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed max-w-2xl border-l-2 border-oku-purple/20 pl-8">
              Because healing is not one-size-fits-all. We offer a range of approaches designed to meet you exactly where your story asks to be held.
            </p>
          </div>
        </SectionReveal>

        {/* Narrative Divider */}
        <SectionReveal className="mb-48">
            <div className="bg-oku-dark rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden group">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Flower className="mx-auto mb-10 text-oku-purple animate-float" size={48} />
                    <h2 className="heading-display text-4xl md:text-6xl mb-8 leading-tight">Beyond the lab coat.</h2>
                    <p className="text-lg text-white/60 italic font-display leading-relaxed mb-12">
                        "We believe therapy should feel less like a clinical procedure and more like a gentle returning to yourself."
                    </p>
                    <div className="h-px w-32 bg-oku-purple/30 mx-auto" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <img src="/uploads/2025/06/Vector-1.png" className="w-full h-full object-cover grayscale invert" alt="" />
                </div>
            </div>
        </SectionReveal>

        {/* Detailed Services Grid */}
        <div className="space-y-32">
          {SERVICES.map((svc, i) => (
            <SectionReveal key={svc.id}>
              <div className={`flex flex-col lg:flex-row gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Visual/Number Side */}
                <div className="lg:w-1/2 w-full">
                    <div className={`${svc.color} aspect-square rounded-[5rem] flex items-center justify-center relative group overflow-hidden border border-white/40 shadow-inner`}>
                        <span className="heading-display text-[15rem] md:text-[20rem] font-light text-white leading-none opacity-40 select-none group-hover:scale-110 transition-transform duration-[2s]">
                            {svc.number}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white max-w-sm text-center">
                                <h3 className="heading-display text-4xl text-oku-dark mb-4">{svc.title}</h3>
                                <p className="text-sm text-oku-taupe leading-relaxed font-medium italic">{svc.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-1/2 w-full space-y-10">
                    <div className="space-y-6">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${svc.accent}`}>Service Protocol {svc.number}</h3>
                        <h2 className="heading-display text-5xl md:text-6xl text-oku-dark leading-tight tracking-tighter">
                            {svc.title.split(' & ').map((part, idx) => (
                                <span key={idx}>
                                    {idx > 0 && <span className="italic text-oku-taupe"> & </span>}
                                    {part}
                                </span>
                            ))}
                        </h2>
                        <p className="text-xl text-oku-taupe font-display italic leading-relaxed">
                            {svc.longDesc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                        {svc.features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-oku-taupe/5 shadow-sm group hover:border-oku-purple/20 transition-all">
                                <div className={`${svc.accent} mb-4 opacity-60 group-hover:scale-110 transition-transform inline-block`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-dark mb-2">{feature.label}</h4>
                                <p className="text-[10px] text-oku-taupe leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <Link 
                            href="/auth/signup"
                            className="btn-navy py-6 px-12 inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all shadow-2xl"
                        >
                            Book {svc.title} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Final CTA */}
        <SectionReveal className="mt-48">
          <div className="bg-oku-cream-warm/30 rounded-[4rem] p-16 md:p-24 border border-oku-taupe/10 text-center relative overflow-hidden">
            <Heart className="mx-auto mb-8 text-oku-purple/40" size={48} />
            <h2 className="heading-display text-5xl md:text-7xl text-oku-dark mb-8">Not sure where to start?</h2>
            <p className="text-oku-taupe max-w-2xl mx-auto italic font-display text-2xl leading-relaxed mb-12">
                "It's completely okay to not have the words yet. Let's begin with a quiet conversation to find the right path for you."
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                <Link href="/auth/signup" className="px-12 py-6 bg-oku-dark text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-navy transition-all shadow-xl">
                    Free Consultation
                </Link>
                <Link href="/therapists" className="px-12 py-6 bg-white text-oku-dark border border-oku-taupe/10 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-cream transition-all shadow-sm">
                    Meet the Collective
                </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

import { FileText } from 'lucide-react';
