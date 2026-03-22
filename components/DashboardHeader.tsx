'use client'

import { ReactNode } from 'react'

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
          {title}
        </h1>
        {description && (
          <p className="text-oku-taupe mt-2 font-display italic leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-4">
          {actions}
        </div>
      )}
    </div>
  )
}
