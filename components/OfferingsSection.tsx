'use client'

import { motion } from 'framer-motion'

const offerings = [
  {
    title: "Individual Therapy",
    description: "Depth-oriented, Trauma-informed, Queer-affirmative, Culturally sensitive.",
    color: "bg-oku-purple/10"
  },
  {
    title: "Trauma & EMDR",
    description: "EMDR certified, Somatic-aware, Gentle pace for deep healing.",
    color: "bg-oku-blue/10"
  },
  {
    title: "Movement Therapy",
    description: "Breath & Body-led, Somatic integration, Accessible to all bodies.",
    color: "bg-oku-pink/10"
  },
  {
    title: "Psychometric Assessments",
    description: "RCI Certified, Insight-led, Evidence-based mental health screenings.",
    color: "bg-oku-sage/10"
  },
  {
    title: "Couples & Group Work",
    description: "Relational healing, Facilitated dialogue, Inclusive of all relationship structures.",
    color: "bg-oku-olive/10"
  },
  {
    title: "Queer-Affirmative Care",
    description: "No explaining required. A safe, celebratory space for body + identity focus.",
    color: "bg-oku-coral/10"
  }
]

export default function OfferingsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-6 uppercase tracking-tight">
            Ways to Begin
          </h2>
          <p className="text-xl text-oku-taupe max-w-2xl mx-auto italic font-display">
            gentle paths towards your interior self.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${item.color} p-10 rounded-3xl hover:shadow-lg transition-all duration-500 cursor-default group`}
            >
              <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 group-hover:translate-x-1 transition-transform">
                {item.title}
              </h3>
              <p className="text-oku-taupe leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
