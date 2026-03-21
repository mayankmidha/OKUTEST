'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ClipboardCheck, Video, Heart, Shield, MessageCircle } from 'lucide-react'

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
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Therapy that feels like home</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 mb-6 tracking-tighter">
            Come as you are.
          </h1>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-8">
            We hold space for your <br />
            <span className="italic font-script text-oku-purple lowercase text-5xl md:text-7xl">
              {currentText}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mt-8 mb-12 max-w-2xl mx-auto font-display italic leading-relaxed">
            Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Begin your journey with a free consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/therapists"
              className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-oku-purple transition-all shadow-xl"
            >
              Book a free 15-min trial
            </Link>
            <Link 
              href="/assessments"
              className="inline-block bg-white text-gray-900 border border-gray-200 px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-50 transition-all"
            >
              Take an assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Entry Points Section - SaaS Focus */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-oku-purple/10 rounded-2xl flex items-center justify-center text-oku-purple mb-8 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                <ClipboardCheck size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Self-Assessments</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Understand your patterns through our clinically-validated screenings for ADHD, Anxiety, OCD, and Trauma.
              </p>
              <Link href="/assessments" className="flex items-center gap-2 text-oku-purple font-black uppercase tracking-widest text-xs">
                View Screenings <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-gray-900/5 rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Direct Matching</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Connect directly with therapists who specialize in your specific needs. Start with a brief, no-pressure conversation.
              </p>
              <Link href="/therapists" className="flex items-center gap-2 text-gray-900 font-black uppercase tracking-widest text-xs">
                Meet our People <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section - with images */}
      <div className="bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-16 text-center">A place to <b>explore</b></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center group">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23-2.png" 
                alt="Slow Healing" 
                className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Slow Healing</h3>
              <p className="text-gray-600">We move at the pace your story asks for—never rushed.</p>
            </div>
            <div className="text-center group">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23.png" 
                alt="Depth Work" 
                className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Depth Work</h3>
              <p className="text-gray-600">We meet what's beneath, not just what's visible.</p>
            </div>
            <div className="text-center group">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23-3.png" 
                alt="Whole Self" 
                className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Whole Self</h3>
              <p className="text-gray-600">Your culture, identity, body—all of you is held here.</p>
            </div>
            <div className="text-center group">
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Frame-23-1.png" 
                alt="Welcoming Space" 
                className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Welcoming Space</h3>
              <p className="text-gray-600">A calm, non-clinical space designed for ease and safety.</p>
            </div>
          </div>

          <p className="mt-20 text-xl text-gray-600 max-w-4xl mx-auto text-center font-display italic leading-relaxed">
            Oku was created as a gentle refuge for those <strong>who feel unseen</strong> in traditional therapy spaces. Whether you're unpacking generational pain, navigating identity, or simply seeking to <strong>reconnect with yourself</strong>, we invite you to explore—<strong>without pressure or performance.</strong>
          </p>
        </div>
      </div>

      {/* Services List */}
      <div id="services" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-sm uppercase tracking-[0.4em] font-black text-oku-purple mb-16 text-center">Our Offerings</h2>
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {[
              { title: "Individual Therapy", tags: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative"] },
              { title: "Trauma & EMDR", tags: ["EMDR Certified", "Somatic-Aware", "Gentle Pace"] },
              { title: "Movement Therapy", tags: ["Body-Led", "Somatic Integration", "Accessible"] },
              { title: "Psychometric Assessments", tags: ["RCI Certified", "Insight-Led", "Evidence-Based"] },
              { title: "Couples & Group Work", tags: ["Relational", "Inclusive", "Safer Spaces"] },
              { title: "Queer-Affirmative Care", tags: ["Affirming", "Lived Understanding", "Aware"] }
            ].map((service, i) => (
              <div key={i} className="border-l-4 border-gray-900 pl-8 group">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-oku-purple transition-colors">{i+1}. {service.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualified Section */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple mb-4 block">Our Standard</span>
              <h2 className="text-5xl font-display font-bold text-gray-900 mb-8 tracking-tighter">
                Qualified, ethical, and <br />
                <span className="underline decoration-wavy decoration-oku-purple/30">deeply human.</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-display italic">
                <p>
                  Every therapist at Oku is professionally trained including RCI Licensed Clinical Psychologists and psychodynamic therapists.
                </p>
                <p>
                  We combine clinical precision with cultural humility, ensuring your mental health is in grounded, ethical hands.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-oku-purple/10 rounded-[3rem] rotate-3 -z-10" />
              <img 
                src="https://okutherapy.com/wp-content/uploads/2025/06/Vector-1.png" 
                alt="Qualified and Ethical" 
                className="w-full h-auto rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gray-900 text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-oku-purple/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-display font-bold mb-8 tracking-tighter">Ready to begin?</h2>
          <p className="text-2xl mb-12 text-gray-400 font-script italic">"It's okay to take your time."</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/therapists"
              className="bg-white text-gray-900 px-10 py-5 rounded-full text-lg font-bold hover:bg-oku-purple hover:text-white transition-all shadow-xl"
            >
              Book a trial session
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-transparent border border-white/20 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/5 transition-all"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
