'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const [bio, setBio] = useState(initialData.bio || '')
  const [rate, setRate] = useState(initialData.hourlyRate || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/practitioner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, hourlyRate: parseFloat(rate) })
      })

      if (res.ok) {
        router.refresh()
        alert('Profile updated successfully')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Professional Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all"
          placeholder="Tell your clients about your approach..."
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Hourly Rate ($)</label>
        <div className="relative max-w-[200px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20 focus:border-oku-purple transition-all font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save Changes
      </button>
    </form>
  )
}
