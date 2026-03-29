'use client'

import { usePathname } from 'next/navigation'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-oku-cream">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        <div className="p-4 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
