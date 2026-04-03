'use client'

import { motion } from 'motion/react'

export default function ExploreSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const features = [
    {
      title: "Slow Healing",
      description: "We move at the pace your story asks for—never rushed.",
      color: "oku-purple"
    },
    {
      title: "Depth Work", 
      description: "We meet what's beneath, not just what's visible.",
      color: "oku-blue"
    },
    {
      title: "Whole Self",
      description: "Your culture, identity, body—all of you is held here.",
      color: "oku-pink"
    },
    {
      title: "Welcoming Space",
      description: "A calm, non-clinical space designed for ease and safety.",
      color: "oku-sage"
    }
  ]

  return (
    <section className="py-20 bg-white">
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
            className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-8"
          >
            A place to explore
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`bg-${feature.color}/10 p-8 rounded-2xl text-center`}
            >
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-oku-taupe leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-lg text-oku-taupe leading-relaxed">
            Oku was created as a gentle refuge for those who feel unseen in traditional therapy spaces. 
            Whether you're unpacking generational pain, navigating identity, or simply seeking to reconnect 
            with yourself, we invite you to explore—without pressure or performance.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
