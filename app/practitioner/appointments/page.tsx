import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { Calendar, Video, Clock, CheckCircle2, FileText, AlertCircle, Search } from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'

export default async function PractitionerAppointmentsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const appointments = await prisma.appointment.findMany({
    where: { practitionerId: session.user.id },
    include: {
      client: true,
      service: true,
      soapNote: true
    },
    orderBy: { startTime: 'desc' }
  })

  const upcoming = appointments.filter(a => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
  const completed = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'NO_SHOW')

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Session Ledger" 
        description="Clinical appointment schedule and session record management."
        actions={
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe" size={14} />
                <input type="text" placeholder="Search sessions..." className="pl-10 pr-4 py-3 bg-white border border-oku-taupe/10 rounded-full text-xs focus:outline-none focus:border-oku-purple shadow-sm transition-all" />
             </div>
             <Link href="/practitioner/schedule" className="btn-primary py-3.5 px-6 text-[10px]">Manage Hours</Link>
          </div>
        }
      />

      <div className="space-y-12">
        {/* Upcoming Queue */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe ml-2">Upcoming Queue</h2>
             <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100">Live Schedule</div>
          </div>
          
          {upcoming.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-oku-taupe/20 rounded-[2.5rem] p-16 text-center">
               <p className="text-oku-taupe font-display italic">Your upcoming queue is currently empty.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((appt) => (
                <DashboardCard key={appt.id} className="group border-l-4 border-l-oku-purple">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center min-w-[80px]">
                         <p className="text-2xl font-display font-bold text-oku-dark">
                           {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                         </p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">Start</p>
                      </div>
                      <div className="h-12 w-px bg-oku-taupe/10" />
                      <div>
                        <Link href={`/practitioner/clients/${appt.clientId}`} className="font-bold text-oku-dark text-xl hover:text-oku-purple transition-colors">{appt.client.name}</Link>
                        <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right border-r border-oku-taupe/10 pr-10">
                        <p className="font-bold text-oku-dark">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-oku-taupe font-black uppercase tracking-widest mt-1 opacity-60">Confirmed</p>
                      </div>
                      <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg">
                        Launch Room
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
              <p className="p-20 text-center text-oku-taupe italic opacity-60">No past sessions found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8">Patient</th>
                    <th className="p-8">Service</th>
                    <th className="p-8">Date</th>
                    <th className="p-8">Notes Status</th>
                    <th className="p-8 text-right">Records</th>
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
                        {appt.soapNote ? (
                           <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
                              <CheckCircle2 size={12} /> Filed
                           </span>
                        ) : (
                           <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
                              <AlertCircle size={12} /> Pending Note
                           </span>
                        )}
                      </td>
                      <td className="p-8 text-right">
                        <Link href={`/practitioner/sessions/${appt.id}/notes`} className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                           {appt.soapNote ? 'View Note' : 'Add Note'}
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
    </div>
  )
}
