import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, User, Activity, FileText, Heart, Shield, Calendar } from 'lucide-react'
import { UserRole } from '@prisma/client'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id: clientId } = await params
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  // Fetch the client data, but ONLY if they are assigned to this practitioner
  const clientData = await prisma.user.findFirst({
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
        assessmentAnswers: {
            include: { assessment: true },
            orderBy: { completedAt: 'desc' }
        },
        moodEntries: {
            orderBy: { createdAt: 'desc' },
            take: 14 // Last 2 weeks
        }
    }
  })

  if (!clientData) {
    redirect('/practitioner/clients')
  }

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/practitioner/clients" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark flex items-center gap-2 mb-4">
            <ArrowLeft size={12} /> Patient Roster
          </Link>
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-oku-purple/10 text-oku-purple rounded-full flex items-center justify-center text-3xl font-display font-bold">
                {clientData.name?.substring(0, 1)}
             </div>
             <div>
                <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {clientData.name}
                </h1>
                <p className="text-oku-taupe mt-2 font-display italic">Clinical File & History</p>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Col: Overview & Demographics */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark mb-6 flex items-center gap-2">
                        <User size={16} className="text-oku-purple" /> Patient Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Email</p>
                            <p className="text-sm font-medium">{clientData.email}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Phone</p>
                            <p className="text-sm font-medium">{clientData.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Total Sessions</p>
                            <p className="text-sm font-medium">{clientData.clientAppointments.length}</p>
                        </div>
                        <div className="pt-4 border-t border-oku-taupe/10">
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Patient Bio / Notes</p>
                            <p className="text-sm italic text-oku-taupe">{clientData.bio || 'No bio provided.'}</p>
                        </div>
                    </div>
                </div>

                {/* Intake Form Data */}
                <div className="bg-oku-cream-warm/30 p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark mb-6 flex items-center gap-2">
                        <Shield size={16} className="text-oku-purple" /> Intake & Safety
                    </h3>
                    {clientData.intakeForm ? (
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Emergency Contact</p>
                                <p className="text-sm font-medium">{clientData.intakeForm.emergencyContact}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Medical History</p>
                                <p className="text-sm text-oku-dark leading-relaxed">{clientData.intakeForm.medicalHistory || 'None reported.'}</p>
                            </div>
                            <div className="pt-4 border-t border-oku-taupe/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Consent Signed</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs italic text-oku-taupe opacity-60">Intake form not yet submitted.</p>
                    )}
                </div>

                <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-oku-purple" /> Clinical Screenings
                            </h3>
                            <Link href="/practitioner/assessments/new" className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">
                                Assign New
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {clientData.assessmentAnswers.length === 0 ? (
                                <p className="text-xs italic opacity-60">No assessments taken.</p>
                            ) : (
                                clientData.assessmentAnswers.map(ans => (
                                    <div key={ans.id} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-oku-purple font-black mb-1">{ans.assessment.title}</p>
                                        <p className="font-bold">{String(ans.result)}</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-40 mt-2">{new Date(ans.completedAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            </div>

            {/* Right Col: Timeline & Notes */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Mood Trend */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <Heart className="text-oku-purple" size={24} /> Recent Mood Trend
                    </h2>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                        {clientData.moodEntries.length === 0 ? (
                            <p className="text-sm text-oku-taupe italic">No mood data recorded by patient.</p>
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
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-4 opacity-60 text-center">Last 14 Entries (1=Low, 5=High)</p>
                    </div>
                </section>

                {/* Session History & Notes */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-oku-dark mb-6 flex items-center gap-3">
                        <FileText className="text-oku-purple" size={24} /> Session History & Clinical Notes
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
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Subjective</p>
                                            <p className="text-sm text-oku-dark leading-relaxed">{appt.soapNote.subjective || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Objective</p>
                                            <p className="text-sm text-oku-dark leading-relaxed">{appt.soapNote.objective || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Assessment</p>
                                            <p className="text-sm text-oku-dark leading-relaxed">{appt.soapNote.assessment || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Plan</p>
                                            <p className="text-sm text-oku-dark leading-relaxed">{appt.soapNote.plan || '-'}</p>
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

      </div>
    </div>
  )
}
