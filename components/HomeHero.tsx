'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen bg-oku-page-bg overflow-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-oku-purple/30 blur-[120px] mix-blend-multiply opacity-60" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-oku-blue/30 blur-[100px] mix-blend-multiply opacity-50" 
      />
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-oku-pink/20 blur-[80px] mix-blend-multiply opacity-40" />

      {/* Hero Content */}
      <section className="relative flex-grow flex items-center justify-center pt-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-6 py-2 mb-10 text-[11px] font-medium tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
              Sanctuary for the Soul
            </span>
            
            <h1 className="text-[12vw] md:text-[9vw] lg:text-[8.5vw] font-display text-oku-dark leading-[0.85] tracking-tight mb-16">
              Come as <br />
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="italic text-oku-taupe inline-block"
              >
                you are.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed mb-20 max-w-3xl mx-auto"
            >
              We hold space for your healing. Discover a trauma-informed, 
              inclusive approach to mental wellness.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-10"
            >
              <Link
                href="/auth/signup"
                className="group relative px-12 py-6 bg-oku-dark text-oku-page-bg rounded-full text-sm font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <span className="relative z-10">Book a Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-oku-purple/20 via-transparent to-oku-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                href="/about-us"
                className="px-12 py-6 border border-oku-taupe/20 text-oku-dark rounded-full text-sm font-medium tracking-[0.2em] uppercase hover:bg-white transition-all duration-500 hover:border-oku-dark"
              >
                Learn our approach
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-oku-taupe font-medium">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-oku-taupe/40 to-transparent" />
      </motion.div>

      {/* Featured Section */}
      <section className="relative py-48 bg-white/40 backdrop-blur-3xl border-t border-oku-taupe/10">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
            {[
              {
                title: "Inclusive Care",
                description: "Queer-affirmative, culturally responsive therapy for diverse identities and lived experiences.",
                color: "bg-oku-purple/20",
                icon: "✦"
              },
              {
                title: "Trauma Informed",
                description: "Our approach prioritizes safety, choice, and empowerment in every single session.",
                color: "bg-oku-blue/20",
                icon: "✧"
              },
              {
                title: "Expert Clinicians",
                description: "Connect with licensed therapists who bring deep clinical expertise and empathy.",
                color: "bg-oku-green/20",
                icon: "✨"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="group relative"
              >
                <div className={`w-20 h-20 ${feature.color} rounded-full flex items-center justify-center text-3xl mb-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12`}>
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-display text-oku-dark mb-6 leading-tight">{feature.title}</h3>
                <p className="text-oku-taupe text-lg leading-relaxed font-light">{feature.description}</p>
                <div className="mt-8 w-12 h-px bg-oku-taupe/20 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
