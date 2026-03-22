import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { ArrowLeft } from "lucide-react"
import CalendarScheduler from "./CalendarScheduler"

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
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/practitioner/dashboard" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark flex items-center gap-2 mb-4">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">Clinical Schedule</h1>
          <p className="text-oku-taupe mt-2 font-display italic">Manage your recurring availability and specific date overrides.</p>
        </div>

        <CalendarScheduler 
            initialAvailability={practitioner.availability} 
            overrides={practitioner.overrides}
            blockedDates={practitioner.blockedDates}
        />
      </div>
    </div>
  )
}
