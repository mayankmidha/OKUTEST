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
  description,
  headerActions,
  heroActions,
  title,
}: PractitionerShellProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-oku-mint/5">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/55 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 rounded-full border border-white/80 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
                <Search size={14} className="text-oku-darkgrey/40" />
                <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-oku-darkgrey/20 w-64" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {headerActions}
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-oku-darkgrey/40 shadow-sm backdrop-blur-md transition-all hover:text-oku-purple-dark sm:h-12 sm:w-12">
              <Bell size={18} strokeWidth={1.5} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-oku-purple-dark rounded-full border-2 border-white animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 lg:p-10">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-16"
        >
          <div className="clinic-hero-card mb-10 flex flex-col justify-between gap-8 lg:mb-12 lg:flex-row lg:items-end lg:gap-12">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                 <span className="chip bg-white/60 border-white/80">{badge}</span>
                 <span className="clinic-kicker">Workspace Dashboard</span>
              </div>
              <h1 className="heading-display text-4xl leading-[0.92] tracking-tighter text-oku-darkgrey sm:text-5xl lg:text-7xl">
                {title.split(' ')[0]} <span className="text-oku-purple-dark italic">{title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="clinic-copy max-w-2xl border-l-4 border-oku-purple-dark/10 pl-5 font-display italic sm:pl-8">
                {description}
              </p>
            </div>
            {heroActions && <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:w-auto lg:justify-end">{heroActions}</div>}
          </div>
        </motion.section>

        {children}
      </div>

      <footer className="mt-auto px-4 pb-10 pt-0 text-center text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/20 sm:px-6 sm:pb-12">
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
    <section className={`clinic-surface ${className}`}>
      <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="clinic-kicker">Practitioner Surface</p>
          <h2 className="heading-display mt-2 text-3xl text-oku-darkgrey tracking-tight">{title}</h2>
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
    <div className="clinic-stat-card group bg-white/80">
      <div className={`mb-6 h-1.5 w-12 rounded-full opacity-50 transition-all duration-300 group-hover:opacity-100 ${accent}`} />
      <p className="clinic-kicker mb-2">{label}</p>
      <p className="heading-display text-3xl text-oku-darkgrey sm:text-4xl">{value}</p>
      {detail && <p className="mt-4 text-[9px] font-black uppercase tracking-[0.22em] text-oku-purple-dark/65">{detail}</p>}
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
      className="group clinic-surface flex h-full flex-col bg-white/80 transition-all hover:-translate-y-1"
    >
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-oku-lavender text-oku-darkgrey shadow-inner transition-all duration-300 group-hover:bg-oku-darkgrey group-hover:text-white md:mb-10 md:h-14 md:w-14 md:rounded-2xl">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="heading-display text-2xl text-oku-darkgrey mb-2">{title}</h3>
        <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">{description}</p>
      </div>
      <div className="mt-8 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-oku-purple-dark/55 transition-all group-hover:text-oku-purple-dark md:mt-10">
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
