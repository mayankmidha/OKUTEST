'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Calendar, Users, Search,
  ClipboardCheck, Brain, Heart, MessageSquare,
  Gift, FileText, LogOut, ChevronRight, Menu, X
} from 'lucide-react'
import { useState } from 'react'

interface NavLink {
  label: string
  href: string
  icon: React.ReactNode
}

interface ClientSidebarProps {
  adhdUnlocked: boolean
}

export function ClientSidebar({ adhdUnlocked }: ClientSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links: NavLink[] = [
    { label: 'Overview',         href: '/dashboard/client',                   icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { label: 'Sessions',         href: '/dashboard/client/sessions',          icon: <Calendar size={18} strokeWidth={1.5} /> },
    { label: 'Find a Therapist', href: '/dashboard/client/therapists',        icon: <Search size={18} strokeWidth={1.5} /> },
    { label: 'Assessments',      href: '/dashboard/client/clinical',          icon: <ClipboardCheck size={18} strokeWidth={1.5} /> },
    // ADHD Manager — only rendered when clinically confirmed
    ...(adhdUnlocked
      ? [{ label: 'ADHD Manager', href: '/dashboard/client/adhd', icon: <Brain size={18} strokeWidth={1.5} /> }]
      : []),
    { label: 'Circles',          href: '/dashboard/client/circles',           icon: <Users size={18} strokeWidth={1.5} /> },
    { label: 'Wellness',         href: '/dashboard/client/wellness',          icon: <Heart size={18} strokeWidth={1.5} /> },
    { label: 'Messages',         href: '/dashboard/client/messages',          icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { label: 'Referrals',        href: '/dashboard/client/referrals',         icon: <Gift size={18} strokeWidth={1.5} /> },
    { label: 'Documents',        href: '/dashboard/client/documents',         icon: <FileText size={18} strokeWidth={1.5} /> },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-oku-lavender/80 to-oku-blush/80 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/60 m-4 shadow-2xl">
      {/* Logo */}
      <div className="px-4 py-8 flex items-center justify-between">
        <Link href="/" className="block">
          <img src="/uploads/2025/07/Logoo.png" alt="OKU" className="h-10 w-auto opacity-90" />
        </Link>
        <button onClick={() => setOpen(false)} className="lg:hidden text-oku-darkgrey/40">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-2 overflow-y-auto mt-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-6 ml-4">Sanctuary</p>
        {links.map((link) => {
          const isActive =
            link.href === '/dashboard/client'
              ? pathname === '/dashboard/client'
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="relative group block"
            >
              <div
                className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white shadow-xl scale-[1.03] border border-white text-oku-darkgrey'
                    : 'text-oku-darkgrey/50 hover:bg-white/40 hover:translate-x-1'
                }`}
                style={isActive ? { borderRadius: '100000px' } : {}}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-oku-lavender shadow-inner text-oku-purple-dark'
                        : 'bg-white/40 group-hover:bg-white text-oku-darkgrey/40 group-hover:text-oku-purple-dark'
                    }`}
                  >
                    {link.icon}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-oku-darkgrey' : ''}`}>
                    {link.label}
                  </span>
                </div>
                {isActive && <ChevronRight size={12} className="text-oku-darkgrey/30" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 pt-6 border-t border-white/30 mt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-oku-darkgrey/40 hover:bg-white/40 hover:text-oku-darkgrey transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-white/40 group-hover:bg-white flex items-center justify-center">
            <LogOut size={16} strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 w-12 h-12 bg-white/80 backdrop-blur rounded-2xl shadow-lg flex items-center justify-center border border-white/60"
      >
        <Menu size={20} className="text-oku-darkgrey" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  )
}
