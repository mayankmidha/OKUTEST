'use client'

import Link from 'next/link'
import V1Header from './V1Header'

export default function OriginalV1People() {
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

        .dynamic-button.bg-white {
          color: #2D2D2D;
        }

        .dynamic-button.bg-white:hover {
          color: white;
        }

        .dynamic-button.bg-white::before {
          background-color: white;
        }

        .dynamic-button.bg-white::after {
          background-color: #2D2D2D;
        }
      `}</style>

      <V1Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <b>You're not alone.</b>
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            We hold space for
          </h2>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 underline decoration-wavy decoration-gray-400">
              your belonging
            </h2>
          </div>
          <p className="text-xl text-gray-600 mt-8 mb-8 max-w-2xl mx-auto">
            <strong>Oku | People</strong> is a collective space for those who ache for connection. A space to share the weight, find community, and gently begin again.
          </p>
          <a 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="dynamic-button inline-block"
          >
            Join our community
          </a>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Community</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Placeholder for community members - you can add actual people here */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Community Member</h3>
              <p className="text-gray-600 text-center text-sm">Finding healing through connection</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Community Member</h3>
              <p className="text-gray-600 text-center text-sm">Sharing stories, building understanding</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Community Member</h3>
              <p className="text-gray-600 text-center text-sm">Growing together in gentle spaces</p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">This space is for you if...</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You've felt like too much in traditional spaces</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">Your body remembers what words cannot express</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You've never seen yourself fully reflected</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You carry generational weight and stories</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">Your queerness has been questioned or misunderstood</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You've lived between cultures and identities</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">Your healing doesn't follow a straight line</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You're new to therapy and want to begin gently</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-xl">•</span>
                <p className="text-gray-700">You want more than just coping tools and strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your people?</h2>
          <p className="text-xl mb-8 text-gray-300">You don't have to walk this path alone.</p>
          <div className="space-y-4">
            <a 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="dynamic-button inline-block bg-white text-gray-900"
            >
              Start with a consultation
            </a>
            <div className="text-gray-400">
              <p>Or join our community gatherings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
