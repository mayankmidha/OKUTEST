'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-[#F5F1EE] opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] rounded-full bg-[#E8E0D9] opacity-30 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase text-oku-taupe bg-oku-cream-warm rounded-full"
            >
              Welcome to Oku Therapy
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-oku-dark leading-tight mb-8"
            >
              Come as <span className="italic">you are</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-oku-taupe font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              We hold space for your healing. Discover a trauma-informed, 
              inclusive approach to mental wellness designed for all parts of you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-oku-dark text-white rounded-full text-lg font-medium hover:bg-oku-purple-dark transition-colors duration-300 shadow-lg shadow-black/5"
              >
                Book a free 1:1 consultation
              </Link>
              <Link
                href="/about-us"
                className="px-8 py-4 border border-oku-taupe/20 text-oku-dark rounded-full text-lg font-medium hover:bg-oku-cream-warm transition-all duration-300"
              >
                Learn our approach
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Inclusive Care",
                description: "We provide queer-affirmative, culturally responsive therapy for diverse identities.",
                color: "bg-oku-purple"
              },
              {
                title: "Trauma Informed",
                description: "Our approach prioritizes safety, choice, and empowerment in every session.",
                color: "bg-oku-blue"
              },
              {
                title: "Expert Clinicians",
                description: "Connect with licensed therapists who bring deep expertise and lived experience.",
                color: "bg-oku-green"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 rounded-3xl border border-oku-taupe/5 hover:border-oku-taupe/20 transition-colors duration-300 ${feature.color}`}
              >
                <h3 className="text-2xl font-serif text-oku-dark mb-4">{feature.title}</h3>
                <p className="text-oku-taupe leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
