'use client'

import { motion } from 'motion/react'

const team = [
  {
    name: "Dr. Suraj Singh",
    role: "Psychiatrist",
    image: "/images/suraj.jpg"
  },
  {
    name: "Tanisha Singh",
    role: "Clinical Psychologist",
    image: "/images/tanisha.jpg"
  },
  {
    name: "Rananjay Singh",
    role: "Queer Affirmative/Family Therapist",
    image: "/images/rananjay.jpg"
  },
  {
    name: "Amna Ansari",
    role: "Clinical Psychologist",
    image: "/images/amna.jpg"
  },
  {
    name: "Mohit Dudeja",
    role: "Queer Affirmative Psychotherapist",
    image: "/images/mohit.jpg"
  },
  {
    name: "Gursheel Kaur",
    role: "Psychodynamic Psychotherapist",
    image: "/images/gursheel.jpg"
  }
]

export default function TeamSection() {
  return (
    <section className="py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-oku-dark mb-8 tracking-tighter">
            NOT JUST THERAPISTS, PEOPLE FIRST.
          </h2>
          <p className="text-2xl text-oku-taupe max-w-3xl mx-auto font-display italic leading-relaxed">
            "Our collective is made of humans who bring their whole selves to the work, 
            holding space for your unfolding with grace and humanity."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {team.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-8 shadow-2xl group-hover:shadow-oku-purple/20 transition-all duration-700">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oku-dark/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-3xl font-display font-bold text-oku-dark mb-2 group-hover:text-oku-purple transition-colors duration-300">{person.name}</h3>
              <p className="text-sm uppercase tracking-[0.2em] font-bold text-oku-taupe">{person.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
