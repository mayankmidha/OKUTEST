'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function BrandedNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  const dashboardHref = session?.user?.role === 'ADMIN' ? '/admin/dashboard' :
    session?.user?.role === 'THERAPIST' ? '/practitioner/dashboard' :
    '/dashboard/client'

  const navLinks = [
    { label: 'Therapists', href: '/therapists' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Assessments', href: '/assessments' },
    { label: 'Circles', href: '/circles' },
    { label: 'Journal', href: '/blog' },
    { label: 'For Therapists', href: '/for-therapists' },
    { label: 'About', href: '/about-us' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="relative z-[110] group shrink-0">
          <motion.img
            src="/wp-content/uploads/2025/07/Logoo.png"
            alt="OKU Therapy"
            className="h-8 md:h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
        </Link>

        {/* Desktop Pill Nav */}
        <motion.div
          className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-2xl border border-white/70 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {navLinks.map((link) => (
            <NavPill key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavPill>
          ))}
        </motion.div>

        {/* Desktop Actions */}
        <motion.div
          className="hidden lg:flex items-center gap-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {session ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={dashboardHref}
                className="bg-oku-dark text-white px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-oku-purple-dark transition-colors flex items-center gap-2"
              >
                Dashboard <ArrowRight size={13} />
              </Link>
            </motion.div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-dark/70 hover:text-oku-dark px-4 py-3 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/therapists"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-purple-dark px-5 py-3 rounded-full bg-oku-lavender/60 hover:bg-oku-lavender transition-colors"
              >
                Browse Therapists
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/signup"
                  className="bg-oku-dark text-white px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-oku-purple-dark transition-colors flex items-center gap-2"
                >
                  Start Free <ArrowRight size={13} />
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden relative z-[110] p-3.5 bg-white/80 backdrop-blur-md rounded-full border border-white/60 shadow-md"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={18} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[105] bg-white/95 backdrop-blur-xl pt-28 px-8 flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-5 text-3xl font-display font-bold text-oku-dark tracking-tighter border-b border-oku-darkgrey/5 hover:text-oku-purple-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-auto pb-12 flex flex-col gap-3 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              {/* Social proof blurb */}
              <p className="text-xs text-oku-darkgrey/40 font-bold italic mb-2">
                Sessions from ₹1,500/hr · First consult free
              </p>
              {session ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-5 rounded-2xl bg-oku-dark text-white text-center font-black text-[10px] uppercase tracking-widest"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-5 rounded-2xl border-2 border-oku-darkgrey/10 text-center font-black text-[10px] uppercase tracking-widest text-oku-dark"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/therapists"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-5 rounded-2xl bg-oku-lavender text-oku-purple-dark text-center font-black text-[10px] uppercase tracking-widest"
                  >
                    Browse Therapists
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-5 rounded-2xl bg-oku-dark text-white text-center font-black text-[10px] uppercase tracking-widest"
                  >
                    Start Free — No Card Needed
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavPill({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
        active ? 'bg-oku-dark text-white shadow-sm' : 'text-oku-dark/70 hover:text-oku-dark hover:bg-white/80'
      }`}
    >
      {children}
    </Link>
  )
}
