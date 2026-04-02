import { prisma } from '@/lib/prisma'
import { TherapistGrid } from '@/components/TherapistGrid'

export const revalidate = 3600

export default async function TherapistsPage() {
  const practitioners = await prisma.practitionerProfile.findMany({
    where: { isVerified: true },
    include: { user: { select: { id: true, name: true, avatar: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  })

  const allSpecialties = Array.from(
    new Set(practitioners.flatMap((p) => p.specialization).filter(Boolean))
  ).sort()

  return <TherapistGrid practitioners={practitioners as any} specialties={allSpecialties} />
}
