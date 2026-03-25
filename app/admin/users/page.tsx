'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, Users, Search, Filter, ShieldCheck, Mail, Calendar, Activity } from 'lucide-react'
import { ActionMenu } from '@/components/ActionMenu'

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock users data
    setUsers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@client.com',
        role: 'CLIENT',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        lastLogin: '2024-03-25'
      },
      {
        id: '2',
        name: 'Dr. Suraj Singh',
        email: 'suraj@okutherapy.com',
        role: 'THERAPIST',
        status: 'ACTIVE',
        createdAt: '2024-01-10',
        lastLogin: '2024-03-25'
      },
      {
        id: '3',
        name: 'Tanisha Singh',
        email: 'tanisha@okutherapy.com',
        role: 'THERAPIST',
        status: 'ACTIVE',
        createdAt: '2024-01-12',
        lastLogin: '2024-03-24'
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@okutherapy.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2024-01-01',
        lastLogin: '2024-03-25'
      }
    ])
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-oku-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oku-purple mx-auto"></div>
          <p className="mt-4 text-oku-dark font-display italic">Accessing registry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-oku-cream px-6 py-12 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-oku-navy text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-premium">Access Control</span>
               <span className="text-oku-taupe/40 text-[10px] font-black uppercase tracking-[0.3em]">User Registry</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-oku-dark">
              Registry.
            </h1>
            <p className="text-xl text-oku-taupe font-display italic opacity-80 max-w-xl">
              Complete oversight of the Oku Therapy community members and access levels.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark transition-colors">
               ← Dashboard
            </Link>
            <div className="h-8 w-px bg-oku-taupe/10 mx-2" />
            <button className="btn-navy group flex items-center gap-3">
               <ShieldCheck size={18} /> System Audit
            </button>
          </div>
        </div>

        {/* Search & Global Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           <div className="md:col-span-3 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-oku-taupe/40 group-focus-within:text-oku-dark transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or role..." 
                className="w-full bg-white/60 backdrop-blur-md border border-white rounded-3xl py-5 pl-16 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-oku-rose/50 transition-all shadow-sm"
              />
           </div>
           <button className="bg-white/60 backdrop-blur-md border border-white rounded-3xl py-5 px-8 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">All Roles</span>
              <Filter size={16} className="text-oku-taupe group-hover:text-oku-dark transition-colors" />
           </button>
        </div>

        {/* Registry Table */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oku-taupe/5">
              <thead>
                <tr className="bg-oku-rose/30">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Member</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Clinical Role</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Account Status</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Registered</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Activity</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oku-taupe/5">
                {users.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/60 transition-colors duration-500">
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-oku-champagne flex items-center justify-center text-oku-taupe shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <Users size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-oku-dark leading-tight">{item.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mt-1">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        item.role === 'ADMIN' 
                          ? 'bg-oku-dark text-white'
                          : item.role === 'THERAPIST'
                          ? 'bg-oku-lavender text-oku-lavender-dark border border-oku-lavender-dark/20'
                          : 'bg-oku-matcha text-oku-matcha-dark border border-oku-matcha-dark/20'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${item.status === 'ACTIVE' ? 'bg-oku-success animate-pulse' : 'bg-oku-taupe/20'}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-oku-dark">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <div className="flex items-center gap-2 text-oku-taupe">
                          <Calendar size={14} className="opacity-40" />
                          <span className="text-sm font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <div className="flex items-center gap-2 text-oku-taupe">
                          <Activity size={14} className="opacity-40" />
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.lastLogin}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-right">
                       <ActionMenu 
                         onView={() => console.log('View', item.id)}
                         onEdit={() => console.log('Edit', item.id)}
                         onContact={() => console.log('Contact', item.id)}
                         onSecurity={() => console.log('Security', item.id)}
                         onDelete={() => console.log('Delete', item.id)}
                       />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
