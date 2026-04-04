import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { ClientRosterList } from '@/components/ClientRosterList'

export const dynamic = 'force-dynamic'

export default async function PractitionerClientsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const profile = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    select: { canPostBlogs: true }
  })

  // Fetch unique clients for this practitioner
  const appointments = await prisma.appointment.findMany({
    where: { practitionerId: session.user.id },
    include: {
      client: {
        include: {
          clientProfile: true,
          moodEntries: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      },
      soapNote: true
    },
    orderBy: { startTime: 'desc' }
  })

  // Group by client
  const clientMap = new Map()
  appointments.forEach(appt => {
    if (!clientMap.has(appt.clientId)) {
      clientMap.set(appt.clientId, {
        client: appt.client,
        totalSessions: 1,
        lastSession: appt.startTime,
        nextSession: null,
        notesCount: appt.soapNote ? 1 : 0
      })
    } else {
      const existing = clientMap.get(appt.clientId)
      existing.totalSessions += 1
      if (appt.soapNote) existing.notesCount += 1
      // Check if it's a future session
      if (new Date(appt.startTime) > new Date()) {
          existing.nextSession = appt.startTime
      }
    }
  })

  const clients = Array.from(clientMap.values())
  const missingNotes = appointments.filter(a => a.status === 'COMPLETED' && !a.soapNote).length
  const avgRetention = clients.length > 0
    ? Math.round(clients.reduce((acc, c) => acc + c.totalSessions, 0) / clients.length)
    : 0

  return (
    <PractitionerShell
      title="Patient Roster"
      description="Manage your active caseload and clinical files."
      badge="Patients"
      currentPath="/practitioner/clients"
      canPostBlogs={profile?.canPostBlogs}
    >
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:mb-12 xl:grid-cols-3">
        <div className="card-glass-3d relative overflow-hidden !bg-oku-darkgrey !p-6 animate-float-3d sm:!p-8">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-2">Total Patients</p>
            <p className="heading-display text-4xl text-white sm:text-5xl">{clients.length}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple-dark/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="card-glass-3d !bg-oku-mint/60 !p-6 animate-float-3d sm:!p-8" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/40 mb-2">Avg. Retention</p>
          <p className="heading-display text-4xl text-oku-darkgrey sm:text-5xl">
            {avgRetention} <span className="text-lg text-oku-darkgrey/40">sessions</span>
          </p>
        </div>
        <div className="card-glass-3d !bg-oku-peach/60 !p-6 animate-float-3d sm:col-span-2 sm:!p-8 xl:col-span-1" style={{ animationDelay: '0.4s' }}>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/40 mb-2">Missing Notes</p>
          <p className={`heading-display text-4xl sm:text-5xl ${missingNotes > 0 ? 'text-red-500' : 'text-oku-darkgrey'}`}>
            {missingNotes}
          </p>
        </div>
      </div>

      <ClientRosterList clients={clients} />
    </PractitionerShell>
  )
}
