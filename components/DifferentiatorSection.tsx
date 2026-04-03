'use client'

import { motion } from 'motion/react'

const comparisons = [
  { from: "Fixing", to: "Listening" },
  { from: "Clinical", to: "Relational" },
  { from: "Plans", to: "Process" },
  { from: "Inclusive", to: "Affirming" }
]

export default function DifferentiatorSection() {
  return (
    <section className="py-24 bg-oku-dark text-oku-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
              OKU IS NOT YOUR <br />USUAL THERAPY.
            </h2>
            <p className="text-xl text-oku-cream/70 max-w-md leading-relaxed">
              We move away from clinical coldness towards relational warmth. 
              Our focus is on the unfolding, not the fixing.
            </p>
          </div>

          <div className="space-y-12">
            {comparisons.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="flex items-center gap-8 group"
              >
                <span className="text-2xl font-display text-oku-cream/30 line-through group-hover:text-oku-cream/50 transition-colors">
                  {item.from}
                </span>
                <div className="h-px w-12 bg-oku-purple/30"></div>
                <span className="text-4xl md:text-5xl font-display font-bold text-oku-purple group-hover:text-white transition-colors">
                  {item.to}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
