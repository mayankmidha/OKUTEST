'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const services = [
  {
    number: "1",
    title: "Individual Therapy",
    description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
    features: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative", "Culturally Sensitive"],
    color: "oku-purple"
  },
  {
    number: "2", 
    title: "Trauma & EMDR",
    description: "Support for processing trauma—using EMDR and safe practices to help your body and mind rest.",
    features: ["EMDR Certified", "Somatic-Aware", "Gentle Pace", "Trauma-Informed"],
    color: "oku-blue"
  },
  {
    number: "3",
    title: "Movement Therapy", 
    description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
    features: ["Breath & Body-Led", "Somatic Integration", "Expressive & Safe", "Accessible to All"],
    color: "oku-pink"
  },
  {
    number: "4",
    title: "Psychometric Assessments",
    description: "When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.",
    features: ["RCI Certified", "Insight-Led", "Non-Judgmental", "Evidence-Based"],
    color: "oku-sage"
  },
  {
    number: "5",
    title: "Couples Therapy & Group Work",
    description: "Healing together in relationships can be transformative, encouraging dialogue and growth.",
    features: ["Relational Healing", "Facilitated Dialogue", "Safer Spaces", "Completely Inclusive"],
    color: "oku-olive"
  },
  {
    number: "6",
    title: "Queer-Affirmative Care",
    description: "Therapy that doesn't require you to explain yourself. We affirm your identity and lived truth—without condition.",
    features: ["Affirming & Aware", "No Explaining", "Body + Identity", "Lived Understanding"],
    color: "oku-coral"
  }
]

export default function ServicesSection() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

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
            className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-4"
          >
            Not just therapists, <span className="block">people first</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-5xl font-display font-bold text-${service.color}`}>
                    {service.number}
                  </span>
                  <h3 className="text-3xl font-display font-semibold text-oku-dark">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-lg text-oku-taupe mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`bg-${service.color}/10 px-4 py-3 rounded-lg text-center`}
                    >
                      <p className="text-sm font-medium text-oku-dark">{feature}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard/client/therapists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-oku-dark rounded-full text-oku-dark hover:bg-oku-dark hover:text-white transition-all duration-300"
                >
                  Book a free 1:1 consultation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <div className={`bg-gradient-to-br from-${service.color}/20 to-${service.color}/5 rounded-3xl p-8 h-64 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-${service.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-oku-dark font-medium">Therapeutic Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
