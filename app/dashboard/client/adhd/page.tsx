import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Brain, CalendarClock, Sparkles } from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { TaskManager } from '@/components/TaskManager'
import { AIAssistantWidget } from '@/components/AIAssistantWidget'

function isAdhdAssessment(title?: string | null) {
  const normalizedTitle = (title || '').toLowerCase()
  return (
    normalizedTitle.includes('adhd') ||
    normalizedTitle.includes('executive') ||
    normalizedTitle.includes('asrs') ||
    normalizedTitle.includes('conners') ||
    normalizedTitle.includes('brief')
  )
}

export default async function ClientAdhdHelperPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const [assessmentAnswers, transcripts, upcomingAppointments] = await Promise.all([
    prisma.assessmentAnswer.findMany({
      where: { userId: session.user.id },
      include: { assessment: true },
      orderBy: { completedAt: 'desc' },
      take: 6,
    }),
    prisma.transcript.findMany({
      where: {
        appointment: { clientId: session.user.id },
      },
      include: {
        appointment: {
          include: {
            practitioner: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.appointment.findMany({
      where: {
        clientId: session.user.id,
        startTime: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      include: {
        practitioner: { select: { name: true } },
      },
      orderBy: { startTime: 'asc' },
      take: 3,
    }),
  ])

  const adhdAssessments = assessmentAnswers.filter((answer) => isAdhdAssessment(answer.assessment?.title))
  const adhdSignalTranscripts = transcripts.filter(
    (transcript) => Array.isArray(transcript.adhdSignals) && transcript.adhdSignals.length > 0
  )

  const activeRecommendations = adhdSignalTranscripts.flatMap((transcript) =>
    Array.isArray(transcript.careRecommendations) ? transcript.careRecommendations : []
  ).slice(0, 6)

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto space-y-10">
      <DashboardHeader
        title="ADHD Helper"
        description="Executive-function support, clinical signals, and practical next steps in one workspace."
        actions={
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client/clinical" className="btn-sky hidden md:flex items-center gap-2">
              <Brain size={18} /> Clinical Record
            </Link>
            <Link href="/dashboard/client/book" className="btn-navy flex items-center gap-2">
              <CalendarClock size={18} /> Upcoming Sessions
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard title="ADHD Screenings" variant="lavender">
          <p className="text-3xl font-display font-bold text-oku-dark">{adhdAssessments.length}</p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe">
            Executive-function assessments on file
          </p>
        </DashboardCard>
        <DashboardCard title="AI Flagged Sessions" variant="matcha">
          <p className="text-3xl font-display font-bold text-oku-dark">{adhdSignalTranscripts.length}</p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe">
            Sessions with ADHD or EF markers
          </p>
        </DashboardCard>
        <DashboardCard title="Action Queue" variant="white">
          <p className="text-3xl font-display font-bold text-oku-dark">{activeRecommendations.length}</p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe">
            AI care recommendations ready to use
          </p>
        </DashboardCard>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="card-glass p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-oku-purple/10 text-oku-purple-dark flex items-center justify-center">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-oku-dark">Focus Supports</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Latest AI-informed guidance</p>
              </div>
            </div>

            {activeRecommendations.length === 0 ? (
              <p className="text-sm italic text-oku-taupe">
                No ADHD-specific care recommendations have been generated yet. As more sessions and screenings are completed, OKU AI will surface more targeted supports here.
              </p>
            ) : (
              <div className="space-y-3">
                {activeRecommendations.map((recommendation, index) => (
                  <div key={`${recommendation}-${index}`} className="rounded-[1.75rem] border border-oku-taupe/5 bg-white px-5 py-4 text-sm text-oku-dark">
                    {String(recommendation)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-glass p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-oku-ocean text-oku-navy-light flex items-center justify-center">
                <Brain size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-oku-dark">Assessment Track</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Recent ADHD and executive-function screenings</p>
              </div>
            </div>

            {adhdAssessments.length === 0 ? (
              <p className="text-sm italic text-oku-taupe">
                No ADHD-focused assessments have been completed yet. Your clinician can assign one from the clinical dashboard.
              </p>
            ) : (
              <div className="space-y-4">
                {adhdAssessments.map((assessment) => (
                  <div key={assessment.id} className="rounded-[1.75rem] border border-oku-taupe/5 bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-oku-dark">{assessment.assessment.title}</p>
                        <p className="mt-1 text-xs text-oku-taupe">
                          Completed {new Date(assessment.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">Clinical State</p>
                        <p className="mt-1 text-sm font-bold text-oku-dark">{assessment.result || 'Recorded'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <TaskManager />

          <div className="card-glass p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-oku-matcha text-oku-matcha-dark flex items-center justify-center">
                <CalendarClock size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-oku-dark">Next Support Window</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Upcoming care touchpoints</p>
              </div>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-sm italic text-oku-taupe">
                No upcoming sessions are booked. Use this workspace to collect patterns, then bring them into your next appointment.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-[1.75rem] border border-oku-taupe/5 bg-white px-5 py-4">
                    <p className="font-bold text-oku-dark">{appointment.practitioner?.name || 'Practitioner'}</p>
                    <p className="mt-1 text-xs text-oku-taupe">
                      {new Date(appointment.startTime).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2.5rem] border border-oku-purple/10 bg-oku-purple/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-oku-purple-dark" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">OKU AI ADHD Mode</p>
            </div>
            <p className="text-sm text-oku-dark leading-relaxed">
              Ask for micro-plans, low-overwhelm schedules, body-doubling ideas, task breakdowns, and session prep in any language.
            </p>
          </div>
        </div>
      </div>

      <AIAssistantWidget contextType="adhd_helper" title="ADHD Helper" />
    </div>
  )
}
