'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Users, DollarSign, Settings, Activity, CheckCircle, 
  Clock, Shield, Plus, Edit2, Check, X, 
  TrendingUp, BarChart3, PieChart, ShieldAlert,
  Search, Filter, MoreVertical, ExternalLink,
  Calendar, FileText, Zap, AlertTriangle
} from 'lucide-react'
import { toggleTherapistVerification, updateTherapistRate, updateServicePrice, createService, toggleServiceStatus } from '../actions'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'

function AdminDashboardContent({ 
  stats, 
  therapists, 
  services,
  clients,
  settings: initialSettings
}: { 
  stats: any, 
  therapists: any[], 
  services: any[],
  clients: any[],
  settings: any
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(currentTab)
  const [settings, setSettings] = useState(initialSettings || { maintenanceMode: false, platformFeePercent: 20 })
  
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
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Platform Hub" 
        description="Administrative oversight and system configuration."
        actions={
           <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${settings.maintenanceMode ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-green-500'}`} />
              {settings.maintenanceMode ? 'Maintenance Mode' : 'Live System'}
           </div>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-12 border-b border-oku-taupe/10 pb-6">
        {[
          { id: 'overview', label: 'Platform Pulse', icon: Activity },
          { id: 'therapists', label: 'Therapist Management', icon: Shield },
          { id: 'services', label: 'Service Catalog', icon: DollarSign },
          { id: 'clients', label: 'Patient Records', icon: Users },
          { id: 'audit', label: 'Security & Logs', icon: FileText },
          { id: 'settings', label: 'Global Settings', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-oku-dark text-white shadow-2xl scale-105' 
                : 'bg-white text-oku-taupe border border-oku-taupe/10 hover:border-oku-purple hover:text-oku-purple'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard subtitle="Total Revenue" icon={DollarSign}>
                <p className="text-4xl font-display font-bold text-oku-dark">${stats.totalRevenue.toLocaleString()}</p>
              </DashboardCard>
              <DashboardCard subtitle="Bookings" icon={Calendar}>
                <p className="text-4xl font-display font-bold text-oku-dark">{stats.totalAppointments}</p>
              </DashboardCard>
              <DashboardCard subtitle="Providers" icon={Shield}>
                <p className="text-4xl font-display font-bold text-oku-dark">{therapists.filter(t => t.practitionerProfile?.isVerified).length}</p>
              </DashboardCard>
              <DashboardCard subtitle="Clients" icon={Users}>
                <p className="text-4xl font-display font-bold text-oku-dark">{clients.length}</p>
              </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <DashboardCard title="System Metrics" icon={BarChart3} dark className="relative overflow-hidden group">
                  <div className="space-y-8 relative z-10 mt-4">
                     <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-black opacity-40">
                           <span>Therapist Onboarding</span>
                           <span>{Math.round((therapists.filter(t => t.practitionerProfile?.isVerified).length / (therapists.length || 1)) * 100)}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-oku-purple transition-all duration-1000" style={{ width: `${(therapists.filter(t => t.practitionerProfile?.isVerified).length / (therapists.length || 1)) * 100}%` }} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Pending</p>
                           <p className="text-2xl font-bold">{therapists.filter(t => !t.practitionerProfile?.isVerified).length}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Active Services</p>
                           <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                        </div>
                     </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
               </DashboardCard>

               <DashboardCard title="Booking Velocity" icon={TrendingUp} className="relative overflow-hidden">
                  <div className="flex items-end gap-3 h-48 mt-4">
                     {[30, 60, 40, 85, 55, 75, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-oku-purple/10 rounded-2xl relative group cursor-pointer">
                           <div 
                             className="absolute bottom-0 left-0 right-0 bg-oku-purple rounded-2xl transition-all duration-700 group-hover:bg-oku-dark" 
                             style={{ height: `${h}%` }}
                           />
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe opacity-40">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </DashboardCard>
            </div>
          </div>
        )}

        {activeTab === 'therapists' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-oku-taupe/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Practitioner Network</h2>
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe" size={14} />
                    <input type="text" placeholder="Search team..." className="pl-10 pr-4 py-3 bg-oku-cream/50 border border-oku-taupe/10 rounded-full text-xs focus:outline-none focus:border-oku-purple transition-all w-64" />
                 </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8 border-b border-oku-taupe/5">Practitioner</th>
                    <th className="p-8 border-b border-oku-taupe/5">Internal Status</th>
                    <th className="p-8 border-b border-oku-taupe/5">Market Rate ($)</th>
                    <th className="p-8 border-b border-oku-taupe/5 text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {therapists.map(t => (
                    <tr key={t.id} className="hover:bg-oku-cream/20 transition-all duration-300">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-oku-purple/10 overflow-hidden border-2 border-white shadow-sm">
                            {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🧘</div>}
                          </div>
                          <div>
                            <p className="font-bold text-oku-dark text-lg">{t.name}</p>
                            <p className="text-xs text-oku-taupe mt-0.5">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <button 
                          onClick={() => handleVerifyToggle(t.practitionerProfile.id, t.practitionerProfile.isVerified)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            t.practitionerProfile.isVerified 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-red-50 hover:text-red-700 hover:border-red-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100'
                          }`}
                        >
                          {t.practitionerProfile.isVerified ? <><CheckCircle size={12}/> Verified</> : <><ShieldAlert size={12}/> Pending Approval</>}
                        </button>
                      </td>
                      <td className="p-8">
                        {editingRate === t.practitionerProfile.id ? (
                          <div className="flex items-center gap-2 bg-oku-cream/50 p-2 rounded-xl border border-oku-purple/20">
                            <input 
                              type="number" 
                              value={newRate}
                              autoFocus
                              onChange={(e) => setNewRate(e.target.value)}
                              className="w-20 bg-transparent px-2 text-sm font-bold text-oku-dark outline-none"
                            />
                            <div className="flex gap-1">
                               <button onClick={() => handleSaveRate(t.practitionerProfile.id)} className="p-1.5 bg-oku-dark text-white rounded-lg hover:bg-oku-purple transition-all"><Check size={12}/></button>
                               <button onClick={() => setEditingRate(null)} className="p-1.5 bg-white text-oku-dark border border-oku-taupe/10 rounded-lg hover:bg-red-50"><X size={12}/></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 group/rate">
                            <span className="text-xl font-display font-bold text-oku-dark">${t.practitionerProfile.hourlyRate || 0}</span>
                            <button onClick={() => { setEditingRate(t.practitionerProfile.id); setNewRate(String(t.practitionerProfile.hourlyRate || 0)) }} className="opacity-0 group-hover/rate:opacity-100 p-2 rounded-full hover:bg-oku-purple/10 text-oku-purple transition-all">
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-8 text-right">
                        <button className="bg-oku-cream-warm/20 text-oku-dark p-3 rounded-xl hover:bg-oku-dark hover:text-white transition-all">
                           <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
            <div className="p-12 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-dark text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold tracking-tight">Session Catalog</h2>
                <p className="text-sm text-oku-cream/40 mt-2 font-display italic">Global pricing and service definitions.</p>
              </div>
              <button className="relative z-10 btn-primary py-4 px-8 flex items-center gap-2 shadow-2xl">
                 <Plus size={18} /> New Service
              </button>
              <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/5 rounded-full blur-3xl" />
            </div>
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map(s => (
                  <div key={s.id} className="group p-8 bg-oku-cream/20 border border-oku-taupe/5 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 rounded-2xl bg-white text-oku-purple shadow-sm group-hover:bg-oku-purple group-hover:text-white transition-colors duration-500">
                        <PieChart size={24} />
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-oku-cream-warm text-oku-taupe'}`}>
                           {s.isActive ? 'Live' : 'Hidden'}
                         </span>
                         <button className="p-2 text-oku-taupe hover:text-oku-dark"><Settings size={14} /></button>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-oku-dark mb-2">{s.name}</h3>
                    <p className="text-sm text-oku-taupe mb-8 leading-relaxed opacity-60 line-clamp-2">{s.description}</p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-oku-taupe/5">
                       <div className="flex items-center gap-2 text-oku-taupe font-bold">
                          <Clock size={14} />
                          <span className="text-[10px] uppercase tracking-widest">{s.duration} minutes</span>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {editingService === s.id ? (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl border border-oku-purple/20 animate-in slide-in-from-right-4">
                              <span className="text-oku-purple font-bold ml-2">$</span>
                              <input 
                                type="number" 
                                value={newPrice}
                                autoFocus
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-20 bg-transparent px-2 font-bold text-oku-dark outline-none"
                              />
                              <button onClick={() => handleSaveServicePrice(s.id)} className="p-2 bg-oku-dark text-white rounded-xl hover:bg-oku-purple transition-all"><Check size={14}/></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 group/price cursor-pointer" onClick={() => { setEditingService(s.id); setNewPrice(String(s.price)) }}>
                              <p className="text-3xl font-display font-bold text-oku-dark group-hover:text-oku-purple transition-colors">${s.price}</p>
                              <div className="w-8 h-8 rounded-full bg-oku-cream-warm/30 flex items-center justify-center text-oku-taupe group-hover/price:bg-oku-purple group-hover/price:text-white transition-all">
                                <Edit2 size={12} />
                              </div>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center">
              <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Patient Directory</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-oku-taupe bg-oku-cream-warm px-4 py-2 rounded-full">
                 {clients.length} Registered Seekers
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-oku-cream/30 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                  <tr>
                    <th className="p-8 border-b border-oku-taupe/5">Client Name</th>
                    <th className="p-8 border-b border-oku-taupe/5">Contact Identity</th>
                    <th className="p-8 border-b border-oku-taupe/5 text-center">Session Count</th>
                    <th className="p-8 border-b border-oku-taupe/5 text-center">Attendance Note</th>
                    <th className="p-8 border-b border-oku-taupe/5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oku-taupe/5">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-oku-cream/20 transition-all duration-300 group">
                      <td className="p-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-oku-cream-warm/50 flex items-center justify-center text-oku-taupe font-bold text-xs uppercase tracking-tighter">
                               {c.name?.substring(0, 2)}
                            </div>
                            <span className="font-bold text-oku-dark text-lg group-hover:text-oku-purple transition-colors">{c.name}</span>
                         </div>
                      </td>
                      <td className="p-8 text-sm text-oku-taupe italic">{c.email}</td>
                      <td className="p-8 text-center">
                         <span className="px-4 py-2 bg-white rounded-full border border-oku-taupe/10 font-bold text-oku-dark shadow-sm">
                            {c._count.clientAppointments}
                         </span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${c.clientProfile?.noShowCount > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
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

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <DashboardCard title="Global Configuration" icon={Settings}>
             <div className="space-y-10 max-w-2xl mt-4">
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
          </DashboardCard>
        )}

        {/* AUDIT LOGS TAB */}
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
                  {(stats.auditLogs || []).map((log: any) => (
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
      </div>
    </div>
  )
}

function AdminDashboardClient(props: any) {
  return (
    <Suspense fallback={<div className="p-20 text-center font-display italic text-oku-taupe">Loading Platform Hub...</div>}>
      <AdminDashboardContent {...props} />
    </Suspense>
  )
}

export default AdminDashboardClient
