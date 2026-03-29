import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CareRoomClient } from './CareRoomClient'

export default async function CareRoomPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const careContext = await prisma.careContext.findUnique({
    where: { userId: session.user.id }
  })

  // If no care context exists, create one
  if (!careContext) {
      await prisma.careContext.create({
          data: { userId: session.user.id }
      })
  }

  return (
    <div className="min-h-screen bg-oku-cream overflow-hidden">
      <CareRoomClient user={session.user} initialContext={careContext} />
    </div>
  )
}
