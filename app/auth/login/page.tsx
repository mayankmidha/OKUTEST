import V1LoginPage from '@/components/V1LoginPage'
import { LoginSkeleton } from '@/components/LoginSkeleton'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <V1LoginPage />
    </Suspense>
  )
}
