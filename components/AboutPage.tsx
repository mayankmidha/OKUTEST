'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-oku-page-bg min-h-screen pt-48 pb-32">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-32"
        >
          <span className="inline-block px-6 py-2 mb-10 text-[11px] font-medium tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
            Our Philosophy
          </span>
          <h1 className="text-6xl md:text-8xl font-display text-oku-dark leading-[0.9] tracking-tight mb-12">
            A Sanctuary <br />
            <span className="italic text-oku-taupe">for Inner Space.</span>
          </h1>
          <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed max-w-2xl">
            At Oku, we believe that therapy is a collaborative journey of discovery. 
            Rooted in the belief that everyone deserves a safe, supportive space to explore.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-24 items-center mb-48">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/5] bg-oku-cream rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-oku-taupe/5"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-oku-purple/20 via-transparent to-oku-blue/20" />
            <div className="absolute inset-0 flex items-center justify-center text-oku-taupe/40 font-display italic text-2xl transition-transform duration-1000 group-hover:scale-110">
              The Heart of Things
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-display text-oku-dark mb-10 leading-tight">Trauma-Informed <br />& Deeply Inclusive</h2>
            <div className="space-y-8 text-oku-taupe text-lg leading-relaxed font-light">
              <p>
                We specialize in trauma-informed care that acknowledges the complex 
                intersections of identity, history, and wellness. Our clinicians are 
                trained to provide queer-affirmative and culturally responsive therapy.
              </p>
              <p>
                Our name, "Oku," comes from a concept of "inner space" or "the heart 
                of things." We invite you to explore that inner space with us, at 
                your own pace, with no judgment.
              </p>
              <div className="pt-8">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-12 h-px bg-oku-purple" />
                  <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-oku-dark">Our Values</span>
                </div>
                <ul className="grid grid-cols-2 gap-6">
                  {['Radical Empathy', 'Identity Affirming', 'Relational Depth', 'Holistic Wellness'].map((v) => (
                    <li key={v} className="flex items-center gap-3 text-sm tracking-wide text-oku-dark font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-oku-blue" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[4rem] p-16 md:p-32 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-oku-dark" />
          <div className="absolute inset-0 bg-gradient-to-tr from-oku-purple/20 via-transparent to-oku-blue/20 opacity-30" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display text-white mb-12 leading-tight">
              Ready to start your <br />
              <span className="italic text-oku-taupe/60">journey towards healing?</span>
            </h2>
            <button className="group relative px-12 py-6 bg-white text-oku-dark rounded-full text-sm font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <span className="relative z-10">Book a consultation</span>
              <div className="absolute inset-0 bg-oku-page-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
