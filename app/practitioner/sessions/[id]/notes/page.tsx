import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PractitionerShell } from "@/components/practitioner-shell/practitioner-shell"
import { NotesEditor } from "@/components/NotesEditor"

export default async function SessionNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!session?.user || session.user.role !== 'THERAPIST') {
    redirect("/dashboard")
  }

  const therapistSession = await prisma.appointment.findUnique({
    where: { id: id },
    include: { 
        client: true,
        soapNote: true
    }
  })

  if (!therapistSession || therapistSession.practitionerId !== session.user.id) {
    redirect("/practitioner/dashboard")
  }

  return (
    <PractitionerShell
      title="Clinical Progress Note"
      badge="Clinical"
      currentPath="/practitioner/appointments"
      description={`Documenting session insights and therapeutic progress for ${therapistSession.client.name}.`}
    >
      <div className="max-w-5xl mx-auto">
        <NotesEditor appointment={therapistSession} existingNote={therapistSession.soapNote} />
      </div>
    </PractitionerShell>
  )
}
