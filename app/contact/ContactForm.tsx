'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Could not send message')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (submissionError: any) {
      setStatus('error')
      setError(submissionError.message || 'Could not send message')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-oku-taupe mb-2">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          className="w-full bg-white border border-oku-taupe/20 p-4 rounded-pill focus:ring-2 focus:ring-oku-purple transition-all outline-none"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-oku-taupe mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          className="w-full bg-white border border-oku-taupe/20 p-4 rounded-pill focus:ring-2 focus:ring-oku-purple transition-all outline-none"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-oku-taupe mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
          className="w-full bg-white border border-oku-taupe/20 p-4 rounded-pill focus:ring-2 focus:ring-oku-purple transition-all outline-none"
          placeholder="+91 99999 99999"
        />
      </div>
      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-oku-taupe mb-2">Message</label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          className="w-full bg-white border border-oku-taupe/20 p-4 rounded-xl focus:ring-2 focus:ring-oku-purple transition-all outline-none"
          placeholder="How can we help?"
        />
      </div>
      {status === 'success' && (
        <p className="text-sm font-bold text-green-700">Message received. Our team will follow up soon.</p>
      )}
      {error && (
        <p className="text-sm font-bold text-red-600">{error}</p>
      )}
      <button
        disabled={status === 'loading'}
        className="bg-oku-dark text-white px-12 py-4 rounded-pill font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 w-full disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === 'loading' ? (
          <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Sending</span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}
