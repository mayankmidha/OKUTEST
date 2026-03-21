'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login')
      return
    }

    if (user.role === 'CLIENT') {
      router.replace('/dashboard/client')
      return
    }

    if (user.role === 'THERAPIST') {
      router.replace('/practitioner/dashboard')
      return
    }

    if (user.role === 'ADMIN') {
      router.replace('/admin/dashboard')
      return
    }

    router.replace('/auth/login')
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
