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
  Layout
} from 'lucide-react'
import { 
  toggleTherapistVerification, 
  toggleTherapistBlogPower,
  updateTherapistRate, 
  createService, 
  updatePlatformSettings,
  updateServiceDefinition,
  deleteServiceDefinition,
} from '../actions'
import { AdminUserManagement } from '@/components/AdminUserManagement'
import { BlogManager } from '@/components/BlogManager'
import { formatCurrency, autoConvert } from '@/lib/currency'
import { getPractitionerDisciplineLabel, isPsychiatristProfile } from '@/lib/practitioner-type'
import { motion } from 'framer-motion'

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
  const [settings, setSettingsState] = useState(initialSettings || {})
  
  useEffect(() => {
    setActiveTab(currentTab)
  }, [currentTab])

  const setTab = (tab: string) => {
    router.push(`/admin/dashboard?tab=${tab}`)
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
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl heading-display text-oku-darkgrey mb-2"
            >
              {clients.length}
            </motion.p>
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
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl heading-display text-oku-darkgrey mb-2"
            >
              {therapists.length}
            </motion.p>
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
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl heading-display text-oku-darkgrey mb-2"
            >
              {stats.totalAppointments}
            </motion.p>
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
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl heading-display text-oku-darkgrey mb-2"
            >
              {formatCurrency(autoConvert(stats.totalRevenue, undefined, 'INR').amount, 'INR')}
            </motion.p>
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

      <div className="relative z-10">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-1000">
             
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
                        <div className={`${col.color}/20 rounded-[2rem] p-4 min-h-[300px] border-2 border-dashed border-white/60 flex flex-col gap-4`}>
                           <div className="card-glass-3d !p-4 !bg-white/80 !rounded-2xl shadow-sm">
                              <p className="text-[9px] font-bold text-oku-darkgrey">Client Session</p>
                              <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">Mar 29, 10:00 AM</p>
                           </div>
                           <div className="card-glass-3d !p-4 !bg-white/80 !rounded-2xl shadow-sm">
                              <p className="text-[9px] font-bold text-oku-darkgrey">Intake Call</p>
                              <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">Mar 29, 11:30 AM</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4 space-y-12">
                {/* Revenue Line Chart Placeholder */}
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
                   <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-8 text-center italic">Monthly platform revenue trend</p>
                </div>

                {/* Assessment Area Chart Placeholder */}
                <div className="card-glass-3d !p-10 !bg-oku-babyblue/40 border-2">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="heading-display text-2xl text-oku-darkgrey tracking-tight">Clinical <span className="italic text-oku-purple-dark">Volume</span></h3>
                      <Sparkles size={20} className="text-oku-purple-dark/40" />
                   </div>
                   <div className="h-48 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-oku-babyblue to-transparent opacity-40" />
                      <Activity size={100} strokeWidth={0.5} className="text-oku-purple-dark/10" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 z-10">Assessment Completion Trend</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'therapists' && (
          <div className="card-glass-3d overflow-hidden animate-in slide-in-from-bottom-4 duration-1000 !p-0 !bg-white/40">
            <div className="p-12 border-b border-white/60 flex justify-between items-center">
              <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Specialist <span className="italic text-oku-purple-dark">Network</span></h2>
              <div className="flex gap-4">
                 <div className="px-6 py-3 rounded-full bg-oku-mint border border-white text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">
                   {therapists.length} Active
                 </div>
              </div>
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
                        <span className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${t.practitionerProfile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60'}`}>
                          {t.practitionerProfile?.isVerified ? 'Verified' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-oku-mint shadow-[0_0_10px_rgba(228,249,240,1)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Active</span>
                         </div>
                      </td>
                      <td className="p-10 text-right">
                        <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-3 !px-6 text-[9px]">Edit Access</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs would follow same glassmorphism treatment... */}
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
