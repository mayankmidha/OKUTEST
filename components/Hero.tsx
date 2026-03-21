'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const emotions = [
  'grief',
  'longing', 
  'quiet',
  'becoming',
  'anger',
  'story'
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % emotions.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-oku-cream pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-oku-purple/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-oku-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <div className="flex flex-col items-center">
          {/* Animated Emotion Oval */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 mb-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-oku-purple/30 rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-oku-blue/40 rounded-full"
            ></motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <div className="border-2 border-oku-dark rounded-2xl px-6 py-3">
                    <p className="font-script text-3xl text-oku-dark">{emotions[index]}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Pulsing rings */}
            <div className="absolute inset-0 border-4 border-oku-purple/10 rounded-full animate-ping"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-oku-dark leading-tight tracking-tight mb-6">
              Your Mental <br />
              <span className="text-oku-purple italic">Health Matters</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-script text-3xl md:text-4xl text-oku-taupe mb-12"
            >
              Therapy tailored to your unique journey.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/auth/signup"
                className="bg-oku-purple text-oku-dark px-12 py-5 rounded-pill font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Start Your Journey
              </Link>
              <Link
                href="/therapists"
                className="text-oku-dark font-bold hover:text-oku-purple transition-colors flex items-center gap-2 group"
              >
                Meet our therapists
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
