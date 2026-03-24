'use client'

import { useState } from 'react'
import { UserPlus, Key, Loader2, ShieldCheck, AlertCircle, Users, Mail, User, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AdminUserManagement() {
  const [activeSubTab, setActiveSubSubTab] = useState<'create' | 'reset'>('create')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Create User State
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', role: 'CLIENT' })
  
  // Reset Password State
  const [resetData, setResetData] = useState({ userId: '', newPassword: '' })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      })
      if (res.ok) {
        setMessage({ type: 'success', text: `User ${createData.email} created successfully` })
        setCreateData({ name: '', email: '', password: '', role: 'CLIENT' })
      } else {
        const text = await res.text()
        setMessage({ type: 'error', text: text || 'Failed to create user' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Unexpected error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Password reset successfully' })
        setResetData({ userId: '', newPassword: '' })
      } else {
        const text = await res.text()
        setMessage({ type: 'error', text: text || 'Failed to reset password' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Unexpected error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveSubSubTab('create')}
          className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${activeSubTab === 'create' ? 'bg-oku-navy text-white' : 'bg-oku-cream text-oku-taupe'}`}
        >
          <UserPlus size={14} className="inline mr-2" /> Create Identity
        </button>
        <button 
          onClick={() => setActiveSubSubTab('reset')}
          className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${activeSubTab === 'reset' ? 'bg-oku-navy text-white' : 'bg-oku-cream text-oku-taupe'}`}
        >
          <Key size={14} className="inline mr-2" /> Force Credential Reset
        </button>
      </div>

      <div className="card-glass p-10 bg-white shadow-2xl border-none">
        {activeSubTab === 'create' ? (
          <form onSubmit={handleCreateUser} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="text" 
                    value={createData.name}
                    onChange={(e) => setCreateData({...createData, name: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="email" 
                    value={createData.email}
                    onChange={(e) => setCreateData({...createData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">System Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <select 
                    value={createData.role}
                    onChange={(e) => setCreateData({...createData, role: e.target.value})}
                    className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner appearance-none"
                  >
                    <option value="CLIENT">Patient (Client)</option>
                    <option value="THERAPIST">Practitioner (Therapist)</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">Initial Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="password" 
                    value={createData.password}
                    onChange={(e) => setCreateData({...createData, password: e.target.value})}
                    className="pl-12 w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
            <button disabled={isSubmitting} type="submit" className="btn-navy w-full py-5 rounded-3xl flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
              Authorize & Create Identity
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">Target User ID (or Email)</label>
                <input 
                  required
                  type="text" 
                  value={resetData.userId}
                  onChange={(e) => setResetData({...resetData, userId: e.target.value})}
                  placeholder="Enter User ID or Registered Email"
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60">New Secure Password</label>
                <input 
                  required
                  type="password" 
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all shadow-inner"
                />
              </div>
            </div>
            <button disabled={isSubmitting} type="submit" className="btn-primary w-full py-5 rounded-3xl flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
              Override Security Credentials
            </button>
          </form>
        )}

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-6 rounded-3xl flex items-center gap-4 text-sm font-bold border ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}
            >
              {message.type === 'success' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
