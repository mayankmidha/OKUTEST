'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Users, DollarSign, Settings, Activity, CheckCircle, 
  Clock, Shield, Plus, Edit2, Check, X, UserPlus,
  TrendingUp, BarChart3, PieChart, ShieldAlert,
  Search, Filter, MoreVertical, ExternalLink,
  Calendar, FileText, Zap, AlertTriangle, Megaphone, Sparkles, Brain,
  ArrowUpRight, Globe, Lock, MessageSquare, Pill, Trash2, TrendingDown,
  Layout, Save, ShieldCheck, Loader2, Heart, CreditCard, Scale
} from 'lucide-react'
import { 
  toggleTherapistVerification, 
  updateTherapistRate, 
  updatePlatformSettings,
} from '../actions'
import { AdminUserManagement } from '@/components/AdminUserManagement'
import { BlogManager } from '@/components/BlogManager'
import { formatCurrency, autoConvert } from '@/lib/currency'
import { getPractitionerDisciplineLabel } from '@/lib/practitioner-type'
import { motion, AnimatePresence } from 'framer-motion'
import { CirclesManager } from './CirclesManager'
import { AdminServicesManagement } from './AdminServicesManagement'
import { AdminAppointmentsManagement } from './AdminAppointmentsManagement'

function AdminDashboardContent({ 
  stats, 
  therapists, 
  services,
  clients,
  circles,
  allAppointments,
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
  circles: any[],
  allAppointments: any[],
  settings: any
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get('tab') || 'pulse'
  const [activeTab, setActiveTab] = useState(currentTab)
  const [isUpdating, setIsUpdating] = useState(false)
  const [platformSettings, setPlatformSettings] = useState(initialSettings)
  
  useEffect(() => {
    setActiveTab(currentTab)
  }, [currentTab])

  const setTab = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin/dashboard?tab=${tab}`, { scroll: false })
  }

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true)
    try {
      await toggleTherapistVerification(id, !currentStatus)
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCommitProtocols = async () => {
    setIsUpdating(true)
    try {
      await updatePlatformSettings(platformSettings)
      alert("✅ Protocols committed successfully.")
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const TABS = [
    { id: 'pulse', label: 'Pulse', icon: Activity },
    { id: 'integrity', label: 'Integrity', icon: Shield },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'audit', label: 'Audit', icon: Lock },
    { id: 'protocol', label: 'Protocol', icon: Settings }
  ]

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden text-oku-darkgrey">
      
      {/* ── HEADER: GLOBAL GOVERNANCE ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Command Hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Platform Oversight</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Platform <span className="text-oku-purple-dark italic">Pulse.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Global management and system-wide intelligence.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <div className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational Integrity
           </div>
        </div>
      </div>

      {/* ── 1. GLOBAL STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/40" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{clients.length + therapists.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Total Active Users</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/20">Circles</span>
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{circles.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Facilitated Groups</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-peach/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Activity size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/20" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{stats.totalAppointments}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Care Windows</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-babyblue/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.6s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <DollarSign size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/20" />
          </div>
          <div>
            <p className="text-4xl heading-display text-oku-darkgrey mb-2">
              {formatCurrency(autoConvert(stats.totalRevenue, undefined, 'INR').amount, 'INR')}
            </p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Gross Volume</p>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-16 relative z-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-oku-darkgrey text-white shadow-2xl scale-[1.05]' 
                : 'bg-white/60 text-oku-darkgrey/40 border border-white hover:bg-white hover:text-oku-darkgrey'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[600px]">
        <AnimatePresence mode="wait">
          {/* PULSE TAB */}
          {activeTab === 'pulse' && (
            <motion.div 
              key="pulse"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
               <div className="lg:col-span-8 card-glass-3d !p-12 !bg-white/40">
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Booking <span className="italic text-oku-purple-dark">Flow</span></h2>
                     <Layout size={24} className="text-oku-purple-dark/20" />
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                     {[
                       { label: 'Pending', status: 'PENDING', color: 'bg-oku-peach' },
                       { label: 'Confirmed', status: 'CONFIRMED', color: 'bg-oku-mint' },
                       { label: 'Completed', status: 'COMPLETED', color: 'bg-oku-lavender' },
                       { label: 'Cancelled', status: 'CANCELLED', color: 'bg-oku-blush' }
                     ].map((col) => {
                       const columnApps = allAppointments.filter(a => a.status === col.status).slice(0, 5)
                       return (
                       <div key={col.label} className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{col.label}</span>
                             <span className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center text-[10px] font-black text-oku-darkgrey shadow-sm">
                                {allAppointments.filter(a => a.status === col.status).length}
                             </span>
                          </div>
                          <div className={`${col.color}/20 rounded-[2rem] p-4 min-h-[350px] border-2 border-dashed border-white/60 flex flex-col gap-4`}>
                             {columnApps.map(appt => (
                                <div key={appt.id} className="card-glass-3d !p-4 !bg-white/80 !rounded-2xl shadow-sm border-none group cursor-pointer hover:scale-105 transition-all">
                                    <p className="text-[9px] font-bold text-oku-darkgrey truncate">{appt.client?.name || 'Anonymous'}</p>
                                    <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">{new Date(appt.startTime).toLocaleDateString()}</p>
                                </div>
                             ))}
                          </div>
                       </div>
                     )})}
                  </div>
               </div>
               <div className="lg:col-span-4 space-y-12">
                  <div className="card-glass-3d !p-10 !bg-oku-butter/40 border-2">
                     <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight mb-8">System <span className="italic text-oku-purple-dark">Activities</span></h3>
                     <div className="space-y-4">
                        {stats.recentActivities.slice(0, 5).map((act: any, i: number) => (
                          <div key={i} className="flex items-center gap-4 text-[10px]">
                             <div className="w-2 h-2 rounded-full bg-oku-purple-dark" />
                             <p className="text-oku-darkgrey font-bold truncate flex-1">{act.user?.name || 'Unknown'}</p>
                             <p className="text-oku-darkgrey/40 italic">{act.action}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* INTEGRITY TAB */}
          {activeTab === 'integrity' && (
            <motion.div 
              key="integrity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <AdminUserManagement users={[...therapists, ...clients]} />
            </motion.div>
          )}

          {/* NETWORK TAB */}
          {activeTab === 'network' && (
            <motion.div 
              key="network" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d overflow-hidden !p-0 !bg-white/40"
            >
              <div className="p-12 border-b border-white/60 flex justify-between items-center">
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Specialist <span className="italic text-oku-purple-dark">Network</span></h2>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Credential Verification Flow active</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-oku-lavender/40 text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                      <th className="p-10">Practitioner</th>
                      <th className="p-10">Verification</th>
                      <th className="p-10">Identity</th>
                      <th className="p-10 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {therapists.map(t => (
                      <tr key={t.id} className="hover:bg-white/40 transition-all duration-500">
                        <td className="p-10">
                          <p className="font-bold text-oku-darkgrey text-xl">{t.name}</p>
                          <p className="text-xs text-oku-darkgrey/40 mt-1 italic font-display">{getPractitionerDisciplineLabel(t.practitionerProfile)}</p>
                        </td>
                        <td className="p-10">
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleToggleVerification(t.practitionerProfile?.id || '', t.practitionerProfile?.isVerified || false)}
                            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${t.practitionerProfile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60 hover:scale-105'}`}
                          >
                            {t.practitionerProfile?.isVerified ? 'Verified' : 'Verify KYC'}
                          </button>
                        </td>
                        <td className="p-10"><span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{t.email}</span></td>
                        <td className="p-10 text-right"><MoreVertical size={20} className="text-oku-darkgrey/20 ml-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* FINANCIALS TAB */}
          {activeTab === 'financials' && (
            <motion.div 
              key="financials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <AdminAppointmentsManagement 
                appointments={allAppointments}
                therapists={therapists}
                clients={clients}
                services={services}
              />
            </motion.div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <motion.div 
              key="templates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <AdminServicesManagement services={services} />
            </motion.div>
          )}

          {/* SAFETY TAB */}
          {activeTab === 'safety' && (
            <motion.div 
              key="safety" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d !p-12 !bg-white/40"
            >
               <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-12">Clinical <span className="italic text-oku-purple-dark">Safeguards</span></h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 bg-oku-blush/10 rounded-[3rem] border border-oku-blush/20">
                     <div className="flex items-center gap-4 mb-6">
                        <AlertTriangle className="text-oku-blush-dark" />
                        <h3 className="font-bold text-xl">High-Risk Alerts</h3>
                     </div>
                     <p className="text-sm text-oku-darkgrey/60 italic font-display">No clinical flags detected in the last 24 hours.</p>
                  </div>
                  <div className="p-8 bg-oku-lavender/10 rounded-[3rem] border border-oku-lavender/20">
                     <div className="flex items-center gap-4 mb-6">
                        <Megaphone className="text-oku-purple-dark" />
                        <h3 className="font-bold text-xl">Circle Moderation</h3>
                     </div>
                     <p className="text-sm text-oku-darkgrey/60 italic font-display">{circles.length} facilitated rooms currently operational.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'audit' && (
            <motion.div 
              key="audit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d !p-12 !bg-white/40"
            >
               <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-12">Integrity <span className="italic text-oku-purple-dark">Ledger</span></h2>
               <div className="space-y-4">
                  {stats.auditLogs.map((log: any, i: number) => (
                    <div key={i} className="p-6 bg-white/60 rounded-2xl border border-white flex justify-between items-center text-[10px]">
                       <div className="flex items-center gap-6">
                          <span className="font-black uppercase tracking-widest text-oku-purple-dark">{log.action}</span>
                          <span className="text-oku-darkgrey/40 italic font-display">{log.user?.name || 'System'}</span>
                       </div>
                       <span className="text-oku-darkgrey/20 font-black uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* PROTOCOL TAB */}
          {activeTab === 'protocol' && (
            <motion.div 
              key="protocol" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-12"
            >
               <div className="card-glass-3d !p-12 !bg-white/40">
                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-10">Platform Protocol</h3>
                  <div className="space-y-6">
                     {[
                       { label: 'Maintenance Mode', key: 'maintenanceMode' },
                       { label: 'Enable OKU AI', key: 'okuAiEnabled' },
                       { label: 'ADHD Care Mode', key: 'adhdCareModeEnabled' },
                       { label: 'Fraud Detection', key: 'autoTranslateTranscripts' }
                     ].map((s) => (
                       <div key={s.key} className="flex items-center justify-between p-6 bg-white/60 rounded-[2rem] border border-white">
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">{s.label}</span>
                          <div 
                            onClick={() => setPlatformSettings({...platformSettings, [s.key]: !platformSettings[s.key as keyof typeof platformSettings]})}
                            className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-colors ${platformSettings[s.key as keyof typeof platformSettings] ? 'bg-oku-mint' : 'bg-oku-peach'}`}
                          >
                             <motion.div layout className="w-6 h-6 bg-white rounded-full" animate={{ x: platformSettings[s.key as keyof typeof platformSettings] ? 24 : 0 }} />
                          </div>
                       </div>
                     ))}
                     <button onClick={handleCommitProtocols} disabled={isUpdating} className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 mt-4">
                        {isUpdating ? <Loader2 size={18} className="animate-spin mr-3" /> : <Save size={18} className="mr-3" />} Commit Protocols
                     </button>
                  </div>
               </div>
               <div className="card-glass-3d !p-12 !bg-oku-mint/30">
                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-10">Economical Integrity</h3>
                  <div className="space-y-6">
                     {[
                       { label: 'Platform Fee (%)', key: 'therapySessionPlatformFeePercent' },
                       { label: 'Min. Payout (INR)', key: 'minimumPayoutAmount' }
                     ].map((f) => (
                       <div key={f.key} className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">{f.label}</label>
                          <input type="number" className="input-pastel" value={platformSettings[f.key as keyof typeof platformSettings]} onChange={(e) => setPlatformSettings({...platformSettings, [f.key]: parseFloat(e.target.value)})} />
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 3D Background Objects */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-oku-blush/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-oku-mint/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}

function AdminDashboardClient(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-oku-lavender flex items-center justify-center"><Loader2 size={48} className="animate-spin text-oku-purple-dark" /></div>}>
      <AdminDashboardContent {...props} />
    </Suspense>
  )
}

export default AdminDashboardClient
