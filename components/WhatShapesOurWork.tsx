'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

const values = [
  {
    title: "Care Over Fixing",
    description: "We believe in holding space rather than rushing solutions. Your journey unfolds at its own pace.",
    icon: "❤️"
  },
  {
    title: "Inclusive By Design", 
    description: "Every part of you is welcome here. No code-switching, no explaining—just authentic connection.",
    icon: "🌈"
  },
  {
    title: "Not Quick Wins",
    description: "Deep healing takes time. We're here for the long haul, not the quick fix.",
    icon: "⏳"
  }
]

export default function WhatShapesOurWork() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-oku-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={item}
            className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-4"
          >
            What shapes <span className="block">our work,</span>
          </motion.h2>
          <motion.h3 
            variants={item}
            className="text-2xl md:text-3xl font-display text-oku-taupe"
          >
            and your experience of it.
          </motion.h3>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-display font-semibold text-oku-dark mb-4">
                {value.title}
              </h3>
              <p className="text-oku-taupe leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl font-display font-bold text-oku-dark mb-6">
            Not sure where to <span className="font-script text-4xl">begin?</span>
          </h3>
          <p className="text-lg text-oku-taupe mb-8 max-w-2xl mx-auto">
            Our free 20-minute consultation is a space to ask questions, feel things out, and see if we're the right fit—no pressure, no prep needed.
          </p>
          
          <Link
            href="/therapists"
            className="inline-flex items-center gap-2 px-8 py-4 bg-oku-dark text-white rounded-full hover:bg-oku-taupe transition-colors duration-300"
          >
            Book a free 1:1 consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
