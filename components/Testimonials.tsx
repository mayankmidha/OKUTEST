'use client'

import { motion } from 'motion/react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    text: "This therapy changed my life. I finally found a space where I felt truly understood and supported.",
    author: "A. Sharma",
    stars: 5,
  },
  {
    text: "The scheduling is so easy, and the therapists are world-class. Highly recommend OKU Therapy.",
    author: "R. Kapoor",
    stars: 5,
  },
  {
    text: "Finding a queer-affirmative therapist who actually gets it was a game changer for me.",
    author: "M. Das",
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-oku-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-4">What Our Clients Say</h2>
          <p className="font-script text-2xl text-oku-taupe">Real stories from our community.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="bg-oku-page-bg p-10 rounded-card flex flex-col items-center text-center shadow-lg relative"
            >
              <div className="flex gap-1 mb-6 text-oku-purple">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg md:text-xl font-display italic text-oku-dark mb-8 leading-relaxed">
                "{t.text}"
              </p>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-oku-taupe">
                — {t.author}
              </p>
              
              <div className="absolute top-4 left-4 text-6xl font-display text-oku-purple/10 opacity-50">“</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
