'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, Sparkles, Loader2, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function NotesEditor({ appointment, existingNote }: { appointment: any, existingNote?: any }) {
  const [formData, setFormData] = useState({
    subjective: existingNote?.subjective || '',
    objective: existingNote?.objective || '',
    assessment: existingNote?.assessment || '',
    plan: existingNote?.plan || ''
  })
  const [isScribing, setIsScribe] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleScribe = async () => {
    setIsScribe(true)
    try {
      const res = await fetch('/api/clinical/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: appointment.id })
      })
      if (res.ok) {
        const { draft } = await res.json()
        
        // Parse the draft (assuming the LLM followed instructions)
        const subjectiveMatch = draft.match(/SUBJECTIVE:([\s\S]*?)OBJECTIVE:/i)
        const objectiveMatch = draft.match(/OBJECTIVE:([\s\S]*?)ASSESSMENT:/i)
        const assessmentMatch = draft.match(/ASSESSMENT:([\s\S]*?)PLAN:/i)
        const planMatch = draft.match(/PLAN:([\s\S]*)/i)

        if (subjectiveMatch) setFormData(prev => ({ ...prev, subjective: subjectiveMatch[1].trim() }))
        if (objectiveMatch) setFormData(prev => ({ ...prev, objective: objectiveMatch[1].trim() }))
        if (assessmentMatch) setFormData(prev => ({ ...prev, assessment: assessmentMatch[1].trim() }))
        if (planMatch) setFormData(prev => ({ ...prev, plan: planMatch[1].trim() }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsScribe(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/notes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sessionId: appointment.id })
      })
      if (res.ok) {
        router.refresh()
        router.push('/practitioner/appointments')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      <div className="flex items-center justify-between bg-oku-purple/10 p-8 rounded-[2.5rem] border border-oku-purple/20 relative overflow-hidden group">
         <div className="relative z-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-oku-purple-dark flex items-center gap-2">
               <Sparkles size={16} /> OCI Ambient Scribe
            </h3>
            <p className="text-xs text-oku-taupe mt-2 italic">Draft clinical notes based on patient trends & goals.</p>
         </div>
         <button 
            type="button"
            onClick={handleScribe}
            disabled={isScribing}
            className="relative z-10 bg-oku-dark text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-oku-purple transition-all disabled:opacity-50"
         >
            {isScribing ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
            {isScribing ? 'Scribing Neural Draft...' : 'Draft with OCI Scribe'}
         </button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      <div className="grid gap-8">
        {[
          { label: 'Subjective (S)', key: 'subjective', placeholder: "Client's self-report, emotions, and presentation..." },
          { label: 'Objective (O)', key: 'objective', placeholder: "Clinical observations, mental status exam, behavior..." },
          { label: 'Assessment (A)', key: 'assessment', placeholder: "Clinical impression, progress toward goals, diagnostic interpretation..." },
          { label: 'Plan (P)', key: 'plan', placeholder: "Next steps, homework, upcoming interventions..." }
        ].map((field) => (
          <div key={field.key} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm focus-within:shadow-xl focus-within:border-oku-purple/30 transition-all">
            <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-6 ml-2">{field.label}</label>
            <textarea 
              value={(formData as any)[field.key]}
              onChange={e => setFormData({...formData, [field.key]: e.target.value})}
              rows={4}
              placeholder={field.placeholder}
              className="w-full bg-oku-cream/30 border border-oku-taupe/5 rounded-3xl p-8 focus:outline-none focus:bg-white focus:ring-4 focus:ring-oku-purple/5 transition-all text-base leading-relaxed text-oku-dark"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-oku-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-4 text-white/60">
            <AlertCircle className="text-oku-purple" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Lock • HIPAA Synchronized</p>
         </div>
         <button 
            type="submit"
            disabled={isSaving}
            className="relative z-10 btn-primary py-5 px-16 shadow-xl flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Finalize Clinical Note
         </button>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>
    </form>
  )
}
