'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Users, Clock, Settings, 
  ChevronRight, LogOut, Bell, Search,
  LayoutDashboard, UserCircle, Briefcase, MessageSquare, HelpCircle
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
}

const NAV_LINKS: PractitionerNavLink[] = [
  { href: '/practitioner/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/messages', label: 'Messages', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/appointments', label: 'Schedule', icon: <Calendar size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/clients', label: 'Patients', icon: <Users size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/intelligence', label: 'Intelligence', icon: <Brain size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/schedule', label: 'Hours', icon: <Clock size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/profile', label: 'Profile', icon: <UserCircle size={18} strokeWidth={1.5} /> },
  { href: '/practitioner/support', label: 'Support', icon: <HelpCircle size={18} strokeWidth={1.5} /> },
]

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
}: PractitionerShellProps) {
  return (
    <div className="min-h-screen bg-oku-cream font-sans text-oku-dark selection:bg-oku-purple/20">
      {/* Sophisticated Background Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-oku-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-oku-sage/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Modern Sidebar */}
        <aside className="w-80 border-r border-oku-taupe/5 bg-white/40 backdrop-blur-3xl hidden xl:flex flex-col sticky top-0 h-screen">
          <div className="p-10">
            <Link href="/" className="block mb-12">
               <img src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" alt="OKU" className="h-8 w-auto grayscale brightness-0 opacity-80" />
            </Link>

            <nav className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-4 opacity-40">Clinical Workspace</p>
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(currentPath, link.href)
                const renderedIcon = link.icon

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
                        {renderedIcon}
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

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="h-24 border-b border-oku-taupe/5 bg-white/20 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-6 xl:hidden">
                <Link href="/practitioner/dashboard">
                    <span className="text-2xl font-black text-oku-dark">O.</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-4 bg-oku-cream-warm/40 px-6 py-2.5 rounded-full border border-oku-taupe/5">
                <Search size={14} className="text-oku-taupe opacity-40" />
                <input type="text" placeholder="Search patients or sessions..." className="bg-transparent border-none outline-none text-[11px] font-medium placeholder:text-oku-taupe/40 w-64" />
            </div>

            <div className="flex items-center gap-4">
              {headerActions}
              <div className="h-10 w-px bg-oku-taupe/10 mx-2 hidden sm:block" />
              <button className="w-12 h-12 rounded-2xl bg-white border border-oku-taupe/5 flex items-center justify-center text-oku-taupe hover:text-oku-dark transition-colors relative">
                  <Bell size={18} strokeWidth={1.5} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-oku-purple rounded-full border-2 border-white" />
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-12 h-12 rounded-2xl bg-oku-dark text-white flex items-center justify-center hover:bg-oku-purple-dark transition-all"
              >
                  <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Hero / Page Header Section */}
          <div className="p-10 pb-4">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-[3.5rem] bg-white p-12 lg:p-16 border border-oku-taupe/5 shadow-[0_32px_80px_rgba(0,0,0,0.02)] relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-3 rounded-full bg-oku-purple/10 px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-oku-purple-dark border border-oku-purple/10 mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-oku-purple animate-pulse" />
                    {badge}
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-display font-bold text-oku-dark tracking-tighter leading-[0.85]">
                    {title}
                  </h1>
                  <p className="mt-8 text-lg font-display italic text-oku-taupe max-w-2xl leading-relaxed opacity-70">
                    {description}
                  </p>
                </div>

                {heroActions && <div className="flex flex-wrap gap-4">{heroActions}</div>}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-oku-purple/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-oku-sage/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />
            </motion.section>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-10 pt-6">
            {children}
          </div>

          <footer className="p-10 pt-0 text-[10px] font-black uppercase tracking-[0.4em] text-oku-taupe opacity-30 text-center">
             Clinical Excellence • Privacy Preserved • OKU Protocol v2.5
          </footer>
        </main>
      </div>
    </div>
  )
}

export function PractitionerLoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-oku-cream flex items-center justify-center p-10">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-oku-purple/20 border-t-oku-purple rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe animate-pulse">{message}</p>
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
    <section className={`bg-white rounded-[3rem] p-10 border border-oku-taupe/5 shadow-sm hover:shadow-xl transition-all duration-700 ${className}`}>
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">{title}</h2>
          {description && <p className="mt-2 text-sm text-oku-taupe font-display italic opacity-60">{description}</p>}
        </div>
        {(action || actions) && (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
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
    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm hover:shadow-2xl transition-all duration-500 group">
      <div className={`h-1.5 w-12 rounded-full mb-8 opacity-40 group-hover:opacity-100 transition-all duration-500 ${accent}`} />
      <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-2">{label}</p>
      <p className="text-4xl font-display font-bold text-oku-dark tracking-tighter">{value}</p>
      {detail && <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-60">{detail}</p>}
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
      className="group bg-white rounded-[2.5rem] p-10 border border-oku-taupe/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="w-14 h-14 rounded-2xl bg-oku-cream flex items-center justify-center text-oku-dark group-hover:bg-oku-dark group-hover:text-white transition-all duration-500 mb-10 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-display font-bold text-oku-dark mb-2">{title}</h3>
        <p className="text-sm text-oku-taupe font-display italic leading-relaxed opacity-60">{description}</p>
      </div>
      <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-40 group-hover:opacity-100 transition-all">
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
    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${styles[tone]}`}>
      {children}
    </span>
  )
}
