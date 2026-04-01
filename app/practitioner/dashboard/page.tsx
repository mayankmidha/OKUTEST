import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Clock,
  FileText,
  Heart,
  Pill,
  ShieldCheck,
  User as UserIcon,
  Users,
  Zap,
  Calendar,
  Activity,
  Plus,
  MessageSquare,
  Save,
  CheckCircle2,
  Moon,
  Sparkles
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export const dynamic = 'force-dynamic'

export default async function PractitionerDashboardPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [
    practitioner,
    totalCompleted,
    caseloadCount,
    recentNotes,
    upcomingSessions,
    allClientAppointments,
  ] = await Promise.all([
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    }),
    prisma.appointment.count({
      where: { practitionerId: session.user.id, status: AppointmentStatus.COMPLETED },
    }),
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      distinct: ['clientId'],
    }).then((results) => results.length),
    prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: session.user.id,
        startTime: { gte: new Date() },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      include: { client: true, service: true, participants: { include: { user: true } } },
      orderBy: { startTime: 'asc' },
      take: 10
    }),
    // Fetch appointments to build real patient roster
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id, clientId: { not: null } },
      include: { client: true },
      orderBy: { startTime: 'desc' },
    }),
  ])

  if (!practitioner) {
    redirect('/auth/login')
  }

  const facilitatedCircles = upcomingSessions.filter(s => s.isGroupSession)
  const individualSessions = upcomingSessions.filter(s => !s.isGroupSession)

  const todaySessionsCount = upcomingSessions.filter(s =>
    new Date(s.startTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
  ).length

  // Build real patient roster from appointment history
  const rosterMap = new Map<string, {
    client: NonNullable<typeof allClientAppointments[0]['client']>
    totalSessions: number
    lastSession: Date
    status: string
  }>()
  allClientAppointments.forEach(appt => {
    if (!appt.clientId || !appt.client) return
    if (!rosterMap.has(appt.clientId)) {
      rosterMap.set(appt.clientId, {
        client: appt.client,
        totalSessions: 1,
        lastSession: appt.startTime,
        status: appt.status === AppointmentStatus.COMPLETED ? 'Active' : 'Scheduled',
      })
    } else {
      const existing = rosterMap.get(appt.clientId)!
      existing.totalSessions += 1
      if (new Date(appt.startTime) > existing.lastSession) {
        existing.lastSession = appt.startTime
      }
    }
  })
  const patientRoster = Array.from(rosterMap.values()).slice(0, 8)

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-mint/10 relative overflow-hidden">
      {/* Redesign Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="chip bg-white/60 border-white/80">Clinical Workspace</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Therapist Dashboard</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Presence, <span className="text-oku-purple-dark italic">{session.user.name?.split(' ')[0]}.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Holding space for clinical excellence and compassionate care.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/practitioner/schedule" className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10">
             <Clock size={18} className="mr-3 text-oku-purple-dark" /> Manage Hours
          </Link>
          <Link href="/practitioner/profile" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 pulse-cta">
             <UserIcon size={18} className="mr-3" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* 1. 3D Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Activity size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/40">Today</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{todaySessionsCount}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Sessions Remaining</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Active</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{caseloadCount}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Total Patient Roster</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-peach/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <CheckCircle2 size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Lifetime</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{totalCompleted}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Sessions Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        {/* Left Section */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* Facilitated Circles */}
          {facilitatedCircles.length > 0 && (
            <section className="card-glass-3d !p-12 !bg-oku-lavender/30 border-oku-purple/20">
              <div className="flex items-center justify-between mb-12">
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Facilitated <span className="italic text-oku-purple-dark">Circles</span></h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark px-4 py-2 bg-white rounded-full shadow-sm">Group Therapy Host</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facilitatedCircles.map(circle => {
                  const [title, desc] = (circle.notes || '|').split('|')
                  return (
                    <div key={circle.id} className="card-glass-3d !p-8 !bg-white/60 group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark">
                          <Users size={20} />
                        </div>
                        <Link href={`/session/${circle.id}`} className="btn-pill-3d bg-oku-darkgrey text-white !py-2 !px-6 text-[8px]">Enter Room</Link>
                      </div>
                      <h3 className="text-xl font-bold text-oku-darkgrey mb-2">{title || 'Untitled Circle'}</h3>
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                        <span>{new Date(circle.startTime).toLocaleDateString()}</span>
                        <span>{new Date(circle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="mt-6 pt-6 border-t border-oku-darkgrey/5 flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-oku-purple-dark">{circle.participants.length} Seeker(s) Joined</span>
                        <div className="flex -space-x-2">
                          {circle.participants.slice(0,3).map((p: any) => (
                            <div key={p.id} className="w-6 h-6 rounded-full bg-oku-blush border-2 border-white flex items-center justify-center text-[8px] font-bold text-oku-darkgrey/40">
                              {p.user?.name?.substring(0,1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Active Schedule */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Active <span className="italic text-oku-purple-dark">Schedule</span></h2>
              <Link href="/practitioner/appointments" className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2">Full Ledger <ArrowUpRight size={14} /></Link>
            </div>
            
            <div className="space-y-6">
              {individualSessions.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                  <Moon className="mx-auto text-oku-purple-dark/20 mb-6 animate-float-3d" size={48} />
                  <p className="text-2xl font-display italic text-oku-darkgrey/30">The queue is clear.</p>
                </div>
              ) : (
                upcomingSessions.map((appt) => (
                  <div key={appt.id} className="card-glass-3d !p-8 !bg-white/60 group hover:shadow-2xl transition-all duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="flex items-center gap-8">
                        <div className="relative tilt-card">
                          <div className="w-20 h-20 rounded-[1.75rem] bg-oku-babyblue overflow-hidden border-4 border-white shadow-xl tilt-card-content flex items-center justify-center text-2xl font-bold text-oku-darkgrey/40">
                            {appt.client?.name?.substring(0, 1)}
                          </div>
                        </div>
                        <div>
                          <p className="text-3xl heading-display text-oku-darkgrey">{appt.client?.name || 'Patient Seeker'}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-oku-purple-dark/10 text-oku-purple-dark rounded-full border border-oku-purple-dark/10">{appt.service?.name || 'Session'}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 flex items-center gap-2"><ShieldCheck size={12} /> Video Ready</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-oku-darkgrey/5 pt-8 md:pt-0 md:pl-10">
                        <div className="text-right min-w-[120px]">
                          <p className="text-2xl font-bold text-oku-darkgrey">
                             {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-oku-darkgrey/40 font-black uppercase tracking-widest mt-1">
                             Today, {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <Link href={`/session/${appt.id}`} className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white min-w-[180px] pulse-cta">
                          Enter Care Room
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Patient Roster / Glassmorphism Table */}
          <section className="card-glass-3d !p-12 !bg-white/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Patient <span className="italic text-oku-purple-dark">Roster</span></h2>
              <Link href="/practitioner/clients" className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-2">Full Roster <ArrowUpRight size={14} /></Link>
            </div>
            {patientRoster.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                <Moon className="mx-auto text-oku-purple-dark/20 mb-6 animate-float-3d" size={48} />
                <p className="text-2xl font-display italic text-oku-darkgrey/30">No clients yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2rem] border border-white shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-oku-lavender/40">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Client</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Sessions</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Last Session</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/20">
                    {patientRoster.map((entry) => (
                      <tr key={entry.client.id} className="border-t border-white/40 hover:bg-white/40 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-oku-blush flex items-center justify-center text-xs font-black text-oku-darkgrey/60">
                              {entry.client.name?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                            <span className="font-bold text-oku-darkgrey text-sm">{entry.client.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-oku-darkgrey/60">{entry.totalSessions}</td>
                        <td className="px-8 py-6 text-sm text-oku-darkgrey/60 italic font-display">
                          {new Date(entry.lastSession).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-oku-mint text-oku-darkgrey/60 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{entry.status}</span>
                        </td>
                        <td className="px-8 py-6">
                          <Link href={`/practitioner/clients/${entry.client.id}`} className="text-oku-purple-dark hover:underline text-[10px] font-black uppercase tracking-widest">View File</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Right Section */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* Clinical Resilience / Notes (Butter Yellow) */}
          <section className="card-glass-3d !bg-oku-butter !p-10 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Sparkles className="text-oku-purple-dark/60 animate-float-3d" size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Quick Note</span>
              </div>
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-6">Clinical <span className="italic text-oku-purple-dark">Scratchpad</span></h3>
              <textarea 
                placeholder="Draft clinical insights or thoughts here..."
                className="w-full h-40 bg-white/40 border border-white/60 rounded-[2rem] p-6 text-sm italic font-display focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all shadow-sm placeholder:text-oku-darkgrey/30"
              />
              <button className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 mt-6 group">
                <Save size={16} className="mr-3 group-hover:scale-110 transition-transform" /> Auto-Saving
              </button>
            </div>
          </section>

          {/* 5. Clinical Vault / Recent SOAP Notes (Lavender) */}
          <section className="card-glass-3d !bg-oku-lavender/60 !p-10 group">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Recent <span className="italic text-oku-purple-dark">SOAP Notes</span></h2>
              <FileText size={20} className="text-oku-purple-dark/40 animate-float-3d" />
            </div>
            
            <div className="space-y-6">
              {recentNotes.length === 0 ? (
                <p className="text-oku-darkgrey/40 italic font-display">No finalized notes yet.</p>
              ) : (
                recentNotes.map((note) => (
                  <div key={note.id} className="p-6 bg-white/40 rounded-3xl border border-white hover:bg-white transition-all duration-500 cursor-pointer">
                    <p className="font-bold text-oku-darkgrey text-sm">{note.appointment.client?.name}</p>
                    <p className="text-[9px] uppercase tracking-widest text-oku-darkgrey/40 mt-1 font-black">{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
              <Link href="/practitioner/clients" className="btn-pill-3d bg-white border-white text-oku-darkgrey w-full !py-4 text-[9px]">
                Full Clinical Archive
              </Link>
            </div>
          </section>

          {/* AI Strategy Placeholder */}
          <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-dashed border-2">
             <Brain size={24} className="text-oku-purple-dark/40 mb-6 animate-float-3d" />
             <p className="text-sm font-bold text-oku-darkgrey/60 italic leading-relaxed">
               "Focus on the relational patterns emerging in your caseload this week."
             </p>
          </div>

        </div>
      </div>
      
      {/* 3D Background Objects */}
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
