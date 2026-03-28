'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/about-us' },
    { name: 'Collective', href: '/therapists' },
    { name: 'Services', href: '/services' },
    { name: 'Assessments', href: '/assessments' },
    { name: 'Ecosystem', href: '/insurance' },
    { name: 'Blog', href: '/blog' },
  ];

  // Don't show public header on dashboard or auth routes
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/practitioner') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname === '/consent'
  ) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4' 
          : 'py-6'
      }`}
    >
      <style>{`
        .nav-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .nav-link-text {
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div
          className={`flex justify-between items-center rounded-full border px-6 md:px-8 transition-all duration-500 ${
            isScrolled
              ? 'bg-white/85 backdrop-blur-2xl border-oku-taupe/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] py-4'
              : 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.04)] py-5'
          }`}
        >
          <Link href="/" className="nav-logo-text text-2xl text-oku-dark hover:opacity-70 transition-opacity">
            Oku
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`nav-link-text transition-colors ${
                pathname === link.href ? 'text-oku-dark opacity-100' : 'text-oku-dark/65 hover:text-oku-dark opacity-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-2 border-l border-oku-taupe/20 pl-8">
            {session ? (
              <Link 
                href="/dashboard" 
                className="bg-oku-dark text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-navy transition-all shadow-lg flex items-center gap-2"
              >
                <LayoutDashboard size={14} /> My Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link-text text-oku-dark/70 hover:text-oku-dark transition-colors">
                  Login
                </Link>
                <Link 
                  href="/therapists" 
                  className="bg-oku-dark text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-navy transition-all shadow-lg flex items-center gap-2"
                >
                  Book Consult <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-oku-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 overflow-hidden"
          >
            <div className="mt-4 rounded-[2rem] bg-white/95 backdrop-blur-2xl border border-oku-taupe/10 shadow-[0_24px_60px_rgba(0,0,0,0.08)] px-8 py-10 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display text-oku-dark"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 border-t border-oku-taupe/5 flex flex-col gap-6">
                {session ? (
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-xl text-oku-purple font-medium"
                  >
                    <LayoutDashboard size={20} /> My Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-dark">Login</Link>
                    <Link href="/therapists" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-purple">Book Consult</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
