'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path ? 'text-oku-dark font-bold' : 'text-oku-taupe hover:text-oku-dark'

  return (
    <header className="sticky top-0 z-50 bg-oku-cream/95 backdrop-blur-sm border-b border-oku-taupe/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-display text-2xl font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
              OKU Therapy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <Link href="/services" className={`${isActive('/services')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>Services</Link>
            <Link href="/about-us" className={`${isActive('/about-us')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>About Us</Link>
            <Link href="/people" className={`${isActive('/people')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>People</Link>
            <Link href="/auth/login" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-purple hover:text-oku-dark transition-colors">
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col gap-1"
            >
              <span className={`w-6 h-0.5 bg-oku-dark transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-oku-dark transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-oku-dark transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-oku-cream border-t border-oku-taupe/20">
            <nav className="flex flex-col py-4 space-y-4">
              <Link 
                href="/services" 
                className={`${isActive('/services')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/about-us" 
                className={`${isActive('/about-us')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/people" 
                className={`${isActive('/people')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                People
              </Link>
              <Link 
                href="/auth/login" 
                className="block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-purple"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
