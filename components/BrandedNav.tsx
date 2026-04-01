'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function BrandedNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Unified Logo */}
        <Link href="/" className="relative z-[110] group">
          <img 
            src="/uploads/uploads/2025/07/Logoo.png" 
            alt="OKU Therapy" 
            className="h-8 md:h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        </Link>

        {/* High-End Pill Navigation */}
        <div className="hidden lg:flex items-center gap-2 bg-white/40 backdrop-blur-2xl border border-white/60 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <NavLink href="/circles">Circles</NavLink>
          <NavLink href="/assessments">Assessments</NavLink>
          <NavLink href="/therapists">Therapists</NavLink>
          <NavLink href="/about-us">About Us</NavLink>
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-dark hover:text-oku-purple px-6 transition-all">Identity</Link>
          <Link href="/auth/signup" className="bg-oku-dark text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-oku-purple-dark hover:scale-105 transition-all flex items-center gap-3">
            Book Consult <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden relative z-[110] p-4 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-lg">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[105] bg-oku-cream pt-32 px-8 flex flex-col gap-8 lg:hidden"
          >
            <MobileNavLink href="/circles" onClick={() => setMobileMenuOpen(false)}>Circles</MobileNavLink>
            <MobileNavLink href="/assessments" onClick={() => setMobileMenuOpen(false)}>Assessments</MobileNavLink>
            <MobileNavLink href="/therapists" onClick={() => setMobileMenuOpen(false)}>Therapists</MobileNavLink>
            <MobileNavLink href="/about-us" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
            <div className="mt-auto pb-12 flex flex-col gap-4">
                <Link href="/auth/login" className="w-full py-6 rounded-3xl border border-oku-taupe/10 text-center font-black text-[10px] uppercase tracking-widest text-oku-dark">Sign In</Link>
                <Link href="/auth/signup" className="w-full py-6 rounded-3xl bg-oku-dark text-white text-center font-black text-[10px] uppercase tracking-widest">Begin Journey</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-oku-dark hover:bg-white transition-all">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
      {children}
    </Link>
  )
}
