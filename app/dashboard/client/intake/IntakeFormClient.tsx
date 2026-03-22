'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardCard } from '@/components/DashboardCard'
import { ShieldCheck, FileText, AlertCircle, Save, CheckCircle2, Loader2, MapPin, User, Phone } from 'lucide-react'
import { InformedConsentViewer } from '@/components/InformedConsentViewer'

export default function IntakeFormClient({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    legalName: initialData?.legalName || '',
    currentAddress: initialData?.currentAddress || '',
    permanentAddress: initialData?.permanentAddress || '',
    emergencyContact1: initialData?.emergencyContact1 || '',
    emergencyContact2: initialData?.emergencyContact2 || '',
    hasSignedConsent: initialData?.hasSignedConsent || false,
    hasAcceptedPrivacy: initialData?.hasAcceptedPrivacy || false,
    medicalHistory: initialData?.medicalHistory || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.hasSignedConsent || !formData.hasAcceptedPrivacy) {
        alert('Please accept the Oku Therapy Informed Consent and Privacy Policy to proceed.')
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
        alert('Clinical intake and Informed Consent completed successfully.')
        router.refresh()
        router.push('/dashboard/client')
      } else {
        throw new Error('Failed to save intake form')
      }
    } catch (e) {
      console.error(e)
      alert('Error saving your clinical records. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* 1. Legal Identity */}
      <DashboardCard title="1. Clinical Identity" icon={<User size={20} strokeWidth={1.5} />}>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Client's Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="As per government identification"
                  value={formData.legalName}
                  onChange={(e) => setFormData({...formData, legalName: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Current Address</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Full current residential address"
                  value={formData.currentAddress}
                  onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Permanent Address</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Full permanent residential address"
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
        </div>
      </DashboardCard>

      {/* 2. Emergency Contacts */}
      <DashboardCard title="2. Safety Net (Emergency Contacts)" icon={<Phone size={20} strokeWidth={1.5} />}>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Primary Emergency Contact</label>
                <input 
                  type="text" 
                  required
                  placeholder="Name, Relationship & Phone Number"
                  value={formData.emergencyContact1}
                  onChange={(e) => setFormData({...formData, emergencyContact1: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Secondary Emergency Contact</label>
                <input 
                  type="text" 
                  required
                  placeholder="Name, Relationship & Phone Number"
                  value={formData.emergencyContact2}
                  onChange={(e) => setFormData({...formData, emergencyContact2: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
        </div>
      </DashboardCard>

      {/* 3. Informed Consent Form Viewer */}
      <div className="space-y-6">
        <h3 className="text-2xl font-display font-bold text-oku-dark tracking-tight ml-4">3. Clinical Consent</h3>
        <InformedConsentViewer />
        
        <div className="space-y-4 px-4">
            <label className="flex items-start gap-4 p-8 bg-white border border-oku-taupe/10 rounded-[2.5rem] cursor-pointer hover:border-oku-purple transition-all group shadow-sm">
                <input 
                    type="checkbox" 
                    required
                    checked={formData.hasSignedConsent}
                    onChange={(e) => setFormData({...formData, hasSignedConsent: e.target.checked})}
                    className="mt-1 w-6 h-6 accent-oku-purple" 
                />
                <div className="space-y-1">
                    <p className="font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
                        Digitally Sign Informed Consent
                    </p>
                    <p className="text-xs text-oku-taupe leading-relaxed">
                        I have read the Oku Therapy Informed Consent Form. I understand the benefits, risks, confidentiality limitations (including the "No Secrets" policy), and the cancellation policy. I give my informed consent to proceed.
                    </p>
                </div>
            </label>

            <label className="flex items-start gap-4 p-8 bg-white border border-oku-taupe/10 rounded-[2.5rem] cursor-pointer hover:border-oku-purple transition-all group shadow-sm">
                <input 
                    type="checkbox" 
                    required
                    checked={formData.hasAcceptedPrivacy}
                    onChange={(e) => setFormData({...formData, hasAcceptedPrivacy: e.target.checked})}
                    className="mt-1 w-6 h-6 accent-oku-purple" 
                />
                <div className="space-y-1">
                    <p className="font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
                        Accept HIPAA & Platform Privacy Policy
                    </p>
                    <p className="text-xs text-oku-taupe leading-relaxed">
                        I understand how my personal health information will be stored and protected under Indian jurisdiction and Oku Therapy's digital privacy standards.
                    </p>
                </div>
            </label>
        </div>
      </div>

      {/* 4. Medical History */}
      <DashboardCard title="4. Clinical Background" icon={<FileText size={20} strokeWidth={1.5} />}>
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
      </DashboardCard>

      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-6 px-16 flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-oku-purple/20 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Authenticate & Finalize Onboarding
        </button>
        {initialData?.signedAt && (
            <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-40">Clinical Lock Date</span>
                <span className="text-green-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} /> {new Date(initialData.signedAt).toLocaleDateString()}
                </span>
            </div>
        )}
      </div>

    </form>
  )
}
