'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';

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
    { name: 'Collective', href: '/people' },
    { name: 'Services', href: '/services' },
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
          ? 'bg-white/80 backdrop-blur-xl border-b border-oku-taupe/10 py-4 shadow-sm' 
          : 'bg-transparent py-6'
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

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex justify-between items-center">
        <Link href="/" className="nav-logo-text text-2xl text-oku-dark hover:opacity-70 transition-opacity">
          Oku
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`nav-link-text text-oku-dark hover:text-oku-purple transition-colors ${
                pathname === link.href ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-6 ml-4 border-l border-oku-taupe/20 pl-10">
            {session ? (
              <Link 
                href="/dashboard" 
                className="bg-oku-dark text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-navy transition-all shadow-lg flex items-center gap-2"
              >
                <LayoutDashboard size={14} /> My Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link-text text-oku-dark opacity-60 hover:opacity-100">
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-oku-dark text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-navy transition-all shadow-lg flex items-center gap-2"
                >
                  Start Journey <ChevronRight size={14} />
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-oku-taupe/10 overflow-hidden"
          >
            <div className="px-8 py-12 flex flex-col gap-8">
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
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-purple">Sign Up</Link>
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
