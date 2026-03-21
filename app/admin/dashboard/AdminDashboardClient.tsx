'use client'

import { useState } from 'react'
import { Users, DollarSign, Settings, Activity, CheckCircle, Clock, Shield, Plus, Edit2, Check, X } from 'lucide-react'
import { toggleTherapistVerification, updateTherapistRate, updateServicePrice, createService, toggleServiceStatus } from '../actions'

export default function AdminDashboardClient({ 
  stats, 
  therapists, 
  services,
  clients 
}: { 
  stats: any, 
  therapists: any[], 
  services: any[],
  clients: any[]
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingRate, setEditingRate] = useState<string | null>(null)
  const [newRate, setNewRate] = useState<string>('')
  
  const [editingService, setEditingService] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<string>('')

  const handleVerifyToggle = async (id: string, currentStatus: boolean) => {
    await toggleTherapistVerification(id, !currentStatus)
  }

  const handleSaveRate = async (id: string) => {
    if (newRate) {
      await updateTherapistRate(id, parseFloat(newRate))
    }
    setEditingRate(null)
  }

  const handleSaveServicePrice = async (id: string) => {
    if (newPrice) {
      await updateServicePrice(id, parseFloat(newPrice))
    }
    setEditingService(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">
          Admin Control Center
        </h1>
        <p className="text-oku-taupe mt-2 font-display italic">Manage the platform, therapists, and services.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-10 border-b border-oku-taupe/10 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'therapists', label: 'Therapists & Onboarding', icon: Shield },
          { id: 'services', label: 'Pricing & Services', icon: DollarSign },
          { id: 'clients', label: 'Clients', icon: Users }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-oku-dark text-white shadow-lg' 
                : 'bg-white text-oku-taupe border border-oku-taupe/10 hover:border-oku-purple hover:text-oku-purple'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Total Revenue</p>
                <p className="text-4xl font-display font-bold text-oku-dark">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Total Appointments</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{stats.totalAppointments}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Verified Therapists</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{therapists.filter(t => t.practitionerProfile?.isVerified).length}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-oku-taupe/10 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-4">Total Clients</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{clients.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-oku-dark text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-display font-bold mb-6 tracking-tighter">System Health</h3>
                    <div className="space-y-6">
                       <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-sm opacity-60">Pending Verifications</span>
                          <span className="font-bold text-oku-purple">{therapists.filter(t => !t.practitionerProfile?.isVerified).length}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-sm opacity-60">Active Services</span>
                          <span className="font-bold text-oku-purple">{services.filter(s => s.isActive).length}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm opacity-60">Database Status</span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-400 px-2 py-1 rounded">Operational</span>
                       </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-sm">
                  <h3 className="text-2xl font-display font-bold text-oku-dark mb-6 tracking-tighter">Recent Client Growth</h3>
                  <div className="flex items-end gap-2 h-40">
                     {/* Mock Chart Visualization */}
                     {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-oku-purple/20 rounded-t-lg relative group">
                           <div 
                             className="absolute bottom-0 left-0 right-0 bg-oku-purple rounded-t-lg transition-all duration-1000" 
                             style={{ height: `${h}%` }}
                           />
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40">
                     <span>Mon</span>
                     <span>Tue</span>
                     <span>Wed</span>
                     <span>Thu</span>
                     <span>Fri</span>
                     <span>Sat</span>
                     <span>Sun</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* THERAPISTS TAB */}
        {activeTab === 'therapists' && (
          <div className="bg-white rounded-[2rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-oku-taupe/10 flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-oku-dark">Therapist Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/50 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-6">Therapist</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Hourly Rate ($)</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/10">
                  {therapists.map(t => (
                    <tr key={t.id} className="hover:bg-oku-cream/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-oku-purple/20 overflow-hidden">
                            {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : null}
                          </div>
                          <div>
                            <p className="font-bold text-oku-dark">{t.name}</p>
                            <p className="text-xs text-oku-taupe">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => handleVerifyToggle(t.practitionerProfile.id, t.practitionerProfile.isVerified)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            t.practitionerProfile.isVerified 
                            ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-green-100 hover:text-green-700'
                          }`}
                        >
                          {t.practitionerProfile.isVerified ? <><CheckCircle size={14}/> Verified</> : <><Clock size={14}/> Pending</>}
                        </button>
                      </td>
                      <td className="p-6">
                        {editingRate === t.practitionerProfile.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              value={newRate}
                              onChange={(e) => setNewRate(e.target.value)}
                              className="w-20 px-2 py-1 border border-oku-taupe/20 rounded-md text-sm"
                            />
                            <button onClick={() => handleSaveRate(t.practitionerProfile.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={16}/></button>
                            <button onClick={() => setEditingRate(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={16}/></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-oku-dark">{t.practitionerProfile.hourlyRate || 0}</span>
                            <button onClick={() => { setEditingRate(t.practitionerProfile.id); setNewRate(String(t.practitionerProfile.hourlyRate || 0)) }} className="text-oku-taupe hover:text-oku-purple">
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-[2rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-dark text-white">
              <div>
                <h2 className="text-2xl font-display font-bold">Platform Services & Pricing</h2>
                <p className="text-sm text-oku-cream/60 mt-1">These services are available for clients to book.</p>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6">
                {services.map(s => (
                  <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-oku-cream-warm/20 border border-oku-taupe/10 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-oku-dark">{s.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-oku-taupe">{s.duration} minutes • {s.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                      {editingService === s.id ? (
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-oku-taupe/10">
                          <span className="text-oku-taupe font-bold">$</span>
                          <input 
                            type="number" 
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-20 px-2 py-1 outline-none text-oku-dark font-bold"
                          />
                          <button onClick={() => handleSaveServicePrice(s.id)} className="p-1.5 bg-oku-green text-white rounded"><Check size={14}/></button>
                          <button onClick={() => setEditingService(null)} className="p-1.5 bg-oku-red text-white rounded"><X size={14}/></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Price</p>
                            <p className="text-2xl font-display font-bold text-oku-dark">${s.price}</p>
                          </div>
                          <button 
                            onClick={() => { setEditingService(s.id); setNewPrice(String(s.price)) }}
                            className="w-10 h-10 rounded-full bg-oku-purple/10 flex items-center justify-center text-oku-purple hover:bg-oku-purple hover:text-white transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-[2rem] border border-oku-taupe/10 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-oku-taupe/10">
              <h2 className="text-2xl font-display font-bold text-oku-dark">Registered Clients</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/50 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-6">Client Name</th>
                    <th className="p-6">Email</th>
                    <th className="p-6 text-center">Total Sessions</th>
                    <th className="p-6 text-center">No-Shows</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/10">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-oku-cream/30 transition-colors">
                      <td className="p-6 font-bold text-oku-dark">{c.name}</td>
                      <td className="p-6 text-sm text-oku-taupe">{c.email}</td>
                      <td className="p-6 text-center font-bold text-oku-dark">{c._count.clientAppointments}</td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.clientProfile?.noShowCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {c.clientProfile?.noShowCount || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
