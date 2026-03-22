import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  ClipboardCheck, FileText, Target, 
  ShieldCheck, ArrowRight, History, 
  Sparkles, Activity
} from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { ASSESSMENTS } from '@/lib/assessments'

export default async function ClientClinicalHub() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Fetch all clinical data for this client
  const [intake, assessmentAnswers, treatmentPlans] = await Promise.all([
    prisma.intakeForm.findUnique({ where: { userId: session.user.id } }),
    prisma.assessmentAnswer.findMany({
      where: { userId: session.user.id },
      include: { assessment: true },
      orderBy: { completedAt: 'desc' }
    }),
    prisma.treatmentPlan.findMany({
      where: { clientId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { practitioner: { select: { name: true } } }
    })
  ])

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Clinical Record" 
        description="A secure overview of your therapeutic journey, assessments, and clinical documentation."
        actions={
          <Link href="/assessments" className="btn-primary py-4 px-8 flex items-center gap-2 shadow-xl">
            <ClipboardCheck size={18} /> Take New Screening
          </Link>
        }
      />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* 1. Active Treatment Plans */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-2">Active Therapeutic Strategy</h2>
            {treatmentPlans.length === 0 ? (
              <DashboardCard className="border-dashed py-16 text-center">
                 <Target size={32} className="mx-auto text-oku-taupe/20 mb-4" strokeWidth={1} />
                 <p className="text-oku-taupe font-display italic text-lg">No treatment plan initialized yet.</p>
                 <p className="text-xs text-oku-taupe opacity-60 mt-2">Your practitioner will collaborate with you to build this.</p>
              </DashboardCard>
            ) : (
              <div className="space-y-6">
                {treatmentPlans.map(plan => (
                  <DashboardCard key={plan.id} variant={plan.status === 'ACTIVE' ? 'purple' : 'white'} title={plan.status === 'ACTIVE' ? 'Active Clinical Plan' : 'Revised Plan'}>
                    <div className="mt-4 space-y-6">
                       <div className="flex justify-between items-start border-b border-oku-taupe/5 pb-4">
                          <div>
                             <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Practitioner</p>
                             <p className="font-bold text-oku-dark text-lg">{plan.practitioner.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Last Updated</p>
                             <p className="text-sm font-medium">{new Date(plan.updatedAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-8">
                          <div>
                             <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mb-2">Focus Goals</p>
                             <p className="text-sm italic text-oku-taupe leading-relaxed">{plan.goals}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mb-2">Key Objectives</p>
                             <p className="text-sm italic text-oku-taupe leading-relaxed">{plan.objectives}</p>
                          </div>
                       </div>
                    </div>
                  </DashboardCard>
                ))}
              </div>
            )}
          </section>

          {/* 2. Assessment History */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe mb-6 ml-2">Diagnostic Timeline</h2>
            <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
              {assessmentAnswers.length === 0 ? (
                <div className="p-20 text-center">
                   <p className="text-oku-taupe italic opacity-60">No completed assessments recorded.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                    <tr>
                      <th className="p-8">Assessment</th>
                      <th className="p-8">Clinical State</th>
                      <th className="p-8">Date</th>
                      <th className="p-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-oku-taupe/5">
                    {assessmentAnswers.map((ans) => {
                      const slug = ASSESSMENTS.find(a => a.title === ans.assessment.title)?.slug
                      return (
                        <tr key={ans.id} className="hover:bg-oku-cream/20 transition-all group">
                          <td className="p-8">
                            <p className="font-bold text-oku-dark">{ans.assessment.title}</p>
                          </td>
                          <td className="p-8">
                            <span className="bg-oku-purple/10 text-oku-purple-dark text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              {ans.result}
                            </span>
                          </td>
                          <td className="p-8 text-sm text-oku-taupe">
                            {new Date(ans.completedAt).toLocaleDateString()}
                          </td>
                          <td className="p-8 text-right">
                             {slug ? (
                               <Link href={`/assessments/${slug}`} className="text-oku-purple hover:underline text-[10px] font-black uppercase tracking-widest">Retake</Link>
                             ) : (
                               <Link href="/assessments" className="text-oku-taupe hover:underline text-[10px] font-black uppercase tracking-widest">View Hub</Link>
                             )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Compliance & Info */}
        <div className="space-y-8">
          <DashboardCard title="Onboarding Status" icon={<ShieldCheck size={20} strokeWidth={1.5} />}>
             <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-oku-taupe/5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Informed Consent</span>
                   {intake?.hasSignedConsent ? (
                     <span className="text-[9px] font-black uppercase text-oku-success flex items-center gap-1"><ShieldCheck size={12}/> Verified</span>
                   ) : (
                     <Link href="/dashboard/client/intake" className="text-[9px] font-black uppercase text-oku-danger hover:underline">Needs Signature</Link>
                   )}
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-oku-taupe/5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Medical Intake</span>
                   {intake?.medicalHistory ? (
                     <span className="text-[9px] font-black uppercase text-oku-success flex items-center gap-1"><ShieldCheck size={12}/> Complete</span>
                   ) : (
                     <Link href="/dashboard/client/intake" className="text-[9px] font-black uppercase text-oku-danger hover:underline">Incomplete</Link>
                   )}
                </div>
             </div>
          </DashboardCard>

          <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Sparkles size={16} className="text-oku-purple" /> Privacy First
                </h3>
                <p className="text-xs opacity-60 leading-relaxed italic">
                   Your clinical record is encrypted and only accessible by you and your designated practitioner. We never share this data with third parties.
                </p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}
