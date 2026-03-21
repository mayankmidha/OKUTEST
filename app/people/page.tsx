'use client'

import { motion } from 'framer-motion'

const therapists = [
  {
    name: "Dr. Suraj Singh",
    credentials: "Consultant Psychiatrist",
    specialties: ["Psychiatry", "Medication Management", "Mental Health Assessment"],
    approach: "Comprehensive psychiatric care with focus on holistic treatment approaches",
    languages: ["English", "Hindi"]
  },
  {
    name: "Tanisha Singh", 
    credentials: "Clinical Psychologist (A.) & Psychodynamic Psychotherapist",
    specialties: ["Psychodynamic Therapy", "Clinical Psychology", "Depth Work"],
    approach: "Psychodynamic approach exploring unconscious patterns and relational dynamics",
    languages: ["English", "Hindi"]
  },
  {
    name: "Rananjay Singh",
    credentials: "Queer affirmative therapist and family therapist",
    specialties: ["Queer-Affirmative Therapy", "Family Therapy", "Relationship Counseling"],
    approach: "Affirming therapy for LGBTQ+ individuals and couples, with family systems perspective",
    languages: ["English", "Hindi"]
  },
  {
    name: "Amna Ansari",
    credentials: "Clinical psychologist (A.)",
    specialties: ["Clinical Psychology", "Assessment", "Evidence-Based Therapy"],
    approach: "Clinical psychology with evidence-based therapeutic interventions",
    languages: ["English", "Hindi", "Urdu"]
  },
  {
    name: "Mohit Dudeja", 
    credentials: "Queer affirmative therapist",
    specialties: ["Queer-Affirmative Therapy", "Identity Counseling", "Gender Affirmation"],
    approach: "Specialized queer-affirmative therapy focusing on identity and gender exploration",
    languages: ["English", "Hindi"]
  },
  {
    name: "Gursheel Kaur",
    credentials: "Psychodynamic Psychotherapist", 
    specialties: ["Psychodynamic Therapy", "Depth Psychology", "Long-term Therapy"],
    approach: "Deep psychodynamic work exploring patterns from childhood and early relationships",
    languages: ["English", "Hindi", "Punjabi"]
  }
]

export default function PeoplePage() {
  return (
    <main className="min-h-screen bg-oku-cream py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-oku-dark mb-4">
            Our People
          </h1>
          <p className="text-lg text-oku-taupe max-w-2xl mx-auto leading-relaxed">
            Meet our team of qualified therapists and mental health professionals, 
            each bringing unique expertise and compassionate care to your healing journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oku-purple to-oku-pink rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-semibold text-oku-dark mb-2">
                  {therapist.name}
                </h3>
                <p className="text-oku-taupe text-sm mb-3">{therapist.credentials}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {therapist.languages.map((lang, i) => (
                    <span key={i} className="text-xs bg-oku-cream px-2 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-oku-dark mb-3 text-center">Specialties</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {therapist.specialties.map((specialty, i) => (
                    <span key={i} className="text-sm bg-oku-purple/10 text-oku-dark px-3 py-1 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-oku-dark mb-2 text-center">Therapeutic Approach</h4>
                <p className="text-oku-taupe text-sm leading-relaxed text-center">
                  {therapist.approach}
                </p>
              </div>

              <a 
                href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20{therapist.name.replace(' ', '%20')}"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-oku-dark text-white py-3 rounded-full hover:bg-oku-taupe transition-colors text-center block"
              >
                Book Consultation
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-white rounded-3xl p-12"
        >
          <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">
            Ready to start your healing journey?
          </h3>
          <p className="text-oku-taupe mb-8 max-w-2xl mx-auto">
            Take the first step with a free 20-minute consultation. We'll help you find the right therapist for your needs.
          </p>
          <a 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
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
