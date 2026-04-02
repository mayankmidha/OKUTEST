import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CircleSessionRoom } from './CircleSessionRoom'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CircleSessionPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Verify user is a GroupParticipant (or practitioner) of this circle
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      participants: { select: { userId: true } },
      service: { select: { name: true } },
    },
  })

  if (!appointment || !appointment.isGroupSession) {
    redirect('/dashboard/client/circles')
  }

  const isParticipant = appointment.participants.some(
    (p) => p.userId === session.user.id
  )
  const isFacilitator =
    appointment.practitionerId === session.user.id ||
    session.user.role === 'ADMIN'

  if (!isParticipant && !isFacilitator) {
    redirect(`/dashboard/client/circles/${id}`)
  }

  // Anonymised display name — first name only
  const firstName = (session.user.name || 'Participant').split(' ')[0]

  return (
    <div className="p-4 min-h-screen bg-oku-darkgrey">
      <CircleSessionRoom
        callId={`circle_${id}`}
        userId={session.user.id}
        userName={firstName}
        circleId={id}
      />
    </div>
  )
}
