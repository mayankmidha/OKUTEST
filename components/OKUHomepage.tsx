"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, Sparkles, Wind, MessageCircle, ShieldCheck, Zap, Star, Activity, Users, Calendar, Brain, TrendingUp } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Service {
  number: string;
  title: string;
  description: string;
  features: { icon: string; label: string; desc: string }[];
}

interface PhilosophyBlock {
  title: string;
  description: string;
  points: string[];
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CYCLING_WORDS = ["grief", "longing", "quiet", "becoming", "anger", "story"];

const HERO_VISUALS = {
  primary: {
    image: "/wp-content/uploads/2025/07/Tanisha_-821x1024.jpg",
    alt: "Tanisha Singh portrait",
  },
  secondary: {
    image: "/wp-content/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg",
    alt: "Dr. Suraj Singh portrait",
  },
  stickerOne: "/wp-content/uploads/2025/06/Group-28.png",
  stickerTwo: "/wp-content/uploads/2025/06/Group-29.png",
  stickerThree: "/wp-content/uploads/2025/06/Frame-137.png",
};

const SERVICES: Service[] = [
  {
    number: "1",
    title: "Individual Therapy",
    description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
    features: [
      { icon: "🌿", label: "Depth-Oriented", desc: "Explore your emotions beyond surface symptoms." },
      { icon: "🌱", label: "Trauma-Informed", desc: "Your pace and safety come first—always." },
      { icon: "🏳️‍🌈", label: "Queer-Affirmative", desc: "Therapy that welcomes your identity without explanation." },
      { icon: "🧩", label: "Culturally Sensitive", desc: "Your context, language, and story matter." },
    ],
  },
  {
    number: "2",
    title: "Trauma & EMDR",
    description: "Support for processing trauma—using EMDR and safe practices to help your body and mind rest.",
    features: [
      { icon: "👁", label: "EMDR Therapy", desc: "Evidence-based processing for traumatic memory." },
      { icon: "🫁", label: "Somatic Awareness", desc: "Connecting body signals to healing work." },
      { icon: "🛡", label: "Paced & Safe", desc: "No pressure to move faster than you're ready." },
      { icon: "🧠", label: "Nervous System-Led", desc: "Working with your body's natural rhythms." },
    ],
  },
  {
    number: "3",
    title: "Movement Therapy",
    description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
    features: [
      { icon: "🌬", label: "Breath & Body-Led", desc: "Follow your body's pace and rhythm—nothing is forced." },
      { icon: "🌀", label: "Somatic Integration", desc: "Gently process stored emotions through movement." },
      { icon: "🌊", label: "Expressive & Safe", desc: "Move without judgment. No performance, no right way." },
      { icon: "🤝", label: "Accessible to All", desc: "No experience needed—just curiosity and presence." },
    ],
  },
  {
    number: "4",
    title: "Psychometric Assessments",
    description: "When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.",
    features: [
      { icon: "📝", label: "Licensed Oversight", desc: "All assessments are clinical and supervised." },
      { icon: "🔍", label: "Clarity & Path", desc: "Find a map for your symptoms and the next steps." },
      { icon: "⚖️", label: "Unbiased & Deep", desc: "A scientific look at your patterns and behaviors." },
      { icon: "🤝", label: "Grounded Feedback", desc: "We discuss results with you as a collaborative partner." },
    ],
  },
  {
    number: "5",
    title: "Couples & Group Work",
    description: "Healing together in relationships can be transformative, encouraging dialogue and growth.",
    features: [
      { icon: "👥", label: "Relational Space", desc: "Improve communication and deepen connection." },
      { icon: "🔄", label: "Cycle Breaking", desc: "Identify and change old patterns in relationship." },
      { icon: "🏠", label: "Foundational Safety", desc: "Build a secure base for your shared future." },
      { icon: "✨", label: "Transformative dialogue", desc: "Move from conflict to curiosity and repair." },
    ],
  },
  {
    number: "6",
    title: "Queer-Affirmative Care",
    description: "Therapy that doesn’t require you to explain yourself. We affirm your identity and lived truth—without condition.",
    features: [
      { icon: "🏳️‍🌈", label: "Identity Safe", desc: "Your gender and sexuality are respected and understood." },
      { icon: "🗣️", label: "No Explanation Needed", desc: "We know the context, we hold the space." },
      { icon: "🛡️", label: "Political & Personal", desc: "Understanding the intersection of society and self." },
      { icon: "❤️", label: "Lived Truth", desc: "Validating your journey with pride and expertise." },
    ],
  },
];

const PHILOSOPHY: PhilosophyBlock[] = [
  {
    title: "From Fixing to Listening",
    description: "In a world that demands quick results, we offer a space for depth. We don't start with a diagnosis—we start with you. Every session is an invitation to be seen and heard, not just managed.",
    points: ["Non-pathologizing approach", "Collaborative care", "Rooted in presence"],
    image: "/wp-content/uploads/2025/06/Group.png",
  },
  {
    title: "Inclusive by Design",
    description: "You shouldn’t have to translate your lived experience before feeling safe. Oku is built by and for those who carry marginalized identities—queer, neurodivergent, and trauma-informed care is our baseline, not an add-on.",
    points: ["Queer affirmative", "Trauma informed", "Neurodivergent safe"],
    image: "/wp-content/uploads/2025/06/Frame-108.png",
  },
  {
    title: "Wait, what's Oku?",
    description: "OKU (奥) is the Japanese word for 'innermost' or 'depths.' It's that quiet, tender space we all carry within us. We created this clinic as a sanctuary for those depths to unfold at their own pace.",
    points: ["Sustainable growth", "Somatic depth", "Ethical practice"],
    image: "/wp-content/uploads/2025/06/x31_.png",
  },
];

const TRUST_PILLARS = [
  {
    title: "Qualified & Ethical",
    description: "Every practitioner is RCI licensed or equivalently vetted with deep clinical experience.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Radically Inclusive",
    description: "Built for queer, neurodivergent, and marginalized folks to feel truly seen.",
    icon: <Heart size={24} />,
  },
  {
    title: "Integrated Platform",
    description: "Secure records, seamless booking, and clinical AI tools in one sanctuary.",
    icon: <Zap size={24} />,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OKUHomepage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="oku-home-public relative overflow-hidden bg-[#F7F4EF]">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10">
          <SectionReveal>
            <div className="max-w-5xl mb-24">
              <h1 className="heading-display text-7xl md:text-9xl text-oku-darkgrey leading-[0.88] tracking-tight mb-6">
                Come as <span className="italic text-oku-purple-dark">you are.</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic max-w-lg border-l-4 border-oku-purple-dark/20 pl-8 leading-relaxed">
                   We hold space for your <br />
                   <AnimatePresence mode="wait">
                    <motion.span
                      key={CYCLING_WORDS[index]}
                      initial={{ opacity: 0, y: 10, rotateX: 45 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -10, rotateX: -45 }}
                      transition={{ duration: 0.6, ease: "circOut" }}
                      className="inline-block text-oku-purple-dark font-display text-4xl md:text-5xl not-italic"
                    >
                      {CYCLING_WORDS[index]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
             <SectionReveal className="delay-300">
                <div className="relative group">
                   <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/40 transform rotate-1 group-hover:rotate-0 transition-transform duration-1000">
                      <img src={HERO_VISUALS.primary.image} alt={HERO_VISUALS.primary.alt} className="w-full h-full object-cover" />
                   </div>
                   <img 
                      src={HERO_VISUALS.stickerOne} 
                      className="absolute -top-12 -right-12 w-48 drop-shadow-2xl animate-float" 
                      alt="Sticker" 
                   />
                </div>
             </SectionReveal>

             <SectionReveal className="delay-500">
                <div className="space-y-12">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-2 border-white transform -rotate-3">
                         <img src={HERO_VISUALS.secondary.image} alt={HERO_VISUALS.secondary.alt} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-sm">
                         <h2 className="heading-display text-3xl text-oku-darkgrey leading-tight mb-2">A place to <b>explore</b> not perform.</h2>
                         <p className="text-sm text-oku-darkgrey/50 font-display italic">Rooted in psychodynamic & trauma-informed care.</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-4 pt-6">
                      <Link href="/book" className="btn-pill-3d bg-oku-darkgrey text-white !px-12 !py-6 text-[11px] tracking-[0.4em] uppercase">
                         Book a Consultation
                      </Link>
                      <Link href="/therapists" className="btn-pill-3d bg-white text-oku-darkgrey !px-10 !py-6 text-[11px] tracking-[0.4em] uppercase hover:bg-oku-lavender">
                         View Collective
                      </Link>
                   </div>
                </div>
             </SectionReveal>
          </div>
        </div>

        {/* Floating stickers */}
        <img src={HERO_VISUALS.stickerTwo} className="absolute bottom-20 left-10 w-40 opacity-20 pointer-events-none" alt="" />
        <img src={HERO_VISUALS.stickerThree} className="absolute top-40 right-10 w-56 opacity-10 pointer-events-none rotate-12" alt="" />
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-32 bg-white/40 backdrop-blur-3xl border-y border-white/60 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionReveal>
            <div className="mb-20">
               <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter">
                  Qualified and <b>ethical</b> <br />
                  <span className="italic text-oku-purple-dark">to begin healing.</span>
               </h2>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {SERVICES.map((service, idx) => (
              <SectionReveal key={service.number} className={`delay-${idx * 150}`}>
                <div className="group service-card bg-white/60 p-10 rounded-[3rem] border border-white hover:bg-white hover:shadow-2xl transition-all duration-700 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                     <span className="text-5xl font-display font-bold text-oku-lavender group-hover:text-oku-purple-dark transition-colors duration-500">
                        {service.number}
                     </span>
                     <ArrowRight size={24} className="text-oku-darkgrey/10 group-hover:text-oku-purple-dark group-hover:translate-x-2 transition-all" />
                  </div>
                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-6 tracking-tight leading-none group-hover:italic transition-all">
                    {service.title}
                  </h3>
                  <p className="text-oku-darkgrey/60 text-sm font-display italic leading-relaxed mb-10 flex-1">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {service.features.map(f => (
                      <div key={f.label} className="group/f">
                        <span className="block text-xl mb-2">{f.icon}</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey mb-1 group-hover/f:text-oku-purple-dark">{f.label}</p>
                        <p className="text-[9px] text-oku-darkgrey/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="py-48 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <SectionReveal>
            <div className="mb-32 max-w-3xl">
              <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter leading-none mb-8">
                 What <b>shapes</b> our work, <br />
                 <span className="italic text-oku-purple-dark">and your experience of it.</span>
              </h2>
            </div>
          </SectionReveal>

          <div className="space-y-48">
            {PHILOSOPHY.map((block, idx) => (
              <SectionReveal key={block.title}>
                <div className={`grid lg:grid-cols-2 gap-24 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                   <div className={`space-y-10 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <h3 className="heading-display text-4xl md:text-5xl text-oku-darkgrey leading-tight tracking-tight">
                         {block.title}
                      </h3>
                      <p className="text-lg text-oku-darkgrey/65 font-display italic leading-relaxed">
                         {block.description}
                      </p>
                      <ul className="space-y-4">
                         {block.points.map(p => (
                            <li key={p} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">
                               <div className="w-2 h-2 rounded-full bg-oku-purple" /> {p}
                            </li>
                         ))}
                      </ul>
                   </div>
                   <div className={`relative ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="aspect-[4/3] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/60 relative group">
                         <img src={block.image} alt={block.title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                         <div className="absolute inset-0 bg-oku-purple-dark/10 mix-blend-overlay group-hover:bg-transparent transition-all duration-1000" />
                      </div>
                      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-oku-lavender/30 rounded-full blur-3xl -z-10" />
                   </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST PILLARS ── */}
      <section className="py-48 bg-[#F7F4EF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
           <div className="grid lg:grid-cols-2 gap-32 items-center">
              <SectionReveal>
                 <div className="space-y-12">
                    <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter leading-none mb-12">
                      A clinic <span className="italic text-oku-purple-dark underline decoration-zigzag">you can trust.</span>
                    </h2>
                    <div className="space-y-12">
                       {TRUST_PILLARS.map(pillar => (
                         <div key={pillar.title} className="flex gap-8 group">
                            <div className="shrink-0 w-16 h-16 rounded-2xl bg-white shadow-sm border border-oku-taupe/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all duration-500">
                               {pillar.icon}
                            </div>
                            <div className="space-y-3">
                               <h4 className="heading-display text-2xl text-oku-darkgrey tracking-tight">{pillar.title}</h4>
                               <p className="text-sm text-oku-darkgrey/50 font-display italic leading-relaxed">{pillar.description}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </SectionReveal>
              
              <SectionReveal>
                 <div className="relative">
                    <div className="aspect-square bg-oku-lavender/10 rounded-[5rem] overflow-hidden p-16 rotate-3">
                       <img src="/wp-content/uploads/2025/07/Group-33.png" alt="Trust" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-oku-purple-dark/5 blur-3xl -z-10" />
                 </div>
              </SectionReveal>
           </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="pb-48 pt-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
           <SectionReveal>
              <div className="bg-oku-darkgrey rounded-[4rem] p-12 md:p-24 lg:p-32 text-white relative overflow-hidden group shadow-2xl">
                 <div className="relative z-10 max-w-4xl">
                    <h2 className="heading-display text-5xl md:text-8xl mb-12 tracking-tight leading-[0.9]">
                       How you been <br />
                       <span className="italic text-oku-purple">feeling lately?</span>
                    </h2>
                    <p className="text-xl text-white/60 font-display italic mb-16 max-w-xl border-l-2 border-white/20 pl-8 leading-relaxed">
                       You don't need a crisis to begin. You just need a quiet moment of choice.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                       <Link 
                          href="/book" 
                          className="w-full sm:w-auto text-center bg-white text-oku-darkgrey py-6 px-12 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-oku-lavender transition-all shadow-2xl active:scale-95"
                       >
                          Request Consultation
                       </Link>
                       <Link href="/contact" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]">
                          Talk to us
                       </Link>
                    </div>
                 </div>
                 
                 <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
                    <img src="/wp-content/uploads/2025/06/Vector-1.png" className="w-full h-full object-contain scale-150 rotate-12" alt="" />
                 </div>
              </div>
           </SectionReveal>
        </div>
      </section>

      <style jsx global>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .decoration-zigzag {
          text-decoration: underline;
          text-decoration-style: wavy;
          text-underline-offset: 12px;
          text-decoration-thickness: 3px;
        }
      `}</style>
    </div>
  );
}