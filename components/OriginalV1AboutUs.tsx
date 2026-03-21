'use client'

import Link from 'next/link'
import V1Header from './V1Header'

export default function OriginalV1AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        .dynamic-button {
          display: inline-block;
          padding: 8px 40px;
          background-color: transparent;
          color: #2D2D2D;
          text-decoration: none;
          border-radius: 1050px;
          font-family: 'Helvetica', Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          border: 1px solid #2D2D2D;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          cursor: pointer;
        }

        .dynamic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #2D2D2D;
          border-radius: 50px;
          transform: scale(1);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .dynamic-button::after {
          content: '›';
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%) scale(0);
          background-color: #2D2D2D;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .dynamic-button:hover {
          color: #2D2D2D;
          padding-right: 70px;
        }

        .dynamic-button:hover::before {
          transform: scale(0);
        }

        .dynamic-button:hover::after {
          transform: translateY(-50%) scale(1);
          opacity: 1;
        }
      `}</style>

      <V1Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <b>The heart</b> behind
            </h1>
            <div className="relative">
              <h2 className="text-4xl font-bold text-gray-900 underline decoration-wavy decoration-gray-400">
                oku therapy
              </h2>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Group-21-1024x520.png" 
              alt="OKU Therapy" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              OKU (奥) is a Japanese word that means "the innermost," "the depths," or "the place within." It speaks to the quiet spaces we all carry — layered, tender, and often unseen.
            </p>
            <p>
              At Oku Therapy, we offer a place for those parts.
            </p>
            <p>
              We don't believe healing is about becoming someone new. We believe it's about returning — gently, slowly — to what has always lived inside you.
            </p>
            <p>
              Whether you come carrying grief, trauma, identity questions, or a quiet ache you can't quite name, this is a space to pause, reflect, and begin again — from the inside out.
            </p>
          </div>

          <div className="mt-12 text-center">
            <a 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="dynamic-button inline-block"
            >
              Begin your journey
            </a>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">♥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inclusive Care</h3>
              <p className="text-gray-600">We honor all identities, experiences, and paths to healing.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gentle Pace</h3>
              <p className="text-gray-600">We move at the speed your story needs, never rushing the process.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Relational Healing</h3>
              <p className="text-gray-600">We believe in the power of connection and shared humanity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
