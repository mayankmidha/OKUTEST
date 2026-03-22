'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardCardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  variant?: 'white' | 'dark' | 'purple' | 'blue' | 'green' | 'pink' | 'sage'
}

export function DashboardCard({ title, subtitle, icon, children, className = '', variant = 'white' }: DashboardCardProps) {
  const variants = {
    white: 'bg-white border-oku-taupe/5 shadow-2xl shadow-oku-taupe/5',
    dark: 'bg-oku-dark text-white border-white/5',
    purple: 'bg-oku-purple/30 border-oku-purple/10',
    blue: 'bg-oku-blue/30 border-oku-blue/10',
    green: 'bg-oku-green/30 border-oku-green/10',
    pink: 'bg-oku-pink/30 border-oku-pink/10',
    sage: 'bg-oku-sage/30 border-oku-sage/10'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`p-10 rounded-[3rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-oku-taupe/10 ${variants[variant]} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-10">
          <div>
            {title && <h3 className={`text-2xl font-display tracking-tight ${variant === 'dark' ? 'text-white' : 'text-oku-dark'}`}>{title}</h3>}
            {subtitle && <p className={`text-[10px] mt-2 uppercase tracking-[0.3em] font-medium ${variant === 'dark' ? 'text-white/40' : 'text-oku-taupe'}`}>{subtitle}</p>}
          </div>
          {icon && (
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-white shadow-sm border border-oku-taupe/5 text-oku-dark'}`}>
              {icon}
            </div>
          )}
        </div>
      )}
      <div className={variant === 'dark' ? 'text-white/80' : 'text-oku-dark/80'}>
        {children}
      </div>
    </motion.div>
  )
}
