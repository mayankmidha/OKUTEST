import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { Calendar, Video, Clock, ArrowRight, CheckCircle2, History } from 'lucide-react'
import { AppointmentStatus } from '@prisma/client'

export default async function ClientSessionsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const appointments = await prisma.appointment.findMany({
    where: { clientId: session.user.id },
    include: {
      practitioner: true,
      service: true
    },
    orderBy: { startTime: 'desc' }
  })

  const upcoming = appointments.filter(a => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
  const past = appointments.filter(a => new Date(a.startTime) <= new Date() || a.status === 'COMPLETED')

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="My Sessions" 
        description="View your upcoming appointments and full clinical history."
        actions={
          <Link href="/dashboard/client/therapists" className="btn-primary py-4 px-8 flex items-center gap-2 shadow-xl">
            <Calendar size={18} /> Book New Session
          </Link>
        }
      />

      <div className="space-y-12">
        {/* Upcoming */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-2">Confirmed Appointments</h2>
          {upcoming.length === 0 ? (
            <DashboardCard className="border-dashed py-16 text-center">
               <p className="text-oku-taupe font-display italic text-lg mb-6">No upcoming sessions found.</p>
               <Link href="/dashboard/client/therapists" className="text-oku-purple font-bold hover:underline">Find a therapist to begin →</Link>
            </DashboardCard>
          ) : (
            <div className="grid gap-4">
              {upcoming.map((appt) => (
                <DashboardCard key={appt.id} className="group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all duration-500 shadow-inner">
                        <Video size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-oku-dark text-xl">{appt.practitioner?.name || 'Practitioner'}</p>
                        <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right border-r border-oku-taupe/10 pr-10">
                        <p className="font-bold text-oku-dark">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-oku-taupe font-black uppercase tracking-widest mt-1">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Link href={`/session/${appt.id}`} className="bg-oku-dark text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-oku-purple transition-all shadow-lg active:scale-95">
                        Join Session
                      </Link>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-2">Session History</h2>
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
            {past.length === 0 ? (
              <p className="p-20 text-center text-oku-taupe italic">Your history will appear here once you complete your first session.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8">Therapist</th>
                    <th className="p-8">Service</th>
                    <th className="p-8">Date</th>
                    <th className="p-8">Status</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {past.map((appt) => (
                    <tr key={appt.id} className="hover:bg-oku-cream/20 transition-all group">
                      <td className="p-8">
                        <p className="font-bold text-oku-dark">{appt.practitioner.name}</p>
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
                      <td className="p-8 text-right space-y-2">
                        <Link href="/therapists" className="block text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline transition-opacity">Rebook</Link>
                        {appt.status === 'COMPLETED' && (
                            <Link href={`/dashboard/client/book/${appt.id}/superbill`} className="block text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark hover:underline transition-opacity">
                                Superbill
                            </Link>
                        )}
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
