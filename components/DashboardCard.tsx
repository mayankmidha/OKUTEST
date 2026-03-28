'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardCardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  variant?: 'white' | 'dark' | 'lavender' | 'glacier' | 'matcha' | 'rose'
  className?: string
}

export function DashboardCard({ 
  title, 
  subtitle, 
  icon, 
  children, 
  variant = 'white',
  className = '' 
}: DashboardCardProps) {
  const variants = {
    white: 'bg-white/80 backdrop-blur-xl border-white/80 shadow-premium',
    dark: 'bg-oku-dark text-white border-oku-dark shadow-2xl',
    lavender: 'bg-oku-lavender/75 backdrop-blur-xl border-oku-lavender-dark/10 shadow-pastel',
    glacier: 'bg-oku-glacier/75 backdrop-blur-xl border-oku-glacier-dark/10 shadow-sm',
    matcha: 'bg-oku-matcha/75 backdrop-blur-xl border-oku-matcha-dark/10 shadow-sm',
    rose: 'bg-oku-rose/75 backdrop-blur-xl border-oku-rose-dark/10 shadow-sm',
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`p-7 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-300 hover:shadow-2xl ${variants[variant]} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            {title && <h3 className={`text-xl md:text-2xl font-display font-bold tracking-tight ${variant === 'dark' ? 'text-white' : 'text-oku-dark'}`}>{title}</h3>}
            {subtitle && <p className={`text-[10px] md:text-[11px] mt-2 uppercase tracking-[0.24em] font-black ${variant === 'dark' ? 'text-white/40' : 'text-oku-taupe/60'}`}>{subtitle}</p>}
          </div>
          {icon && (
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-white/85 text-oku-dark border border-white'}`}>
              {icon}
            </div>
          )}
        </div>
      )}
      <div className={variant === 'dark' ? 'text-white/80' : 'text-oku-dark/80 font-medium'}>
        {children}
      </div>
    </motion.div>
  )
}
