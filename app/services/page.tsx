'use client'

import { motion } from 'framer-motion'

const services = [
  {
    number: "1",
    title: "Individual Therapy",
    description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
    tags: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative", "Culturally Sensitive"],
    bgColor: "bg-oku-purple/10",
    textColor: "text-oku-purple"
  },
  {
    number: "2", 
    title: "Trauma & EMDR",
    description: "Support for processing trauma—using EMDR and safe practices to help your body and mind rest.",
    tags: ["EMDR Certified", "Somatic-Aware", "Gentle Pace", "Trauma-Informed"],
    bgColor: "bg-oku-blue/10",
    textColor: "text-oku-blue"
  },
  {
    number: "3",
    title: "Movement Therapy", 
    description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
    tags: ["Breath & Body-Led", "Somatic Integration", "Expressive & Safe", "Accessible to All"],
    bgColor: "bg-oku-pink/10",
    textColor: "text-oku-pink"
  },
  {
    number: "4",
    title: "Psychometric Assessments",
    description: "When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.",
    tags: ["RCI Certified", "Insight-Led", "Non-Judgmental", "Evidence-Based"],
    bgColor: "bg-oku-green/10",
    textColor: "text-oku-green"
  },
  {
    number: "5",
    title: "Couples Therapy & Group Work",
    description: "Healing together in relationships can be transformative, encouraging dialogue and growth.",
    tags: ["Relational Healing", "Facilitated Dialogue", "Safer Spaces", "Completely Inclusive"],
    bgColor: "bg-oku-orange/10",
    textColor: "text-oku-orange"
  },
  {
    number: "6",
    title: "Queer-Affirmative Care",
    description: "Therapy that doesn't require you to explain yourself. We affirm your identity and lived truth—without condition.",
    tags: ["Affirming & Aware", "No Explaining", "Body + Identity", "Lived Understanding"],
    bgColor: "bg-oku-red/10",
    textColor: "text-oku-red"
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-oku-cream py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-oku-dark mb-6">
            Our Services
          </h1>
          <p className="text-xl text-oku-taupe max-w-3xl mx-auto leading-relaxed">
            We offer a range of therapeutic approaches designed to meet you where you are. 
            Each service is rooted in trauma-informed, inclusive care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-2xl font-bold ${service.textColor}`}>
                    {service.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-semibold text-oku-dark mb-3">
                    {service.title}
                  </h3>
                  <p className="text-oku-taupe leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className={`text-xs ${service.bgColor} ${service.textColor} px-3 py-1 rounded-full`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a 
                href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%20session%20for%20${service.title.replace(' ', '%20')}"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-oku-dark text-white px-6 py-3 rounded-full hover:bg-oku-taupe transition-colors"
              >
                Book This Service
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-3xl p-12"
        >
          <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">
            Not sure which service is right for you?
          </h3>
          <p className="text-xl text-oku-taupe mb-8 max-w-2xl mx-auto">
            That's completely okay. Our free consultation helps us understand your needs and recommend the best approach.
          </p>
          <a 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%20free%20consultation%20to%20discuss%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full hover:bg-oku-taupe transition-colors"
          >
            Book Free Consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </main>
  )
}
