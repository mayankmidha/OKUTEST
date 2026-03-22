'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
  dark?: boolean
}

export function DashboardCard({ title, subtitle, icon: Icon, children, className = '', dark = false }: DashboardCardProps) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 shadow-sm hover:shadow-xl ${
      dark 
      ? 'bg-oku-dark text-white border-white/5' 
      : 'bg-white text-oku-dark border-oku-taupe/10'
    } ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className={`text-xl font-display font-bold ${dark ? 'text-white' : 'text-oku-dark'}`}>{title}</h3>}
            {subtitle && <p className={`text-xs mt-1 uppercase tracking-widest font-black ${dark ? 'text-white/40' : 'text-oku-taupe opacity-60'}`}>{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-2xl ${dark ? 'bg-white/10 text-oku-purple' : 'bg-oku-purple/10 text-oku-purple'}`}>
              <Icon size={20} />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
