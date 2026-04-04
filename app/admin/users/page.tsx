import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminUserManagement } from '@/components/AdminUserManagement'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Fetch all users for management
  const users = await prisma.user.findMany({
    include: {
      clientProfile: { select: { adhdDiagnosed: true, referralCreditBalance: true } },
      practitionerProfile: { select: { isVerified: true } },
      _count: { select: { clientAppointments: true, practitionerAppointments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60">
              <ChevronLeft size={13} /> Command Hub
            </Link>
            <span className="chip bg-white/60 border-white/80">Identity Management</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-7xl text-oku-darkgrey tracking-tighter">
            Users <span className="text-oku-purple-dark italic">Registry.</span>
          </h1>
        </div>
      </div>

      <AdminUserManagement users={users} />
    </div>
  )
}
