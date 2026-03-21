'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSession } from 'next-auth/react'

export default function WordPressHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    getSession().then(setSession)
  }, [pathname])

  const isActive = (path: string) => pathname === path ? 'text-oku-dark font-bold' : 'text-oku-taupe hover:text-oku-dark'

  return (
    <header className="sticky top-0 z-50 bg-oku-cream/90 backdrop-blur-sm border-b border-oku-taupe/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-oku-dark flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-5 h-5 text-oku-dark" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 2.235.755 4.3 2.022 5.95.36.48.754.934 1.175 1.356C4.477 19.245 7.077 20 10 20c2.923 0 5.523-.755 7.803-2.694.421-.422.815-.876 1.175-1.356C19.245 14.3 20 12.235 20 10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold text-oku-dark">OKU Therapy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className={isActive('/services')}>Services</Link>
            <Link href="/about-us" className={isActive('/about-us')}>About Us</Link>
            <Link href="/people" className={isActive('/people')}>People</Link>
          </nav>

          {/* CTA / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={session.user.role === 'THERAPIST' ? '/practitioner/dashboard' : '/dashboard'}
                  className="text-oku-dark font-medium hover:text-oku-purple transition-colors"
                >
                  Dashboard
                </Link>
                <button onClick={() => {}} className="text-sm text-oku-taupe hover:text-oku-dark transition-colors">
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-oku-dark hover:text-oku-taupe transition-colors font-medium">
                  Log in
                </Link>
                <Link 
                  href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-oku-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-oku-taupe transition-colors"
                >
                  Book Consultation
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 z-50 relative"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-oku-dark transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-oku-dark transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-oku-dark transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`fixed inset-0 bg-oku-cream/95 backdrop-blur-sm transition-all duration-300 md:hidden z-40 flex items-center justify-center ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <nav className="flex flex-col items-center gap-8 text-center p-6">
            <Link href="/services" onClick={() => setIsOpen(false)} className="text-2xl font-display text-oku-dark">Services</Link>
            <Link href="/about-us" onClick={() => setIsOpen(false)} className="text-2xl font-display text-oku-dark">About Us</Link>
            <Link href="/people" onClick={() => setIsOpen(false)} className="text-2xl font-display text-oku-dark">People</Link>
            
            <div className="w-12 h-0.5 bg-oku-taupe/20 my-2"></div>
            
            {session ? (
              <>
                <Link 
                  href={session.user.role === 'THERAPIST' ? '/practitioner/dashboard' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium text-oku-purple"
                >
                  Dashboard
                </Link>
                <button onClick={() => { setIsOpen(false); }} className="text-lg text-oku-taupe">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-xl font-medium text-oku-dark">
                  Log in
                </Link>
                <Link 
                  href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
                  onClick={() => setIsOpen(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium"
                >
                  Book Consultation
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
