'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import V1Header from './V1Header'

export default function ExactV1Homepage() {
  const [currentText, setCurrentText] = useState('grief')
  
  const textArray = ['grief', 'longing', 'quiet', 'becoming', 'anger', 'story']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => {
        const currentIndex = textArray.indexOf(prev)
        return textArray[(currentIndex + 1) % textArray.length]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <V1Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <b>Come as you are.</b>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We hold space for your
          </h2>
          <div className="relative inline-block">
            <h2 
              id="change"
              className="text-4xl md:text-5xl font-bold text-gray-900"
              style={{ fontFamily: 'cursive' }}
            >
              {currentText}
            </h2>
          </div>
          <p className="text-xl text-gray-600 mt-8 mb-8 max-w-2xl mx-auto">
            Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Book a free consultation to begin gently.
          </p>
          
          {/* Simple Button */}
          <div className="mt-8">
            <a 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Book a free 1:1 consultation
            </a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-12">
            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Individual Therapy</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Depth-Oriented</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Trauma-Informed</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Queer-Affirmative</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Culturally Sensitive</span>
              </div>
            </div>
            
            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Trauma & EMDR</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">EMDR Certified</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Somatic-Aware</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Gentle Pace</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Trauma-Informed</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Movement Therapy</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Breath & Body-Led</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Somatic Integration</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Expressive & Safe</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Accessible to All</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Psychometric Assessments</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">RCI Certified</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Insight-Led</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Non-Judgmental</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Evidence-Based</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Couples Therapy & Group Work</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Relational Healing</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Facilitated Dialogue</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Safer Spaces</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Completely Inclusive</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-900 pl-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Queer-Affirmative Care</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Affirming & Aware</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">No Explaining</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Body + Identity</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Lived Understanding</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">A place to explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Slow Healing</h3>
              <p className="text-gray-600">We move at the pace your story asks for—never rushed.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Depth Work</h3>
              <p className="text-gray-600">We meet what's beneath, not just what's visible.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Whole Self</h3>
              <p className="text-gray-600">Your culture, identity, body—all of you is held here.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcoming Space</h3>
              <p className="text-gray-600">A calm, non-clinical space designed for ease and safety.</p>
            </div>
          </div>
          <p className="mt-12 text-lg text-gray-600 max-w-3xl">
            Oku was created as a gentle refuge for those who feel unseen in traditional therapy spaces. Whether you're unpacking generational pain, navigating identity, or simply seeking to reconnect with yourself, we invite you to explore—without pressure or performance.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to begin?</h2>
          <p className="text-xl mb-8 text-gray-300">"It's okay to take your time."</p>
          <a 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Book a free 1:1 consultation
          </a>
        </div>
      </div>
    </div>
  )
}
