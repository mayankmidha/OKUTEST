'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Users, Clock, Settings, 
  ChevronRight, LogOut, Bell, Search,
  LayoutDashboard, UserCircle, Briefcase, MessageSquare, HelpCircle, Brain, FileText,
  Menu, X, User as UserIcon, Pill, Receipt, Building2, Sparkles, Activity
} from 'lucide-react'
import { signOut } from 'next-auth/react'

type PractitionerNavLink = {
  href: string
  label: string
  icon: ReactNode
}

type PractitionerShellProps = {
  badge: string
  children: ReactNode
  currentPath: string
  description: string
  headerActions?: ReactNode
  heroActions?: ReactNode
  title: string
  canPostBlogs?: boolean
}

const getNavLinks = (canPostBlogs: boolean): PractitionerNavLink[] => {
  const links = [
    { href: '/practitioner/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { href: '/practitioner/appointments', label: 'Schedule', icon: <Calendar size={18} strokeWidth={1.5} /> },
    { href: '/practitioner/clients', label: 'Patients', icon: <Users size={18} strokeWidth={1.5} /> },
    { href: '/practitioner/billing', label: 'Billing', icon: <Receipt size={18} strokeWidth={1.5} /> },
    { href: '/practitioner/messages', label: 'Messages', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { href: '/practitioner/intelligence', label: 'Intelligence', icon: <Brain size={18} strokeWidth={1.5} /> },
  ]

  if (canPostBlogs) {
    links.push({ href: '/practitioner/blogs', label: 'Blogs', icon: <FileText size={18} strokeWidth={1.5} /> })
  }

  links.push({ href: '/practitioner/profile', label: 'Profile', icon: <UserIcon size={18} strokeWidth={1.5} /> })
  links.push({ href: '/practitioner/support', label: 'Support', icon: <HelpCircle size={18} strokeWidth={1.5} /> })

  return links
}

function isActiveLink(currentPath: string, href: string) {
  if (currentPath === href) return true
  return currentPath.startsWith(`${href}/`)
}

export function PractitionerShell({
  badge,
  children,
  currentPath,
  description,
  headerActions,
  heroActions,
  title,
  canPostBlogs = false,
}: PractitionerShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navLinks = getNavLinks(canPostBlogs)

  return (
    <div className="min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      {/* 3D Background Objects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-oku-blush/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-oku-mint/10 rounded-full blur-[120px] animate-float-3d" />
      </div>

      <div className="relative flex min-h-screen z-10">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-88 min-h-screen flex-col sticky top-0 p-2 overflow-hidden">
           <div className="flex flex-col h-full bg-gradient-to-b from-oku-lavender/80 to-oku-blush/80 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/60 m-4 shadow-2xl">
              <div className="px-4 py-8 flex items-center justify-between">
                <Link href="/" className="block group animate-float-3d">
                  <img 
                    src="/uploads/2025/07/Logoo.png" 
                    alt="OKU" 
                    className="h-10 w-auto opacity-90"
                  />
                </Link>
              </div>

              <nav className="flex-1 space-y-3 px-2 overflow-y-auto mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-8 ml-4">Clinical</p>
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const active = isActiveLink(currentPath, link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="relative group block"
                      >
                        <div className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ${
                          active 
                            ? 'bg-white shadow-xl scale-[1.05] border border-white text-oku-darkgrey'
                            : 'text-oku-darkgrey/50 hover:bg-white/40 hover:translate-x-2'
                        }`}>
                          <div className="flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              active 
                              ? 'bg-oku-lavender shadow-inner' 
                              : 'bg-white/40 group-hover:bg-white'
                            }`}>
                               <div className={active ? 'text-oku-purple-dark' : 'text-oku-darkgrey/40 group-hover:text-oku-purple-dark'}>
                                  {link.icon}
                               </div>
                            </div>
                            <span className={`text-[11px] uppercase tracking-[0.2em] font-black ${active ? 'text-oku-darkgrey' : ''}`}>{link.label}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </nav>

              <div className="mt-auto pt-8">
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-pill-3d bg-white/80 border-oku-darkgrey/5 hover:bg-red-50 hover:text-red-500 transition-all w-full !py-4 text-[10px]"
                >
                  <LogOut size={14} strokeWidth={2} className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-2xl text-oku-darkgrey"
                >
                    <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-sm">
                    <Search size={14} className="text-oku-darkgrey/40" />
                    <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-oku-darkgrey/20 w-64" />
                </div>
            </div>

            <div className="flex items-center gap-4">
              {headerActions}
              <button className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-sm flex items-center justify-center text-oku-darkgrey/40 hover:text-oku-purple-dark transition-all relative">
                  <Bell size={18} strokeWidth={1.5} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-oku-purple-dark rounded-full border-2 border-white animate-pulse" />
              </button>
            </div>
          </header>

          <div className="p-10">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="chip bg-white/60 border-white/80">{badge}</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Clinical Intelligence</span>
                  </div>
                  <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter leading-[0.85]">
                    {title.split(' ')[0]} <span className="text-oku-purple-dark italic">{title.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 max-w-2xl leading-relaxed">
                    {description}
                  </p>
                </div>
                {heroActions && <div className="flex flex-wrap gap-4">{heroActions}</div>}
              </div>
            </motion.section>

            {children}
          </div>

          <footer className="p-12 pt-0 text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/20 text-center">
             Sanctuary Operations • Clinical Excellence • v3.5
          </footer>
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-oku-darkgrey/20 backdrop-blur-sm z-[100]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-[110]"
            >
               <div className="flex flex-col h-full bg-gradient-to-b from-oku-lavender to-oku-blush p-6 m-4 rounded-[3rem] shadow-2xl">
                  <div className="px-4 py-8 flex justify-between items-center">
                    <img src="/uploads/2025/07/Logoo.png" alt="OKU" className="h-8 w-auto" />
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/40 rounded-2xl">
                       <X size={20} className="text-oku-darkgrey" />
                    </button>
                  </div>
                  <nav className="flex-1 space-y-2 px-2 mt-8 overflow-y-auto">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-5 p-4 rounded-2xl transition-all ${
                          isActiveLink(currentPath, link.href) ? 'bg-white shadow-lg text-oku-darkgrey' : 'text-oku-darkgrey/50'
                        }`}
                      >
                        {link.icon}
                        <span className="text-[11px] font-black uppercase tracking-widest">{link.label}</span>
                      </Link>
                    ))}
                  </nav>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
