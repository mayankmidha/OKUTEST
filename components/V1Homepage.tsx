import Link from 'next/link'

export default function V1Homepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">OKU Therapy</div>
            <div className="flex space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-gray-900">Services</Link>
              <Link href="/about-us" className="text-gray-700 hover:text-gray-900">About Us</Link>
              <Link href="/people" className="text-gray-700 hover:text-gray-900">People</Link>
            </div>
            <Link 
              href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Book a free 1:1 consultation
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          OKU Therapy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oku is a psychotherapy collective offering inclusive, trauma-informed care for all parts of who you are. Book a free consultation to begin gently.
        </p>
        <Link 
          href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Book a free 1:1 consultation
        </Link>
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

      {/* Services Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Services</h2>
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
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to begin?</h2>
          <p className="text-xl mb-8 text-gray-300">"It's okay to take your time."</p>
          <Link 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Book a free 1:1 consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
