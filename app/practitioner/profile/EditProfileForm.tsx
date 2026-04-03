'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    Loader2, 
    Save, 
    User, 
    Award, 
    BookOpen, 
    Link as LinkIcon, 
    Briefcase, 
    Calendar, 
    DollarSign, 
    Sparkles, 
    ArrowRight, 
    ArrowLeft,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { resolvePractitionerPricing } from '@/lib/pricing'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const initialPricing = resolvePractitionerPricing(initialData)
  const [formData, setFormData] = useState({
    name: initialData.user?.name || '',
    bio: initialData.bio || '',
    indiaSessionRate: initialData.indiaSessionRate || initialPricing.indiaSessionRate,
    internationalSessionRate: initialData.internationalSessionRate || initialPricing.internationalSessionRate,
    licenseNumber: initialData.licenseNumber || '',
    specialization: initialData.specialization || [],
    education: initialData.education || '',
    experienceYears: initialData.experienceYears || 0,
    linkedinUrl: initialData.linkedinUrl || '',
    websiteUrl: initialData.websiteUrl || '',
    timezone: initialData.timezone || 'UTC',
    googleCalendarEmail: initialData.googleCalendarEmail || '',
    outlookCalendarEmail: initialData.outlookCalendarEmail || '',
    appleCalendarEmail: initialData.appleCalendarEmail || '',
    appleAppSpecificPassword: initialData.appleAppSpecificPassword || '',
    calendlyLink: initialData.calendlyLink || '',
    syncEnabled: initialData.syncEnabled ?? false,
    isOnboarded: true // We force this to true when they submit this form
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(initialData.isOnboarded ? 0 : 1) // 0 means just edit mode, 1-4 is onboarding
  const [newSpecialty, setNewSpecialty] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const syncLink = initialData.id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/practitioner/schedule/feed/${initialData.id}?secret=${initialData.iCalSecret}` : ''

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/practitioner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        if (step > 0) {
            router.push('/practitioner/dashboard')
        } else {
            router.refresh()
            alert('Profile synchronized.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  // Render Logic for Step-by-Step Onboarding
  if (step > 0) {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <div className="mb-12 flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple mb-2">Step {step} of 4</p>
                    <h2 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
                        {step === 1 && "Clinical Identity"}
                        {step === 2 && "Universal Sync"}
                        {step === 3 && "Professional Rates"}
                        {step === 4 && "Clinical Expertise"}
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/80 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-white shadow-premium relative overflow-hidden"
                >
                    {step === 1 && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Professional Name</label>
                                <input 
                                    className="input-pebble text-2xl font-bold" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Dr. Jane Smith"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Clinical Bio</label>
                                <textarea 
                                    className="input-pebble min-h-[150px] text-lg leading-relaxed" 
                                    value={formData.bio} 
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Tell your future clients about your approach..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Clinical Timezone</label>
                                <select 
                                    className="input-pebble appearance-none" 
                                    value={formData.timezone} 
                                    onChange={e => setFormData({...formData, timezone: e.target.value})}
                                >
                                    <option value="Asia/Kolkata">India (IST)</option>
                                    <option value="America/New_York">US Eastern (EST)</option>
                                    <option value="Europe/London">London (GMT)</option>
                                    <option value="UTC">Universal (UTC)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10">
                            <div className="bg-oku-dark text-white p-10 rounded-[3rem] relative overflow-hidden">
                                <p className="text-[10px] font-black uppercase tracking-widest text-oku-lavender mb-4">Magic Sync Link</p>
                                <p className="text-xs text-white/60 mb-6 leading-relaxed">Subscribe in Apple, Google, or Outlook to see your OKU sessions update in real-time.</p>
                                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                                    <input readOnly value={syncLink} className="flex-1 bg-transparent border-none outline-none text-[10px] font-mono opacity-60 truncate" />
                                    <button type="button" onClick={() => { navigator.clipboard.writeText(syncLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-white text-oku-dark px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-oku-lavender transition-all">
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/20 rounded-full blur-3xl" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input className="input-pebble" placeholder="Calendly Link" value={formData.calendlyLink} onChange={e => setFormData({...formData, calendlyLink: e.target.value})} />
                                <input className="input-pebble" placeholder="Google Calendar Email" value={formData.googleCalendarEmail} onChange={e => setFormData({...formData, googleCalendarEmail: e.target.value})} />
                            </div>
                            <div className="flex items-center gap-4 p-6 bg-oku-lavender/20 rounded-3xl border border-oku-lavender/30">
                                <input type="checkbox" className="w-6 h-6 rounded-lg text-oku-purple" checked={formData.syncEnabled} onChange={e => setFormData({...formData, syncEnabled: e.target.checked})} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">Enable Universal Two-Way Sync</p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10">
                            <p className="text-sm text-oku-taupe italic leading-relaxed">Set your rates. International clients will see these converted to their local currency using live exchange rates.</p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">India Session (INR)</label>
                                    <input type="number" className="input-pebble text-2xl font-bold" value={formData.indiaSessionRate} onChange={e => setFormData({...formData, indiaSessionRate: parseFloat(e.target.value)})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">International (USD)</label>
                                    <input type="number" className="input-pebble text-2xl font-bold" value={formData.internationalSessionRate} onChange={e => setFormData({...formData, internationalSessionRate: parseFloat(e.target.value)})} />
                                </div>
                            </div>
                            <div className="p-8 bg-oku-peach/30 rounded-[2.5rem] border border-oku-peach/50 flex items-start gap-4">
                                <ShieldCheck className="text-oku-peach-dark flex-shrink-0" />
                                <p className="text-xs text-oku-taupe leading-relaxed">
                                    <span className="font-bold text-oku-dark">Privacy Guard Active:</span> We hide your personal website and LinkedIn from clients to ensure platform-based care continuity and protection of your professional boundaries.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">License / Certification Number</label>
                                <input className="input-pebble" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} placeholder="State Board ID / Medical License" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe ml-2">Specializations</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.specialization.map((s: string) => (
                                        <span key={s} className="px-4 py-2 bg-oku-lavender text-oku-purple-dark rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                                            {s} <button onClick={() => setFormData({...formData, specialization: formData.specialization.filter((x:string) => x !== s)})} className="hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    className="input-pebble" 
                                    placeholder="Type and press Enter (e.g. CBT, ADHD, Anxiety)" 
                                    value={newSpecialty}
                                    onChange={e => setNewSpecialty(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            if (newSpecialty.trim()) {
                                                setFormData({...formData, specialization: [...formData.specialization, newSpecialty.trim()]})
                                                setNewSpecialty('')
                                            }
                                        }
                                    }}
                                />
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
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (step === 4 ? "Complete Onboarding" : "Continue")}
                            {step < 4 && <ArrowRight size={18} />}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
  }

  // Standard Edit Mode (Step 0)
  return (
    <form onSubmit={handleSubmit} className="space-y-16 py-10 max-w-5xl mx-auto">
      <div className="card-pebble">
        <div className="flex items-center gap-4 mb-10 border-b border-oku-taupe/5 pb-6">
           <div className="p-4 bg-oku-lavender rounded-2xl text-oku-purple-dark"><User size={24} /></div>
           <div>
              <h3 className="text-2xl font-display font-bold text-oku-dark">Clinical Identity</h3>
              <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60">Core Professional Profile</p>
           </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Professional Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-pebble" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Clinical Timezone</label>
                <select value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="input-pebble appearance-none">
                    <option value="Asia/Kolkata">IST (India Standard Time)</option>
                    <option value="America/New_York">EST (Eastern Time)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="UTC">UTC (Universal)</option>
                </select>
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe ml-2">Clinical Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="input-pebble min-h-[120px]" />
            </div>
        </div>
      </div>

      <div className="card-pebble">
        <div className="flex items-center gap-4 mb-10 border-b border-oku-taupe/5 pb-6">
           <div className="p-4 bg-oku-mint rounded-2xl text-oku-mint-dark"><Calendar size={24} /></div>
           <div>
              <h3 className="text-2xl font-display font-bold text-oku-dark">Calendar Sync</h3>
              <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60">Universal Handshake</p>
           </div>
        </div>
        <div className="space-y-8">
            <div className="bg-oku-dark text-white p-10 rounded-[3rem] relative overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-lavender mb-2">Magic iCal Link</p>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                    <input readOnly value={syncLink} className="flex-1 bg-transparent border-none outline-none text-[10px] font-mono opacity-60 truncate" />
                    <button type="button" onClick={() => { navigator.clipboard.writeText(syncLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-white text-oku-dark px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <input className="input-pebble" placeholder="Calendly Link" value={formData.calendlyLink} onChange={e => setFormData({...formData, calendlyLink: e.target.value})} />
                <input className="input-pebble" placeholder="Google Calendar Email" value={formData.googleCalendarEmail} onChange={e => setFormData({...formData, googleCalendarEmail: e.target.value})} />
            </div>
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <button type="submit" disabled={isSubmitting} className="btn-pebble bg-oku-dark text-white hover:bg-oku-purple-dark w-full md:w-auto min-w-[300px]">
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Synchronize Profile
        </button>
      </div>
    </form>
  )
}
