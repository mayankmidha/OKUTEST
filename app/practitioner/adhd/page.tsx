import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { BodyDoubleRoom } from '@/components/BodyDoubleRoom'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export const dynamic = 'force-dynamic'

export default async function PractitionerADHDPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
    redirect('/auth/login')
  }

  const user = {
    id: session.user.id,
    name: session.user.name || 'Practitioner',
    role: session.user.role
  }

  return (
    <PractitionerShell
      title="Focus Sanctuary"
      badge="ADHD Support"
      currentPath="/practitioner/adhd"
      description="Anonymous communal focus for deep documentation and clinical prep."
    >
      <div className="max-w-6xl mx-auto py-10">
        <BodyDoubleRoom user={user} isTherapist={true} />
      </div>
    </PractitionerShell>
  )
}
