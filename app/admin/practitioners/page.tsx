'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Bell, LogOut, Users, Search, Filter, ShieldCheck, Briefcase } from 'lucide-react'
import { ActionMenu } from '@/components/ActionMenu'

export default function AdminPractitionersPage() {
  const [user, setUser] = useState<any>(null)
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock practitioners data
    setPractitioners([
      {
        id: '1',
        name: 'Dr. Suraj Singh',
        email: 'suraj@okutherapy.com',
        licenseNumber: 'MD-12345',
        specialization: ['Psychiatry', 'Medication Management'],
        experience: '15+ years',
        status: 'VERIFIED',
        createdAt: '2024-01-10',
        totalSessions: 156,
        rating: 4.9,
        hourlyRate: 1500
      },
      {
        id: '2',
        name: 'Tanisha Singh',
        email: 'tanisha@okutherapy.com',
        licenseNumber: 'PSY-67890',
        specialization: ['Clinical Psychology', 'Psychodynamic Therapy'],
        experience: '12+ years',
        status: 'VERIFIED',
        createdAt: '2024-01-12',
        totalSessions: 98,
        rating: 4.8,
        hourlyRate: 1200
      },
      {
        id: '3',
        name: 'Dr. Rananjay Singh',
        email: 'rananjay@okutherapy.com',
        licenseNumber: 'MD-24680',
        specialization: ['Psychiatry', 'Child & Adolescent Psychiatry'],
        experience: '10+ years',
        status: 'PENDING',
        createdAt: '2024-02-15',
        totalSessions: 45,
        rating: 4.7,
        hourlyRate: 1400
      }
    ])
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-oku-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oku-purple mx-auto"></div>
          <p className="mt-4 text-oku-dark font-display italic">Synchronizing collective...</p>
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
               <span className="bg-oku-navy text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-premium">Admin Control</span>
               <span className="text-oku-taupe/40 text-[10px] font-black uppercase tracking-[0.3em]">Practitioner Management</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-oku-dark">
              Clinical Collective.
            </h1>
            <p className="text-xl text-oku-taupe font-display italic opacity-80 max-w-xl">
              Verification and oversight for Oku's trusted practitioners.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark transition-colors">
               ← Dashboard
            </Link>
            <div className="h-8 w-px bg-oku-taupe/10 mx-2" />
            <button className="btn-navy group flex items-center gap-3">
               <Users size={18} /> Onboard Specialist
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="md:col-span-2 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-oku-taupe/40 group-focus-within:text-oku-dark transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or license..." 
                className="w-full bg-white/60 backdrop-blur-md border border-white rounded-3xl py-5 pl-16 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all shadow-sm"
              />
           </div>
           <button className="bg-white/60 backdrop-blur-md border border-white rounded-3xl py-5 px-8 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Filter by Status</span>
              <Filter size={16} className="text-oku-taupe group-hover:text-oku-dark transition-colors" />
           </button>
        </div>

        {/* Data Table */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oku-taupe/5">
              <thead>
                <tr className="bg-oku-lavender/30">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Practitioner</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Specialization</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Sessions</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Revenue (₹)</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-oku-taupe uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oku-taupe/5">
                {practitioners.map((practitioner) => (
                  <tr key={practitioner.id} className="group hover:bg-white/60 transition-colors duration-500">
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-oku-glacier flex items-center justify-center text-oku-navy-light shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <Users size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-oku-dark leading-tight">{practitioner.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mt-1">{practitioner.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <ShieldCheck size={12} className="text-oku-purple-dark" />
                             <span className="text-[9px] font-bold text-oku-taupe">Lic: {practitioner.licenseNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {practitioner.specialization.map((spec: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-oku-matcha text-oku-matcha-dark border border-oku-matcha-dark/10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        practitioner.status === 'VERIFIED'
                          ? 'bg-oku-success/10 text-oku-success border border-oku-success/20'
                          : 'bg-oku-pending/10 text-oku-pending border border-oku-pending/20'
                      }`}>
                        {practitioner.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <span className="text-xl font-display font-bold text-oku-dark">{practitioner.totalSessions}</span>
                          <Briefcase size={14} className="text-oku-taupe opacity-30" />
                       </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <p className="text-lg font-bold text-oku-dark">₹{practitioner.hourlyRate.toLocaleString()}</p>
                       <p className="text-[9px] font-black text-oku-taupe opacity-40 uppercase tracking-widest">Base Rate</p>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-right">
                       <ActionMenu 
                         onView={() => console.log('View', practitioner.id)}
                         onEdit={() => console.log('Edit', practitioner.id)}
                         onSecurity={() => console.log('Security', practitioner.id)}
                         onDelete={() => console.log('Delete', practitioner.id)}
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
