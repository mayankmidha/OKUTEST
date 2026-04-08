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
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <DashboardHeader 
        title="My Sessions" 
        description="View your upcoming appointments and full clinical history."
        actions={
          <Link href="/dashboard/client/therapists" className="btn-primary flex w-full items-center justify-center gap-2 px-8 py-4 shadow-xl sm:w-auto">
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
                  <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple group-hover:bg-oku-purple group-hover:text-white transition-all duration-500 shadow-inner">
                        <Video size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-oku-dark text-xl">{appt.practitioner?.name || 'Practitioner'}</p>
                        <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 border-t border-oku-taupe/10 pt-4 sm:flex-row sm:items-center sm:gap-6 xl:border-l xl:border-t-0 xl:pt-0 xl:pl-10">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-oku-dark">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-oku-taupe font-black uppercase tracking-widest mt-1">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Link href={`/session/${appt.id}`} className="w-full rounded-full bg-oku-dark px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-oku-purple active:scale-95 sm:w-auto sm:px-10">
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
              <>
                <div className="space-y-4 p-4 md:hidden">
                  {past.map((appt) => (
                    <div key={appt.id} className="rounded-[1.75rem] border border-oku-taupe/10 bg-oku-cream/10 p-5">
                      <p className="font-bold text-oku-dark">{appt.practitioner.name}</p>
                      <p className="mt-1 text-sm text-oku-taupe">{appt.service.name}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <p className="text-xs font-black uppercase tracking-widest text-oku-taupe">{new Date(appt.startTime).toLocaleDateString()}</p>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          appt.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="mt-5 flex flex-col gap-2">
                        <Link href="/therapists" className="text-[10px] font-black uppercase tracking-widest text-oku-purple transition-opacity hover:underline">Rebook</Link>
                        {appt.status === 'COMPLETED' && (
                            <Link href={`/dashboard/client/book/${appt.id}/superbill`} className="text-[10px] font-black uppercase tracking-widest text-oku-taupe transition-opacity hover:text-oku-dark hover:underline">
                                Superbill
                            </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[760px] w-full text-left">
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
                        <tr key={appt.id} className="group transition-all hover:bg-oku-cream/20">
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
                          <td className="space-y-2 p-8 text-right">
                            <Link href="/therapists" className="block text-[10px] font-black uppercase tracking-widest text-oku-purple transition-opacity hover:underline">Rebook</Link>
                            {appt.status === 'COMPLETED' && (
                                <Link href={`/dashboard/client/book/${appt.id}/superbill`} className="block text-[10px] font-black uppercase tracking-widest text-oku-taupe transition-opacity hover:text-oku-dark hover:underline">
                                    Superbill
                                </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
