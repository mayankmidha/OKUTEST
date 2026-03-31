'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import BrandedNav from '@/components/BrandedNav'
import BrandedFooter from '@/components/BrandedFooter'
import AuthProvider from '@/components/auth-provider'
import { ActivityTracker } from '@/components/ActivityTracker'
import { CrisisChatWidget } from '@/components/CrisisChatWidget'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Hide Header/Footer if in dashboard or session
  const isDashboard = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/practitioner') || 
                      pathname.startsWith('/admin') ||
                      pathname.startsWith('/session/')

  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ActivityTracker />
      </Suspense>
      {!isDashboard && <BrandedNav />}
      <main>
        {children}
      </main>
      {!isDashboard && <BrandedFooter />}
      <CrisisChatWidget />
    </AuthProvider>
  )
}
