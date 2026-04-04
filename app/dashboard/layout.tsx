'use client'

import { DashboardSidebar } from '@/components/DashboardSidebar'
import { Suspense } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-oku-lavender/5">
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
