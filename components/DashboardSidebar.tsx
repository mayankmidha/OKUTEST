'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Calendar, Users, 
  Settings, Heart, ClipboardCheck, 
  Shield, FileText, Bell, LogOut,
  ChevronRight, Activity, DollarSign,
  Briefcase, History, Clock, HelpCircle, Sparkles, MessageSquare
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const clientLinks = [
    { label: 'Overview', href: '/dashboard/client', icon: <LayoutDashboard size={18} strokeWidth={1.5} />, color: 'text-oku-purple' },
    { label: 'Messages', href: '/dashboard/client/messages', icon: <MessageSquare size={18} strokeWidth={1.5} />, color: 'text-oku-pink' },
    { label: 'Sessions', href: '/dashboard/client/book', icon: <History size={18} strokeWidth={1.5} />, color: 'text-oku-blue' },
    { label: 'Wellness', href: '/dashboard/client/mood', icon: <Heart size={18} strokeWidth={1.5} />, color: 'text-oku-pink' },
    { label: 'Vault', href: '/dashboard/client/vault', icon: <Shield size={18} strokeWidth={1.5} />, color: 'text-oku-purple' },
    { label: 'Clinical', href: '/dashboard/client/clinical', icon: <ClipboardCheck size={18} strokeWidth={1.5} />, color: 'text-oku-green' },
    { label: 'Therapists', href: '/therapists', icon: <Sparkles size={18} strokeWidth={1.5} />, color: 'text-oku-sage' },
    { label: 'Settings', href: '/dashboard/profile', icon: <Settings size={18} strokeWidth={1.5} />, color: 'text-oku-taupe' },
  ]

  const therapistLinks = [
    { label: 'Center', href: '/practitioner/dashboard', icon: <Activity size={18} strokeWidth={1.5} />, color: 'text-oku-purple' },
    { label: 'Messages', href: '/practitioner/messages', icon: <MessageSquare size={18} strokeWidth={1.5} />, color: 'text-oku-blue' },
    { label: 'Schedule', href: '/practitioner/appointments', icon: <Calendar size={18} strokeWidth={1.5} />, color: 'text-oku-blue' },
    { label: 'Hours', href: '/practitioner/schedule', icon: <Clock size={18} strokeWidth={1.5} />, color: 'text-oku-green' },
    { label: 'Patients', href: '/practitioner/clients', icon: <Users size={18} strokeWidth={1.5} />, color: 'text-oku-pink' },
    { label: 'Clinical', href: '/practitioner/assessments', icon: <ClipboardCheck size={18} strokeWidth={1.5} />, color: 'text-oku-green' },
    { label: 'Profile', href: '/practitioner/profile', icon: <Settings size={18} strokeWidth={1.5} />, color: 'text-oku-taupe' },
    { label: 'Support', href: '/contact', icon: <HelpCircle size={18} strokeWidth={1.5} />, color: 'text-oku-sage' },
  ]

  const adminLinks = [
    { label: 'Pulse', href: '/admin/dashboard', icon: <Shield size={18} strokeWidth={1.5} />, color: 'text-oku-purple' },
    { label: 'Financials', href: '/admin/financials', icon: <DollarSign size={18} strokeWidth={1.5} />, color: 'text-oku-blue' },
    { label: 'Therapists', href: '/admin/dashboard?tab=therapists', icon: <Users size={18} strokeWidth={1.5} />, color: 'text-oku-green' },
    { label: 'Audit', href: '/admin/dashboard?tab=audit', icon: <FileText size={18} strokeWidth={1.5} />, color: 'text-oku-pink' },
    { label: 'Services', href: '/admin/dashboard?tab=services', icon: <Briefcase size={18} strokeWidth={1.5} />, color: 'text-oku-sage' },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : clientLinks

  return (
    <aside className="w-80 bg-oku-page-bg/50 backdrop-blur-3xl border-r border-oku-taupe/5 min-h-screen flex flex-col sticky top-0 z-40 p-6 gap-8">
      <div className="px-4 py-6">
        <Link href="/" className="block group">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
            alt="OKU" 
            className="h-10 w-auto" 
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-oku-taupe/40 mb-8 ml-4">Terminal</p>
        <div className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href.includes('?') && pathname + '?' + link.href.split('?')[1] === link.href)
            const renderedIcon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative group block"
              >
                {active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white rounded-3xl shadow-xl shadow-oku-taupe/5 border border-oku-taupe/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative flex items-center justify-between p-4 rounded-3xl transition-all duration-500 ${
                  active 
                  ? 'text-oku-dark' 
                  : 'text-oku-taupe hover:text-oku-dark hover:translate-x-1'
                }`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      active 
                      ? 'bg-oku-page-bg shadow-inner border border-oku-taupe/5' 
                      : 'bg-white/40 group-hover:bg-white group-hover:shadow-md'
                    }`}>
                       <div className={active ? link.color : 'text-oku-taupe group-hover:text-oku-dark'}>
                          {renderedIcon}
                       </div>
                    </div>
                    <span className={`text-[11px] uppercase tracking-[0.2em] font-medium ${active ? 'text-oku-dark' : ''}`}>{link.label}</span>
                  </div>
                  {active && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-oku-purple" 
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="mt-auto space-y-6">
        <div className="p-6 rounded-[2.5rem] bg-white shadow-2xl shadow-oku-taupe/10 border border-oku-taupe/5 group transition-all duration-500 hover:shadow-oku-purple/5">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-oku-purple/30 to-oku-blue/30 flex items-center justify-center text-oku-dark font-display font-medium shadow-inner">
                 {session?.user?.name?.substring(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[11px] font-medium uppercase tracking-widest text-oku-dark truncate">{session?.user?.name}</p>
                 <p className="text-[9px] uppercase tracking-widest text-oku-taupe/60 font-medium">{role?.toLowerCase()}</p>
              </div>
           </div>
           <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-oku-page-bg hover:bg-red-50 hover:text-red-500 text-oku-taupe transition-all duration-500 text-[10px] uppercase tracking-[0.2em] font-medium border border-oku-taupe/5"
           >
             <LogOut size={14} strokeWidth={1.5} />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
    </aside>
  )
}
