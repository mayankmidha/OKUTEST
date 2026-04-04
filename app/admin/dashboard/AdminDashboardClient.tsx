'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Users, DollarSign, Settings, Activity, Shield, 
  AlertTriangle, Megaphone, Brain, Lock, 
  Search, ShieldAlert, BarChart3, TrendingUp,
  Layout, Save, ShieldCheck, Loader2, CreditCard, X, Check,
  UserCheck, Heart, FileText, Zap, Globe, MessageSquare
} from 'lucide-react'
import { 
  toggleTherapistVerification, 
  updatePlatformSettings,
} from '../actions'
import { AdminUserManagement } from '@/components/AdminUserManagement'
import { formatCurrency, autoConvert } from '@/lib/currency'
import { getPractitionerDisciplineLabel } from '@/lib/practitioner-type'
import { motion, AnimatePresence } from 'motion/react'
import { CirclesManager } from './CirclesManager'
import { AdminAppointmentsManagement } from './AdminAppointmentsManagement'
import { AssessmentTemplateManager } from './AssessmentTemplateManager'

function AdminDashboardContent({ 
  stats, 
  therapists = [], 
  services = [],
  clients = [],
  circles = [],
  allAppointments = [],
  settings: initialSettings
}: { 
  stats: {
    totalRevenue?: number,
    totalAppointments?: number,
    auditLogs?: any[],
    recentActivities?: any[],
    allTranscripts?: any[],
    allPosts?: any[],
    circleReports?: any[]
  }, 
  therapists?: any[], 
  services?: any[],
  clients?: any[],
  circles?: any[],
  allAppointments?: any[],
  settings: any
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [platformSettings, setPlatformSettings] = useState(initialSettings)
  
  // Safe access with defaults
  const recentActivities = stats?.recentActivities || []
  const allTranscripts = stats?.allTranscripts || []
  const circleReports = stats?.circleReports || []
  const totalRevenue = stats?.totalRevenue || 0
  const totalAppointments = stats?.totalAppointments || 0
  
  // Use 'pillar' for high-level nav and 'sub' for nested tabs
  const currentPillar = searchParams.get('pillar') || 'pulse'
  const currentSub = searchParams.get('sub') || 'overview'
  
  const setPillar = (pillar: string, sub: string = 'overview') => {
    router.push(`/admin/dashboard?pillar=${pillar}&sub=${sub}`, { scroll: false })
  }

  // Action Center Derived Data
  const pendingKYC = therapists.filter(t => !t.practitionerProfile?.isVerified)
  const highRiskSignals = allTranscripts.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL')
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
      
      {/* AMBIENT BLOBS */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── HEADER: GLOBAL CONTROL ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Command Hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Platform Oversight</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
            System <span className="text-oku-purple-dark italic">Ledger.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
            Comprehensive platform intelligence and operational command.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-8 py-4 rounded-full border border-white shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">All Systems Operational</span>
        </div>
      </div>

      {/* ── PILLAR NAVIGATION ── */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-16 relative z-10">
        {[
            { id: 'pulse', label: 'Platform Pulse', icon: Activity, color: 'text-oku-purple-dark' },
            { id: 'integrity', label: 'Network Integrity', icon: ShieldCheck, color: 'text-emerald-600' },
            { id: 'operations', label: 'Operations & Fees', icon: Settings, color: 'text-oku-purple-dark' },
            { id: 'safety', label: 'Clinical Safety', icon: ShieldAlert, color: 'text-red-500' }
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
          
          {/* PILLAR: PLATFORM PULSE */}
          {currentPillar === 'pulse' && (
            <motion.div key="pulse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                {/* HIGH-LEVEL METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="card-glass-3d !p-10 !bg-oku-lavender/60">
                        <Users size={24} className="text-oku-purple-dark mb-8" />
                        <p className="text-6xl heading-display mb-2">{clients.length + therapists.length}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Active Souls</p>
                    </div>
                    <div className="card-glass-3d !p-10 !bg-oku-mint/60">
                        <DollarSign size={24} className="text-emerald-600 mb-8" />
                        <p className="text-4xl heading-display mb-2">{formatCurrency(autoConvert(totalRevenue, undefined, 'INR').amount, 'INR')}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Gross Volume (LTD)</p>
                    </div>
                    <div className="card-glass-3d !p-10 !bg-oku-peach/60">
                        <Activity size={24} className="text-oku-peach-dark mb-8" />
                        <p className="text-6xl heading-display mb-2">{totalAppointments}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Care Sessions</p>
                    </div>
                    <div className="card-glass-3d !p-10 !bg-oku-babyblue/60">
                        <Users size={24} className="text-oku-babyblue-dark mb-8" />
                        <p className="text-6xl heading-display mb-2">{circles.length}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Operational Circles</p>
                    </div>
                </div>

                {/* ACTIVITY LEDGER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 card-glass-3d !p-12 !bg-white/40">
                        <h2 className="heading-display text-4xl mb-12">System <span className="italic">Activities</span></h2>
                        <div className="space-y-4">
                            {recentActivities.slice(0, 8).map((act: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/60 rounded-[2rem] border border-white shadow-sm group hover:bg-white transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark text-xs font-black">
                                            {act.user?.name?.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{act.user?.name || 'System'}</p>
                                            <p className="text-[10px] uppercase tracking-widest opacity-40">{act.action}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-20">{new Date(act.createdAt).toLocaleTimeString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-12">
                        <div className="card-glass-3d !p-10 !bg-oku-dark text-white relative overflow-hidden">
                            <Brain size={24} className="text-oku-lavender mb-8 animate-float-3d" />
                            <h3 className="heading-display text-2xl mb-4">SaaS <span className="italic text-oku-lavender">Insights</span></h3>
                            <p className="text-sm text-white/60 leading-relaxed italic">
                                Enrollment is up 12% this week. Thursday is currently the highest-load day for clinical sessions.
                            </p>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-oku-purple/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

          {/* PILLAR: NETWORK INTEGRITY */}
          {currentPillar === 'integrity' && (
            <motion.div key="integrity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="card-glass-3d !p-0 overflow-hidden !bg-white/40">
                    <div className="p-12 border-b border-white flex justify-between items-center">
                        <h2 className="heading-display text-4xl">Practitioner <span className="italic text-oku-purple-dark">KYC</span></h2>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Network Verification Protocol</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-oku-lavender/40 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                                    <th className="p-10">Practitioner</th>
                                    <th className="p-10">Status</th>
                                    <th className="p-10">License / Credentials</th>
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
                                                {t.practitionerProfile?.isVerified ? 'Verified' : 'Awaiting Review'}
                                            </span>
                                        </td>
                                        <td className="p-10 font-mono text-[10px] opacity-40">{t.practitionerProfile?.licenseNumber || 'PENDING_UPLOAD'}</td>
                                        <td className="p-10 text-right">
                                            <button 
                                                onClick={() => handleToggleVerification(t.practitionerProfile?.id || '', t.practitionerProfile?.isVerified || false)}
                                                className="p-4 rounded-2xl bg-white border border-white hover:scale-110 transition-all text-oku-purple-dark shadow-sm"
                                            >
                                                {t.practitionerProfile?.isVerified ? <X size={20} /> : <Check size={20} />}
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

          {/* PILLAR: OPERATIONS & FEES */}
          {currentPillar === 'operations' && (
            <motion.div key="operations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="flex gap-4 mb-12">
                    {[
                        { id: 'protocols', label: 'System Protocols', icon: Lock },
                        { id: 'templates', label: 'Assessment Models', icon: FileText },
                        { id: 'ledger', label: 'Global Ledger', icon: CreditCard }
                    ].map(sub => (
                        <button 
                            key={sub.id}
                            onClick={() => setPillar('operations', sub.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentSub === sub.id ? 'bg-oku-dark text-white shadow-xl scale-105' : 'bg-white/60 text-oku-darkgrey/40 hover:bg-white border border-white'}`}
                        >
                            <sub.icon size={16} />
                            {sub.label}
                        </button>
                    ))}
                </div>

                {currentSub === 'protocols' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 card-glass-3d !p-12 !bg-white/40">
                            <h2 className="heading-display text-4xl mb-12">Governance <span className="italic">Protocols</span></h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { label: 'Platform Maintenance', key: 'maintenanceMode', icon: Shield },
                                    { label: 'OCI Intelligence (AI)', key: 'okuAiEnabled', icon: Brain },
                                    { label: 'ADHD Care Matrix', key: 'adhdCareModeEnabled', icon: Zap },
                                    { label: 'Audit Sentinel', key: 'autoTranslateTranscripts', icon: ShieldCheck }
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
                            <button 
                                onClick={async () => {
                                    setIsUpdating(true)
                                    try {
                                        await updatePlatformSettings(platformSettings)
                                        alert("✅ Protocols synchronized across the OS.")
                                        router.refresh()
                                    } finally {
                                        setIsUpdating(false)
                                    }
                                }}
                                disabled={isUpdating}
                                className="btn-pill-3d bg-oku-dark text-white w-full !py-5 mt-12 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-60"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Commit Global Settings
                            </button>
                        </div>
                        <div className="lg:col-span-4 space-y-12">
                            <div className="card-glass-3d !p-10 !bg-oku-mint/30">
                                <h3 className="heading-display text-2xl mb-10">Fee <span className="italic">Matrix</span></h3>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-4">Service Commission (%)</label>
                                        <input type="number" className="input-pastel" value={platformSettings.platformFeePercent} onChange={(e) => setPlatformSettings({...platformSettings, platformFeePercent: parseFloat(e.target.value)})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-4">Referral Reward (%)</label>
                                        <input type="number" className="input-pastel" value={platformSettings.referralRewardPercent} onChange={(e) => setPlatformSettings({...platformSettings, referralRewardPercent: parseFloat(e.target.value)})} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentSub === 'templates' && (
                    <AssessmentTemplateManager assessments={services} />
                )}

                {currentSub === 'ledger' && (
                    <div className="card-glass-3d !p-12 !bg-white/40">
                        <h2 className="heading-display text-4xl mb-12">Global <span className="italic">Ledger</span></h2>
                        <AdminAppointmentsManagement 
                            appointments={allAppointments}
                            therapists={therapists}
                            clients={clients}
                            services={services}
                        />
                    </div>
                )}
            </motion.div>
          )}

          {/* PILLAR: CLINICAL SAFETY */}
          {currentPillar === 'safety' && (
            <motion.div key="safety" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div className="card-glass-3d !p-12 !bg-white/40">
                        <h2 className="heading-display text-4xl mb-12 flex items-center gap-4">
                            <AlertTriangle className="text-red-500" />
                            Clinical <span className="italic text-red-500">Watchlist</span>
                        </h2>
                        <div className="space-y-6">
                            {highRiskSignals.length === 0 ? (
                                <p className="text-xl font-display italic text-oku-darkgrey/20 py-20 text-center">No elevated clinical signals detected.</p>
                            ) : (
                                highRiskSignals.map((signal, i) => (
                                    <div key={i} className="p-8 bg-white rounded-[2.5rem] border-2 border-red-100 flex items-center justify-between gap-8 group hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                                <AlertTriangle size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{signal.riskLevel} Risk Flag</p>
                                                <h3 className="text-2xl font-display font-bold">Patient: {signal.appointment.client?.name}</h3>
                                                <p className="text-xs opacity-40 italic mt-1">Scribe: {signal.summary?.substring(0, 100)}...</p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/dashboard?tab=audit&id=${signal.id}`} className="btn-pill-3d bg-oku-dark text-white !py-3 !px-8">Audit Scribe</Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-12">
                    <div className="card-glass-3d !p-10 !bg-oku-lavender/30">
                        <h3 className="heading-display text-2xl mb-8">Community <span className="italic">Oversight</span></h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10">Circle Reports</p>
                        <div className="space-y-4">
                            {circleReports.length === 0 ? (
                                <p className="text-sm opacity-40 italic font-display">No circle reports pending.</p>
                            ) : (
                                circleReports.map((report: any, i: number) => (
                                    <div key={i} className="p-6 bg-white/60 rounded-3xl border border-white flex flex-col gap-4">
                                        <p className="text-xs font-bold text-red-500 uppercase">{report.reason}</p>
                                        <p className="text-[10px] opacity-60 leading-relaxed italic">{report.details}</p>
                                        <div className="flex justify-between items-center border-t border-oku-darkgrey/5 pt-4">
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{report.reporter?.name}</span>
                                            <button className="text-[8px] font-black uppercase tracking-widest text-oku-purple-dark underline">Resolve</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* AMBIENT BACKGROUND DECOR */}
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
