'use client'

import { motion } from 'framer-motion'

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-oku-cream">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-20"
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-oku-dark mb-8">
              About OKU Therapy
            </h1>
            <p className="text-xl text-oku-taupe leading-relaxed">
              A different kind of therapeutic space—relational, body-aware, and rooted in who you are.
            </p>
          </div>

          <section>
            <h2 className="text-4xl font-display font-bold text-oku-dark mb-6">therapy.</h2>
            <p className="text-lg text-oku-taupe leading-relaxed mb-8">
              We don't wear lab coats or hand you a fixed plan. Instead, we offer a slower, more spacious kind of care—relational, body-aware, and rooted in who you are. Our sessions feel less like a prescription and more like a conversation that unfolds.
            </p>
          </section>

          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h3 className="text-3xl font-display font-semibold text-oku-dark mb-4">
                  From Fixing to Listening
                </h3>
                <p className="text-oku-taupe leading-relaxed">
                  In many traditional spaces, therapy begins with a problem to solve and a diagnosis to name. You're often seen as something to treat.
                </p>
                <p className="text-oku-taupe leading-relaxed mt-4">
                  At Oku, we start by listening—not labeling. We sit beside your story, not above it.
                </p>
              </div>
              <div className="bg-oku-purple/10 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-oku-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-oku-purple font-semibold">Listening First</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-display font-semibold text-oku-dark mb-4">
                  From Clinical to Relational
                </h3>
                <p className="text-oku-taupe leading-relaxed">
                  You won't find harsh lighting or stiff furniture here. Our space is designed to feel like somewhere you can exhale.
                </p>
                <p className="text-oku-taupe leading-relaxed mt-4">
                  We believe healing happens in relationship, not in procedure. The room matters as much as the therapist.
                </p>
              </div>
              <div className="order-1 md:order-2 bg-oku-blue/10 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-oku-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-oku-blue font-semibold">Relational Space</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h3 className="text-3xl font-display font-semibold text-oku-dark mb-4">
                  From Plans to Process
                </h3>
                <p className="text-oku-taupe leading-relaxed">
                  Therapy isn't a checklist or 5-step solution. Real change doesn't fit into fixed frameworks.
                </p>
                <p className="text-oku-taupe leading-relaxed mt-4">
                  We allow things to unfold—slowly, organically. At Oku, therapy adapts as you do.
                </p>
              </div>
              <div className="bg-oku-pink/10 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-oku-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-oku-pink font-semibold">Organic Process</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-display font-semibold text-oku-dark mb-4">
                  From Inclusive to Affirming
                </h3>
                <p className="text-oku-taupe leading-relaxed">
                  You shouldn't have to educate your therapist about your identity. Safety isn't created by neutrality—it's created by awareness.
                </p>
                <p className="text-oku-taupe leading-relaxed mt-4">
                  We're queer-affirmative, caste-aware, body-literate. Not just inclusive in words, but in every layer of our work.
                </p>
              </div>
              <div className="order-1 md:order-2 bg-gradient-to-br from-oku-purple/10 to-oku-pink/10 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-oku-purple to-oku-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <p className="text-oku-purple font-semibold">Affirming Care</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-white rounded-3xl p-12 mt-20"
          >
            <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">
              Ready to begin gently?
            </h3>
            <p className="text-xl text-oku-taupe mb-8">
              Take the first step with a free 20-minute consultation. No pressure, no prep needed.
            </p>
            <a 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-oku-taupe transition-all hover:scale-105"
            >
              Book Free Consultation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
