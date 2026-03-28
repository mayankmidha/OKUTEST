'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User, Mail, Phone, Heart, Globe, Clock, ShieldAlert } from 'lucide-react'

export default function ClientProfileForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    location: initialData.location || 'India',
    bio: initialData.bio || '',
    emergencyContactName: initialData.clientProfile?.emergencyContactName || '',
    emergencyContactPhone: initialData.clientProfile?.emergencyContactPhone || '',
    preferredLanguage: initialData.clientProfile?.preferredLanguage || 'English',
    timezone: initialData.clientProfile?.timezone || 'UTC',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/user/profile', {
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
           <h3 className="font-display font-bold text-lg text-oku-dark">Contact Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">Full Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
            />
            </div>
            <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">Email Address</label>
            <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-oku-cream/10 border border-oku-taupe/5 rounded-2xl p-4 text-sm text-oku-taupe cursor-not-allowed"
            />
            </div>
            <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">Phone Number</label>
            <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Not set"
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
            />
            </div>
            <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">Country</label>
            <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all appearance-none"
            >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="Switzerland">Switzerland</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Other">Other</option>
            </select>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-oku-taupe/5 pb-4">
           <ShieldAlert size={18} className="text-oku-danger" />
           <h3 className="font-display font-bold text-lg text-oku-dark">Safety & Emergency</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Emergency Contact Name</label>
                <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Emergency Contact Phone</label>
                <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
                />
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-oku-taupe/5 pb-4">
           <Globe size={18} className="text-oku-ocean" />
           <h3 className="font-display font-bold text-lg text-oku-dark">Preferences</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Preferred Language</label>
                <select
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all appearance-none"
                >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Timezone</label>
                <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all appearance-none"
                >
                    <option value="UTC">UTC (Universal)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">US Eastern (EST)</option>
                    <option value="America/Los_Angeles">US Pacific (PST)</option>
                </select>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Clinical Bio (Optional)</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          placeholder="Briefly share anything you'd like your therapist to know about you."
          className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all shadow-inner"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-navy py-5 px-12 flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Synchronize Profile
        </button>
      </div>
    </form>
  )
}
