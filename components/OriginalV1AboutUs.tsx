'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RebuiltAboutUs() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Our Story</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                The <span className="italic font-script text-oku-purple lowercase text-5xl md:text-7xl">heart</span> behind <br />
                <span className="underline decoration-wavy decoration-oku-purple/30">oku therapy.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-display italic leading-relaxed">
                OKU (奥) is a Japanese word that means "the innermost," "the depths," or "the place within." 
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-oku-purple/5 rounded-[3rem] -rotate-3 -z-10" />
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/07/Group-21-1024x520.png" 
                alt="OKU Therapy Team" 
                className="w-full h-auto rounded-[3rem] shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
           <div className="space-y-10 text-xl text-gray-700 leading-relaxed font-display italic">
              <p>
                It speaks to the quiet spaces we all carry — layered, tender, and often unseen. At Oku Therapy, we offer a place for those parts.
              </p>
              <p>
                We don't believe healing is about becoming someone new. We believe it's about returning — gently, slowly — to what has always lived inside you.
              </p>
              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl relative my-16">
                 <p className="text-3xl text-gray-900 leading-snug">
                   "Whether you come carrying grief, trauma, identity questions, or a quiet ache you can't quite name, this is a space to pause, reflect, and begin again."
                 </p>
                 <Sparkles className="absolute -top-6 -right-6 text-oku-purple" size={48} />
              </div>
              <p>
                Oku was created as a gentle refuge for those who feel unseen in traditional therapy spaces. We combine clinical precision with cultural humility, ensuring your journey is held in grounded, ethical hands.
              </p>
           </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-sm uppercase tracking-[0.4em] font-black text-oku-purple mb-4">Our Core Values</h2>
             <p className="text-4xl font-display font-bold text-gray-900 tracking-tight">The foundation of our care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Heart, title: 'Inclusive Care', desc: 'We honor all identities, experiences, and unique paths to healing.' },
              { icon: Sparkles, title: 'Gentle Pace', desc: 'We move at the speed your story needs, never rushing the process.' },
              { icon: ShieldCheck, title: 'Ethical Hands', desc: 'Clinical precision combined with deep cultural humility and awareness.' }
            ].map((value, i) => (
              <div key={i} className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 group hover:-translate-y-2 transition-all duration-500 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-oku-purple mx-auto mb-8 shadow-sm group-hover:bg-oku-purple group-hover:text-white transition-colors">
                  <value.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-oku-dark text-white py-32 relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-oku-purple/10 rounded-full blur-3xl" />
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Find your clinical partner.</h2>
            <p className="text-2xl text-oku-cream/60 font-script italic mb-12">"Your story is safe with us."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href="/therapists" className="btn-primary py-6 px-12 shadow-2xl">Meet our People</Link>
               <Link href="/auth/login" className="bg-white/10 text-white border border-white/10 py-6 px-12 rounded-full font-bold hover:bg-white/20 transition-all">Portal Login</Link>
            </div>
         </div>
      </section>
    </main>
  )
}
