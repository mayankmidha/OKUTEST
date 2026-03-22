'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ClipboardCheck, MessageCircle, Heart, Shield, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RebuiltHomepage() {
  const [currentText, setCurrentText] = useState('grief')
  const textArray = ['grief', 'longing', 'quiet', 'becoming', 'anger', 'story']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => {
        const currentIndex = textArray.indexOf(prev)
        return textArray[(currentIndex + 1) % textArray.length]
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-8"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Therapy that feels like home</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-bold text-gray-900 mb-8 tracking-tighter leading-[0.85]"
          >
            Come as <br />
            you are.
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-12"
          >
            We hold space for your <br />
            <span className="italic font-script text-oku-purple lowercase text-5xl md:text-8xl">
              {currentText}
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 font-display italic leading-relaxed"
          >
            Oku is a psychotherapy collective offering inclusive, trauma-informed care for all parts of who you are. Begin your journey gently.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/therapists" className="btn-primary py-6 px-12 text-lg shadow-2xl hover:shadow-oku-purple/20 transition-all active:scale-95">
              Book a free 15-min trial
            </Link>
            <Link href="/assessments" className="bg-white text-gray-900 border border-gray-200 py-6 px-12 rounded-full text-lg font-bold hover:bg-gray-50 transition-all active:scale-95">
              Take an assessment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight">A place to explore, not perform.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { img: '2-2', title: 'Slow Healing', desc: 'We move at the pace your story asks for—never rushed.' },
              { img: '', title: 'Depth Work', desc: "We meet what's beneath, not just what's visible." },
              { img: '-3', title: 'Whole Self', desc: 'Your culture, identity, body—all of you is held here.' },
              { img: '-1', title: 'Welcoming Space', desc: 'A calm, non-clinical space designed for ease.' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-8 relative">
                   <div className="absolute inset-0 bg-oku-purple/5 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500" />
                   <img 
                    src={`https://okutherapy.com/wp-content/uploads/2025/06/Frame-23${item.img}.png`} 
                    alt={item.title} 
                    className="w-full h-full object-contain relative z-10"
                   />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Entry Points */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-oku-cream/30 p-12 rounded-[3.5rem] border border-oku-taupe/10 group hover:-translate-y-2 transition-all duration-500">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-oku-purple shadow-sm mb-8 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                  <ClipboardCheck size={32} />
               </div>
               <h3 className="text-3xl font-display font-bold text-gray-900 mb-4 tracking-tight">Clinical Assessments</h3>
               <p className="text-lg text-gray-600 mb-10 leading-relaxed italic font-display">Understand your patterns through our clinically-validated screenings for ADHD, Anxiety, and Trauma.</p>
               <Link href="/assessments" className="flex items-center gap-2 text-oku-purple font-black uppercase tracking-widest text-xs">
                  Begin Screening <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            <div className="bg-oku-dark p-12 rounded-[3.5rem] text-white shadow-2xl group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-oku-purple transition-colors">
                     <MessageCircle size={32} />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">15-Min Trial Calls</h3>
                  <p className="text-lg text-white/60 mb-10 leading-relaxed italic font-display">Connect directly with therapists who specialize in your specific needs. No pressure, just conversation.</p>
                  <Link href="/therapists" className="flex items-center gap-2 text-oku-purple font-black uppercase tracking-widest text-xs">
                     Find Your Match <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Standard */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple mb-4 block">Our Standard</span>
              <h2 className="text-6xl font-display font-bold text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                Qualified, ethical, and <br />
                <span className="underline decoration-wavy decoration-oku-purple/30">deeply human.</span>
              </h2>
              <div className="space-y-6 text-xl text-gray-600 font-display italic leading-relaxed">
                <p>Every therapist at Oku is professionally trained, including RCI Licensed Clinical Psychologists.</p>
                <p>We combine clinical precision with cultural humility, ensuring your mental health is in grounded, ethical hands.</p>
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-oku-purple/10 rounded-[4rem] rotate-3 -z-10" />
               <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Vector-1.png" 
                alt="Ethical care" 
                className="w-full h-auto rounded-[4rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-32 text-center">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-8 tracking-tighter">Ready to return to yourself?</h2>
            <p className="text-2xl text-oku-taupe font-script italic mb-12">"You don't have to carry the story alone."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href="/therapists" className="btn-primary py-6 px-12 shadow-2xl">Start your journey</Link>
               <Link href="/auth/signup" className="bg-gray-100 text-gray-900 py-6 px-12 rounded-full font-bold hover:bg-gray-200 transition-all">Create Account</Link>
            </div>
         </div>
      </section>
    </main>
  )
}
