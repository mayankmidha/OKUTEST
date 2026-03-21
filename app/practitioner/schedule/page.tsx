import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { prisma } from "@/lib/prisma"
import { Save, Clock, AlertCircle } from "lucide-react"
import { UserRole } from "@prisma/client"

export default async function ScheduleManagementPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.PRACTITIONER) {
    redirect("/dashboard")
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    include: { availability: true }
  })

  if (!practitioner) redirect("/dashboard")

  const days = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ]

  return (
    <div className="min-h-screen bg-oku-cream py-20 px-6">
      <Header />
      <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-xl mt-12">
        <h1 className="text-4xl font-display font-bold text-oku-dark mb-8">Manage Availability</h1>
        
        <form action="/api/availability/update" method="POST">
          <div className="space-y-6">
            {days.map((day) => {
              const current = practitioner.availability.find(a => a.dayOfWeek === day.value)
              return (
                <div key={day.value} className="flex items-center justify-between p-6 bg-oku-cream/30 rounded-[2rem] border border-oku-taupe/5">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      name={`active_${day.value}`} 
                      defaultChecked={!!current}
                      className="w-6 h-6 rounded-full border-oku-purple text-oku-purple focus:ring-oku-purple"
                    />
                    <span className="font-bold text-oku-dark w-24">{day.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="time" 
                      name={`start_${day.value}`} 
                      defaultValue={current?.startTime || "09:00"}
                      className="px-4 py-2 rounded-pill border-oku-taupe/20 bg-white"
                    />
                    <span className="text-oku-taupe">to</span>
                    <input 
                      type="time" 
                      name={`end_${day.value}`} 
                      defaultValue={current?.endTime || "17:00"}
                      className="px-4 py-2 rounded-pill border-oku-taupe/20 bg-white"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <button type="submit" className="btn-primary w-full mt-12 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Save Schedule
          </button>
        </form>
      </div>
    </div>
  )
}
