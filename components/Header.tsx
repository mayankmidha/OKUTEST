'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show global header in telehealth session mode
  if (pathname.startsWith('/session/')) return null

  const isActive = (path: string) => pathname === path 
    ? 'text-oku-dark border-b-2 border-oku-purple' 
    : 'text-oku-taupe hover:text-oku-dark hover:border-b-2 hover:border-oku-purple/30'

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'py-4 bg-oku-page-bg/80 backdrop-blur-xl border-b border-oku-taupe/10 shadow-sm' 
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-50">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-12 w-auto transition-transform duration-500 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {['Services', 'Assessments', 'Therapists', 'About Us'].map((item) => {
              let href = `/${item.toLowerCase().replace(' ', '-')}`
              
              if (status === 'authenticated' && session?.user?.role === 'CLIENT') {
                if (item === 'Therapists') href = '/dashboard/client/therapists'
                if (item === 'Assessments') href = '/dashboard/client/clinical'
              }

              return (
                <Link 
                  key={item}
                  href={href} 
                  className={`${isActive(href)} transition-all duration-300 text-[11px] uppercase tracking-[0.3em] font-medium py-1`}
                >
                  {item}
                </Link>
              )
            })}
            
            <div className="h-4 w-px bg-oku-taupe/20 mx-2" />

            {status === 'authenticated' ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-oku-taupe/10 hover:shadow-lg hover:bg-white/60 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-full bg-oku-purple/30 flex items-center justify-center text-oku-dark/70 border border-oku-purple/20">
                    <User size={14} />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-oku-dark truncate max-w-[120px]">
                    {session.user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-500 text-oku-taupe ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-oku-taupe/10 py-3 overflow-hidden"
                    >
                      <Link 
                        href="/dashboard"
                        className="flex items-center gap-4 px-6 py-4 text-[11px] font-medium uppercase tracking-widest text-oku-taupe hover:bg-oku-purple/10 hover:text-oku-dark transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} strokeWidth={1.5} /> Dashboard
                      </Link>
                      <Link 
                        href="/dashboard/profile"
                        className="flex items-center gap-4 px-6 py-4 text-[11px] font-medium uppercase tracking-widest text-oku-taupe hover:bg-oku-blue/10 hover:text-oku-dark transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} strokeWidth={1.5} /> Profile
                      </Link>
                      <div className="h-px bg-oku-taupe/5 mx-4 my-1" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-medium uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={16} strokeWidth={1.5} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link href="/auth/login" className="text-[11px] uppercase tracking-[0.3em] font-medium text-oku-taupe hover:text-oku-dark transition-all duration-300">
                  Login
                </Link>
                <Link href="/auth/signup" className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-oku-purple via-oku-blue to-oku-pink rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <button className="relative bg-oku-dark text-oku-page-bg px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-oku-dark/90 transition-all shadow-xl">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-oku-dark hover:bg-oku-taupe/5 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-40 bg-oku-page-bg md:hidden pt-32 px-12"
            >
              <nav className="flex flex-col space-y-8">
                {['Services', 'Assessments', 'Therapists', 'About Us'].map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item}
                  >
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`} 
                      className="text-4xl font-display text-oku-dark hover:text-oku-purple transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="h-px bg-oku-taupe/10 w-full my-4" 
                />
                
                {status === 'authenticated' ? (
                  <div className="flex flex-col space-y-6">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-taupe hover:text-oku-dark">Dashboard</Link>
                    <button onClick={handleLogout} className="text-xl font-medium text-red-400 text-left">Logout</button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-6">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-taupe">Login</Link>
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-oku-purple">Sign Up</Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
