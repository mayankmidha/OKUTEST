import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DashboardCard } from '@/components/DashboardCard'
import { VisualCalendar } from '@/components/VisualCalendar'
import { Calendar, Video, Clock, CheckCircle2, FileText, AlertTriangle, Search } from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export default async function PractitionerAppointmentsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [appointments, profile] = await Promise.all([
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      include: {
        client: true,
        service: true,
        soapNote: true
      },
      orderBy: { startTime: 'desc' }
    }),
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      select: { canPostBlogs: true }
    })
  ])

  const upcoming = appointments.filter(a => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
  const completed = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'NO_SHOW')

  return (
    <PractitionerShell
      title="Session Ledger"
      description="Clinical appointment schedule and session record management."
      badge="Schedule"
      currentPath="/practitioner/appointments"
      canPostBlogs={profile?.canPostBlogs}
      heroActions={
        <Link href="/practitioner/schedule" className="btn-primary py-3.5 px-6 text-[10px] shadow-xl">Manage Hours</Link>
      }
    >
      <VisualCalendar appointments={appointments} />

      <div className="space-y-12">
        {/* Upcoming Queue */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe ml-2">Upcoming Queue</h2>
          </div>
          {upcoming.length === 0 ? (
            <DashboardCard className="border-dashed py-16 text-center">
               <p className="text-oku-taupe font-display italic text-lg mb-4">The queue is clear.</p>
               <p className="text-xs text-oku-taupe opacity-60">New sessions will appear here automatically.</p>
            </DashboardCard>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((appt) => (
                <DashboardCard key={appt.id} className="group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-oku-purple/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all duration-500 shadow-inner">
                        <Video size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-oku-dark text-xl">{appt.client.name}</p>
                        <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right border-r border-oku-taupe/10 pr-10">
                        <p className="font-bold text-oku-dark">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-oku-taupe font-black uppercase tracking-widest mt-1">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg active:scale-95">
                        Enter Room
                      </Link>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}
        </section>

        {/* Clinical History */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-2">Clinical History</h2>
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
            {completed.length === 0 ? (
              <p className="p-20 text-center text-oku-taupe italic opacity-60">No completed session records found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8">Patient</th>
                    <th className="p-8">Session Type</th>
                    <th className="p-8">Timeline</th>
                    <th className="p-8">Clinical State</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {completed.map((appt) => (
                    <tr key={appt.id} className="hover:bg-oku-cream/20 transition-all group">
                      <td className="p-8">
                        <p className="font-bold text-oku-dark">{appt.client.name}</p>
                      </td>
                      <td className="p-8 text-sm text-oku-taupe">{appt.service.name}</td>
                      <td className="p-8 text-sm text-oku-taupe">{new Date(appt.startTime).toLocaleDateString()}</td>
                      <td className="p-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          appt.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <Link href={`/practitioner/sessions/${appt.id}/notes`} className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                           <FileText size={14} /> {appt.soapNote ? 'Review Note' : 'Add SOAP Note'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </PractitionerShell>
  )
}
