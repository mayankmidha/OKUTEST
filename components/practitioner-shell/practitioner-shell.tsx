'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Users, Clock, Settings, 
  ChevronRight, LogOut, Bell, Search,
  LayoutDashboard, UserCircle, Briefcase, MessageSquare, HelpCircle, Brain, FileText,
  Menu, X, User as UserIcon, Pill, Receipt, Building2
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
    { href: '/practitioner/billing', label: 'Billing & Claims', icon: <Receipt size={18} strokeWidth={1.5} /> },
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
    <div className="min-h-screen bg-oku-cream font-sans text-oku-dark selection:bg-oku-purple/20">
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-oku-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-oku-sage/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar - Hidden on mobile, visible on XL */}
        <aside className="w-80 border-r border-oku-taupe/5 bg-white/40 backdrop-blur-3xl hidden xl:flex flex-col sticky top-0 h-screen">
          <div className="p-10">
            <Link href="/practitioner/dashboard" className="block mb-12">
               <img src="/uploads/2025/07/Logoo.png" alt="OKU" className="h-8 w-auto grayscale brightness-0 opacity-80" />
            </Link>

            <nav className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-4 opacity-40">Clinical Workspace</p>
              {navLinks.map((link) => {
                const active = isActiveLink(currentPath, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group ${
                      active 
                      ? 'bg-oku-dark text-white shadow-2xl shadow-oku-dark/10' 
                      : 'text-oku-taupe hover:bg-white hover:text-oku-dark hover:shadow-xl hover:shadow-oku-taupe/5'
                    }`}
                  >
                    <div className={active ? 'text-oku-purple' : 'group-hover:text-oku-purple transition-colors'}>
                        {link.icon}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto p-10 border-t border-oku-taupe/5">
             <div className="bg-oku-dark rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer">
                <div className="relative z-10 flex items-center justify-between">
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Support</p>
                      <p className="text-xs font-bold">Clinical Help Desk</p>
                   </div>
                   <ChevronRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-oku-purple/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
             </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-oku-dark/40 backdrop-blur-sm z-[60] xl:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] xl:hidden flex flex-col shadow-2xl"
              >
                <div className="p-8 flex-1 overflow-y-auto">
                   <div className="flex justify-between items-center mb-10">
                      <img src="/uploads/2025/07/Logoo.png" alt="OKU" className="h-6 w-auto grayscale brightness-0" />
                      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-oku-taupe hover:text-oku-dark">
                         <X size={20} />
                      </button>
                   </div>
                   <nav className="space-y-1">
                      {navLinks.map((link) => {
                        const active = isActiveLink(currentPath, link.href)
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
                              active ? 'bg-oku-dark text-white' : 'text-oku-taupe hover:bg-oku-cream'
                            }`}
                          >
                            <div className={active ? 'text-oku-purple' : ''}>{link.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                          </Link>
                        )
                      })}
                   </nav>
                </div>
                <div className="p-8 border-t border-oku-taupe/5">
                   <button 
                     onClick={() => signOut({ callbackUrl: '/' })}
                     className="w-full py-4 bg-oku-cream text-oku-dark rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     <LogOut size={16} /> Logout
                   </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="h-20 md:h-24 border-b border-oku-taupe/5 bg-white/20 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="xl:hidden p-2 -ml-2 text-oku-dark hover:bg-white/40 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>
                <Link href="/practitioner/dashboard" className="xl:hidden">
                    <span className="text-xl font-black text-oku-dark">O.</span>
                </Link>
                <div className="hidden md:flex items-center gap-4 bg-oku-cream-warm/40 px-6 py-2.5 rounded-full border border-oku-taupe/5">
                    <Search size={14} className="text-oku-taupe opacity-40" />
                    <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none text-[11px] font-medium placeholder:text-oku-taupe/40 w-40 lg:w-64" />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {headerActions}
              <div className="h-8 w-px bg-oku-taupe/10 mx-1 hidden sm:block" />
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-oku-taupe/5 flex items-center justify-center text-oku-taupe hover:text-oku-dark transition-colors relative">
                  <Bell size={18} strokeWidth={1.5} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-oku-purple rounded-full border-2 border-white" />
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:flex w-12 h-12 rounded-2xl bg-oku-dark text-white items-center justify-center hover:bg-oku-purple-dark transition-all"
              >
                  <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Page Hero Section */}
          <div className="p-4 md:p-10 pb-2 md:pb-4">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-[2.5rem] md:rounded-[3.5rem] bg-white p-8 md:p-12 lg:p-16 border border-oku-taupe/5 shadow-sm relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 md:gap-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-3 rounded-full bg-oku-purple/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-oku-purple-dark border border-oku-purple/10 mb-6 md:mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-oku-purple animate-pulse" />
                    {badge}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-oku-dark tracking-tighter leading-[0.9]">
                    {title}
                  </h1>
                  <p className="mt-6 md:mt-8 text-base md:text-lg font-display italic text-oku-taupe max-w-2xl leading-relaxed opacity-70">
                    {description}
                  </p>
                </div>

                {heroActions && <div className="flex flex-wrap gap-3 md:gap-4">{heroActions}</div>}
              </div>

              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-oku-purple/5 rounded-full blur-[80px] md:blur-[100px] translate-x-1/4 -translate-y-1/4" />
            </motion.section>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-10 pt-4 md:pt-6">
            {children}
          </div>

          <footer className="p-8 pt-0 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-oku-taupe opacity-30 text-center">
             Clinical Excellence • Privacy Preserved • OKU Protocol v2.5
          </footer>
        </main>
      </div>
    </div>
  )
}

export function PractitionerLoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6 md:p-10">
      <div className="text-center space-y-4 md:space-y-6">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-oku-purple/20 border-t-oku-purple rounded-full animate-spin mx-auto" />
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-oku-taupe animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export function PractitionerSectionCard({
  action,
  actions,
  children,
  className = '',
  description,
  title,
}: {
  action?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  description?: string
  title: string
}) {
  return (
    <section className={`bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-oku-taupe/5 shadow-sm hover:shadow-xl transition-all duration-700 ${className}`}>
      <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-oku-dark tracking-tight">{title}</h2>
          {description && <p className="mt-1 md:mt-2 text-xs md:text-sm text-oku-taupe font-display italic opacity-60">{description}</p>}
        </div>
        {(action || actions) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 md:gap-3">
            {action}
            {actions}
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

export function PractitionerStatCard({ accent = 'bg-oku-purple', detail, label, value }: { accent?: string, detail?: string, label: string, value: string | number }) {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white shadow-sm hover:shadow-2xl transition-all duration-500 group">
      <div className={`h-1 w-10 md:h-1.5 md:w-12 rounded-full mb-6 md:mb-8 opacity-40 group-hover:opacity-100 transition-all duration-500 ${accent}`} />
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-1 md:mb-2">{label}</p>
      <p className="text-3xl md:text-4xl font-display font-bold text-oku-dark tracking-tighter">{value}</p>
      {detail && <p className="mt-3 md:mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-60">{detail}</p>}
    </div>
  )
}

export function PractitionerActionTile({
  description,
  href,
  icon,
  title,
}: {
  description: string
  href: string
  icon: ReactNode
  title: string
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-oku-taupe/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-oku-cream flex items-center justify-center text-oku-dark group-hover:bg-oku-dark group-hover:text-white transition-all duration-500 mb-8 md:mb-10 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg md:text-xl font-display font-bold text-oku-dark mb-1 md:mb-2">{title}</h3>
        <p className="text-xs md:text-sm text-oku-taupe font-display italic leading-relaxed opacity-60">{description}</p>
      </div>
      <div className="mt-8 md:mt-10 flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-40 group-hover:opacity-100 transition-all">
        Open Workspace <ChevronRight size={12} />
      </div>
    </Link>
  )
}

export function PractitionerPill({
  children,
  tone = 'purple',
}: {
  children: ReactNode
  tone?: 'purple' | 'sage' | 'pink' | 'dark'
}) {
  const styles = {
    purple: 'bg-oku-purple/10 text-oku-purple-dark border-oku-purple/10',
    sage: 'bg-oku-sage/10 text-oku-dark border-oku-sage/10',
    pink: 'bg-oku-pink/10 text-oku-dark border-oku-pink/10',
    dark: 'bg-oku-dark text-white border-oku-dark',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest ${styles[tone]}`}>
      {children}
    </span>
  )
}
