'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

      {/* Approach Section - with images */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">A place to <b>explore</b></h2>
          
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <img 
                  src="/uploads/2025/06/Frame-23-2.png" 
                  alt="Slow Healing" 
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Slow Healing</h3>
                <p className="text-gray-600">We move at the pace your story asks for—never rushed.</p>
              </div>
              <div className="text-center">
                <img 
                  src="/uploads/2025/06/Frame-23.png" 
                  alt="Depth Work" 
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Depth Work</h3>
                <p className="text-gray-600">We meet what's beneath, not just what's visible.</p>
              </div>
              <div className="text-center">
                <img 
                  src="/uploads/2025/06/Frame-23-3.png" 
                  alt="Whole Self" 
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Whole Self</h3>
                <p className="text-gray-600">Your culture, identity, body—all of you is held here.</p>
              </div>
              <div className="text-center">
                <img 
                  src="/uploads/2025/06/Frame-23-1.png" 
                  alt="Welcoming Space" 
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcoming Space</h3>
                <p className="text-gray-600">A calm, non-clinical space designed for ease and safety.</p>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-8">
            <div className="text-center">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23-2.png" 
                alt="Slow Healing" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Slow Healing</h3>
              <p className="text-gray-600">We move at the pace your story asks for—never rushed.</p>
            </div>
            <div className="text-center">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23.png" 
                alt="Depth Work" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Depth Work</h3>
              <p className="text-gray-600">We meet what's beneath, not just what's visible.</p>
            </div>
            <div className="text-center">
              <img 
                src="/uploads/2025/06/Frame-23-3.png" 
                alt="Whole Self" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Whole Self</h3>
              <p className="text-gray-600">Your culture, identity, body—all of you is held here.</p>
            </div>
            <div className="text-center">
              <img 
                src="/uploads/2025/06/Frame-23-1.png" 
                alt="Welcoming Space" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcoming Space</h3>
              <p className="text-gray-600">A calm, non-clinical space designed for ease and safety.</p>
            </div>
          </div>

          <p className="mt-12 text-lg text-gray-600 max-w-3xl text-center">
            Oku was created as a gentle refuge for those <strong>who feel unseen</strong> in traditional therapy spaces. Whether you're unpacking generational pain, navigating identity, or simply seeking to <strong>reconnect with yourself</strong>, we invite you to explore—<strong>without pressure or performance.</strong>
          </p>
        </div>
      </div>

      {/* Qualified Section with Vector Image */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <b>qualified and</b>
              </h2>
              <div className="relative">
                <h2 className="text-4xl font-bold text-gray-900 underline decoration-wavy decoration-gray-400">
                  ethical
                </h2>
              </div>
              <div className="mt-8 space-y-4 text-lg text-gray-700">
                <p>
                  Every therapist at Oku is professionally trained and qualified including RCI Licensed Clinical Psychologists, psychodynamic therapists, queer affirmative therapists.
                </p>
                <p>
                  We combine clinical precision with cultural humility, ensuring your mental health is in grounded, ethical hands.
                </p>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <img 
                src="/uploads/2025/06/Vector-1.png" 
                alt="Qualified and Ethical" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Therapists Section */}
      <div id="therapists" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Not just <b>therapists,</b>
            </h2>
            <div className="relative">
              <h3 className="text-4xl font-bold text-gray-900 underline decoration-wavy decoration-gray-400">
                people first
              </h3>
            </div>
            <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our team of <strong>licensed therapists, facilitators, psychologists and listeners</strong>—bringing care, context, and presence into every session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg" 
                alt="Dr. Suraj Singh" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Suraj Singh</h3>
              <p className="text-gray-600 text-sm">Consultant Psychiatrist</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/Tanisha_-821x1024.jpg" 
                alt="Tanisha Singh" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tanisha Singh</h3>
              <p className="text-gray-600 text-sm">Clinical Psychologist (A.) & Psychodynamic Psychotherapist</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/Rananjay--579x1024.jpg" 
                alt="Rananjay Singh" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rananjay Singh</h3>
              <p className="text-gray-600 text-sm">Queer affirmative therapist and family therapist</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/Amna-670x1024.jpg" 
                alt="Amna Ansari" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Amna Ansari</h3>
              <p className="text-gray-600 text-sm">Clinical psychologist (A.)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/Mohit-911x1024.jpg" 
                alt="Mohit Dudeja" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mohit Dudeja</h3>
              <p className="text-gray-600 text-sm">Queer affirmative therapist</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <img 
                src="/uploads/2025/07/gursheel_pfp-1024x980.jpg" 
                alt="Gursheel Kaur" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gursheel Kaur</h3>
              <p className="text-gray-600 text-sm">Psychodynamic Psychotherapist</p>
            </div>
          </div>
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
