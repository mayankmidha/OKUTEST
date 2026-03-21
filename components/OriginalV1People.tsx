'use client'

import Link from 'next/link'
import { ArrowRight, Users, MessageSquare, Heart, Sparkles } from 'lucide-react'

export default function OriginalV1People() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-oku-purple/10 rounded-full mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Community</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 mb-6 tracking-tighter">
            You're not alone.
          </h1>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-8">
            We hold space for <br />
            <span className="italic font-script text-oku-purple lowercase text-5xl md:text-7xl underline decoration-wavy decoration-oku-purple/30">
              your belonging.
            </span>
          </h2>
          <p className="text-xl text-gray-600 mt-8 mb-12 max-w-2xl mx-auto font-display italic leading-relaxed">
            <strong>Oku | People</strong> is a collective space for those who ache for connection. A space to share the weight, find community, and gently begin again.
          </p>
          <Link 
            href="/auth/signup"
            className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-oku-purple transition-all shadow-xl"
          >
            Join our community
          </Link>
        </div>
      </div>

      {/* This space is for you if... */}
      <div className="bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">A refuge for the unseen.</h2>
            <p className="text-oku-taupe font-display italic text-lg">This space is for you if...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "You've felt like too much in traditional spaces",
              "Your body remembers what words cannot express",
              "You've never seen yourself fully reflected",
              "You carry generational weight and stories",
              "Your queerness has been misunderstood",
              "Your healing doesn't follow a straight line",
              "You're new to therapy and want to begin gently",
              "You want more than just coping tools",
              "You seek a connection that feels like home"
            ].map((text, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-oku-purple/20 flex items-center justify-center text-oku-purple">
                  <Sparkles size={12} />
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Our Gatherings</h2>
            <p className="text-lg text-gray-600 leading-relaxed italic">
              Beyond one-on-one therapy, we host community circles, support groups, and workshops designed to foster collective healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="p-12 rounded-[3.5rem] bg-oku-purple/5 border border-oku-purple/10">
              <Users className="text-oku-purple mb-6" size={40} />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Collective Circles</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Facilitated small group sessions focusing on shared experiences—from grief to identity.
              </p>
              <Link href="/auth/signup" className="text-oku-purple font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:translate-x-2 transition-transform">
                Get Notified of Circles <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-12 rounded-[3.5rem] bg-gray-900 text-white shadow-2xl">
              <MessageSquare className="text-oku-purple mb-6" size={40} />
              <h3 className="text-2xl font-display font-bold mb-4">Digital Community</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                A private, safe space for our clients to connect, share resources, and support each other.
              </p>
              <Link href="/auth/signup" className="text-oku-purple font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:translate-x-2 transition-transform">
                Join the Platform <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-display font-bold text-gray-900 mb-8 tracking-tighter">Ready to find your people?</h2>
          <p className="text-2xl mb-12 text-oku-taupe font-script italic">"You don't have to walk this path alone."</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/therapists"
              className="bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-oku-purple transition-all shadow-xl"
            >
              Start with a consultation
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-white text-gray-900 border border-gray-200 px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-50 transition-all"
            >
              Join the community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
