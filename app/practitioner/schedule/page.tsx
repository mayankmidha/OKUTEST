import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { ArrowLeft, Clock } from "lucide-react"
import CalendarScheduler from "./CalendarScheduler"
import { PractitionerShell } from "@/components/practitioner-shell/practitioner-shell"

export default async function PractitionerSchedulePage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    include: { 
        availability: true,
        overrides: {
            where: { date: { gte: new Date() } },
            orderBy: { date: 'asc' }
        },
        blockedDates: {
            where: { date: { gte: new Date() } },
            orderBy: { date: 'asc' }
        }
    }
  })

  if (!practitioner) redirect('/practitioner/dashboard')

  return (
    <PractitionerShell
      title="Clinical Schedule"
      description="Manage your recurring availability, specific date exceptions, and time-off requests."
      badge="Schedule"
      currentPath="/practitioner/schedule"
      heroActions={
        <div className="px-4 py-2 bg-oku-purple/10 text-oku-purple-dark rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-oku-purple/20">
           <Clock size={14} /> Timezone: IST (UTC+5:30)
        </div>
      }
    >
      <CalendarScheduler 
          initialAvailability={practitioner.availability} 
          overrides={practitioner.overrides}
          blockedDates={practitioner.blockedDates}
      />
    </PractitionerShell>
  )
}
