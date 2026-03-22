'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AssignAssessmentModal({ assessment, clients }: { assessment: any, clients: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAssign = async () => {
    if (!selectedClientId) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/practitioner/assessments/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClientId, assessmentId: assessment.id })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        alert(`Successfully assigned ${assessment.title} to patient.`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-oku-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-oku-purple transition-all shadow-md active:scale-95"
      >
        <UserPlus size={14} /> Assign to Patient
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-oku-dark/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-oku-taupe/10 bg-oku-purple/10 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-display font-bold text-oku-dark">Assign Assessment</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mt-1">{assessment.title}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-oku-taupe">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Select Patient from Roster</label>
                   <select 
                     value={selectedClientId}
                     onChange={(e) => setSelectedClientId(e.target.value)}
                     className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all appearance-none"
                   >
                     <option value="">Choose a patient...</option>
                     {clients.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                </div>

                <div className="bg-oku-cream-warm/30 p-6 rounded-3xl border border-oku-taupe/5">
                   <p className="text-xs text-oku-taupe leading-relaxed italic">
                     Once assigned, this assessment will appear instantly on the patient's dashboard clinical hub for completion.
                   </p>
                </div>

                <button 
                  onClick={handleAssign}
                  disabled={!selectedClientId || isSubmitting}
                  className="w-full py-5 bg-oku-dark text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-oku-purple transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
