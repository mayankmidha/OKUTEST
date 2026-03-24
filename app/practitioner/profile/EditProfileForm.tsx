'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User, Mail, DollarSign, Award, BookOpen, Link as LinkIcon, Briefcase } from 'lucide-react'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    name: initialData.user?.name || '',
    bio: initialData.bio || '',
    hourlyRate: initialData.hourlyRate || 150,
    licenseNumber: initialData.licenseNumber || '',
    specialization: initialData.specialization || [],
    education: initialData.education || '',
    experienceYears: initialData.experienceYears || 0,
    linkedinUrl: initialData.linkedinUrl || '',
    websiteUrl: initialData.websiteUrl || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const [newSpecialty, setNewSpecialty] = useState('')

  const handleAddSpecialty = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSpecialty.trim()) {
      e.preventDefault()
      if (!formData.specialization.includes(newSpecialty.trim())) {
        setFormData({
          ...formData,
          specialization: [...formData.specialization, newSpecialty.trim()]
        })
      }
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (s: string) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((item: string) => item !== s)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/practitioner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.refresh()
        alert('Profile updated successfully')
      } else {
        alert('Failed to update profile')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-oku-taupe/5 pb-4">
           <User size={18} className="text-oku-purple" />
           <h3 className="font-display font-bold text-lg text-oku-dark">Core Identity</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Professional Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Market Rate ($/hr)</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                    <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                        className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-oku-taupe/5 pb-4">
           <Award size={18} className="text-oku-ocean" />
           <h3 className="font-display font-bold text-lg text-oku-dark">Clinical Credentials</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">License Number</label>
                <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Years of Experience</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                    <input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                        className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                    />
                </div>
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Educational Background</label>
                <div className="relative">
                    <BookOpen className="absolute left-4 top-4 text-oku-taupe/40" size={16} />
                    <textarea
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        rows={2}
                        placeholder="e.g. PhD in Clinical Psychology, Stanford University"
                        className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-oku-taupe/5 pb-4">
           <LinkIcon size={18} className="text-oku-taupe" />
           <h3 className="font-display font-bold text-lg text-oku-dark">Online Presence</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">LinkedIn Profile URL</label>
                <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Professional Website</label>
                <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Clinical Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={6}
          className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all shadow-inner"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Areas of Expertise (Press Enter)</label>
        <input
          type="text"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          onKeyDown={handleAddSpecialty}
          placeholder="Add a specialty..."
          className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {formData.specialization.map((s: string) => (
            <span key={s} className="bg-oku-navy text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
              {s}
              <button type="button" onClick={() => removeSpecialty(s)} className="hover:text-oku-purple">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-navy py-5 px-12 flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Synchronize Professional Profile
        </button>
      </div>
    </form>
  )
}
