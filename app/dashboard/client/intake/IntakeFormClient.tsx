'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ShieldCheck, 
    FileText, 
    AlertCircle, 
    Save, 
    CheckCircle2, 
    Loader2, 
    MapPin, 
    User, 
    Phone,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { InformedConsentViewer } from '@/components/InformedConsentViewer'

export default function IntakeFormClient({ initialData }: { initialData: any }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    legalName: initialData?.legalName || '',
    currentAddress: initialData?.currentAddress || '',
    permanentAddress: initialData?.permanentAddress || '',
    emergencyContact1: initialData?.emergencyContact1 || '',
    emergencyContact2: initialData?.emergencyContact2 || '',
    hasSignedConsent: initialData?.hasSignedConsent || false,
    hasAcceptedPrivacy: initialData?.hasAcceptedPrivacy || false,
    medicalHistory: initialData?.medicalHistory || '',
    isOnboarded: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formData.hasSignedConsent || !formData.hasAcceptedPrivacy) {
        alert('Please accept the Oku Therapy Informed Consent and Privacy Policy to proceed.')
        setStep(3)
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
        router.push('/dashboard/client')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="max-w-4xl mx-auto py-10">
        <div className="mb-12 flex justify-between items-center px-4">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple mb-2">Patient Intake: Step {step} of 4</p>
                <h2 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
                    {step === 1 && "Personal Identity"}
                    {step === 2 && "Safety Net"}
                    {step === 3 && "Clinical Consent"}
                    {step === 4 && "Medical History"}
                </h2>
            </div>
            <div className="flex gap-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`w-12 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-oku-purple' : 'bg-oku-taupe/10'}`} />
                ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-pebble relative overflow-hidden"
            >
                {step === 1 && (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Legal Name</label>
                            <input 
                                className="input-pebble text-2xl font-bold" 
                                value={formData.legalName} 
                                onChange={e => setFormData({...formData, legalName: e.target.value})}
                                placeholder="As per identification"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Current Residence</label>
                                <textarea 
                                    className="input-pebble min-h-[120px]" 
                                    value={formData.currentAddress} 
                                    onChange={e => setFormData({...formData, currentAddress: e.target.value})}
                                    placeholder="Your current full address..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Permanent Residence</label>
                                <textarea 
                                    className="input-pebble min-h-[120px]" 
                                    value={formData.permanentAddress} 
                                    onChange={e => setFormData({...formData, permanentAddress: e.target.value})}
                                    placeholder="Same as above if applicable..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10">
                        <p className="text-sm text-oku-taupe italic leading-relaxed">Safety is our priority. Please provide contacts we can reach in case of an emergency during therapy.</p>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Primary Emergency Contact</label>
                            <input className="input-pebble" value={formData.emergencyContact1} onChange={e => setFormData({...formData, emergencyContact1: e.target.value})} placeholder="Name, Relationship & Phone Number" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Secondary Emergency Contact</label>
                            <input className="input-pebble" value={formData.emergencyContact2} onChange={e => setFormData({...formData, emergencyContact2: e.target.value})} placeholder="Name, Relationship & Phone Number" />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10">
                        <div className="h-[400px] overflow-y-auto pr-4 custom-scrollbar bg-oku-cream-warm/30 rounded-3xl p-8 border border-oku-taupe/10">
                            <InformedConsentViewer />
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-start gap-4 p-6 bg-oku-lavender/10 border border-oku-lavender/20 rounded-[2rem] cursor-pointer group">
                                <input type="checkbox" className="mt-1 w-6 h-6 accent-oku-purple" checked={formData.hasSignedConsent} onChange={e => setFormData({...formData, hasSignedConsent: e.target.checked})} />
                                <span className="text-[11px] font-black uppercase tracking-widest text-oku-dark group-hover:text-oku-purple transition-colors">I sign the informed clinical consent</span>
                            </label>
                            <label className="flex items-start gap-4 p-6 bg-oku-lavender/10 border border-oku-lavender/20 rounded-[2rem] cursor-pointer group">
                                <input type="checkbox" className="mt-1 w-6 h-6 accent-oku-purple" checked={formData.hasAcceptedPrivacy} onChange={e => setFormData({...formData, hasAcceptedPrivacy: e.target.checked})} />
                                <span className="text-[11px] font-black uppercase tracking-widest text-oku-dark group-hover:text-oku-purple transition-colors">I accept the HIPAA & Platform Privacy terms</span>
                            </label>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Medical & Clinical History</label>
                            <textarea 
                                className="input-pebble min-h-[200px] text-lg leading-relaxed" 
                                value={formData.medicalHistory} 
                                onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                                placeholder="Previous diagnoses, medications, or therapy goals..."
                            />
                        </div>
                        <div className="bg-oku-matcha/20 p-8 rounded-[3rem] border border-oku-matcha/30 flex items-center gap-6">
                            <Sparkles className="text-oku-matcha-dark" size={32} />
                            <div>
                                <p className="font-bold text-oku-dark">You're almost there.</p>
                                <p className="text-xs text-oku-taupe">Completing this allows your therapist to prepare for your first session.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-16 flex justify-between gap-4">
                    <button 
                        type="button" 
                        onClick={step === 1 ? () => router.back() : prevStep} 
                        className="px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border border-oku-taupe/10 hover:bg-oku-cream-warm transition-all"
                    >
                        {step === 1 ? "Cancel" : "Back"}
                    </button>
                    <button 
                        type="button" 
                        onClick={step === 4 ? handleSubmit : nextStep} 
                        disabled={isSubmitting}
                        className="bg-oku-dark text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-oku-purple-dark transition-all flex items-center gap-3"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (step === 4 ? "Begin Therapy Journey" : "Continue")}
                        {step < 4 && <ArrowRight size={18} />}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    </div>
  )
}
