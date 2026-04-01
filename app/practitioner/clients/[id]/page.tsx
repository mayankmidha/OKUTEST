import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, User, Activity, FileText, Heart, Shield, Calendar, Mail, Phone, ExternalLink, Brain } from 'lucide-react'
import { UserRole, AppointmentStatus } from '@prisma/client'
import { TreatmentPlanManager } from '@/components/TreatmentPlanManager'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { AssignAssessmentModal } from '@/components/AssignAssessmentModal'
import { DocumentVault } from '@/components/DocumentVault'
import { WellnessVisualizer } from '@/components/WellnessVisualizer'
import { ClinicalAITranscriptViewer } from '@/components/ClinicalAITranscriptViewer'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id: clientId } = await params
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  // Fetch the client data
  const [clientData, assessments, transcripts, profile] = await Promise.all([
    prisma.user.findFirst({
        where: { 
            id: clientId,
            clientAppointments: {
                some: { practitionerId: session.user.id }
            }
        },
        include: {
            clientProfile: true,
            intakeForm: true,
            clientAppointments: {
                where: { practitionerId: session.user.id },
                include: { soapNote: true, service: true },
                orderBy: { startTime: 'desc' }
            },
            clientTreatmentPlans: {
                where: { practitionerId: session.user.id },
                orderBy: { createdAt: 'desc' }
            },
            assessmentAnswers: {
                include: { assessment: true },
                orderBy: { completedAt: 'desc' }
            },
            moodEntries: {
                orderBy: { createdAt: 'desc' },
                take: 14 // Last 2 weeks
            }
        }
    }),
    prisma.assessment.findMany({
        where: { isActive: true },
        orderBy: { title: 'asc' }
    }),
    prisma.transcript.findMany({
        where: { appointment: { clientId: clientId, practitionerId: session.user.id } },
        include: {
            appointment: {
                include: {
                    service: true,
                    client: {
                        select: { name: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    }),
    prisma.practitionerProfile.findUnique({
        where: { userId: session.user.id },
        select: { canPostBlogs: true }
    })
  ])

  if (!clientData) {
    redirect('/practitioner/clients')
  }

  return (
    <PractitionerShell
        title="Patient File"
        badge="Clinical"
        currentPath="/practitioner/clients"
        description={`Full clinical record and history for ${clientData.name}.`}
        canPostBlogs={profile?.canPostBlogs}
        heroActions={
            <div className="flex gap-4">
                <Link href={`/practitioner/messages?c=${clientData.id}`} className="bg-white text-oku-dark border border-oku-taupe/10 py-3.5 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Secure Message</Link>
                <Link href="/practitioner/appointments" className="btn-primary py-3.5 px-6 text-[10px] shadow-xl">Manage Schedule</Link>
            </div>
        }
    >
        <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Col: Overview & Demographics */}
            <div className="space-y-8">
                {/* Core Bio */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-oku-taupe/5">
                            <div className="w-20 h-20 rounded-2xl bg-oku-purple/10 flex items-center justify-center text-oku-purple text-3xl font-display font-bold shadow-inner">
                                {clientData.name?.substring(0, 1)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-bold text-oku-dark tracking-tighter">{clientData.name}</h3>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1 opacity-60">ID: {clientData.id.slice(-8)}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-oku-taupe">
                                <Mail size={14} />
                                <span className="text-xs font-medium">{clientData.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-oku-taupe">
                                <Phone size={14} />
                                <span className="text-xs font-medium">{clientData.phone || 'No phone recorded'}</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-oku-taupe/5">
                                <p className="text-[9px] uppercase tracking-widest font-black text-oku-taupe mb-2 opacity-40">Practitioner Bio Notes</p>
                                <p className="text-sm italic text-oku-dark/70 leading-relaxed">
                                    {clientData.bio || "No initial clinical bio provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Assign Section */}
                <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-oku-purple" /> Clinical Tasks
                            </h3>
                        </div>
                        <p className="text-xs text-white/60 mb-8 italic">Assign clinical screenings to be completed by the patient before their next session.</p>
                        
                        <div className="space-y-4">
                            {assessments.slice(0, 3).map(a => (
                                <AssignAssessmentModal key={a.id} assessment={a} clients={[{id: clientData.id, name: clientData.name}]} />
                            ))}
                            <Link href="/practitioner/assessments" className="block text-center text-[9px] font-black uppercase tracking-widest text-oku-purple hover:underline pt-2">View Full Tool Catalog →</Link>
                        </div>
                    </div>
                </div>

                {/* Intake Form Data */}
                <div className="bg-oku-cream-warm/30 p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark mb-6 flex items-center gap-2">
                        <Shield size={16} className="text-oku-purple" /> Safety & Intake
                    </h3>
                    {clientData.intakeForm ? (
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Legal Name</p>
                                <p className="text-sm font-bold text-oku-dark">{clientData.intakeForm.legalName || clientData.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Emergency Contact</p>
                                <p className="text-sm font-medium">{clientData.intakeForm.emergencyContact1}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Current Residence</p>
                                <p className="text-xs text-oku-dark leading-relaxed">{clientData.intakeForm.currentAddress}</p>
                            </div>
                            <div className="pt-4 border-t border-oku-taupe/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-oku-success"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-oku-success">Consent Signed</span>
                                </div>
                                <span className="text-[9px] font-black text-oku-taupe opacity-40">{new Date(clientData.intakeForm.signedAt!).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs italic text-oku-taupe opacity-60">Intake form not yet submitted.</p>
                    )}
                </div>
            </div>

            {/* Right Col: Timeline & Notes */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Outcome Analytics */}
                <WellnessVisualizer clientId={clientData.id} />

                {/* Mood Trend */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <Heart className="text-oku-purple" size={24} /> Progress Markers
                    </h2>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                        {clientData.moodEntries.length === 0 ? (
                            <p className="text-sm text-oku-taupe italic py-10 text-center">No self-reported mood data recorded.</p>
                        ) : (
                            <div className="flex items-end gap-2 h-32">
                                {clientData.moodEntries.slice().reverse().map(mood => (
                                    <div key={mood.id} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                                        <div className="w-full bg-oku-purple/20 rounded-t-lg relative">
                                            <div 
                                                className="absolute bottom-0 left-0 right-0 bg-oku-purple rounded-t-lg transition-all" 
                                                style={{ height: `${(mood.mood / 5) * 100}%` }}
                                            />
                                        </div>
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-oku-dark text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                            {mood.mood}/5 • {mood.notes || 'No notes'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-4 opacity-60 text-center">Mood Fluctuations (Last 14 Days)</p>
                    </div>
                </section>

                <TreatmentPlanManager clientId={clientData.id} existingPlans={clientData.clientTreatmentPlans || []} />

                {/* Session Intelligence - Transcripts */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <Brain className="text-oku-navy" size={24} /> Session Intelligence
                    </h2>
                    <ClinicalAITranscriptViewer transcripts={transcripts as any} />
                </section>

                {/* Secure File Vault */}
                <section>
                    <DocumentVault clientId={clientData.id} />
                </section>

                {/* Assessment History */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <Activity className="text-oku-purple" size={24} /> Diagnostic History
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {clientData.assessmentAnswers.length === 0 ? (
                            <div className="col-span-full bg-oku-cream/30 border border-dashed border-oku-taupe/20 rounded-3xl p-10 text-center italic text-oku-taupe text-sm">
                                No completed screenings on record.
                            </div>
                        ) : (
                            clientData.assessmentAnswers.map(ans => (
                                <div key={ans.id} className="bg-white p-6 rounded-3xl border border-oku-taupe/10 shadow-sm flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-oku-purple font-black mb-1">{ans.assessment.title}</p>
                                        <p className="text-lg font-bold text-oku-dark">{ans.result}</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">{new Date(ans.completedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-oku-purple/5 flex items-center justify-center text-oku-purple font-bold">
                                        {ans.score}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Session History & Notes */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <FileText className="text-oku-purple" size={24} /> Clinical Progress Notes
                    </h2>
                    <div className="space-y-6">
                        {clientData.clientAppointments.map(appt => (
                            <div key={appt.id} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-oku-taupe/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-oku-purple/10 text-oku-purple rounded-2xl">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-oku-dark text-lg">{new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</p>
                                            <p className="text-xs text-oku-taupe uppercase tracking-widest font-black mt-1">{appt.service.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black ${
                                            appt.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                            appt.status === 'NO_SHOW' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {appt.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {appt.soapNote ? (
                                    <div className="grid grid-cols-2 gap-6 bg-oku-cream-warm/30 p-6 rounded-3xl">
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Subjective</p>
                                            <p className="text-xs text-oku-dark leading-relaxed italic">"{appt.soapNote.subjective || '-'}"</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Plan</p>
                                            <p className="text-xs text-oku-dark leading-relaxed">{appt.soapNote.plan || '-'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-oku-cream/50 p-6 rounded-3xl border border-dashed border-oku-taupe/20">
                                        <p className="text-sm text-oku-taupe italic">No clinical notes recorded for this session.</p>
                                        {appt.status === 'COMPLETED' && (
                                            <Link href={`/practitioner/sessions/${appt.id}/notes`} className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                                                Add Note
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </PractitionerShell>
  )
}
