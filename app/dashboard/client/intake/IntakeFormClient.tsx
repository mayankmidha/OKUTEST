'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardCard } from '@/components/DashboardCard'
import { ShieldCheck, FileText, AlertCircle, Save, CheckCircle2, Loader2 } from 'lucide-react'

export default function IntakeFormClient({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    hasSignedConsent: initialData?.hasSignedConsent || false,
    hasAcceptedPrivacy: initialData?.hasAcceptedPrivacy || false,
    medicalHistory: initialData?.medicalHistory || '',
    emergencyContact: initialData?.emergencyContact || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.hasSignedConsent || !formData.hasAcceptedPrivacy) {
        alert('Please accept the legal consent and privacy policy to proceed.')
        return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Clinical intake completed successfully.')
        router.refresh()
        router.push('/dashboard/client')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* 1. Legal & Consent */}
      <DashboardCard title="1. Legal Consent & Informed Care" icon={<ShieldCheck size={20} strokeWidth={1.5} />}>
        <div className="space-y-6">
          <p className="text-sm text-oku-taupe leading-relaxed italic">
            "By checking the boxes below, you acknowledge that you have read and understood the terms of care at Oku Therapy, including our approach to clinical safety, confidentiality boundaries, and professional ethics."
          </p>
          
          <div className="space-y-4">
            <label className="flex items-start gap-4 p-6 bg-oku-cream/30 rounded-3xl border border-oku-taupe/10 cursor-pointer hover:bg-white transition-all group">
              <input 
                type="checkbox" 
                checked={formData.hasSignedConsent}
                onChange={(e) => setFormData({...formData, hasSignedConsent: e.target.checked})}
                className="mt-1 w-5 h-5 accent-oku-purple" 
              />
              <span className="text-sm font-medium text-oku-dark group-hover:text-oku-purple transition-colors">
                I give informed consent to receive psychological services through the Oku Therapy platform.
              </span>
            </label>

            <label className="flex items-start gap-4 p-6 bg-oku-cream/30 rounded-3xl border border-oku-taupe/10 cursor-pointer hover:bg-white transition-all group">
              <input 
                type="checkbox" 
                checked={formData.hasAcceptedPrivacy}
                onChange={(e) => setFormData({...formData, hasAcceptedPrivacy: e.target.checked})}
                className="mt-1 w-5 h-5 accent-oku-purple" 
              />
              <span className="text-sm font-medium text-oku-dark group-hover:text-oku-purple transition-colors">
                I have read and accepted the HIPAA Privacy Notice regarding my health information.
              </span>
            </label>
          </div>
        </div>
      </DashboardCard>

      {/* 2. Medical History */}
      <DashboardCard title="2. Medical Intake & Safety" icon={<FileText size={20} strokeWidth={1.5} />}>
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Emergency Contact (Required)</label>
            <input 
              type="text" 
              required
              placeholder="Name and Phone Number"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Medical History / Clinical Notes</label>
            <textarea 
              rows={6}
              placeholder="Please share any previous diagnoses, medications, or specific clinical needs your therapist should be aware of."
              value={formData.medicalHistory}
              onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
              className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
            />
          </div>
        </div>
      </DashboardCard>

      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-5 px-12 flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Submit Clinical Onboarding
        </button>
        {initialData?.signedAt && (
            <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 size={16} /> Last Updated: {new Date(initialData.signedAt).toLocaleDateString()}
            </div>
        )}
      </div>

    </form>
  )
}
