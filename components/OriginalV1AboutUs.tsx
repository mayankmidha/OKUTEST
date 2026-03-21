'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react'

export default function OriginalV1AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Our Story</span>
            </div>
            <h1 className="text-6xl font-display font-bold text-gray-900 mb-8 tracking-tighter leading-[0.9]">
              The <span className="italic font-script text-oku-purple lowercase text-5xl md:text-7xl">heart</span> behind <br />
              <span className="underline decoration-wavy decoration-oku-purple/30">oku therapy.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-display italic leading-relaxed">
              OKU (奥) is a Japanese word that means "the innermost," "the depths," or "the place within." 
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-oku-purple/5 rounded-[3rem] -rotate-3 -z-10" />
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Group-21-1024x520.png" 
              alt="OKU Therapy Team" 
              className="w-full h-auto rounded-[3rem] shadow-2xl"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-24">
          <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
            <p>
              It speaks to the quiet spaces we all carry — layered, tender, and often unseen. At Oku Therapy, we offer a place for those parts.
            </p>
            <p>
              We don't believe healing is about becoming someone new. We believe it's about returning — gently, slowly — to what has always lived inside you.
            </p>
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 my-12">
               <p className="font-display italic text-2xl text-gray-900 text-center">
                 "Whether you come carrying grief, trauma, identity questions, or a quiet ache you can't quite name, this is a space to pause, reflect, and begin again."
               </p>
            </div>
            <p>
              Oku was created as a gentle refuge for those who feel unseen in traditional therapy spaces. We combine clinical precision with cultural humility, ensuring your journey is held in grounded, ethical hands.
            </p>
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/therapists"
              className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-oku-purple transition-all shadow-xl"
            >
              Begin your journey
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-sm uppercase tracking-[0.4em] font-black text-oku-purple mb-16 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-oku-purple/10 rounded-2xl flex items-center justify-center text-oku-purple mx-auto mb-6 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                <Heart size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Inclusive Care</h3>
              <p className="text-gray-600">We honor all identities, experiences, and unique paths to healing.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-oku-purple/10 rounded-2xl flex items-center justify-center text-oku-purple mx-auto mb-6 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Gentle Pace</h3>
              <p className="text-gray-600">We move at the speed your story needs, never rushing the process.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-oku-purple/10 rounded-2xl flex items-center justify-center text-oku-purple mx-auto mb-6 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Ethical Hands</h3>
              <p className="text-gray-600">Clinical precision combined with deep cultural humility and awareness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
