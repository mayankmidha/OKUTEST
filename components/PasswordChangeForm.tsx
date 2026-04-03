'use client'

import { useState } from 'react'
import { Loader2, Key, ShieldCheck, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const text = await res.text()
        setMessage({ type: 'error', text: text || 'Failed to update password' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-oku-navy text-white flex items-center justify-center">
          <Key size={18} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-oku-dark">Security Settings</h3>
          <p className="text-[10px] uppercase tracking-widest text-oku-taupe font-black opacity-60">Update your access credentials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {message.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-navy py-4 px-10 flex items-center justify-center gap-2 disabled:opacity-50 w-full md:w-auto"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            Update Security Credentials
          </button>
        </div>
      </form>
    </div>
  )
}
