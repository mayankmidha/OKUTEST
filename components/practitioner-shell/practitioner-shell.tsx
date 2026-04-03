'use client'

import Link from 'next/link'
import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Bell, Search } from 'lucide-react'

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
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-oku-mint/5">
      {/* Top Header */}
      <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-white/60">
        <div className="flex items-center gap-6">
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
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Workspace Dashboard</span>
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

      <footer className="p-12 pt-0 text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/20 text-center mt-auto">
         Sanctuary Operations • Clinical Excellence • v3.5
      </footer>
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
    <section className={`card-glass-3d !p-10 !bg-white/40 ${className}`}>
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">{title}</h2>
          {description && <p className="mt-2 text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">{description}</p>}
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

export function PractitionerStatCard({ accent = 'bg-oku-purple-dark', detail, label, value }: { accent?: string, detail?: string, label: string, value: string | number }) {
  return (
    <div className="card-glass-3d !p-8 !bg-white/60 group animate-float-3d">
      <div className={`h-1.5 w-12 rounded-full mb-8 opacity-40 group-hover:opacity-100 transition-all duration-500 ${accent}`} />
      <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">{label}</p>
      <p className="heading-display text-4xl text-oku-darkgrey">{value}</p>
      {detail && <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-oku-purple-dark opacity-60">{detail}</p>}
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
      className="group card-glass-3d !p-8 md:!p-10 !bg-white/40 flex flex-col h-full"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-darkgrey group-hover:bg-oku-darkgrey group-hover:text-white transition-all duration-500 mb-8 md:mb-10 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="heading-display text-2xl text-oku-darkgrey mb-2">{title}</h3>
        <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">{description}</p>
      </div>
      <div className="mt-8 md:mt-10 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-oku-purple-dark opacity-40 group-hover:opacity-100 transition-all">
        Open Workspace <ChevronRight size={12} className="ml-2" />
      </div>
    </Link>
  )
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}

export function PractitionerPill({
  children,
  tone = 'purple',
}: {
  children: ReactNode
  tone?: 'purple' | 'sage' | 'pink' | 'dark'
}) {
  const styles = {
    purple: 'bg-oku-lavender text-oku-purple-dark border-white',
    sage: 'bg-oku-mint text-oku-darkgrey/60 border-white',
    pink: 'bg-oku-blush text-oku-darkgrey/60 border-white',
    dark: 'bg-oku-darkgrey text-white border-oku-darkgrey',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${styles[tone]}`}>
      {children}
    </span>
  )
}
