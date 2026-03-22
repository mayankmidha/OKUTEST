'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
  variant?: 'white' | 'dark' | 'pastel-purple' | 'pastel-green' | 'pastel-peach'
}

export function DashboardCard({ title, subtitle, icon: Icon, children, className = '', variant = 'white' }: DashboardCardProps) {
  const variants = {
    white: 'bg-white text-oku-dark border-oku-taupe/10',
    dark: 'bg-oku-dark text-white border-white/5',
    'pastel-purple': 'bg-oku-purple text-oku-purple-dark border-oku-purple-dark/10',
    'pastel-green': 'bg-oku-green text-oku-green-dark border-oku-green-dark/10',
    'pastel-peach': 'bg-oku-peach text-oku-peach-dark border-oku-peach-dark/10'
  }

  const isDark = variant === 'dark'

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 shadow-sm hover:shadow-xl ${variants[variant]} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-current'}`}>{title}</h3>}
            {subtitle && <p className={`text-[10px] mt-1 uppercase tracking-widest font-black ${isDark ? 'text-white/40' : 'opacity-60'}`}>{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10 text-white' : 'bg-current bg-opacity-10'}`}>
              <Icon size={20} />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
