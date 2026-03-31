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
  Layout, Save, ShieldCheck
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
  const [isUpdating, setIsUpdating] = useState(false)
  
  useEffect(() => {
    setActiveTab(currentTab)
  }, [currentTab])

  const setTab = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin/dashboard?tab=${tab}`, { scroll: false })
  }

  const handleToggleVerification = async (id: string) => {
    setIsUpdating(true)
    try {
      await toggleTherapistVerification(id)
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      {/* Redesign Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="chip bg-white/60 border-white/80">Command Hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Platform Oversight</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            Platform <span className="text-oku-purple-dark italic">Pulse.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Global governance and system-wide intelligence.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <div className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational Integrity
           </div>
        </div>
      </div>

      {/* 1. 3D Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
        <div className="card-glass-3d !bg-oku-lavender/60 !p-10 flex flex-col justify-between group animate-float-3d">
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/40" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{clients.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Total Seekers</p>
          </div>
        </div>

        <div className="card-glass-3d !bg-oku-mint/60 !p-10 flex flex-col justify-between group animate-float-3d" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <TrendingUp size={20} className="text-oku-purple-dark/20" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">{therapists.length}</p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Verified Specialists</p>
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
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Total Care Windows</p>
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

      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-16 relative z-10">
        {[
          { id: 'overview', label: 'Pulse', icon: Activity },
          { id: 'therapists', label: 'Network', icon: Shield },
          { id: 'clients', label: 'Roster', icon: Users },
          { id: 'audit', label: 'Integrity', icon: Lock },
          { id: 'settings', label: 'Protocol', icon: Settings }
        ].map((tab) => (
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
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
               {/* 4. Booking Overview Kanban */}
               <div className="lg:col-span-8 card-glass-3d !p-12 !bg-white/40">
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Booking <span className="italic text-oku-purple-dark">Flow</span></h2>
                     <Layout size={24} className="text-oku-purple-dark/20" />
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                     {[
                       { label: 'Pending', color: 'bg-oku-peach', count: 12 },
                       { label: 'Confirmed', color: 'bg-oku-mint', count: 45 },
                       { label: 'Completed', color: 'bg-oku-lavender', count: 128 },
                       { label: 'Cancelled', color: 'bg-oku-blush', count: 8 }
                     ].map((col) => (
                       <div key={col.label} className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{col.label}</span>
                             <span className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center text-[10px] font-black text-oku-darkgrey shadow-sm">{col.count}</span>
                          </div>
                          <div className={`${col.color}/20 rounded-[2rem] p-4 min-h-[350px] border-2 border-dashed border-white/60 flex flex-col gap-4`}>
                             <div className="card-glass-3d !p-4 !bg-white/80 !rounded-2xl shadow-sm">
                                <p className="text-[9px] font-bold text-oku-darkgrey">Client Session</p>
                                <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">Mar 29, 10:00 AM</p>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-12">
                  <div className="card-glass-3d !p-10 !bg-oku-butter/40 border-2">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Revenue <span className="italic text-oku-purple-dark">Growth</span></h3>
                        <TrendingUp size={20} className="text-oku-purple-dark/40" />
                     </div>
                     <div className="h-48 flex items-end gap-2 px-2">
                        {[40, 60, 30, 70, 90, 50, 80].map((h, i) => (
                          <div key={i} className="flex-1 bg-oku-purple-dark/20 rounded-t-xl hover:bg-oku-purple-dark/40 transition-all cursor-pointer group relative" style={{ height: `${h}%` }}>
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-oku-darkgrey text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h}k</div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-2">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">System <span className="italic text-oku-purple-dark">Activities</span></h3>
                        <Activity size={20} className="text-oku-purple-dark/40" />
                     </div>
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

          {activeTab === 'therapists' && (
            <motion.div 
              key="therapists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d overflow-hidden !p-0 !bg-white/40"
            >
              <div className="p-12 border-b border-white/60 flex justify-between items-center">
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Specialist <span className="italic text-oku-purple-dark">Network</span></h2>
                <button className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 text-[9px]"><Plus size={14} className="mr-2" /> Add Practitioner</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-oku-lavender/40 text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                      <th className="p-10">Identity</th>
                      <th className="p-10">Discipline</th>
                      <th className="p-10">Verification</th>
                      <th className="p-10">Status</th>
                      <th className="p-10 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {therapists.map(t => (
                      <tr key={t.id} className="hover:bg-white/40 transition-all duration-500 group">
                        <td className="p-10">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                              {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-oku-lavender flex items-center justify-center font-bold text-oku-purple-dark">🧘</div>}
                            </div>
                            <div>
                              <p className="font-bold text-oku-darkgrey text-xl">{t.name}</p>
                              <p className="text-xs text-oku-darkgrey/40 mt-1 italic font-display">{t.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-10">
                          <span className="px-4 py-2 rounded-full bg-white/60 text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/60 border border-white shadow-sm">
                            {getPractitionerDisciplineLabel(t.practitionerProfile)}
                          </span>
                        </td>
                        <td className="p-10">
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleToggleVerification(t.id)}
                            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${t.practitionerProfile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60 hover:scale-105'}`}
                          >
                            {t.practitionerProfile?.isVerified ? 'Verified' : 'Verify Now'}
                          </button>
                        </td>
                        <td className="p-10">
                           <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-oku-mint shadow-[0_0_10px_rgba(228,249,240,1)]" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Active</span>
                           </div>
                        </td>
                        <td className="p-10 text-right">
                          <button className="text-oku-purple-dark hover:text-oku-darkgrey transition-colors"><MoreVertical size={20} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div 
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d overflow-hidden !p-0 !bg-white/40"
            >
              <div className="p-12 border-b border-white/60 flex justify-between items-center">
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Patient <span className="italic text-oku-purple-dark">Roster</span></h2>
                <div className="flex items-center gap-4 bg-white/60 px-6 py-3 rounded-full border border-white">
                   <Search size={14} className="text-oku-darkgrey/40" />
                   <input type="text" placeholder="Filter roster..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-oku-darkgrey/20 w-48" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-oku-lavender/40 text-[10px] uppercase tracking-[0.3em] font-black text-oku-darkgrey/40">
                      <th className="p-10">Seeker</th>
                      <th className="p-10">Engagement</th>
                      <th className="p-10">Clinical Profile</th>
                      <th className="p-10 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {clients.map(c => (
                      <tr key={c.id} className="hover:bg-white/40 transition-all duration-500">
                        <td className="p-10">
                          <p className="font-bold text-oku-darkgrey text-xl">{c.name}</p>
                          <p className="text-xs text-oku-darkgrey/40 mt-1 italic font-display">{c.email}</p>
                        </td>
                        <td className="p-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">{c._count?.clientAppointments || 0} Sessions</p>
                        </td>
                        <td className="p-10">
                           {c.intakeForm ? (
                             <span className="px-4 py-2 rounded-full bg-oku-mint text-oku-darkgrey/60 text-[8px] font-black uppercase tracking-widest">Intake Complete</span>
                           ) : (
                             <span className="px-4 py-2 rounded-full bg-oku-peach text-oku-darkgrey/60 text-[8px] font-black uppercase tracking-widest">Pending Intake</span>
                           )}
                        </td>
                        <td className="p-10 text-right">
                          <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-3 !px-6 text-[9px]">Clinical View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div 
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-glass-3d !p-12 !bg-white/40"
            >
               <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-12">Integrity <span className="italic text-oku-purple-dark">Ledger</span></h2>
               <div className="space-y-6">
                  {stats.auditLogs.map((log: any, i: number) => (
                    <div key={i} className="p-8 bg-white/60 rounded-3xl border border-white flex justify-between items-center group hover:shadow-xl transition-all">
                       <div className="flex items-center gap-8">
                          <div className="w-12 h-12 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark">
                             <Shield size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-oku-darkgrey">{log.action}</p>
                             <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Performed by {log.user?.name || 'System'}</p>
                          </div>
                       </div>
                       <p className="text-[10px] text-oku-darkgrey/30 font-black uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-12"
            >
               <div className="card-glass-3d !p-12 !bg-white/40">
                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-10 flex items-center gap-4">
                    <ShieldCheck size={28} className="text-oku-purple-dark" /> Platform Protocol
                  </h3>
                  <div className="space-y-8">
                     {[
                       { label: 'Maintenance Mode', key: 'maintenanceMode' },
                       { label: 'Enable OKU AI', key: 'okuAiEnabled' },
                       { label: 'ADHD Care Mode', key: 'adhdCareModeEnabled' },
                       { label: 'Auto-Transcription', key: 'autoTranslateTranscripts' }
                     ].map((s) => (
                       <div key={s.key} className="flex items-center justify-between p-6 bg-white/60 rounded-[2rem] border border-white">
                          <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">{s.label}</span>
                          <div className="w-14 h-8 bg-oku-mint rounded-full relative p-1 cursor-pointer">
                             <div className="w-6 h-6 bg-white rounded-full shadow-md float-right" />
                          </div>
                       </div>
                     ))}
                     <button className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 mt-4"><Save size={18} className="mr-3" /> Commit Protocols</button>
                  </div>
               </div>

               <div className="card-glass-3d !p-12 !bg-oku-babyblue/30">
                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-10 flex items-center gap-4">
                    <Brain size={28} className="text-oku-purple-dark" /> AI Governance
                  </h3>
                  <div className="bg-white/40 p-8 rounded-[2rem] border border-white italic font-display text-oku-darkgrey/60 leading-relaxed">
                    "AI safety protocols are active. All clinical summaries are reviewed against HIPAA compliance standards before storage."
                  </div>
                  <div className="mt-12 space-y-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Retained Intelligence</p>
                     <div className="flex items-center justify-between text-oku-darkgrey">
                        <span className="text-4xl font-bold">365</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Days Retention</span>
                     </div>
                     <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-oku-purple-dark" />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 3D Background Objects */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-oku-blush/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-oku-mint/10 rounded-full blur-[120px] pointer-events-none animate-float-3d" />
    </div>
  )
}

function AdminDashboardClient(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-oku-lavender flex items-center justify-center">
        <div className="text-center space-y-12">
          <div className="relative animate-float-3d">
             <div className="w-24 h-24 border-8 border-white border-t-oku-purple-dark rounded-full animate-spin mx-auto shadow-2xl" />
          </div>
          <p className="heading-display text-2xl text-oku-darkgrey/40 animate-pulse">Syncing Pulse...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent {...props} />
    </Suspense>
  )
}

export default AdminDashboardClient
