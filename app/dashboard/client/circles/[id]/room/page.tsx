import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CircleRoom } from './CircleRoom'

export default async function CircleRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Verify membership
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      participants: true,
      service: true
    }
  })

  // Therapist check
  const isTherapist = session.user.role === 'THERAPIST' || session.user.role === 'ADMIN'
  const isParticipant = appointment?.participants?.some(p => p.userId === session?.user?.id)

  if (!isParticipant && !isTherapist) {
    redirect(`/dashboard/client/circles`)
  }

  const circleName = appointment?.service?.name || "Therapy Circle"

  const user = {
    id: session.user.id,
    name: session.user.name || 'Participant',
    image: session.user.image || undefined,
  }

  return (
    <div className="p-4 h-screen bg-oku-background">
      <CircleRoom circleId={id} user={user} circleName={circleName} />
    </div>
  )
}
