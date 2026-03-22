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
      className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20"
    >
      <div className="max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-display text-oku-dark tracking-tighter leading-none mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-oku-taupe font-display italic leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-6">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
