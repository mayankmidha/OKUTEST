'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PeoplePage() {
  const team = [
    {
      name: "Our Team",
      role: "Practitioners",
      bio: "A diverse collective of clinicians dedicated to inclusive, trauma-informed care."
    }
  ];

  return (
    <div className="bg-[#FDFCFB] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-[#2D2926] mb-8">
            Meet the <span className="italic">collective</span>
          </h1>
          <p className="text-xl text-[#6B635D] font-light leading-relaxed">
            Our practitioners are more than just clinicians. We are a collective 
            of thinkers, healers, and activists committed to making mental 
            wellness accessible for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] bg-[#F5F1EE] rounded-3xl mb-6 relative overflow-hidden">
                {/* Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[#D1C7C0] italic transition-transform duration-700 group-hover:scale-110">
                  Profile
                </div>
              </div>
              <h3 className="text-2xl font-serif text-[#2D2926] mb-1">Practitioner Name</h3>
              <p className="text-[#8C7B6E] font-medium text-sm tracking-wide uppercase mb-4">Psychotherapist</p>
              <p className="text-[#6B635D] leading-relaxed text-sm">
                Specializing in trauma, identity, and relational dynamics with a holistic lens.
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-serif text-[#2D2926] mb-8">Want to join our collective?</h2>
          <button className="px-8 py-4 border border-[#D1C7C0] text-[#2D2926] rounded-full text-lg font-medium hover:bg-[#F5F1EE] transition-all duration-300">
            Work with us
          </button>
        </motion.div>
      </div>
    </div>
  );
}
