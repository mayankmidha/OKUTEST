'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User, Mail, Phone } from 'lucide-react'

export default function ClientProfileForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    bio: initialData.bio || '',
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">
            <User size={12} /> Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">
            <Mail size={12} /> Email Address
          </label>
          <input
            type="email"
            disabled
            value={formData.email}
            className="w-full bg-oku-cream/10 border border-oku-taupe/5 rounded-2xl p-4 text-sm text-oku-taupe cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe flex items-center gap-2">
            <Phone size={12} /> Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Not set"
            className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">About You (Optional Note for Therapists)</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          placeholder="Briefly share anything you'd like your therapist to know about you."
          className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-4 px-10 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </div>
    </form>
  )
}
