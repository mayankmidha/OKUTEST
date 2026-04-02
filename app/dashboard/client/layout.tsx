import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'
import { DashboardSidebar } from '@/components/DashboardSidebar'

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

  return (
    <div className="flex min-h-screen bg-oku-lavender/5">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
