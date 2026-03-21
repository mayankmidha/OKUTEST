'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()

  // Don't show global header in telehealth session mode
  if (pathname.startsWith('/session/')) return null

  const isActive = (path: string) => pathname === path ? 'text-oku-dark font-bold' : 'text-oku-taupe hover:text-oku-dark'

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-oku-cream/95 backdrop-blur-sm border-b border-oku-taupe/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-10 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/services" className={`${isActive('/services')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>Services</Link>
            <Link href="/assessments" className={`${isActive('/assessments')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>Assessments</Link>
            <Link href="/therapists" className={`${isActive('/therapists')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>Therapists</Link>
            <Link href="/about-us" className={`${isActive('/about-us')} transition-colors text-[10px] uppercase tracking-[0.4em] font-black`}>About Us</Link>
            
            <div className="h-6 w-px bg-oku-taupe/10 mx-2" />

            {status === 'authenticated' ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-oku-taupe/10 hover:shadow-md transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-oku-purple/20 flex items-center justify-center text-oku-purple">
                    <User size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-oku-dark truncate max-w-[100px]">
                    {session.user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-oku-taupe/10 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-cream hover:text-oku-dark transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-cream hover:text-oku-dark transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={14} /> Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-oku-red hover:bg-oku-red/5 transition-colors border-t border-oku-taupe/5"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-oku-dark text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.4em] font-black hover:bg-oku-purple transition-all shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
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
                href="/assessments" 
                className={`${isActive('/assessments')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assessments
              </Link>
              <Link 
                href="/therapists" 
                className={`${isActive('/therapists')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Therapists
              </Link>
              <Link 
                href="/about-us" 
                className={`${isActive('/about-us')} block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              {status === 'authenticated' ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-red"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-6 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
