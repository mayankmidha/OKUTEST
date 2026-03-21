'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Users, Globe } from 'lucide-react'

const features = [
  {
    icon: <Shield className="w-8 h-8 text-oku-purple" />,
    title: 'Licensed Therapists',
    description: 'Every practitioner on our platform is fully licensed and vetted to ensure high-quality care.',
  },
  {
    icon: <Clock className="w-8 h-8 text-oku-blue" />,
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your life. Our automated system handles reminders and rescheduling.',
  },
  {
    icon: <Globe className="w-8 h-8 text-oku-purple" />,
    title: 'Secure & Confidential',
    description: 'HIPAA-compliant video and messaging ensures your privacy is protected at all times.',
  },
  {
    icon: <Users className="w-8 h-8 text-oku-blue" />,
    title: 'Diverse Specializations',
    description: 'From trauma to ADHD, find a specialist who understands your unique intersectional identity.',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-oku-page-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-4">Why OKU Therapy?</h2>
          <p className="text-oku-taupe max-w-2xl mx-auto">We provide the tools and support you need to prioritize your mental wellbeing.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-oku-cream p-8 rounded-card border border-oku-tau-pe/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 p-4 bg-oku-cream-warm inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-oku-dark mb-4">{feature.title}</h3>
              <p className="text-oku-taupe text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
