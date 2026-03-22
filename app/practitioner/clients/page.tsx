import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Search, User, Calendar, FileText, ArrowRight, Activity, Mail } from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export default async function PractitionerClientsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

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

  return (
    <PractitionerShell
      title="Patient Roster"
      description="Manage your active caseload and clinical files."
      badge="Patients"
      currentPath="/practitioner/clients"
      heroActions={
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe" size={16} />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full bg-white border border-oku-taupe/20 pl-12 pr-4 py-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all shadow-sm"
          />
        </div>
      }
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Total Patients</p>
                 <p className="text-5xl font-display font-bold">{clients.length}</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Average Retention</p>
              <p className="text-5xl font-display font-bold text-oku-dark">
                {clients.length > 0 ? Math.round(clients.reduce((acc, c) => acc + c.totalSessions, 0) / clients.length) : 0} <span className="text-lg text-oku-taupe">sessions</span>
              </p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Missing Notes</p>
              <p className="text-5xl font-display font-bold text-oku-danger">
                 {appointments.filter(a => a.status === 'COMPLETED' && !a.soapNote).length}
              </p>
           </div>
        </div>

        <div className="grid gap-6">
          {clients.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-oku-taupe/20 rounded-[3rem] p-20 text-center">
              <User size={48} className="mx-auto text-oku-taupe/30 mb-6" />
              <h3 className="text-2xl font-display font-bold text-oku-dark mb-2">Your roster is empty</h3>
              <p className="text-oku-taupe">When clients book sessions, they will appear here automatically.</p>
            </div>
          ) : (
            clients.map((c, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="grid md:grid-cols-12 gap-8 items-center">
                  
                  {/* Patient Identity */}
                  <div className="md:col-span-4 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-oku-cream-warm flex items-center justify-center text-oku-dark font-display font-bold text-2xl border-2 border-oku-cream shadow-inner">
                      {c.client.name?.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-oku-dark group-hover:text-oku-purple transition-colors">{c.client.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={12} className="text-oku-taupe" />
                        <span className="text-xs text-oku-taupe">{c.client.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Stats */}
                  <div className="md:col-span-5 grid grid-cols-3 gap-4 border-x border-oku-taupe/10 px-8">
                     <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Sessions</p>
                        <p className="text-lg font-bold text-oku-dark">{c.totalSessions}</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Last Mood</p>
                        <p className="text-lg font-bold text-oku-dark">
                           {c.client.moodEntries[0] ? (
                              c.client.moodEntries[0].mood >= 4 ? '🟢 Good' : c.client.moodEntries[0].mood === 3 ? '🟡 Neutral' : '🔴 Low'
                           ) : '-'}
                        </p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">No Shows</p>
                        <p className={`text-lg font-bold ${c.client.clientProfile?.noShowCount > 0 ? 'text-oku-danger' : 'text-oku-dark'}`}>
                           {c.client.clientProfile?.noShowCount || 0}
                        </p>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex items-center justify-end gap-4">
                     {c.nextSession ? (
                        <div className="text-right mr-4">
                           <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Next Session</p>
                           <p className="text-xs font-bold text-oku-purple-dark">{new Date(c.nextSession).toLocaleDateString()}</p>
                        </div>
                     ) : (
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mr-4">No upcoming</p>
                     )}
                     <Link href={`/practitioner/clients/${c.client.id}`} className="w-12 h-12 rounded-full bg-oku-cream-warm flex items-center justify-center text-oku-dark group-hover:bg-oku-dark group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
    </PractitionerShell>
  )
}
