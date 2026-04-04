'use client'

import { useState } from 'react'
import { UserPlus, Key, Loader2, AlertCircle, Users, Mail, User, Shield, Trash2 } from 'lucide-react'
import { updateUserRole, deleteUser } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export function AdminUserManagement({ users }: { users?: any[] }) {
  const [activeSubTab, setActiveSubSubTab] = useState<'directory' | 'create' | 'reset'>('directory')
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  // Create User State
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', role: 'CLIENT' })
  
  // Reset Password State
  const [resetData, setResetData] = useState({ userId: '', newPassword: '' })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting('create')
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
        router.refresh()
      } else {
        const text = await res.text()
        setMessage({ type: 'error', text: text || 'Failed to create user' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Unexpected error' })
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting('reset')
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
      setIsSubmitting(null)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return
    setIsSubmitting(userId)
    try {
      await updateUserRole(userId, newRole as any)
      router.refresh()
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this user? This cannot be undone.')) return
    setIsSubmitting(userId)
    try {
      await deleteUser(userId)
      router.refresh()
    } finally {
      setIsSubmitting(null)
    }
  }

  const filteredUsers = (users || []).filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveSubSubTab('directory')}
          className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${activeSubTab === 'directory' ? 'bg-oku-navy text-white' : 'bg-oku-cream text-oku-taupe hover:bg-oku-cream-warm'}`}
        >
          <Users size={14} className="inline mr-2" /> User Directory
        </button>
        <button 
          onClick={() => setActiveSubSubTab('create')}
          className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${activeSubTab === 'create' ? 'bg-oku-navy text-white' : 'bg-oku-cream text-oku-taupe hover:bg-oku-cream-warm'}`}
        >
          <UserPlus size={14} className="inline mr-2" /> Create Identity
        </button>
        <button 
          onClick={() => setActiveSubSubTab('reset')}
          className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${activeSubTab === 'reset' ? 'bg-oku-navy text-white' : 'bg-oku-cream text-oku-taupe hover:bg-oku-cream-warm'}`}
        >
          <Key size={14} className="inline mr-2" /> Force Credential Reset
        </button>
      </div>

      <div className="card-glass-3d !p-10 !bg-white/60">
        {message && (
          <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            <AlertCircle size={18} />
            <p className="font-bold text-sm">{message.text}</p>
          </div>
        )}

        {activeSubTab === 'directory' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center mb-8">
                 <div>
                     <h3 className="heading-display text-3xl text-oku-darkgrey">Global Directory</h3>
                     <p className="text-oku-darkgrey/40 text-sm font-display italic">Manage roles and access for all registered identities.</p>
                 </div>
                 <input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-pastel max-w-xs"
                 />
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-oku-taupe/10 text-[9px] font-black uppercase tracking-widest text-oku-taupe">
                     <th className="pb-4 pr-4">Identity</th>
                     <th className="pb-4 px-4">Contact</th>
                     <th className="pb-4 px-4">Current Role</th>
                     <th className="pb-4 px-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-oku-taupe/5">
                   {filteredUsers.map(u => (
                     <tr key={u.id} className="hover:bg-white/40 transition-colors">
                       <td className="py-4 pr-4 font-bold text-sm">{u.name}</td>
                       <td className="py-4 px-4 text-xs text-oku-taupe">{u.email}</td>
                       <td className="py-4 px-4">
                         <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={isSubmitting === u.id}
                            className="bg-white/60 border border-oku-taupe/20 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-oku-purple-dark"
                         >
                            <option value="CLIENT">Client</option>
                            <option value="THERAPIST">Therapist</option>
                            <option value="ADMIN">Admin</option>
                         </select>
                       </td>
                       <td className="py-4 px-4 text-right">
                         <button 
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={isSubmitting === u.id}
                            className="p-2 text-oku-taupe/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         >
                            {isSubmitting === u.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                         </button>
                       </td>
                     </tr>
                   ))}
                   {filteredUsers.length === 0 && (
                     <tr>
                        <td colSpan={4} className="py-8 text-center text-oku-taupe text-sm italic">No users found matching your search.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeSubTab === 'create' && (
          <form onSubmit={handleCreateUser} className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="text" 
                    value={createData.name}
                    onChange={(e) => setCreateData({...createData, name: e.target.value})}
                    placeholder="e.g. Jane Doe"
                    className="input-pastel pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="email" 
                    value={createData.email}
                    onChange={(e) => setCreateData({...createData, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="input-pastel pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">System Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <select 
                    value={createData.role}
                    onChange={(e) => setCreateData({...createData, role: e.target.value})}
                    className="input-pastel pl-12 appearance-none"
                  >
                    <option value="CLIENT">Patient (Client)</option>
                    <option value="THERAPIST">Practitioner (Therapist)</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">Initial Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={16} />
                  <input 
                    required
                    type="password" 
                    value={createData.password}
                    onChange={(e) => setCreateData({...createData, password: e.target.value})}
                    className="input-pastel pl-12"
                  />
                </div>
              </div>
            </div>
            <button disabled={isSubmitting === 'create'} type="submit" className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5">
              {isSubmitting === 'create' ? <Loader2 size={20} className="animate-spin mr-2" /> : <UserPlus size={20} className="mr-2" />}
              Authorize & Create Identity
            </button>
          </form>
        )}

        {activeSubTab === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-8 max-w-xl animate-in fade-in slide-in-from-left-4">
             <div>
                <h3 className="heading-display text-3xl text-oku-darkgrey">Credential Override</h3>
                <p className="text-oku-darkgrey/40 text-sm font-display italic mt-2">Force a password reset for any identity in the system.</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">Select Identity</label>
                  <select 
                    required
                    value={resetData.userId}
                    onChange={(e) => setResetData({...resetData, userId: e.target.value})}
                    className="input-pastel appearance-none"
                  >
                    <option value="">Choose User...</option>
                    {(users || []).map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe opacity-60 ml-2">New Secure Password</label>
                  <input 
                    required
                    type="password" 
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                    placeholder="Enter new credentials"
                    className="input-pastel"
                  />
                </div>
            </div>
            <button disabled={isSubmitting === 'reset'} type="submit" className="btn-pill-3d bg-red-600 text-white w-full !py-5 hover:bg-red-700">
              {isSubmitting === 'reset' ? <Loader2 size={20} className="animate-spin mr-2" /> : <AlertCircle size={20} className="mr-2" />}
              Force Password Reset
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
