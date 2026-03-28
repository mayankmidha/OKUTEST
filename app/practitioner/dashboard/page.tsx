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
} from 'lucide-react'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'
import { TaskManager } from '@/components/TaskManager'
import { PractitionerShell, PractitionerStatCard } from '@/components/practitioner-shell/practitioner-shell'
import { autoConvert, formatCurrency } from '@/lib/currency'
import { isPsychiatristProfile } from '@/lib/practitioner-type'
import { getPractitionerFinanceSummary } from '@/lib/provider-finance'

function formatMoney(amount: number) {
  const converted = autoConvert(amount)
  return formatCurrency(converted.amount, converted.currency)
}

function formatSessionTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatSessionDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function NotesPanel({ recentNotes }: { recentNotes: any[] }) {
  return (
    <section className="card-glass p-10 border-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-display font-bold text-oku-dark">Recent Notes</h2>
        <FileText size={20} className="text-oku-lavender-dark opacity-40" />
      </div>
      <div className="space-y-8">
        {recentNotes.length === 0 ? (
          <p className="text-xs text-oku-taupe italic opacity-60 text-center py-10">No secure notes recorded.</p>
        ) : (
          recentNotes.map((note) => (
            <div key={note.id} className="flex gap-5 group cursor-pointer border-b border-oku-taupe/5 pb-6 last:border-0">
              <div className="w-12 h-12 rounded-2xl bg-oku-matcha flex items-center justify-center text-oku-matcha-dark shadow-inner group-hover:bg-oku-dark group-hover:text-white transition-all duration-500">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-base font-bold text-oku-dark group-hover:text-oku-navy transition-colors truncate">
                  {note.appointment.client?.name || 'Patient'}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-oku-taupe opacity-60 font-black mt-1">
                  Finalized {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ArrowUpRight size={16} className="text-oku-taupe opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 self-center" />
            </div>
          ))
        )}
      </div>
      <Link href="/practitioner/clients" className="mt-10 btn-sky w-full block text-center py-4 bg-white/40 border-white hover:bg-white shadow-sm transition-all">
        Clinical Archive
      </Link>
    </section>
  )
}

function PatientPanel({ caseloadCount }: { caseloadCount: number }) {
  return (
    <div className="card-glass p-10 bg-oku-dark text-white border-none shadow-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <Users size={32} className="text-oku-lavender mb-6" strokeWidth={1.5} />
        <h3 className="text-xl font-bold mb-2">Patient Roster</h3>
        <p className="text-xs text-white/40 mb-8 leading-relaxed font-display italic">
          Manage patient records, documentation history, and ongoing clinical coordination.
        </p>
        <Link href="/practitioner/clients" className="btn-primary w-full bg-white text-oku-dark py-4 text-[9px] hover:bg-oku-lavender transition-all">
          Manage {caseloadCount} Patients
        </Link>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-oku-lavender/5 rounded-full blur-2xl" />
    </div>
  )
}

export default async function PractitionerDashboardPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [
    practitioner,
    totalCompleted,
    caseloadCount,
    pendingTasks,
    recentNotes,
    activePrescriptions,
    recentPrescriptions,
  ] = await Promise.all([
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          include: {
            practitionerAppointments: {
              where: {
                startTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
              },
              include: { client: true, service: true },
              orderBy: { startTime: 'asc' },
            },
          },
        },
      },
    }),
    prisma.appointment.count({
      where: { practitionerId: session.user.id, status: AppointmentStatus.COMPLETED },
    }),
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      distinct: ['clientId'],
    }).then((results) => results.length),
    prisma.task.count({
      where: { userId: session.user.id, isCompleted: false },
    }),
    prisma.soapNote.findMany({
      where: { appointment: { practitionerId: session.user.id } },
      include: { appointment: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.prescription.count({
      where: { practitionerId: session.user.id, status: 'ACTIVE' },
    }).catch(() => 0),
    prisma.prescription.findMany({
      where: { practitionerId: session.user.id },
      include: {
        client: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }).catch(() => []),
  ])

  const finance = await getPractitionerFinanceSummary(session.user.id)

  if (!practitioner) {
    await prisma.practitionerProfile.create({
      data: { userId: session.user.id, bio: '', specialization: [] },
    })
    redirect('/practitioner/dashboard')
  }

  const today = new Date().setHours(0, 0, 0, 0)
  const weekAhead = new Date()
  weekAhead.setDate(weekAhead.getDate() + 7)

  const scheduledAppointments = practitioner.user.practitionerAppointments || []
  const todaySessions = scheduledAppointments.filter((appointment: any) => {
    return new Date(appointment.startTime).setHours(0, 0, 0, 0) === today
  })
  const upcomingSessions = scheduledAppointments.filter((appointment: any) => {
    return new Date(appointment.startTime) > new Date()
  })
  const followUpsNextWeek = upcomingSessions.filter((appointment: any) => {
    return new Date(appointment.startTime) <= weekAhead
  })
  const earningsValue = finance.totalEarned
  const earningsLabel = formatMoney(earningsValue)
  const isPsychiatrist = isPsychiatristProfile(practitioner)

  if (isPsychiatrist) {
    return (
      <PractitionerShell
        title="Psychiatry Command"
        description="Medication reviews, psychiatric follow-ups, and consult coordination in one focused workspace."
        badge="Psychiatry Desk"
        currentPath="/practitioner/dashboard"
        canPostBlogs={practitioner.canPostBlogs}
        heroActions={
          <div className="flex items-center gap-4">
            <Link href="/practitioner/appointments" className="btn-sky hidden md:flex items-center gap-2">
              <Clock size={18} /> Review Queue
            </Link>
            <Link href="/practitioner/profile" className="btn-navy group flex items-center gap-2 shadow-2xl">
              <UserIcon size={18} className="group-hover:rotate-12 transition-transform" /> Clinical Profile
            </Link>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <PractitionerStatCard
            label="Total Revenue"
            value={earningsLabel}
            detail="Sessions + assessments"
            accent="bg-oku-matcha-dark"
          />
          <PractitionerStatCard
            label="Active Caseload"
            value={caseloadCount}
            detail="Patients in Care"
            accent="bg-oku-lavender-dark"
          />
          <PractitionerStatCard
            label="Active Prescriptions"
            value={activePrescriptions}
            detail="Medication Plans"
            accent="bg-oku-navy"
          />
          <div className="bg-oku-dark text-white rounded-[2.5rem] p-8 relative overflow-hidden group shadow-pastel">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Next Follow-Up</p>
              <p className="text-xl font-bold truncate mb-1">
                {upcomingSessions[0]?.client?.name?.split(' ')[0] || 'Queue Clear'}
              </p>
              {upcomingSessions[0] && (
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-lavender animate-pulse">
                  Starting at {formatSessionTime(upcomingSessions[0].startTime)}
                </p>
              )}
            </div>
            <Pill className="absolute bottom-[-10px] right-[-10px] text-oku-lavender opacity-10 group-hover:rotate-12 transition-transform" size={80} />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-oku-lavender-dark" />
                  <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Today's Consult Queue</h2>
                </div>
                <Link href="/practitioner/appointments" className="text-[9px] font-black uppercase tracking-widest text-oku-navy-light hover:underline flex items-center gap-1">
                  Full Ledger <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {todaySessions.length === 0 ? (
                  <div className="card-glass py-24 text-center border-dashed bg-oku-glacier/20 border-oku-glacier-dark/10">
                    <p className="text-oku-taupe font-display italic text-2xl opacity-40">No consults scheduled today.</p>
                  </div>
                ) : (
                  todaySessions.map((appointment: any) => (
                    <div key={appointment.id} className="card-glass p-1 group hover:border-oku-lavender-dark/20 transition-all border-oku-taupe/5">
                      <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                          <div className="text-center min-w-[100px] p-4 bg-oku-lavender/30 rounded-2xl border border-oku-lavender-dark/10">
                            <p className="text-2xl font-display font-bold text-oku-dark tracking-tighter">
                              {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-taupe opacity-60 mt-0.5">Start Time</p>
                          </div>
                          <div className="h-12 w-px bg-oku-taupe/10 hidden md:block" />
                          <div>
                            <p className="text-2xl font-display font-bold text-oku-dark leading-tight group-hover:text-oku-navy transition-colors">
                              {appointment.client?.name || 'Patient'}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-oku-glacier/50 text-oku-navy-light rounded-full border border-oku-glacier-dark/5">
                                {appointment.service?.name || 'Consult'}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe flex items-center gap-1 opacity-60">
                                <ShieldCheck size={10} /> Medication Review Ready
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/session/${appointment.id}`} className="btn-navy min-w-[160px] text-center shadow-pastel hover:scale-105 transition-transform">
                          Launch Room
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="card-glass p-10 border-white">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Medication Snapshot</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50 mt-2">Seven-Day Follow-Up Window</p>
                  </div>
                  <Pill size={22} className="text-oku-purple-dark opacity-60" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[2rem] border border-oku-taupe/10 bg-white p-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Follow-Ups</p>
                    <p className="mt-3 text-4xl font-display font-bold text-oku-dark">{followUpsNextWeek.length}</p>
                  </div>
                  <div className="rounded-[2rem] border border-oku-taupe/10 bg-white p-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Open Tasks</p>
                    <p className="mt-3 text-4xl font-display font-bold text-oku-dark">{pendingTasks}</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-oku-taupe font-display italic opacity-70">
                  Stay ahead of adherence issues by using the next-week queue as your medication management touchpoint.
                </p>
              </section>

              <section className="card-glass p-10 border-white">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Recent Prescriptions</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50 mt-2">Most Recent Orders</p>
                  </div>
                  <Brain size={22} className="text-oku-purple-dark opacity-60" />
                </div>
                {recentPrescriptions.length === 0 ? (
                  <p className="text-sm text-oku-taupe font-display italic opacity-70">No prescriptions have been recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentPrescriptions.map((prescription: any) => (
                      <div key={prescription.id} className="rounded-[1.75rem] border border-oku-taupe/10 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-oku-dark">{prescription.medicationName}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mt-1">
                              {prescription.client?.name || 'Patient'} • {prescription.dosage}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-oku-cream text-oku-dark border border-oku-taupe/10">
                            {prescription.status}
                          </span>
                        </div>
                        <p className="text-xs text-oku-taupe mt-3">{prescription.frequency}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="bg-oku-lavender p-12 rounded-[3.5rem] relative overflow-hidden group shadow-premium border border-white">
              <div className="relative z-10">
                <Heart className="text-oku-lavender-dark mb-6 animate-pulse" size={32} />
                <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">Psychiatric Follow-Through</h3>
                <p className="text-oku-taupe italic font-display text-xl leading-relaxed mb-8 max-w-2xl">
                  "Consistency protects outcomes. Keep medication reviews, follow-up notes, and patient education tightly connected."
                </p>
                <div className="flex items-center gap-6">
                  <Link href="/practitioner/clients" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark hover:text-oku-navy-light transition-all group-hover:translate-x-2">
                    Review Care Plans <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="h-[480px] card-glass overflow-hidden p-1 border-oku-rose-dark/5 bg-oku-rose/10">
              <TaskManager />
            </div>
            <NotesPanel recentNotes={recentNotes} />
            <PatientPanel caseloadCount={caseloadCount} />
          </div>
        </div>

        <AIAssistantWidget contextType="practitioner_summary" title="Psychiatry AI Intelligence" />
      </PractitionerShell>
    )
  }

  return (
    <PractitionerShell
      title="Clinical Command"
      description="Refined practice management for deep clinical focus."
      badge="Practitioner HQ"
      currentPath="/practitioner/dashboard"
      canPostBlogs={practitioner.canPostBlogs}
      heroActions={
        <div className="flex items-center gap-4">
          <Link href="/practitioner/schedule" className="btn-sky hidden md:flex items-center gap-2">
            <Clock size={18} /> Manage Hours
          </Link>
          <Link href="/practitioner/profile" className="btn-navy group flex items-center gap-2 shadow-2xl">
            <UserIcon size={18} className="group-hover:rotate-12 transition-transform" /> Professional Profile
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <PractitionerStatCard
            label="Total Revenue"
            value={earningsLabel}
            detail="Sessions + assessments"
            accent="bg-oku-matcha-dark"
          />
        <PractitionerStatCard
          label="Active Caseload"
          value={caseloadCount}
          detail="Unique Patients"
          accent="bg-oku-lavender-dark"
        />
        <PractitionerStatCard
          label="Completed"
          value={totalCompleted}
          detail="Lifetime Sessions"
          accent="bg-oku-glacier-dark"
        />
        <div className="bg-oku-dark text-white rounded-[2.5rem] p-8 relative overflow-hidden group shadow-pastel">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Next Session</p>
            <p className="text-xl font-bold truncate mb-1">
              {upcomingSessions[0]?.client?.name?.split(' ')[0] || 'Queue Clear'}
            </p>
            {upcomingSessions[0] && (
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-lavender animate-pulse">
                Starting at {formatSessionTime(upcomingSessions[0].startTime)}
              </p>
            )}
          </div>
          <Zap className="absolute bottom-[-10px] right-[-10px] text-oku-lavender opacity-10 group-hover:rotate-12 transition-transform" size={80} />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-oku-lavender-dark" />
                <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Active Schedule</h2>
              </div>
              <Link href="/practitioner/appointments" className="text-[9px] font-black uppercase tracking-widest text-oku-navy-light hover:underline flex items-center gap-1">
                Full Ledger <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {todaySessions.length === 0 ? (
                <div className="card-glass py-24 text-center border-dashed bg-oku-glacier/20 border-oku-glacier-dark/10">
                  <p className="text-oku-taupe font-display italic text-2xl opacity-40">The space is quiet today.</p>
                </div>
              ) : (
                todaySessions.map((appointment: any) => (
                  <div key={appointment.id} className="card-glass p-1 group hover:border-oku-lavender-dark/20 transition-all border-oku-taupe/5">
                    <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[100px] p-4 bg-oku-lavender/30 rounded-2xl border border-oku-lavender-dark/10">
                          <p className="text-2xl font-display font-bold text-oku-dark tracking-tighter">
                            {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-taupe opacity-60 mt-0.5">Start Time</p>
                        </div>
                        <div className="h-12 w-px bg-oku-taupe/10 hidden md:block" />
                        <div>
                          <p className="text-2xl font-display font-bold text-oku-dark leading-tight group-hover:text-oku-navy transition-colors">
                            {appointment.client?.name || 'Patient'}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-oku-glacier/50 text-oku-navy-light rounded-full border border-oku-glacier-dark/5">
                              {appointment.service?.name || 'Session'}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe flex items-center gap-1 opacity-60">
                              <ShieldCheck size={10} /> Secure Entry
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/session/${appointment.id}`} className="btn-navy min-w-[160px] text-center shadow-pastel hover:scale-105 transition-transform">
                        Launch Room
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="bg-oku-lavender p-12 rounded-[3.5rem] relative overflow-hidden group shadow-premium border border-white">
            <div className="relative z-10">
              <Heart className="text-oku-lavender-dark mb-6 animate-pulse" size={32} />
              <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">Clinical Resilience</h3>
              <p className="text-oku-taupe italic font-display text-xl leading-relaxed mb-8 max-w-2xl">
                "Your capacity to hold space for others begins with your own gentle returning. Take a breath before your next session."
              </p>
              <div className="flex items-center gap-6">
                <Link href="/practitioner/support" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark hover:text-oku-navy-light transition-all group-hover:translate-x-2">
                  Support Resources <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="h-[480px] card-glass overflow-hidden p-1 border-oku-rose-dark/5 bg-oku-rose/10">
            <TaskManager />
          </div>
          <NotesPanel recentNotes={recentNotes} />
          <PatientPanel caseloadCount={caseloadCount} />
        </div>
      </div>

      <AIAssistantWidget contextType="practitioner_summary" title="Clinical AI Intelligence" />
    </PractitionerShell>
  )
}
