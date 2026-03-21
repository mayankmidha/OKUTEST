'use client'

import Link from 'next/link'
import V1Header from './V1Header'

export default function OriginalV1People() {
  return (
    <div className="min-h-screen bg-white">
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
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
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
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start with a consultation
            </a>
            <div className="text-gray-400">
              <p>Or join our community gatherings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="text-gray-600 hover:text-gray-900">Individual Therapy</Link></li>
                <li><Link href="/services" className="text-gray-600 hover:text-gray-900">Trauma & EMDR</Link></li>
                <li><Link href="/services" className="text-gray-600 hover:text-gray-900">Movement Therapy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link href="/about-us" className="text-gray-600 hover:text-gray-900">Our Story</Link></li>
                <li><Link href="/people" className="text-gray-600 hover:text-gray-900">Our People</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/assessments" className="text-gray-600 hover:text-gray-900">Assessments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://wa.me/919953879928" className="text-gray-600 hover:text-gray-900">WhatsApp</a></li>
                <li><a href="mailto:hello@okutherapy.com" className="text-gray-600 hover:text-gray-900">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 OKU Therapy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
