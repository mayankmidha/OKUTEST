'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Calendar, Users, 
  Settings, Heart, ClipboardCheck, 
  Shield, FileText, Bell, LogOut,
  ChevronRight, Activity, DollarSign,
  Briefcase, History, Clock, HelpCircle, Sparkles
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const clientLinks = [
    { label: 'Overview', href: '/dashboard/client', icon: LayoutDashboard },
    { label: 'My Sessions', href: '/dashboard/client/book', icon: History },
    { label: 'Wellness Tracker', href: '/dashboard/client/mood', icon: Heart },
    { label: 'Clinical Hub', href: '/assessments', icon: ClipboardCheck },
    { label: 'Find Support', href: '/therapists', icon: Sparkles },
    { label: 'Profile', href: '/dashboard/profile', icon: Settings },
  ]

  const therapistLinks = [
    { label: 'Command Center', href: '/practitioner/dashboard', icon: Activity },
    { label: 'Session Ledger', href: '/practitioner/appointments', icon: Calendar },
    { label: 'Clinical Schedule', href: '/practitioner/schedule', icon: Clock },
    { label: 'Patient Roster', href: '/practitioner/clients', icon: Users },
    { label: 'My Profile', href: '/practitioner/profile', icon: Settings },
    { label: 'Practitioner Care', href: '/contact', icon: HelpCircle },
  ]

  const adminLinks = [
    { label: 'Platform Pulse', href: '/admin/dashboard', icon: Shield },
    { label: 'Financial Ledger', href: '/admin/financials', icon: DollarSign },
    { label: 'Therapist Onboarding', href: '/admin/dashboard?tab=therapists', icon: Users },
    { label: 'Security & Logs', href: '/admin/dashboard?tab=audit', icon: FileText },
    { label: 'Service Catalog', href: '/admin/dashboard?tab=services', icon: Briefcase },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : clientLinks

  return (
    <aside className="w-72 bg-[#F8F9FA] border-r border-oku-taupe/10 min-h-screen flex flex-col sticky top-0 z-40">
      <div className="p-8 border-b border-oku-taupe/10 bg-white">
        <Link href="/">
          <img 
            src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
            alt="OKU" 
            className="h-8 w-auto transition-transform hover:scale-105" 
          />
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe/40 mb-6 ml-2">Main Terminal</p>
        {links.map((link) => {
          const active = pathname === link.href || (link.href.includes('?') && pathname + '?' + link.href.split('?')[1] === link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between group p-4 rounded-2xl transition-all duration-300 ${
                active 
                ? 'bg-white text-oku-dark shadow-md scale-[1.02] border border-oku-purple/20' 
                : 'text-oku-taupe hover:bg-white/50 hover:text-oku-dark'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-oku-purple/10 text-oku-purple' : 'bg-oku-cream-warm/30 text-oku-taupe group-hover:bg-white group-hover:text-oku-dark'}`}>
                   <Icon size={16} />
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-black ${active ? 'text-oku-dark' : ''}`}>{link.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-500 ${active ? 'opacity-100 rotate-90' : 'opacity-0'}`} />
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-oku-taupe/10 space-y-4 bg-white/50">
        <div className="bg-white p-4 rounded-2xl border border-oku-taupe/10 flex items-center gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] font-display font-bold border-2 border-white shadow-inner">
              {session?.user?.name?.substring(0, 1)}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-dark truncate">{session?.user?.name}</p>
              <p className="text-[8px] uppercase tracking-widest text-oku-taupe font-bold">{role === 'THERAPIST' ? 'Clinical Provider' : role}</p>
           </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 p-4 text-oku-taupe hover:text-red-600 transition-all group"
        >
          <div className="p-2 rounded-xl bg-oku-cream-warm/30 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
             <LogOut size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-black">Secure Logout</span>
        </button>
      </div>
    </aside>
  )
}
