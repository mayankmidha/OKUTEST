'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Activity,
  Brain,
  Calendar,
  ClipboardCheck,
  DollarSign,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const role = session?.user?.role
  const adhdUnlocked = (session?.user as any)?.adhdDiagnosed || (session?.user as any)?.clientProfile?.adhdDiagnosed
  const [isOpen, setIsOpen] = useState(false)
  const currentUrl = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname

  const clientLinks = [
    { label: 'Home',             href: '/dashboard/client',                   icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { label: 'Find Care',        href: '/dashboard/client/therapists',        icon: <Search size={18} strokeWidth={1.5} /> },
    { label: 'Sessions',         href: '/dashboard/client/sessions',          icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Messages',         href: '/dashboard/client/messages',          icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { label: 'Records',          href: '/dashboard/client/clinical',          icon: <ClipboardCheck size={18} strokeWidth={1.5} /> },
    { label: 'Account',          href: '/dashboard/client/profile',           icon: <Settings size={18} strokeWidth={1.5} /> },
  ]

  const therapistLinks = [
    { label: 'Home',             href: '/practitioner/dashboard',             icon: <Activity size={18} strokeWidth={1.5} /> },
    { label: 'Schedule',         href: '/practitioner/schedule',              icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Clients',          href: '/practitioner/clients',               icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Messages',         href: '/practitioner/messages',              icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { label: 'Finance',          href: '/practitioner/billing',               icon: <DollarSign size={18} strokeWidth={1.5} /> },
    { label: 'Advanced',         href: '/practitioner/intelligence',          icon: <Brain size={18} strokeWidth={1.5} /> },
  ]

  const adminLinks = [
    { label: 'Overview',         href: '/admin/dashboard',                    icon: <Activity size={18} strokeWidth={1.5} /> },
    { label: 'Users',            href: '/admin/users',                        icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Practitioners',    href: '/admin/practitioners',                icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Sessions',         href: '/admin/sessions',                     icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Financials',       href: '/admin/financials',                   icon: <DollarSign size={18} strokeWidth={1.5} /> },
    { label: 'Compliance',       href: '/admin/compliance',                   icon: <ShieldCheck size={18} strokeWidth={1.5} /> },
    { label: 'Operations',       href: '/admin/automation',                   icon: <Zap size={18} strokeWidth={1.5} /> },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : clientLinks
  const handleClose = () => setIsOpen(false)

  const sidebarContent = (
    <div className="clinic-sidebar-shell m-4">
      <div className="flex items-center justify-between px-3 py-5">
        <Link href="/" className="block group" onClick={handleClose}>
          <img 
            src="/wp-content/uploads/2025/07/Logoo.png" 
            alt="OKU" 
            className="h-10 w-auto opacity-90"
          />
        </Link>
        <button onClick={handleClose} className="lg:hidden text-oku-darkgrey/40">
            <X size={24} />
        </button>
      </div>

      <nav className="mt-6 flex-1 space-y-3 overflow-y-auto px-1">
        <p className="clinic-kicker mb-5 ml-4">Sanctuary</p>
        <div className="space-y-2">
          {links.map((link) => {
            const active = currentUrl === link.href || pathname === link.href || (link.href.includes('?') && pathname === link.href.split('?')[0] && currentUrl === link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`clinic-sidebar-link group block ${active ? 'clinic-sidebar-link-active' : ''}`}
                onClick={handleClose}
              >
                <div className="flex items-center gap-4">
                  <div className={`clinic-sidebar-icon ${active ? 'border-transparent bg-oku-lavender text-oku-purple-dark shadow-sm' : 'group-hover:border-white group-hover:bg-white'}`}>
                    {link.icon}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-[0.18em] ${active ? 'text-oku-darkgrey' : 'text-oku-darkgrey/60'}`}>{link.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-[1.8rem] border border-white/80 bg-white/72 p-5 shadow-sm">
           <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-oku-lavender text-lg font-display font-black text-oku-darkgrey shadow-sm">
                 {session?.user?.name?.substring(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-oku-darkgrey">{session?.user?.name}</p>
                 <p className="mt-1 text-[9px] font-black uppercase tracking-[0.24em] text-oku-purple-dark/70">{role?.toLowerCase()}</p>
              </div>
           </div>
           <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="btn-pill-3d w-full bg-white text-[10px] text-oku-darkgrey transition-all hover:bg-red-50 hover:text-red-500 !py-4"
           >
             <LogOut size={14} strokeWidth={2} className="mr-2" />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-6 left-6 z-[60]">
        <button 
          onClick={() => setIsOpen(true)}
          className="rounded-2xl border border-white/80 bg-white/90 p-4 text-oku-darkgrey shadow-lg backdrop-blur-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-oku-darkgrey/20 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-88 min-h-screen flex-col sticky top-0 z-40 p-2 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <motion.aside 
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-[70] w-[320px] lg:hidden"
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}
