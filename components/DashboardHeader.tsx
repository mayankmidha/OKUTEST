'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-10 mb-12 md:mb-20"
    >
      <div className="max-w-3xl px-2">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold text-oku-dark tracking-tight leading-[0.85] mb-6 md:mb-8">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl text-oku-taupe font-display italic leading-relaxed opacity-70 border-l-2 border-oku-lavender-dark/20 pl-8">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 md:gap-6 px-2">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
