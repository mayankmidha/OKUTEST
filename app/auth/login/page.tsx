import V1LoginPage from '@/components/V1LoginPage'
import { LoginSkeleton } from '@/components/LoginSkeleton'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Oku Therapy Collective',
  description: 'Enter your secure sanctuary for healing and growth.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-oku-cream">
      {/* SSR Content for SEO and fast initial paint */}
      <div className="sr-only">
        <h1>Welcome Home to Oku Therapy</h1>
        <p>Your secure sanctuary is waiting for you. Log in to access your dashboard, book sessions, and view clinical insights.</p>
      </div>
      
      <Suspense fallback={<LoginSkeleton />}>
        <V1LoginPage />
      </Suspense>
    </div>
  )
}
