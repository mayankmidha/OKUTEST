import Link from 'next/link'

export default function V1Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-12 w-auto"
              width="558"
              height="96"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/#services" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Services
            </Link>
            <Link 
              href="/about-us" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/people" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              People
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
