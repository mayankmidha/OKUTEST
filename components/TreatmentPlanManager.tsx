'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Target, Save, X, FileText, CheckCircle2 } from 'lucide-react'

export function TreatmentPlanManager({ clientId, existingPlans }: { clientId: string, existingPlans: any[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    presentingProblem: '',
    goals: '',
    objectives: '',
    interventions: '',
    nextReviewDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const activePlan = existingPlans.find(p => p.status === 'ACTIVE')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/practitioner/treatment-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, clientId })
      })

      if (res.ok) {
        setIsCreating(false)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-oku-dark flex items-center gap-3">
            <Target className="text-oku-purple" size={24} /> Longitudinal Treatment Plan
        </h2>
        {!isCreating && !activePlan && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-oku-purple/10 text-oku-purple rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple hover:text-white transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Initialize Plan
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave} 
            className="space-y-6 bg-oku-cream-warm/30 p-8 rounded-3xl border border-oku-taupe/5"
          >
            <div className="flex justify-between items-center mb-4 border-b border-oku-taupe/10 pb-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark">New Clinical Blueprint</h3>
               <button type="button" onClick={() => setIsCreating(false)} className="text-oku-taupe hover:text-red-500"><X size={18} /></button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Presenting Problem</label>
              <textarea required rows={2} value={formData.presentingProblem} onChange={e => setFormData({...formData, presentingProblem: e.target.value})} className="w-full bg-white border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" placeholder="Primary reason for seeking treatment..." />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Long-term Goals</label>
                <textarea required rows={4} value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} className="w-full bg-white border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" placeholder="What does success look like?" />
                </div>
                <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Short-term Objectives</label>
                <textarea required rows={4} value={formData.objectives} onChange={e => setFormData({...formData, objectives: e.target.value})} className="w-full bg-white border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" placeholder="Measurable steps to achieve goals..." />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Clinical Interventions</label>
              <textarea required rows={3} value={formData.interventions} onChange={e => setFormData({...formData, interventions: e.target.value})} className="w-full bg-white border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" placeholder="Therapeutic modalities and techniques to be used (e.g., CBT, EMDR)..." />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-oku-taupe/5">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Target Review Date</label>
                    <input type="date" value={formData.nextReviewDate} onChange={e => setFormData({...formData, nextReviewDate: e.target.value})} className="block bg-white border border-oku-taupe/10 rounded-xl p-2 text-sm focus:outline-none focus:border-oku-purple" />
                </div>
                <button disabled={isSubmitting} className="btn-primary py-4 px-10 shadow-xl flex items-center gap-2">
                    <Save size={16} /> Save Plan
                </button>
            </div>
          </motion.form>
        ) : activePlan ? (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-[9px] uppercase tracking-widest font-black rounded-full flex items-center gap-1 border border-green-100">
                     <CheckCircle2 size={10} /> Active Plan
                 </span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40">Created: {new Date(activePlan.createdAt).toLocaleDateString()}</span>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                 <div>
                     <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mb-2">Presenting Problem</p>
                     <p className="text-sm leading-relaxed text-oku-dark">{activePlan.presentingProblem}</p>
                 </div>
                 <div>
                     <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mb-2">Clinical Interventions</p>
                     <p className="text-sm leading-relaxed text-oku-dark">{activePlan.interventions}</p>
                 </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6 bg-oku-cream-warm/30 p-6 rounded-3xl border border-oku-taupe/5">
                 <div>
                     <p className="text-[10px] uppercase tracking-widest font-black text-oku-dark mb-2">Long-term Goals</p>
                     <p className="text-sm leading-relaxed text-oku-taupe">{activePlan.goals}</p>
                 </div>
                 <div>
                     <p className="text-[10px] uppercase tracking-widest font-black text-oku-dark mb-2">Short-term Objectives</p>
                     <p className="text-sm leading-relaxed text-oku-taupe">{activePlan.objectives}</p>
                 </div>
             </div>

             {activePlan.nextReviewDate && (
                 <div className="pt-6 border-t border-oku-taupe/5 flex items-center gap-4">
                     <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Next Review Target:</p>
                     <p className="text-sm font-bold text-oku-dark">{new Date(activePlan.nextReviewDate).toLocaleDateString()}</p>
                 </div>
             )}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center bg-oku-cream-warm/20 rounded-3xl border border-dashed border-oku-taupe/20">
              <FileText size={32} className="mx-auto text-oku-taupe/20 mb-4" strokeWidth={1} />
              <p className="text-oku-taupe font-display italic text-lg mb-2">No active treatment plan.</p>
              <p className="text-xs text-oku-taupe opacity-60">Initialize a plan to track long-term clinical goals.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
