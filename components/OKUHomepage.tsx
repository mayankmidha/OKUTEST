'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function OKUHomepage() {
  const [currentEmotion, setCurrentEmotion] = useState('grief')

  useEffect(() => {
    const emotions = ['grief', 'longing', 'quiet', 'becoming', 'anger', 'story']
    let index = 0
    
    const interval = setInterval(() => {
      index = (index + 1) % emotions.length
      setCurrentEmotion(emotions[index])
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-oku-cream via-oku-cream to-oku-blue/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-oku-dark mb-6 leading-tight">
            Come as you are.
          </h1>
          <h2 className="text-3xl md:text-4xl font-display text-oku-taupe mb-8">
            We hold space for your
          </h2>
          <div className="inline-block mb-8">
            <div className="border-2 border-oku-dark rounded-2xl px-8 py-4">
              <p className="font-script text-4xl text-oku-dark" id="rotating-text">
                {currentEmotion}
              </p>
            </div>
          </div>
          <p className="text-xl text-oku-taupe max-w-2xl mx-auto mb-12 leading-relaxed">
            Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Book a free consultation to begin gently.
          </p>
          <Link 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-oku-taupe transition-all hover:scale-105"
          >
            Book a free 1:1 consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* A place to explore Section */}
      <section className="py-24 bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-oku-dark mb-4">
              A place to <span className="text-oku-purple">explore</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-display text-oku-taupe">
              not perform.
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Slow Healing</h3>
              <p className="text-oku-taupe leading-relaxed">
                We move at the pace your story asks for—never rushing, never pushing, always honoring your timing.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Depth Work</h3>
              <p className="text-oku-taupe leading-relaxed">
                Going beyond surface-level patterns to understand the roots of what you're experiencing.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Whole Self</h3>
              <p className="text-oku-taupe leading-relaxed">
                Your mind, body, emotions, and spirit are all welcome here—no parts left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-oku-dark mb-4">
              Our Services
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Individual Therapy",
                description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
                tags: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative"]
              },
              {
                title: "Trauma & EMDR",
                description: "Support for processing trauma—using EMDR and safe practices to help your body and mind rest.",
                tags: ["EMDR Certified", "Somatic-Aware", "Gentle Pace"]
              },
              {
                title: "Movement Therapy",
                description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
                tags: ["Breath & Body-Led", "Somatic Integration", "Expressive & Safe"]
              },
              {
                title: "Psychometric Assessments",
                description: "When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.",
                tags: ["RCI Certified", "Insight-Led", "Evidence-Based"]
              },
              {
                title: "Couples Therapy & Group Work",
                description: "Healing together in relationships can be transformative, encouraging dialogue and growth.",
                tags: ["Relational Healing", "Facilitated Dialogue", "Safer Spaces"]
              },
              {
                title: "Queer-Affirmative Care",
                description: "Therapy that doesn't require you to explain yourself. We affirm your identity and lived truth—without condition.",
                tags: ["Affirming & Aware", "No Explaining", "Lived Understanding"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-oku-cream rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">
                  {index + 1}. {service.title}
                </h3>
                <p className="text-oku-taupe mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-oku-purple/10 text-oku-dark px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-oku-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-oku-taupe transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What shapes our work Section */}
      <section className="py-24 bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-oku-dark mb-4">
              What shapes <span className="text-oku-purple">our work,</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-display text-oku-taupe">
              and your experience of it.
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Care Over Fixing</h3>
              <p className="text-oku-taupe leading-relaxed">
                We believe in holding space rather than rushing solutions. Your journey unfolds at its own pace.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Inclusive By Design</h3>
              <p className="text-oku-taupe leading-relaxed">
                Every part of you is welcome here. No code-switching, no explaining—just authentic connection.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-display font-semibold text-oku-dark mb-4">Not Quick Wins</h3>
              <p className="text-oku-taupe leading-relaxed">
                Deep healing takes time. We're here for the long haul, not the quick fix.
              </p>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-3xl p-12">
            <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">
              Not sure where to <span className="text-oku-purple">begin?</span>
            </h3>
            <p className="text-xl text-oku-taupe mb-8 max-w-2xl mx-auto leading-relaxed">
              Our free 20-minute consultation is a space to ask questions, feel things out, and see if we're the right fit—no pressure, no prep needed.
            </p>
            <blockquote className="text-2xl font-script text-oku-purple mb-8">
              "It's okay to take your time."
            </blockquote>
            <Link 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-oku-taupe transition-all hover:scale-105"
            >
              Book a free 1:1 consultation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
