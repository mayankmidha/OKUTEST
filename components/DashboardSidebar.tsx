'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users,
  Settings, Heart, ClipboardCheck,
  Shield, FileText, Bell, LogOut,
  ChevronRight, Activity, DollarSign, ShieldCheck, BookOpen, Search, Video,
  Briefcase, History, Clock, HelpCircle, Sparkles, MessageSquare, Gift, Brain, Menu, X, TrendingUp
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role
  const adhdUnlocked = (session?.user as any)?.adhdDiagnosed 
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const clientLinks = [
    { label: 'Pulse',            href: '/dashboard/client',                   icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { label: 'Care Path',        href: '/dashboard/client/therapists',        icon: <Search size={18} strokeWidth={1.5} /> },
    { label: 'Sessions',         href: '/dashboard/client/sessions',          icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Circles',          href: '/dashboard/client/circles',           icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Assessment Hub',   href: '/dashboard/client/clinical',          icon: <ClipboardCheck size={18} strokeWidth={1.5} /> },
    // ADHD Manager — gate
    ...(adhdUnlocked
      ? [{ label: 'ADHD Helper', href: '/dashboard/client/adhd', icon: <Brain size={18} strokeWidth={1.5} /> }]
      : []),
    { label: 'Wellness Hub',     href: '/dashboard/client/wellness',          icon: <Heart size={18} strokeWidth={1.5} /> },
    { label: 'Library',          href: '/dashboard/client/resources',         icon: <BookOpen size={18} strokeWidth={1.5} /> },
    { label: 'The Vault',        href: '/dashboard/client/documents',         icon: <FileText size={18} strokeWidth={1.5} /> },
    { label: 'Messages',         href: '/dashboard/client/messages',          icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { label: 'Referrals',        href: '/dashboard/client/referrals',         icon: <Gift size={18} strokeWidth={1.5} /> },
    { label: 'Profile',          href: '/dashboard/client/profile',           icon: <Activity size={18} strokeWidth={1.5} /> },
  ]

  const therapistLinks = [
    { label: 'Pulse', href: '/practitioner/dashboard', icon: <Activity size={18} strokeWidth={1.5} /> },
    { label: 'Caseload', href: '/practitioner/clients', icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Schedule', href: '/practitioner/schedule', icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Circles Host', href: '/practitioner/dashboard?tab=circles', icon: <Video size={18} strokeWidth={1.5} /> },
    { label: 'Clinical Tools', href: '/practitioner/assessments', icon: <ClipboardCheck size={18} strokeWidth={1.5} /> },
    { label: 'Intelligence', href: '/practitioner/intelligence', icon: <Brain size={18} strokeWidth={1.5} /> },
    { label: 'Messages', href: '/practitioner/messages', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { label: 'Financials', href: '/practitioner/billing', icon: <DollarSign size={18} strokeWidth={1.5} /> },
    { label: 'Settings', href: '/practitioner/profile', icon: <Settings size={18} strokeWidth={1.5} /> },
  ]

  const adminLinks = [
    { label: 'Pulse', href: '/admin/dashboard', icon: <Activity size={18} strokeWidth={1.5} /> },
    { label: 'Integrity', href: '/admin/dashboard?pillar=network', icon: <Shield size={18} strokeWidth={1.5} /> },
    { label: 'Financials', href: '/admin/financials', icon: <DollarSign size={18} strokeWidth={1.5} /> },
    { label: 'Network', href: '/admin/dashboard?pillar=network', icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Templates', href: '/admin/dashboard?pillar=operations&sub=templates', icon: <FileText size={18} strokeWidth={1.5} /> },
    { label: 'Audit', href: '/admin/dashboard?tab=audit', icon: <ShieldCheck size={18} strokeWidth={1.5} /> },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : clientLinks

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-oku-lavender/80 to-oku-blush/80 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/60 m-4 shadow-2xl">
      <div className="px-4 py-8 flex items-center justify-between">
        <Link href="/" className="block group animate-float-3d">
          <img 
            src="/uploads/2025/07/Logoo.png" 
            alt="OKU" 
            className="h-10 w-auto opacity-90"
          />
        </Link>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-oku-darkgrey/40">
            <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-3 px-2 overflow-y-auto mt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-8 ml-4">Sanctuary</p>
        <div className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href || (link.href.includes('?') && pathname + '?' + link.href.split('?')[1] === link.href)
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
        <div className="card-glass-3d !p-6 !bg-white/60 !rounded-[2.5rem] shadow-xl group transition-all duration-500 hover:scale-[1.02]">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-darkgrey font-display font-black text-xl animate-float-3d shadow-sm">
                 {session?.user?.name?.substring(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey truncate">{session?.user?.name}</p>
                 <p className="text-[9px] uppercase tracking-widest text-oku-purple-dark font-black">{role?.toLowerCase()}</p>
              </div>
           </div>
           <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="btn-pill-3d bg-white/80 border-oku-darkgrey/5 hover:bg-red-50 hover:text-red-500 transition-all w-full !py-4 text-[10px]"
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
          className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl text-oku-darkgrey animate-float-3d"
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
        className="fixed inset-y-0 left-0 w-[320px] z-[70] lg:hidden"
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}
