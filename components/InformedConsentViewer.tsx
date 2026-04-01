'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, FileText, ChevronRight, Loader2, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function InformedConsentViewer() {
  const [isAgreed, setIsAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const handleSign = async () => {
    if (!isAgreed) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            agreementContent: "Standard Oku Therapy Informed Consent v1.0 - Telehealth, Privacy, and Clinical Terms accepted.",
            version: "1.0"
        })
      })
      if (res.ok) {
        await update({ hasSignedConsent: true })
        window.location.href = '/dashboard'
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl border border-oku-taupe/10 overflow-hidden"
      >
        <div className="bg-oku-navy p-10 text-white flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <Lock size={16} className="text-oku-purple" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Legal Requirement</span>
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight">Clinical Consent.</h1>
              <p className="text-white/60 italic font-display mt-2">Required for all active Oku Therapy users.</p>
           </div>
           <ShieldCheck size={120} className="absolute right-[-20px] bottom-[-20px] text-white opacity-5" />
        </div>

        <div className="p-12 space-y-8">
           <div className="bg-oku-cream/30 border border-oku-taupe/5 rounded-[2rem] p-10 h-96 overflow-y-auto custom-scrollbar prose prose-sm max-w-none">
              <h3 className="font-display font-bold text-xl mb-4">1. Telehealth Services</h3>
              <p className="text-oku-taupe leading-relaxed mb-6">
                You are agreeing to participate in telehealth services provided by Oku Therapy. Telehealth involves the use of electronic communications to enable healthcare providers at different locations to share individual patient medical information for the purpose of improving patient care.
              </p>

              <h3 className="font-display font-bold text-xl mb-4">2. Privacy & Data Security</h3>
              <p className="text-oku-taupe leading-relaxed mb-6">
                All communications through the platform are end-to-end encrypted. We maintain HIPAA-compliant standards for data storage. Your session transcripts are processed by OKU CORE AI to provide clinical insights for your therapist, but are never shared with third parties for marketing purposes.
              </p>

              <h3 className="font-display font-bold text-xl mb-4">3. Confidentiality</h3>
              <p className="text-oku-taupe leading-relaxed mb-6">
                Confidentiality is maintained except in cases of reported harm to self or others, or as required by law.
              </p>

              <h3 className="font-display font-bold text-xl mb-4">4. Emergency Procedures</h3>
              <p className="text-oku-taupe leading-relaxed mb-6">
                In the event of a clinical emergency, please use your local emergency services (e.g., 911 or 112) as the platform is not designed for real-time crisis intervention.
              </p>
           </div>

           <div className="flex items-start gap-4 p-6 bg-oku-ocean/20 rounded-2xl border border-oku-blue-mid/10">
              <input 
                type="checkbox" 
                id="consent"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-oku-taupe/20 text-oku-navy focus:ring-oku-purple"
              />
              <label htmlFor="consent" className="text-sm text-oku-dark leading-relaxed font-medium">
                I have read and understood the Informed Consent and Privacy Policy. I agree to the terms of service and clinical protocols of the Oku collective.
              </label>
           </div>

           <div className="pt-4 flex justify-between items-center gap-8">
              <button 
                onClick={() => window.location.href = '/api/auth/signout'}
                className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-red-500 transition-colors"
              >
                Decline & Exit
              </button>
              <button 
                disabled={!isAgreed || isSubmitting}
                onClick={handleSign}
                className="btn-navy py-5 px-12 flex items-center gap-3 disabled:opacity-30 shadow-2xl active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Finalize & Enter <ChevronRight size={18} /></>}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
