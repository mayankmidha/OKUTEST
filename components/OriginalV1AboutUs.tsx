import Link from 'next/link'

export default function OriginalV1AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold">OKU Therapy</Link>
            <div className="flex space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-gray-900">Services</Link>
              <Link href="/about-us" className="text-gray-700 hover:text-gray-900">About Us</Link>
              <Link href="/people" className="text-gray-700 hover:text-gray-900">People</Link>
            </div>
          </div>
        </div>
      </nav>

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
            <Link 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-full text-base font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Begin your journey</span>
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl transition-all duration-300 group-hover:translate-x-2">›</span>
            </Link>
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
