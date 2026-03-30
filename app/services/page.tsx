'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Heart, Sparkles, Shield, Flower2, Cloud, Moon } from 'lucide-react'

const services = [
  {
    number: "01",
    title: "Individual Therapy",
    description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
    features: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative", "Culturally Sensitive"],
    color: "bg-oku-lavender/40",
    icon: Heart
  },
  {
    number: "02", 
    title: "Trauma & EMDR",
    description: "Support for processing trauma—using EMDR and somatic safe practices to help your body and mind rest.",
    features: ["EMDR Certified", "Somatic-Aware", "Gentle Pace", "Trauma-Informed"],
    color: "bg-oku-mint/40",
    icon: Zap
  },
  {
    number: "03",
    title: "Movement Therapy", 
    description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
    features: ["Breath & Body-Led", "Somatic Integration", "Expressive & Safe", "Accessible to All"],
    color: "bg-oku-blush/40",
    icon: Flower2
  },
  {
    number: "04",
    title: "Psychometric Assessments",
    description: "When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.",
    features: ["RCI Certified", "Insight-Led", "Non-Judgmental", "Evidence-Based"],
    color: "bg-oku-babyblue/40",
    icon: Sparkles
  },
  {
    number: "05",
    title: "Couples & Relationships",
    description: "Healing together in relationships can be transformative, encouraging dialogue and growth.",
    features: ["Relational Healing", "Facilitated Dialogue", "Safer Spaces", "Completely Inclusive"],
    color: "bg-oku-butter/40",
    icon: Moon
  },
  {
    number: "06",
    title: "Queer-Affirmative Care",
    description: "Therapy that doesn't require you to explain yourself. We affirm your identity and lived truth—without condition.",
    features: ["Affirming & Aware", "No Explaining", "Body + Identity", "Lived Understanding"],
    color: "bg-oku-lavender/40",
    icon: Cloud
  }
]

export default function ServicesPage() {
  return (
    <div className="oku-page-public min-h-screen bg-oku-peach relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-blush/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mb-32">
          <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>Our Offerings</span>
          <h1 className="heading-display text-oku-darkgrey text-7xl md:text-9xl leading-[0.85] tracking-tight mb-12">
            Ways to <br />
            <span className="text-oku-purple-dark italic">begin.</span>
          </h1>
          <p className="text-xl md:text-3xl text-oku-darkgrey/70 font-display italic leading-relaxed max-w-2xl border-l-4 border-oku-purple-dark/20 pl-8">
            Healing isn't one-size-fits-all. We offer diverse paths designed to meet you exactly where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`card-glass-3d tilt-card !p-12 md:!p-20 flex flex-col md:flex-row gap-16 items-center ${service.color} !rounded-[4rem]`}
            >
              <div className="md:w-1/2">
                <div className="flex items-center gap-6 mb-10">
                  <span className="heading-display text-6xl md:text-8xl text-oku-purple-dark/30">
                    {service.number}
                  </span>
                  <h3 className="heading-display text-4xl md:text-6xl text-oku-darkgrey tracking-tighter">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-xl text-oku-darkgrey/70 mb-12 leading-relaxed italic font-display border-l-4 border-oku-purple-dark/10 pl-8">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-12">
                  {service.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="bg-white/60 px-6 py-4 rounded-2xl text-center border border-white/80 shadow-sm"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">{feature}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`https://wa.me/919953879928?text=${encodeURIComponent(`Hi, I want to book a session for ${service.title}`)}`}
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-6 text-[11px] pulse-cta flex items-center gap-3 w-fit"
                >
                  Book This Service <ArrowRight size={16} />
                </Link>
              </div>

              <div className="md:w-1/2 w-full">
                <div className="aspect-square card-glass-3d !bg-white/40 !rounded-[3rem] flex items-center justify-center relative overflow-hidden group">
                  <div className="relative z-10 text-center scale-150 transition-transform duration-1000 group-hover:scale-[1.7]">
                    <service.icon size={80} strokeWidth={1} className="text-oku-purple-dark opacity-40 animate-float-3d mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">Therapeutic Excellence</p>
                  </div>
                  {/* Abstract Decorations */}
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl animate-pulse delay-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-40 card-glass-3d !p-16 md:!p-24 !bg-white/60 !rounded-[4rem] text-center relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="heading-display text-5xl md:text-8xl text-oku-darkgrey mb-8 tracking-tight">Ready to <span className="text-oku-purple-dark italic">unfold?</span></h2>
              <p className="text-2xl text-oku-darkgrey/60 font-display italic mb-16 max-w-2xl mx-auto">
                Not sure which path is yours? Start with a free 15-minute consultation to explore the best way forward.
              </p>
              <Link href="/therapists" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-16 !py-8 text-xs pulse-cta">
                Meet the collective <ArrowRight size={20} className="ml-3" />
              </Link>
           </div>
           <Shield size={200} strokeWidth={0.5} className="absolute -bottom-20 -right-20 text-oku-purple-dark/5 rotate-12" />
        </div>
      </div>
    </div>
  )
}
