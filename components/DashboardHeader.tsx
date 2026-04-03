'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'

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
      className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-10 mb-10 md:mb-14"
    >
      <div className="max-w-3xl px-1">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-oku-dark tracking-tight leading-[0.92] mb-4 md:mb-5">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base md:text-lg text-oku-taupe font-display italic leading-relaxed opacity-75">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 md:gap-4 px-1">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
