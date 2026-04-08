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
      className="mb-8 flex flex-col justify-between gap-6 md:mb-14 md:gap-10 lg:flex-row lg:items-end"
    >
      <div className="max-w-3xl px-1">
        <h1 className="mb-4 text-3xl font-display font-bold leading-[0.92] tracking-tight text-oku-dark sm:text-4xl md:mb-5 md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm font-display italic leading-relaxed text-oku-taupe opacity-75 sm:text-base md:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-col items-stretch gap-3 px-1 sm:flex-row sm:flex-wrap sm:items-center md:gap-4 lg:w-auto">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
