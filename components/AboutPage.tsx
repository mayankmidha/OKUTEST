'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-[#FDFCFB] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-[#2D2926] mb-8">
            Our <span className="italic">Philosophy</span>
          </h1>
          <p className="text-xl text-[#6B635D] font-light leading-relaxed">
            At Oku, we believe that therapy is a collaborative journey of discovery. 
            Our practice is rooted in the belief that everyone deserves a safe, 
            supportive space to explore their inner world and find their path to healing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] bg-[#F5F1EE] rounded-3xl overflow-hidden relative"
          >
            {/* Placeholder for an image */}
            <div className="absolute inset-0 flex items-center justify-center text-[#D1C7C0] italic">
              Space for healing
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif text-[#2D2926] mb-6">Trauma-Informed & Inclusive</h2>
            <div className="space-y-6 text-[#6B635D] leading-relaxed">
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
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#2D2926] rounded-[3rem] p-12 md:p-20 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-8 max-w-2xl mx-auto">
            Ready to start your journey towards healing?
          </h2>
          <button className="px-8 py-4 bg-white text-[#2D2926] rounded-full text-lg font-medium hover:bg-[#F5F1EE] transition-colors duration-300">
            Book a consultation
          </button>
        </motion.div>
      </div>
    </div>
  );
}
