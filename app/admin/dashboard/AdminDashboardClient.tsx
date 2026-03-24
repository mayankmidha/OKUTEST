'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Users, DollarSign, Settings, Activity, CheckCircle, 
  Clock, Shield, Plus, Edit2, Check, X, UserPlus,
  TrendingUp, BarChart3, PieChart, ShieldAlert,
  Search, Filter, MoreVertical, ExternalLink,
  Calendar, FileText, Zap, AlertTriangle, Megaphone, Sparkles, Brain,
  ArrowUpRight, Globe, Lock, MessageSquare
} from 'lucide-react'
import { toggleTherapistVerification, updateTherapistRate, updateServicePrice, createService, toggleServiceStatus, updatePlatformSettings } from '../actions'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { OCIDiagnostic } from '@/components/OCIDiagnostic'
import { AdminUserManagement } from '@/components/AdminUserManagement'
import { AdminBlogManager } from '@/components/AdminBlogManager'
import { formatCurrency, convertToINR, autoConvert } from '@/lib/currency'

function AdminDashboardContent({ 
  stats, 
  therapists, 
  services,
  clients,
  settings: initialSettings
}: { 
  stats: {
    totalRevenue: number,
    totalAppointments: number,
    auditLogs: any[],
    recentActivities: any[],
    allTranscripts: any[],
    allPosts: any[]
  }, 
  therapists: any[], 
  services: any[],
  clients: any[],
  settings: any
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(currentTab)
  const [settings, setSettingsState] = useState(initialSettings || { maintenanceMode: false, platformFeePercent: 20 })
  const [isSavingSetting, setIsSavingSetting] = useState(false)

  const setSettings = async (newSettings: any) => {
    setSettingsState(newSettings)
    setIsSavingSetting(true)
    try {
       await updatePlatformSettings(newSettings)
    } finally {
       setIsSavingSetting(false)
    }
  }
  
  useEffect(() => {
    setActiveTab(currentTab)
  }, [currentTab])

  const setTab = (tab: string) => {
    router.push(`/admin/dashboard?tab=${tab}`)
  }

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
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-oku-navy text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">Admin Command</span>
             <span className="text-oku-taupe/40 text-[10px] font-black uppercase tracking-[0.3em]">Platform Oversight</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-oku-dark">
            Platform Pulse.
          </h1>
          <p className="text-xl text-oku-taupe font-display italic opacity-80 max-w-xl">
            Global administrative control and system-wide intelligence.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className={`px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm bg-white ${settings.maintenanceMode ? 'text-amber-600 border-amber-100' : 'text-emerald-600 border-emerald-100'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${settings.maintenanceMode ? 'bg-oku-pending animate-pulse' : 'bg-oku-success'}`} />
              {settings.maintenanceMode ? 'Maintenance Mode Active' : 'System Operational'}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8 mb-12 border-b border-oku-taupe/5">
        {[
          { id: 'overview', label: 'Pulse', icon: Activity },
          { id: 'management', label: 'Management', icon: UserPlus },
          { id: 'therapists', label: 'Therapists', icon: Shield },
          { id: 'blogs', label: 'Blogs', icon: FileText },
          { id: 'services', label: 'Catalog', icon: DollarSign },
          { id: 'clients', label: 'Patients', icon: Users },
          { id: 'transcripts', label: 'Integrity', icon: Brain },
          { id: 'activity', label: 'Clicks', icon: Zap },
          { id: 'oci', label: 'Intelligence', icon: Sparkles },
          { id: 'audit', label: 'Security', icon: Lock },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-oku-navy text-white shadow-2xl scale-105' 
                : 'bg-white text-oku-taupe border border-oku-taupe/5 hover:border-oku-navy hover:text-oku-navy'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-glass p-8 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 rounded-2xl bg-oku-green/20 text-oku-green-dark group-hover:bg-oku-green-dark group-hover:text-white transition-all">
                      <DollarSign size={24} />
                   </div>
                   <TrendingUp size={16} className="text-oku-success" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-1">Gross Volume</p>
                <div className="flex flex-col">
                    <p className="text-4xl font-display font-bold text-oku-dark">
                        {(() => {
                            const conv = autoConvert(stats.totalRevenue);
                            return formatCurrency(conv.amount, conv.currency);
                        })()}
                    </p>
                </div>
              </div>

              <div className="card-glass p-8 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 rounded-2xl bg-oku-purple/20 text-oku-purple-dark group-hover:bg-oku-purple-dark group-hover:text-white transition-all">
                      <Calendar size={24} />
                   </div>
                   <Activity size={16} className="text-oku-purple" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-1">Total Bookings</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{stats.totalAppointments}</p>
              </div>

              <div className="card-glass p-8 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 rounded-2xl bg-oku-ocean text-oku-navy-light group-hover:bg-oku-navy group-hover:text-white transition-all">
                      <Shield size={24} />
                   </div>
                   <CheckCircle size={16} className="text-oku-navy-light" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-1">Verified Team</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{therapists.filter((t: any) => t.practitionerProfile?.isVerified).length}</p>
              </div>

              <div className="card-glass p-8 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 rounded-2xl bg-oku-pink/20 text-oku-pink-dark group-hover:bg-oku-pink-dark group-hover:text-white transition-all">
                      <Users size={24} />
                   </div>
                   <Plus size={16} className="text-oku-pink-dark" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-1">Total Patients</p>
                <p className="text-4xl font-display font-bold text-oku-dark">{clients.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 card-glass p-10 group overflow-hidden relative">
                  <div className="flex items-center justify-between mb-12 relative z-10">
                     <div>
                        <h3 className="text-2xl font-display font-bold text-oku-dark tracking-tight">System Utilization</h3>
                        <p className="text-[9px] uppercase tracking-widest font-black text-oku-taupe/60 mt-1">Onboarding & Service Density</p>
                     </div>
                     <BarChart3 size={20} className="text-oku-taupe/20" />
                  </div>
                  
                  <div className="space-y-10 relative z-10">
                     <div className="space-y-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black text-oku-navy">
                           <span>Therapist Onboarding Progress</span>
                           <span>{Math.round((therapists.filter((t: any) => t.practitionerProfile?.isVerified).length / (therapists.length || 1)) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-oku-ocean rounded-full overflow-hidden">
                           <div className="h-full bg-oku-navy transition-all duration-1000" style={{ width: `${(therapists.filter((t: any) => t.practitionerProfile?.isVerified).length / (therapists.length || 1)) * 100}%` }} />
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        <div className="p-6 rounded-[2rem] bg-white border border-oku-taupe/5 shadow-inner">
                           <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe mb-2">Pending Admits</p>
                           <p className="text-3xl font-display font-bold text-oku-dark">{therapists.filter((t: any) => !t.practitionerProfile?.isVerified).length}</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white border border-oku-taupe/5 shadow-inner">
                           <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe mb-2">Live Services</p>
                           <p className="text-3xl font-display font-bold text-oku-dark">{services.filter((s: any) => s.isActive).length}</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white border border-oku-taupe/5 shadow-inner">
                           <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe mb-2">Platform Fee</p>
                           <p className="text-3xl font-display font-bold text-oku-dark">{settings.platformFeePercent}%</p>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-oku-navy/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000" />
               </div>

               <div className="lg:col-span-4 card-navy p-10 group overflow-hidden">
                  <div className="relative z-10">
                     <Megaphone className="text-oku-purple mb-8 animate-float" size={32} />
                     <h3 className="text-2xl font-display font-bold mb-4">Global Broadcast</h3>
                     <p className="text-white/60 text-sm leading-relaxed mb-8 italic font-display">
                        Push urgent updates to all connected clinical and patient dashboards.
                     </p>
                     <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-oku-purple transition-all placeholder:text-white/20 mb-6"
                        placeholder="Platform update message..."
                        rows={3}
                     />
                     <button className="btn-pastel w-full text-center py-4 text-[10px] font-black uppercase tracking-[0.2em]">Transmit Announcement</button>
                  </div>
                  <Globe className="absolute bottom-[-20px] left-[-20px] text-white opacity-5" size={150} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 mb-12">
               <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Identity & Access Management</h2>
               <p className="text-sm text-oku-taupe italic font-display opacity-60">Provision new accounts and override security credentials globally.</p>
            </div>
            <AdminUserManagement />
          </div>
        )}

        {activeTab === 'therapists' && (
          <div className="card-glass overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            <div className="p-10 border-b border-oku-taupe/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Practitioner Network</h2>
              <div className="flex items-center gap-4">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40 group-focus-within:text-oku-navy transition-colors" size={14} />
                    <input type="text" placeholder="Search verified team..." className="pl-12 pr-6 py-4 bg-oku-cream border border-oku-taupe/10 rounded-2xl text-[11px] font-bold focus:outline-none focus:border-oku-navy transition-all w-72 shadow-inner" />
                 </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-oku-cream/50 text-[10px] uppercase tracking-[0.2em] font-black text-oku-taupe/60">
                    <th className="p-8">Practitioner Identity</th>
                    <th className="p-8 text-center">Consent</th>
                    <th className="p-8">Credential Status</th>
                    <th className="p-8">Market Rate ($)</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {therapists.map(t => (
                    <tr key={t.id} className="hover:bg-oku-ocean/20 transition-all duration-500 group">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-500">
                            {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl bg-oku-purple/10 text-oku-purple-dark">🧘</div>}
                          </div>
                          <div>
                            <p className="font-bold text-oku-dark text-lg group-hover:text-oku-navy transition-colors">{t.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40 mt-1">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${t.hasSignedConsent ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {t.hasSignedConsent ? 'SIGNED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-8">
                        <button 
                          onClick={() => handleVerifyToggle(t.practitionerProfile.id, t.practitionerProfile.isVerified)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            t.practitionerProfile.isVerified 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-red-50 hover:text-red-700 hover:border-red-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100'
                          }`}
                        >
                          {t.practitionerProfile.isVerified ? <><Shield size={12}/> Verified Associate</> : <><ShieldAlert size={12}/> Review Required</>}
                        </button>
                      </td>
                      <td className="p-8">
                        {editingRate === t.practitionerProfile.id ? (
                          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-oku-navy shadow-xl animate-in zoom-in-95">
                            <input 
                              type="number" 
                              value={newRate}
                              autoFocus
                              onChange={(e) => setNewRate(e.target.value)}
                              className="w-20 bg-transparent px-2 text-sm font-bold text-oku-dark outline-none"
                            />
                            <div className="flex gap-1">
                               <button onClick={() => handleSaveRate(t.practitionerProfile.id)} className="p-1.5 bg-oku-navy text-white rounded-lg hover:bg-oku-navy-light transition-all"><Check size={12}/></button>
                               <button onClick={() => setEditingRate(null)} className="p-1.5 bg-oku-cream text-oku-dark rounded-lg hover:bg-red-50"><X size={12}/></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 group/rate cursor-pointer" onClick={() => { setEditingRate(t.practitionerProfile.id); setNewRate(String(t.practitionerProfile.hourlyRate || 0)) }}>
                            <span className="text-xl font-display font-bold text-oku-dark">${t.practitionerProfile.hourlyRate || 0}</span>
                            <div className="w-8 h-8 rounded-full bg-oku-cream-warm/30 flex items-center justify-center text-oku-taupe group-hover/rate:bg-oku-navy group-hover/rate:text-white transition-all">
                              <Edit2 size={12} />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-8 text-right">
                        <button className="text-oku-taupe hover:text-oku-navy p-3 rounded-2xl hover:bg-oku-ocean/50 transition-all">
                           <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminBlogManager initialPosts={stats.allPosts} />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="card-glass p-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Clinical Catalog</h2>
                  <p className="text-sm text-oku-taupe italic font-display opacity-60 mt-1">Global service definitions and standard pricing.</p>
               </div>
               <button className="btn-navy flex items-center gap-3">
                  <Plus size={18} /> Add New Protocol
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.map((s: any) => (
                <div key={s.id} className="card-glass p-1 group hover:-translate-y-2 transition-all duration-500 hover:border-oku-navy/20">
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-14 h-14 rounded-2xl bg-oku-ocean text-oku-navy flex items-center justify-center shadow-inner group-hover:bg-oku-navy group-hover:text-white transition-all duration-500">
                        <Zap size={24} />
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-oku-cream-warm text-oku-taupe border border-oku-taupe/5'}`}>
                        {s.isActive ? 'System Live' : 'Maintenance'}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-oku-dark group-hover:text-oku-navy transition-colors mb-3">{s.name}</h3>
                    <p className="text-sm text-oku-taupe font-display italic opacity-60 line-clamp-2 mb-10">{s.description}</p>
                    
                    <div className="mt-auto pt-8 border-t border-oku-taupe/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Clock size={14} className="text-oku-taupe/40" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe">{s.duration} MIN</span>
                       </div>
                       
                       <div className="flex items-center gap-4 cursor-pointer group/p" onClick={() => { setEditingService(s.id); setNewPrice(String(s.price)) }}>
                          <p className="text-3xl font-display font-bold text-oku-dark">${s.price}</p>
                          <ArrowUpRight size={16} className="text-oku-taupe opacity-0 group-hover/p:opacity-100 transition-all -translate-x-2 group-hover/p:translate-x-0" />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="card-glass overflow-hidden">
            <div className="p-10 border-b border-oku-taupe/5 flex justify-between items-center">
              <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Patient Directory</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-oku-taupe bg-oku-cream-warm px-4 py-2 rounded-full">
                 {clients.length} Registered Seekers
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8">Client Name</th>
                    <th className="p-8">Contact Identity</th>
                    <th className="p-8 text-center">Onboarding</th>
                    <th className="p-8 text-center">Consent Status</th>
                    <th className="p-8 text-center">Sessions</th>
                    <th className="p-8 text-center">Attendance Note</th>
                    <th className="p-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {clients.map((c: any) => (
                    <tr key={c.id} className="hover:bg-oku-cream/20 transition-all duration-300 group">
                      <td className="p-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-oku-navy text-white flex items-center justify-center font-bold text-xs uppercase">
                               {c.name?.substring(0, 2)}
                            </div>
                            <span className="font-bold text-oku-dark text-lg group-hover:text-oku-navy transition-colors">{c.name}</span>
                         </div>
                      </td>
                      <td className="p-8 text-sm text-oku-taupe italic">{c.email}</td>
                      <td className="p-8 text-center">
                        <div className="flex flex-col gap-1.5 items-center">
                            <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${c.intakeForm ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                Intake: {c.intakeForm ? 'DONE' : 'PENDING'}
                            </span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${c.hasSignedConsent ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {c.hasSignedConsent ? 'SIGNED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-8 text-center font-bold">{c._count.clientAppointments}</td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${c.clientProfile?.noShowCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {c.clientProfile?.noShowCount || 0} No-Shows
                        </span>
                      </td>
                      <td className="p-8 text-right">
                         <button className="text-oku-taupe hover:text-oku-dark"><ExternalLink size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-navy text-white">
              <div>
                <h2 className="text-3xl font-display font-bold tracking-tight">Clinical Integrity Hub</h2>
                <p className="text-[10px] uppercase tracking-widest font-black text-white/40 mt-1">Global AI Sentiment & Compliance Monitoring</p>
              </div>
              <Brain size={24} className="text-oku-purple animate-pulse" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8">Session Details</th>
                    <th className="p-8">Practitioner</th>
                    <th className="p-8">AI Sentiment</th>
                    <th className="p-8">Risk Profile</th>
                    <th className="p-8 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {stats.allTranscripts.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-oku-taupe italic opacity-60 font-display text-xl">No processed session intelligence captured yet.</td></tr>
                  ) : (
                    stats.allTranscripts.map((t: any) => (
                      <tr key={t.id} className="hover:bg-oku-ocean/10 transition-all text-xs">
                        <td className="p-8">
                           <p className="font-bold text-oku-dark text-base">{t.appointment.service.name}</p>
                           <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mt-1">Patient: {t.appointment.client.name}</p>
                        </td>
                        <td className="p-8">
                           <p className="font-medium text-oku-dark">{t.appointment.practitioner.name}</p>
                        </td>
                        <td className="p-8">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             t.sentiment === 'POSITIVE' ? 'bg-green-50 text-green-600' : 
                             t.sentiment === 'NEGATIVE' ? 'bg-red-50 text-red-600' : 
                             'bg-blue-50 text-blue-600'
                           }`}>
                             {t.sentiment}
                           </span>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${t.riskLevel === 'HIGH' ? 'bg-oku-danger animate-ping' : 'bg-oku-success'}`} />
                              <span className="font-bold text-[10px] uppercase tracking-widest opacity-60">OPTIMAL</span>
                           </div>
                        </td>
                        <td className="p-8 text-right font-mono opacity-60">
                           {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-purple/10">
              <div>
                <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Real-time Behavior</h2>
                <p className="text-xs text-oku-taupe font-black uppercase tracking-widest mt-1 opacity-60">Session tracking and clickstream data</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full border border-oku-taupe/10 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-oku-purple animate-ping" />
                 Monitoring Channels
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr><th className="p-8">User</th><th className="p-8">Action</th><th className="p-8">Context</th><th className="p-8">Environment</th><th className="p-8 text-right">Timestamp</th></tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {stats.recentActivities.map((act: any) => (
                    <tr key={act.id} className="hover:bg-oku-cream/20 transition-all text-xs">
                      <td className="p-8">
                         <p className="font-bold text-oku-dark">{act.user?.name}</p>
                         <p className="opacity-40 text-[10px]">{act.user?.email}</p>
                      </td>
                      <td className="p-8">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${act.action === 'LOGIN' ? 'bg-green-50 text-green-600' : 'bg-oku-purple/20 text-oku-purple-dark'}`}>
                           {act.action}
                         </span>
                      </td>
                      <td className="p-8 max-w-xs truncate font-medium opacity-60">{(act.metadata as any)?.url || (act.metadata as any)?.text}</td>
                      <td className="p-8 opacity-40 text-[10px]">{act.ipAddress}</td>
                      <td className="p-8 text-right font-mono opacity-60">{new Date(act.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'oci' && (
          <div className="space-y-12 animate-in zoom-in-95 duration-1000">
            <div className="card-navy p-12 group">
               <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
                     <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-xl">
                        <Brain size={36} className="text-oku-purple animate-pulse" />
                     </div>
                     <div>
                        <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tighter">OKU CORE INTELLIGENCE</h2>
                        <p className="text-[11px] uppercase tracking-[0.5em] font-black text-oku-purple opacity-40 mt-2">Autonomous Governance Engine v2.5</p>
                     </div>
                  </div>
                  <OCIDiagnostic />
               </div>
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oku-purple/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:bg-oku-purple/10 transition-all duration-1000" />
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-dark text-white">
              <h2 className="text-3xl font-display font-bold tracking-tight">System Audit Logs</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-oku-cream/40 font-bold">Critical Activity</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr><th className="p-8">Timestamp</th><th className="p-8">User</th><th className="p-8">Action</th><th className="p-8">Data Changes</th></tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {stats.auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-oku-cream/20 transition-all text-xs">
                      <td className="p-8 font-mono opacity-60">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="p-8 font-bold text-oku-dark">{log.user?.name || 'System'}</td>
                      <td className="p-8">
                         <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${log.action.includes('CREATED') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                           {log.action}
                         </span>
                      </td>
                      <td className="p-8 max-w-xs truncate font-mono opacity-40">{log.changes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card-glass p-10 animate-in fade-in duration-700">
             <div className="space-y-10 max-w-2xl">
                <div>
                   <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight mb-2">Global Configuration</h2>
                   <p className="text-sm text-oku-taupe font-display italic opacity-60">System-wide parameters and behavioral overrides.</p>
                </div>
                
                <div className="flex items-center justify-between p-8 bg-oku-cream/30 rounded-3xl border border-oku-taupe/5">
                   <div>
                      <p className="font-bold text-oku-dark text-lg">Maintenance Mode</p>
                      <p className="text-sm text-oku-taupe italic">Put the entire platform into read-only mode.</p>
                   </div>
                   <button 
                     className={`w-16 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-oku-purple' : 'bg-oku-taupe/20'}`}
                     onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                   >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-9 shadow-lg' : 'left-1'}`} />
                   </button>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe flex items-center gap-2">
                      <Zap size={14} className="text-oku-purple" /> Platform Take Rate (%)
                   </label>
                   <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" max="50" 
                        value={settings.platformFeePercent} 
                        onChange={(e) => setSettings({...settings, platformFeePercent: parseInt(e.target.value)})}
                        className="flex-1 accent-oku-purple"
                      />
                      <span className="text-2xl font-display font-bold text-oku-dark min-w-[60px] text-right">{settings.platformFeePercent}%</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AdminDashboardClient(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-oku-cream flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-oku-navy/5 border-t-oku-navy rounded-full animate-spin mx-auto" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-oku-navy rounded-full animate-pulse" />
             </div>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-oku-taupe animate-pulse">Platform Syncing...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent {...props} />
    </Suspense>
  )
}

export default AdminDashboardClient
