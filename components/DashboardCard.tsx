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
    white: 'bg-white/60 backdrop-blur-md border-white shadow-premium',
    dark: 'bg-oku-dark text-white border-oku-dark shadow-2xl',
    lavender: 'bg-oku-lavender/60 backdrop-blur-md border-oku-lavender-dark/10 shadow-pastel',
    glacier: 'bg-oku-glacier/60 backdrop-blur-md border-oku-glacier-dark/10 shadow-sm',
    matcha: 'bg-oku-matcha/60 backdrop-blur-md border-oku-matcha-dark/10 shadow-sm',
    rose: 'bg-oku-rose/60 backdrop-blur-md border-oku-rose-dark/10 shadow-sm',
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 hover:shadow-2xl ${variants[variant]} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            {title && <h3 className={`text-2xl md:text-3xl font-display font-bold tracking-tight ${variant === 'dark' ? 'text-white' : 'text-oku-dark'}`}>{title}</h3>}
            {subtitle && <p className={`text-[10px] md:text-[11px] mt-2 uppercase tracking-[0.3em] font-black ${variant === 'dark' ? 'text-white/40' : 'text-oku-taupe/60'}`}>{subtitle}</p>}
          </div>
          {icon && (
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-inner ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-white/80 text-oku-dark border border-white'}`}>
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
