'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Calendar, Users, 
  Settings, Heart, ClipboardCheck, 
  Shield, FileText, Bell, LogOut,
  ChevronRight, Activity, DollarSign
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const clientLinks = [
    { label: 'Overview', href: '/dashboard/client', icon: LayoutDashboard },
    { label: 'Sessions', href: '/dashboard/client/book', icon: Calendar },
    { label: 'Wellness', href: '/dashboard/client/mood', icon: Heart },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Profile', href: '/dashboard/profile', icon: Settings },
  ]

  const therapistLinks = [
    { label: 'Command Center', href: '/practitioner/dashboard', icon: Activity },
    { label: 'Appointments', href: '/practitioner/appointments', icon: Calendar },
    { label: 'Schedule', href: '/practitioner/schedule', icon: Clock },
    { label: 'Patients', href: '/practitioner/clients', icon: Users },
    { label: 'My Profile', href: '/practitioner/profile', icon: Settings },
  ]

  const adminLinks = [
    { label: 'Platform Hub', href: '/admin/dashboard', icon: Shield },
    { label: 'Services', href: '/admin/services', icon: DollarSign },
    { label: 'Therapists', href: '/admin/therapists', icon: Users },
    { label: 'Audit Logs', href: '/admin/logs', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'THERAPIST' ? therapistLinks : clientLinks

  return (
    <aside className="w-72 bg-white border-r border-oku-taupe/10 min-h-screen flex flex-col sticky top-0">
      <div className="p-8 border-b border-oku-taupe/10">
        <Link href="/">
          <img 
            src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
            alt="OKU" 
            className="h-8 w-auto" 
          />
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe/40 mb-6 ml-2">Navigation</p>
        {links.map((link) => {
          const active = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between group p-4 rounded-2xl transition-all ${
                active 
                ? 'bg-oku-dark text-white shadow-xl translate-x-2' 
                : 'text-oku-taupe hover:bg-oku-cream hover:text-oku-dark'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={18} className={active ? 'text-oku-purple' : 'text-oku-taupe group-hover:text-oku-dark'} />
                <span className="text-[10px] uppercase tracking-widest font-black">{link.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform ${active ? 'opacity-100 rotate-90' : 'opacity-0'}`} />
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-oku-taupe/10 space-y-4">
        <div className="bg-oku-cream/50 p-4 rounded-2xl flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-oku-purple/20 flex items-center justify-center text-oku-purple font-bold">
              {session?.user?.name?.substring(0, 1)}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-dark truncate">{session?.user?.name}</p>
              <p className="text-[8px] uppercase tracking-widest text-oku-taupe">{role}</p>
           </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 p-4 text-oku-taupe hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-[10px] uppercase tracking-widest font-black">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

// Helper Clock Icon (missing in lucide-react imports above)
function Clock({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    )
}
