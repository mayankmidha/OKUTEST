'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'motion/react'
import { 
  Sparkles, X, Brain, Target, 
  Lightbulb, ShieldCheck, Activity,
  ChevronRight, ArrowRight, MessageSquare
} from 'lucide-react'

interface AssessmentAnswer {
  id: string
  assessment: { title: string }
  score: number | null
  result: string | null
  aiInterpretation: string | null
  clinicalCuration: string | null
  aiRecommendations: string[]
  completedAt: Date | string
}

interface AssessmentAiCurationModalProps {
  isOpen: boolean
  onClose: () => void
  assessment: AssessmentAnswer | null
}

export function AssessmentAiCurationModal({ isOpen, onClose, assessment }: AssessmentAiCurationModalProps) {
  if (!assessment) return null

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-oku-dark/40 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[3rem] bg-oku-cream text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-white/20">
                
                {/* Header Section */}
                <div className="bg-oku-dark p-12 text-white relative overflow-hidden">
                    <button 
                      onClick={onClose}
                      className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1 bg-oku-purple text-[9px] font-black uppercase tracking-widest rounded-full">OKU AI Analysis</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Clinical Curation</span>
                        </div>
                        <h2 className="heading-display text-5xl md:text-7xl tracking-tighter mb-4">
                            Your <span className="text-oku-lavender italic">Insights.</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-6 mt-10">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Assessment</span>
                                <span className="text-lg font-display font-bold">{assessment.assessment.title}</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">State</span>
                                <span className="text-lg font-display font-bold text-oku-mint">{assessment.result || "Completed"}</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Completed On</span>
                                <span className="text-lg font-display font-bold">{new Date(assessment.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-[50%] h-full bg-oku-purple/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                </div>

                {/* Content Section */}
                <div className="p-12 space-y-12">
                    
                    {/* 1. Interpretation Card */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <section className="space-y-6">
                             <div className="flex items-center gap-3 text-oku-purple-dark">
                                <Brain size={24} strokeWidth={1.5} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">AI Interpretation</h3>
                             </div>
                             <div className="card-glass-3d !p-8 !bg-white/60 !rounded-[2rem] border-white/80 shadow-sm min-h-[200px]">
                                <p className="text-lg text-oku-darkgrey/70 font-display italic leading-relaxed">
                                    {assessment.aiInterpretation || "We're receiving your clinical signals. Your results are being securely processed for your next session."}
                                </p>
                             </div>
                        </section>

                        <section className="space-y-6">
                             <div className="flex items-center gap-3 text-oku-mint-dark">
                                <Activity size={24} strokeWidth={1.5} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Clinical Curation</h3>
                             </div>
                             <div className="card-glass-3d !p-8 !bg-oku-mint/10 !rounded-[2rem] border-oku-mint/20 shadow-sm min-h-[200px]">
                                <p className="text-sm text-oku-darkgrey/80 leading-relaxed font-medium">
                                    {assessment.clinicalCuration || "A deeper pattern analysis will be available once more longitudinal data is collected across your journey."}
                                </p>
                             </div>
                        </section>
                    </div>

                    {/* 2. Recommendations */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 text-oku-peach-dark">
                            <Lightbulb size={24} strokeWidth={1.5} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Personalized Recommendations</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {(assessment.aiRecommendations && assessment.aiRecommendations.length > 0) ? (
                                assessment.aiRecommendations.map((rec, i) => (
                                    <motion.div 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                      key={i} 
                                      className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-oku-taupe/5 shadow-sm group hover:border-oku-peach transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-oku-peach/20 flex items-center justify-center text-oku-peach-dark shrink-0 group-hover:scale-110 transition-transform">
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </div>
                                        <p className="text-sm font-bold text-oku-darkgrey leading-relaxed">{rec}</p>
                                    </motion.div>
                                ))
                            ) : (
                                [1, 2].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4 p-6 bg-white/40 border border-dashed border-oku-taupe/20 rounded-3xl grayscale">
                                        <div className="w-8 h-8 rounded-full bg-oku-taupe/10 flex items-center justify-center text-oku-taupe shrink-0">
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </div>
                                        <p className="text-sm font-medium text-oku-taupe italic">Recommendation pending...</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Footer / CTA */}
                    <div className="pt-12 border-t border-oku-darkgrey/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4 text-oku-darkgrey/40">
                             <ShieldCheck size={20} />
                             <span className="text-[10px] font-black uppercase tracking-widest italic">Protected Analysis Workspace</span>
                        </div>
                        <button 
                           onClick={onClose}
                           className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-5 flex items-center gap-3 group"
                        >
                            Return to Hub <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
