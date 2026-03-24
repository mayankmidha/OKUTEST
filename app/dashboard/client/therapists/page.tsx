import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import TherapistFilters from '@/components/TherapistFilters'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ClientTherapistsDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const [practitioners, userAppointmentCount, user] = await Promise.all([
    prisma.practitionerProfile.findMany({
        where: { isVerified: true },
        include: { user: true }
    }),
    prisma.appointment.count({
        where: { clientId: session.user.id }
    }),
    prisma.user.findUnique({
        where: { id: session.user.id },
        select: { location: true }
    })
  ])

  const isFirstTime = userAppointmentCount === 0

  // Get unique specialties for filters
  const allSpecialties = practitioners.flatMap(p => p.specialization)
  const uniqueSpecialties = Array.from(new Set(allSpecialties)).filter(Boolean)

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <DashboardHeader 
        title="The Collective"
        description="Licensed, trauma-informed practitioners dedicated to your growth."
        actions={
          <div className="px-6 py-3 rounded-full bg-oku-purple/10 text-oku-purple-dark text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-oku-purple/10 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> {practitioners.length} Specialists Live
          </div>
        }
      />

      <div className="mt-10">
        <TherapistFilters therapists={practitioners} specialties={uniqueSpecialties} isFirstTime={isFirstTime} userLocation={user?.location || undefined} />
      </div>
    </div>
  )
}
