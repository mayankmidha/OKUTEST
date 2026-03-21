'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User, Mail, Shield, Briefcase, DollarSign } from 'lucide-react'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    name: initialData.user?.name || '',
    bio: initialData.bio || '',
    hourlyRate: initialData.hourlyRate || '',
    licenseNumber: initialData.licenseNumber || '',
    specialization: initialData.specialization?.join(', ') || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/practitioner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          hourlyRate: parseFloat(formData.hourlyRate),
          specialization: formData.specialization.split(',').map((s: string) => s.trim()).filter(Boolean)
        })
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
            <User size={12} /> Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
            <Shield size={12} /> License Number
          </label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
            <Briefcase size={12} /> Specializations (comma separated)
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="Trauma, Anxiety, ADHD..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 flex items-center gap-2">
            <DollarSign size={12} /> Hourly Rate ($)
          </label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all font-bold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Professional Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={6}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all"
          placeholder="Tell your clients about your approach..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-slate-950 text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save Professional Profile
      </button>
    </form>
  )
}
