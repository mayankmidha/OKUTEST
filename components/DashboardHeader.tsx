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
      <div className="max-w-2xl px-2">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-oku-dark tracking-tighter leading-[0.9] mb-4 md:mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-oku-taupe font-display italic leading-relaxed opacity-70">
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
