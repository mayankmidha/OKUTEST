import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TherapistFilters from '@/components/TherapistFilters'

export const dynamic = 'force-dynamic'

export default async function TherapistsPage() {
  const practitioners = await prisma.practitionerProfile.findMany({
    where: { isVerified: true },
    include: { user: true }
  })

  // Get unique specialties for filters
  const allSpecialties = practitioners.flatMap(p => p.specialization)
  const uniqueSpecialties = Array.from(new Set(allSpecialties)).filter(Boolean)

  return (
    <div className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-oku-dark mb-6 tracking-tighter leading-none">Our People.</h1>
          <p className="font-script text-4xl text-oku-purple mb-8">Licensed, trauma-informed, and deeply human.</p>
          <p className="text-xl text-oku-taupe max-w-2xl leading-relaxed italic">
            "We believe in clinical precision combined with cultural humility. Browse our collective to find the right space for your return to self."
          </p>
        </div>

        <TherapistFilters therapists={practitioners} specialties={uniqueSpecialties} />
      </div>
    </div>
  )
}
