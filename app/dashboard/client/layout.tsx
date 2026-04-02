import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { ClientSidebar } from './ClientSidebar'

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

  // Fetch ADHD flag server-side — never trust client state for gate
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      clientProfile: { select: { adhdDiagnosed: true } },
    },
  })

  const adhdUnlocked = user?.clientProfile?.adhdDiagnosed === true

  return (
    <div className="flex min-h-screen bg-oku-lavender/5">
      <ClientSidebar adhdUnlocked={adhdUnlocked} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
