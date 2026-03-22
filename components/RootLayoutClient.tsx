'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/auth-provider'

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
      {!isDashboard && <Header />}
      <main>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </AuthProvider>
  )
}
