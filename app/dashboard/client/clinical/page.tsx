'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  ClipboardCheck, FileText, Target, 
  ShieldCheck, ArrowRight, History, 
  Sparkles, Activity, Brain, Loader2, Eye
} from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { WellnessVisualizer } from '@/components/WellnessVisualizer'
import { AssessmentAiCurationModal } from '@/components/AssessmentAiCurationModal'

export default function ClientClinicalHub() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login')
    }

    if (status === 'authenticated') {
      fetchClinicalData()
    }
  }, [status])

  async function fetchClinicalData() {
    try {
      const response = await fetch('/api/client/clinical-data')
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error("Failed to fetch clinical data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAiAnalysis = (assessment: any) => {
    setSelectedAssessment(assessment)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oku-cream/20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-oku-purple mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-taupe">Accessing Sanctuary Records...</p>
        </div>
      </div>
    )
  }

  const { intake, assessmentAnswers, treatmentPlans, assignedTasks, adhdSupportPlan } = data || {
    intake: null,
    assessmentAnswers: [],
    treatmentPlans: [],
    assignedTasks: [],
    adhdSupportPlan: null
  }

  const billableAssignedTasks = assignedTasks.filter((task: any) => (task.chargeAmount || task.assessment?.price || 0) > 0)
  const totalAssignedAssessmentCharge = assignedTasks.reduce(
    (sum: number, task: any) => sum + (task.chargeAmount || task.assessment?.price || 0),
    0
  )

  return (
    <div className="min-h-screen bg-oku-lavender/5 px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <DashboardHeader 
        title="Clinical Record" 
        description="A secure overview of your therapeutic journey, assessments, and clinical documentation."
        actions={
          <Link href="/assessments" className="btn-pill-3d flex w-full items-center justify-center gap-2 bg-oku-darkgrey border-oku-darkgrey text-white !px-6 !py-4 shadow-xl transition-transform hover:scale-105 sm:w-auto sm:!px-10">
            <ClipboardCheck size={18} /> Take New Assessment
          </Link>
        }
      />

      {/* 0. Pending Clinical Assignments */}
      {assignedTasks.length > 0 && (
        <section className="mb-12 sm:mb-16">
           <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             <DashboardCard title="Assigned Assessments" variant="lavender">
               <p className="text-4xl font-display font-bold text-oku-dark">{assignedTasks.length}</p>
               <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Pending clinical tasks</p>
             </DashboardCard>
             <DashboardCard title="Billable Queue" variant="white">
               <p className="text-4xl font-display font-bold text-oku-dark">{billableAssignedTasks.length}</p>
               <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Assessments with a fee</p>
             </DashboardCard>
             <DashboardCard title="Assessment Charges" variant="white">
               <p className="text-4xl font-display font-bold text-oku-dark">${totalAssignedAssessmentCharge.toFixed(2)}</p>
               <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Collected on completion</p>
             </DashboardCard>
           </div>
           
           <div className="flex items-center gap-3 mb-8 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-oku-purple animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Clinical Actions Required</h2>
           </div>

           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              {assignedTasks.map((task: any) => {
                const chargeAmount = task.chargeAmount || task.assessment?.price || 0
                const needsPayment = chargeAmount > 0 && task.billingStatus !== 'COMPLETED'
                const assessmentHref = `/dashboard/client/assessments/${task.assessment.id}?assignmentId=${task.id}`
                
                return (
                  <div key={task.id} className={`group relative overflow-hidden card-glass-3d !p-6 sm:!p-8 lg:!p-10 ${chargeAmount > 0 ? '!bg-oku-dark text-white shadow-2xl' : '!bg-white'}`}>
                     <div className="relative z-10">
                        <div className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
                           <div className={`w-14 h-14 rounded-2xl ${chargeAmount > 0 ? 'bg-white/10 border-white/20' : 'bg-oku-lavender/20 border-oku-lavender/30'} flex items-center justify-center border`}>
                              <Sparkles size={24} className={chargeAmount > 0 ? "text-oku-lavender" : "text-oku-purple-dark"} />
                           </div>
                           <div className="text-right">
                              <p className={`text-[9px] font-black uppercase tracking-widest ${chargeAmount > 0 ? 'text-white/40' : 'text-oku-darkgrey/30'} mb-1`}>{chargeAmount > 0 ? 'Premium Assessment' : 'Care Included'}</p>
                              <p className={`text-lg font-bold ${chargeAmount > 0 ? 'text-white' : 'text-oku-darkgrey'}`}>
                                {chargeAmount > 0 ? `$${Number(chargeAmount).toFixed(2)}` : 'FREE'}
                              </p>
                           </div>
                        </div>
                        <h3 className={`heading-display mb-2 text-2xl leading-tight sm:text-3xl ${chargeAmount > 0 ? 'text-white' : 'text-oku-darkgrey'}`}>{task.assessment.title}</h3>
                        <p className={`mb-8 text-sm italic font-display sm:mb-10 ${chargeAmount > 0 ? 'text-white/50' : 'text-oku-darkgrey/40'}`}>Requested by {task.practitioner?.name}</p>
                        
                        {needsPayment ? (
                          <Link 
                            href={`/dashboard/client/checkout?type=ASSESSMENT&id=${task.id}`}
                            className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark shadow-lg transition-all hover:bg-oku-lavender sm:py-5"
                          >
                            Pay & Unlock <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        ) : (
                          <Link 
                            href={assessmentHref}
                            className="flex w-full items-center justify-center gap-3 rounded-full bg-oku-dark py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-lg transition-all hover:bg-oku-darkgrey sm:py-5"
                          >
                            {chargeAmount > 0 ? 'Begin Assessment' : 'Begin Screening'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}
                     </div>
                     {chargeAmount > 0 && <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />}
                  </div>
                )
              })}
           </div>
        </section>
      )}

      <div className="mb-14 sm:mb-20">
         <WellnessVisualizer />
      </div>

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
        <div className="space-y-14 lg:col-span-2 lg:space-y-20">
          
          {/* 1. Active Treatment Plans */}
          <section>
            <div className="flex items-center gap-3 mb-8 ml-2">
                <Target size={18} className="text-oku-taupe/40" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe">Active Therapeutic Strategy</h2>
            </div>
            {treatmentPlans.length === 0 ? (
              <div className="card-glass-3d border-dashed !bg-transparent !p-10 text-center opacity-40 sm:!p-20">
                 <Target size={48} className="mx-auto text-oku-taupe/20 mb-6" strokeWidth={1} />
                 <p className="text-oku-taupe font-display italic text-xl">No treatment plan initialized yet.</p>
                 <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-4">Your practitioner will collaborate with you to build this.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {treatmentPlans.map((plan: any) => (
                  <div key={plan.id} className={`card-glass-3d border-white/60 !p-6 sm:!p-8 lg:!p-12 ${plan.status === 'ACTIVE' ? '!bg-white/80' : '!bg-white/40 opacity-60'}`}>
                    <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-oku-darkgrey/5 pb-8 md:flex-row md:items-center lg:mb-10 lg:gap-8 lg:pb-10">
                       <div className="flex items-center gap-4 sm:gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
                             <ShieldCheck size={28} />
                          </div>
                          <div>
                             <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30">Primary Clinician</p>
                             <p className="heading-display text-3xl text-oku-darkgrey">{plan.practitioner?.name}</p>
                          </div>
                       </div>
                       <div className="bg-oku-darkgrey/5 px-6 py-3 rounded-2xl border border-white/40">
                          <p className="text-[9px] uppercase tracking-widest font-black text-oku-darkgrey/30 mb-1 text-center">Effective Since</p>
                          <p className="text-sm font-bold text-oku-darkgrey text-center">{new Date(plan.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                       </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
                       <div className="space-y-4 rounded-[2rem] border border-oku-lavender/20 bg-oku-lavender/10 p-6 sm:p-8">
                          <h4 className="text-[10px] uppercase tracking-widest font-black text-oku-purple-dark">Care Focus</h4>
                          <p className="font-display text-base italic leading-relaxed text-oku-darkgrey/70 sm:text-lg">{plan.goals}</p>
                       </div>
                       <div className="space-y-4 rounded-[2rem] border border-oku-mint/20 bg-oku-mint/10 p-6 sm:p-8">
                          <h4 className="text-[10px] uppercase tracking-widest font-black text-oku-mint-dark">Methodology</h4>
                          <p className="font-display text-base italic leading-relaxed text-oku-darkgrey/70 sm:text-lg">{plan.objectives}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. Assessment History */}
          <section>
            <div className="flex items-center gap-3 mb-8 ml-2">
                <History size={18} className="text-oku-taupe/40" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe">Diagnostic Timeline</h2>
            </div>
            <div className="card-glass-3d overflow-hidden !bg-white/60 !p-0 shadow-sm">
              {assessmentAnswers.length === 0 ? (
                <div className="py-20 text-center font-display text-xl italic opacity-40 sm:py-32">
                   No completed assessments recorded.
                </div>
              ) : (
                <>
                  <div className="space-y-4 p-4 md:hidden">
                    {assessmentAnswers.map((ans: any) => (
                      <div key={ans.id} className="rounded-[1.75rem] border border-oku-darkgrey/5 bg-white/70 p-5 shadow-sm">
                        <p className="text-lg font-bold text-oku-darkgrey">{ans.assessment.title}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${
                            ans.result?.toLowerCase().includes('severe') || ans.result?.toLowerCase().includes('high')
                              ? 'border border-red-100 bg-red-50 text-red-600'
                              : 'border border-oku-purple/20 bg-oku-purple/10 text-oku-purple-dark'
                          }`}>
                            {ans.result || "Completed"}
                          </span>
                          <p className="text-[11px] font-bold text-oku-darkgrey/40">
                             {new Date(ans.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <button 
                          onClick={() => openAiAnalysis(ans)}
                          className="btn-pill-3d mt-5 flex w-full items-center justify-center gap-2 !border-white !bg-white !px-6 !py-3 !text-oku-purple-dark shadow-sm transition-transform hover:scale-105"
                        >
                          <Sparkles size={14} /> AI Insights
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-[760px] w-full text-left">
                      <thead className="bg-oku-darkgrey/5 text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                        <tr>
                          <th className="px-10 py-8">Clinical Assessment</th>
                          <th className="px-10 py-8">Interpretation</th>
                          <th className="px-10 py-8">Date</th>
                          <th className="px-10 py-8 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-oku-darkgrey/5">
                        {assessmentAnswers.map((ans: any) => (
                          <tr key={ans.id} className="group transition-all hover:bg-white/60">
                            <td className="px-10 py-10">
                              <p className="text-xl font-bold text-oku-darkgrey">{ans.assessment.title}</p>
                            </td>
                            <td className="px-10 py-10">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                ans.result?.toLowerCase().includes('severe') || ans.result?.toLowerCase().includes('high')
                                  ? 'bg-red-50 text-red-600 border border-red-100'
                                  : 'bg-oku-purple/10 text-oku-purple-dark border border-oku-purple/20'
                              }`}>
                                {ans.result || "Completed"}
                              </span>
                            </td>
                            <td className="px-10 py-10">
                              <p className="text-sm font-bold text-oku-darkgrey/40">
                                 {new Date(ans.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </td>
                            <td className="px-10 py-10 text-right">
                               <button 
                                 onClick={() => openAiAnalysis(ans)}
                                 className="btn-pill-3d ml-auto flex items-center gap-2 !border-white !bg-white !px-6 !py-3 !text-oku-purple-dark shadow-sm transition-transform hover:scale-105"
                               >
                                 <Sparkles size={14} /> AI Insights
                               </button>
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

        {/* Sidebar */}
        <div className="space-y-10 lg:space-y-12">
          {adhdSupportPlan && (
            <div className="card-glass-3d border-oku-lavender/30 !bg-oku-lavender/30 !p-6 sm:!p-8 lg:!p-10">
               <div className="flex items-center gap-3 mb-8">
                  <Brain size={24} className="text-oku-purple-dark" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark">ADHD Sanctuary Plan</h3>
               </div>
               <div className="space-y-8">
                  <div className="rounded-[2rem] border border-white bg-white/80 p-6 sm:p-8">
                      <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-3">Core Trajectory</p>
                      <p className="text-xl font-display font-bold text-oku-darkgrey mb-1">{adhdSupportPlan.latestAssessmentTitle}</p>
                      <p className="text-sm text-oku-darkgrey/60 italic mb-6 leading-relaxed">{adhdSupportPlan.summary}</p>
                  </div>
                  
                  <div className="space-y-3">
                     <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 ml-4">Daily Strategies</p>
                     {adhdSupportPlan.strategies.map((s: string, i: number) => (
                        <div key={i} className="rounded-2xl border border-white/60 bg-white/40 p-4 text-sm font-bold text-oku-darkgrey/70">
                           {s}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          <div className="relative overflow-hidden card-glass-3d !bg-oku-dark !p-6 text-white sm:!p-8 lg:!p-10">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck size={24} className="text-oku-mint" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-mint">Vault Protection</h3>
                </div>
                <p className="text-sm text-white/60 italic font-display leading-relaxed">
                   Your clinical records live in a private workspace with role-based access controls for you and your care team.
                </p>
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-oku-mint/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <AssessmentAiCurationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assessment={selectedAssessment}
      />
    </div>
  )
}
