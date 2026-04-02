import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Route protection — unauthenticated
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Role check — non-CLIENT redirected to their own dashboard
  if (session.user.role === UserRole.THERAPIST) {
    redirect('/practitioner/dashboard')
  }
  if (session.user.role === UserRole.ADMIN) {
    redirect('/admin/dashboard')
  }

  // This layout is nested under app/dashboard/layout.tsx
  // which already provides the DashboardSidebar and container.
  return <>{children}</>
}
