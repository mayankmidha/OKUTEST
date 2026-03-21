import V1LoginPage from '@/components/V1LoginPage'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-oku-cream flex items-center justify-center">Loading...</div>}>
      <V1LoginPage />
    </Suspense>
  )
}
