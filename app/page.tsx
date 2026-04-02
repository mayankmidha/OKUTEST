import OKUHomepage from '@/components/OKUHomepage'
import { SocialProofBar } from '@/components/SocialProofBar'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

export default async function Home() {
  const [practitionerCount, sessionCount, clientCount] = await Promise.all([
    prisma.practitionerProfile.count({ where: { isVerified: true } }),
    prisma.appointment.count({ where: { status: 'COMPLETED' } }),
    prisma.user.count({ where: { role: 'CLIENT' } }),
  ])

  return (
    <>
      <SocialProofBar
        practitionerCount={practitionerCount}
        sessionCount={sessionCount}
        clientCount={clientCount}
      />
      <OKUHomepage />
    </>
  )
}
