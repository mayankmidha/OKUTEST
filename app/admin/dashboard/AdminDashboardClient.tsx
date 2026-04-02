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
    allPosts: any[],
    circleReports: any[]
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
  const [isUpdating, setIsUpdating] = useState(false)
  const [platformSettings, setPlatformSettings] = useState(initialSettings)
  
  // Refactored Pillars
  const currentPillar = searchParams.get('pillar') || 'safety'
  
  const setPillar = (pillar: string) => {
    router.push(`/admin/dashboard?pillar=${pillar}`, { scroll: false })
  }

  // Derived Action Center data
  const pendingKYC = therapists.filter(t => !t.practitionerProfile?.isVerified)
  const highRiskSignals = stats.allTranscripts.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL')
  const pendingRefunds = allAppointments.filter(a => a.refundStatus === 'PENDING')

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true)
    try {
      await toggleTherapistVerification(id, !currentStatus)
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

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

      {/* ── ACTION CENTER: NEEDS ATTENTION ── */}
      <section className="mb-16 relative z-10">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-8 ml-4">Action Center: Needs Attention</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`card-glass-3d !p-10 border-2 transition-all ${pendingKYC.length > 0 ? 'border-oku-peach/40 bg-oku-peach/5 scale-[1.02]' : 'border-white/60'}`}>
                <div className="flex items-center justify-between mb-8">
                    <Shield size={24} className={pendingKYC.length > 0 ? 'text-oku-peach-dark' : 'text-oku-darkgrey/20'} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Integrity</span>
                </div>
                <p className="text-5xl heading-display mb-2">{pendingKYC.length}</p>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-10">Practitioners awaiting KYC</p>
                <button onClick={() => setPillar('network')} className="btn-pill-3d bg-white text-oku-darkgrey w-full !py-4">Verify Network</button>
            </div>

            <div className={`card-glass-3d !p-10 border-2 transition-all ${highRiskSignals.length > 0 ? 'border-oku-blush/40 bg-oku-blush/5 scale-[1.02]' : 'border-white/60'}`}>
                <div className="flex items-center justify-between mb-8">
                    <AlertTriangle size={24} className={highRiskSignals.length > 0 ? 'text-oku-blush-dark' : 'text-oku-darkgrey/20'} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Safety</span>
                </div>
                <p className="text-5xl heading-display mb-2">{highRiskSignals.length}</p>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-10">Active High-Risk Signals</p>
                <button onClick={() => setPillar('safety')} className="btn-pill-3d bg-oku-dark text-white w-full !py-4 shadow-xl">Review Alerts</button>
            </div>

            <div className={`card-glass-3d !p-10 border-2 transition-all ${pendingRefunds.length > 0 ? 'border-oku-babyblue/40 bg-oku-babyblue/5 scale-[1.02]' : 'border-white/60'}`}>
                <div className="flex items-center justify-between mb-8">
                    <DollarSign size={24} className={pendingRefunds.length > 0 ? 'text-oku-babyblue-dark' : 'text-oku-darkgrey/20'} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Financials</span>
                </div>
                <p className="text-5xl heading-display mb-2">{pendingRefunds.length}</p>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-10">Pending Refund Reviews</p>
                <button onClick={() => setPillar('operations')} className="btn-pill-3d bg-white text-oku-darkgrey w-full !py-4">Manage Ops</button>
            </div>
         </div>
      </section>

      {/* ── 3 GOVERNANCE PILLARS ── */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-16 relative z-10">
        {[
            { id: 'safety', label: 'Clinical Safety', icon: ShieldAlert, color: 'text-oku-blush-dark' },
            { id: 'network', label: 'Network Integrity', icon: Users, color: 'text-oku-mint-dark' },
            { id: 'operations', label: 'Operational Control', icon: Settings, color: 'text-oku-purple-dark' }
        ].map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setPillar(pillar.id)}
            className={`flex items-center gap-4 px-12 py-6 rounded-3xl text-[11px] uppercase tracking-[0.3em] font-black transition-all whitespace-nowrap ${
              currentPillar === pillar.id 
                ? 'bg-oku-darkgrey text-white shadow-2xl scale-[1.05]' 
                : 'bg-white/60 text-oku-darkgrey/40 border border-white hover:bg-white hover:text-oku-darkgrey shadow-sm'
            }`}
          >
            <pillar.icon size={20} className={currentPillar === pillar.id ? 'text-white' : pillar.color} />
            {pillar.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* PILLAR 1: CLINICAL SAFETY */}
          {currentPillar === 'safety' && (
            <motion.div 
              key="safety" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
               <div className="lg:col-span-8 card-glass-3d !p-12 !bg-white/40">
                  <h2 className="heading-display text-4xl mb-12">Safety <span className="italic text-oku-purple-dark">Watchlist</span></h2>
                  <div className="space-y-6">
                     {highRiskSignals.length === 0 ? (
                        <p className="text-xl font-display italic text-oku-darkgrey/20 py-20 text-center">No elevated clinical signals detected.</p>
                     ) : (
                        highRiskSignals.map((signal, i) => (
                            <div key={i} className="p-8 bg-white/80 rounded-[2.5rem] border border-white flex items-center justify-between gap-8 group hover:shadow-xl transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-oku-blush/20 flex items-center justify-center text-oku-blush-dark">
                                        <AlertTriangle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-blush-dark mb-1">{signal.riskLevel} Risk Flag</p>
                                        <h3 className="text-2xl font-display font-bold">Patient: {signal.appointment.client?.name}</h3>
                                        <p className="text-xs opacity-40 italic mt-1">{signal.summary?.substring(0, 100)}...</p>
                                    </div>
                                </div>
                                <Link href={`/admin/dashboard?tab=audit&id=${signal.id}`} className="btn-pill-3d bg-oku-dark text-white !py-3 !px-8">Audit</Link>
                            </div>
                        ))
                     )}
                  </div>
               </div>
               <div className="lg:col-span-4 space-y-12">
                  <div className="card-glass-3d !p-10 !bg-oku-lavender/30">
                     <h3 className="heading-display text-2xl mb-8">Circle <span className="italic">Moderation</span></h3>
                     <p className="text-sm opacity-60 mb-8 font-display italic">Live facilitated rooms requiring oversight.</p>
                     <div className="space-y-4">
                        {circles.slice(0, 3).map((circle, i) => (
                            <div key={i} className="p-5 bg-white/60 rounded-2xl border border-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-oku-purple-dark">{circle.practitioner?.name}</p>
                                    <p className="text-sm font-bold">{circle.service?.name}</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* PILLAR 2: NETWORK INTEGRITY */}
          {currentPillar === 'network' && (
            <motion.div 
              key="network" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden">
                  <div className="p-12 border-b border-white/60 flex justify-between items-center">
                    <h2 className="heading-display text-4xl">Network <span className="italic text-oku-purple-dark">Integrity</span></h2>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Practitioner KYC Flow</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-oku-lavender/40 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                          <th className="p-10">Practitioner</th>
                          <th className="p-10">Status</th>
                          <th className="p-10">Credentials</th>
                          <th className="p-10 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/40">
                        {therapists.map(t => (
                          <tr key={t.id} className="hover:bg-white/40 transition-all duration-500">
                            <td className="p-10">
                              <p className="font-bold text-xl">{t.name}</p>
                              <p className="text-xs opacity-40 italic mt-1 font-display">{getPractitionerDisciplineLabel(t.practitionerProfile)}</p>
                            </td>
                            <td className="p-10">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${t.practitionerProfile?.isVerified ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60'}`}>
                                {t.practitionerProfile?.isVerified ? 'Verified' : 'Pending KYC'}
                              </span>
                            </td>
                            <td className="p-10 font-mono text-[10px] opacity-40">{t.practitionerProfile?.licenseNumber || 'NOT_PROVIDED'}</td>
                            <td className="p-10 text-right">
                                <button 
                                    onClick={() => handleToggleVerification(t.practitionerProfile?.id || '', t.practitionerProfile?.isVerified || false)}
                                    className="p-3 rounded-xl bg-white border border-white/60 text-oku-purple-dark hover:scale-110 transition-all"
                                >
                                    {t.practitionerProfile?.isVerified ? <X size={18} /> : <Check size={18} />}
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </motion.div>
          )}

          {/* PILLAR 3: OPERATIONAL CONTROL */}
          {currentPillar === 'operations' && (
            <motion.div 
              key="operations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-12"
            >
               <div className="lg:col-span-8 space-y-12">
                  <div className="card-glass-3d !p-12 !bg-white/40">
                     <h2 className="heading-display text-4xl mb-12">System <span className="italic text-oku-purple-dark">Protocols</span></h2>
                     <div className="grid md:grid-cols-2 gap-8">
                        {[
                          { label: 'Maintenance Mode', key: 'maintenanceMode', icon: Shield },
                          { label: 'Enable OCI AI', key: 'okuAiEnabled', icon: Brain },
                          { label: 'ADHD Care Mode', key: 'adhdCareModeEnabled', icon: Zap },
                          { label: 'Audit Logging', key: 'autoTranslateTranscripts', icon: FileText }
                        ].map((s) => (
                          <div key={s.key} className="p-8 bg-white/60 rounded-[2.5rem] border border-white flex flex-col justify-between gap-8 group">
                             <div className="flex items-center justify-between">
                                <s.icon size={20} className="text-oku-purple-dark/40" />
                                <div 
                                    onClick={() => setPlatformSettings({...platformSettings, [s.key]: !platformSettings[s.key as keyof typeof platformSettings]})}
                                    className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-colors ${platformSettings[s.key as keyof typeof platformSettings] ? 'bg-oku-mint' : 'bg-oku-peach'}`}
                                >
                                    <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-sm" animate={{ x: platformSettings[s.key as keyof typeof platformSettings] ? 24 : 0 }} />
                                </div>
                             </div>
                             <p className="text-[11px] font-black uppercase tracking-widest">{s.label}</p>
                          </div>
                        ))}
                     </div>
                     <button onClick={() => alert("✅ Protocols updated.")} className="btn-pill-3d bg-oku-dark text-white w-full !py-5 mt-12 shadow-2xl">Commit Platform Protocol</button>
                  </div>
               </div>
               <div className="lg:col-span-4 space-y-12">
                  <div className="card-glass-3d !p-10 !bg-oku-babyblue/30">
                     <h3 className="heading-display text-2xl mb-8">Financial <span className="italic">Pulse</span></h3>
                     <p className="text-5xl heading-display text-oku-darkgrey mb-2">
                        {formatCurrency(autoConvert(stats.totalRevenue, undefined, 'INR').amount, 'INR')}
                     </p>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10">Platform Gross Volume</p>
                     <div className="space-y-4">
                        <div className="p-5 bg-white/60 rounded-2xl border border-white flex justify-between items-center text-[10px]">
                            <span className="font-black uppercase tracking-widest opacity-40">Total Care Windows</span>
                            <span className="font-bold">{stats.totalAppointments}</span>
                        </div>
                        <div className="p-5 bg-white/60 rounded-2xl border border-white flex justify-between items-center text-[10px]">
                            <span className="font-black uppercase tracking-widest opacity-40">Platform Fee</span>
                            <span className="font-bold">{platformSettings.platformFeePercent}%</span>
                        </div>
                        <div className="p-5 bg-white/60 rounded-2xl border border-white flex flex-col gap-4 text-[10px]">
                            <span className="font-black uppercase tracking-widest opacity-40">Referral Settings</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] opacity-40 uppercase">Reward (%)</p>
                                    <input type="number" className="bg-transparent font-bold w-full" value={platformSettings.referralRewardPercent} onChange={(e) => setPlatformSettings({...platformSettings, referralRewardPercent: parseFloat(e.target.value)})} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] opacity-40 uppercase">Max Sessions</p>
                                    <input type="number" className="bg-transparent font-bold w-full" value={platformSettings.maxReferralRewards} onChange={(e) => setPlatformSettings({...platformSettings, maxReferralRewards: parseInt(e.target.value)})} />
                                </div>
                            </div>
                        </div>
                     </div>
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
