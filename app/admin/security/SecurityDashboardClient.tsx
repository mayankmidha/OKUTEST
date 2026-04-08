'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldAlert, ShieldCheck, Lock, 
  Key, Eye, AlertTriangle, 
  UserX
} from 'lucide-react'
import { motion } from 'motion/react'

export default function SecurityDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchSecurity = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/security')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSecurity() }, [])

  const threatTone =
    data?.metrics?.threatLevel === 'HIGH'
      ? {
          card: 'bg-rose-50/60 border-rose-100',
          icon: 'text-rose-500',
          eyebrow: 'text-rose-800',
          body: 'text-rose-600',
          dot: 'bg-rose-400',
        }
      : data?.metrics?.threatLevel === 'ELEVATED'
        ? {
            card: 'bg-amber-50/60 border-amber-100',
            icon: 'text-amber-500',
            eyebrow: 'text-amber-800',
            body: 'text-amber-600',
            dot: 'bg-amber-400',
          }
        : {
            card: 'bg-emerald-50/50 border-emerald-100',
            icon: 'text-emerald-500',
            eyebrow: 'text-emerald-800',
            body: 'text-emerald-600',
            dot: 'bg-emerald-400',
          }

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><ShieldAlert className="w-12 h-12 animate-pulse text-oku-purple-dark" /></div>
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <SecurityStat 
          title="Threat Level" 
          value={data?.metrics?.threatLevel || 'LOW'} 
          sub={data?.metrics?.summary || 'No flagged activity recorded.'} 
          icon={<ShieldCheck size={28} />}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <SecurityStat 
          title="MFA Adoption" 
          value={`${data?.metrics?.mfaPercent}%`} 
          sub={`${data?.metrics?.mfaEnabled || 0} of ${data?.metrics?.totalUsers || 0} users protected`} 
          icon={<Key size={28} />}
          color="bg-oku-lavender text-oku-purple-dark"
        />
        <SecurityStat 
          title="Recent Events" 
          value={`${data?.metrics?.incidents24h || 0}`} 
          sub="Flagged access events in the last 24 hours" 
          icon={<Lock size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
        <SecurityStat 
          title="Flagged IPs" 
          value={`${data?.metrics?.flaggedIps || 0}`} 
          sub="Distinct sources tied to flagged events" 
          icon={<UserX size={28} />}
          color="bg-oku-darkgrey/5 text-oku-darkgrey/40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Real-time Alerts */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
           <h3 className="text-xl font-display font-black text-oku-darkgrey mb-8 flex items-center gap-3">
             <AlertTriangle size={20} className="text-amber-500" />
             Security Radar
           </h3>
           <div className="space-y-4">
              <div className={`p-6 rounded-2xl flex items-center gap-5 border ${threatTone.card}`}>
                 <ShieldCheck className={threatTone.icon} size={24} />
                 <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${threatTone.eyebrow}`}>
                      {data?.metrics?.threatLevel === 'LOW' ? 'Quiet Review Window' : 'Review Recommended'}
                    </p>
                    <p className={`text-[10px] font-medium ${threatTone.body}`}>
                      {data?.metrics?.summary || 'Security signals are being reviewed.'}
                    </p>
                 </div>
              </div>
              
              <div className="p-6 bg-white/40 border border-white rounded-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-3">Security Posture</p>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-oku-darkgrey">Login Protection</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      {data?.metrics?.mfaPercent || 0}% MFA
                    </span>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-oku-darkgrey">Audit Capture</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      {data?.logs?.length ? 'Active' : 'Quiet'}
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-oku-darkgrey">Review Queue</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      {data?.metrics?.incidents24h || 0} Open
                    </span>
                 </div>
              </div>
           </div>

           <div className="mt-8 p-6 bg-oku-darkgrey rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Security Bulletin</p>
              <p className="text-sm font-light leading-relaxed">
                {data?.metrics?.incidents24h
                  ? 'Review recent access failures, rotate credentials if a pattern repeats, and follow up on any unfamiliar IP activity.'
                  : 'No flagged access events in the last 24 hours. Continue routine review of audit logs and MFA adoption.'}
              </p>
           </div>
        </div>

        {/* Security Log */}
        <div className="lg:col-span-2 card-glass-3d !p-0 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden flex flex-col">
           <div className="p-10 pb-6 flex items-center justify-between border-b border-oku-darkgrey/5">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">Access Incidents</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Failed logins & unauthorized attempts</p>
              </div>
              <div className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-6 !py-3 text-[10px]">
                 <Eye size={14} className="mr-2" /> Latest 20 Events
              </div>
           </div>

           <div className="flex-1 overflow-y-auto max-h-[600px]">
              {data?.logs?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 border-b border-oku-darkgrey/5 bg-white/80 backdrop-blur-md">
                       <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Timestamp</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Source</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Event</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Severity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-oku-darkgrey/5">
                       {data.logs.map((log: any) => (
                         <tr key={log.id} className="transition-colors hover:bg-rose-50/30">
                            <td className="whitespace-nowrap p-6">
                               <p className="text-xs font-black text-oku-darkgrey">{new Date(log.createdAt).toLocaleTimeString()}</p>
                            </td>
                            <td className="p-6">
                               <p className="text-xs font-black text-oku-darkgrey">{log.user?.email || 'ANONYMOUS'}</p>
                               <p className="text-[9px] text-oku-darkgrey/40">{log.ipAddress || '0.0.0.0'}</p>
                            </td>
                            <td className="p-6">
                               <span className="rounded-lg bg-rose-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-700">
                                  {log.action}
                               </span>
                            </td>
                            <td className="p-6">
                               <div className="flex items-center gap-2">
                                  <div className={`h-1.5 w-1.5 rounded-full ${getSeverityMeta(log.action).dot}`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${getSeverityMeta(log.action).text}`}>
                                    {getSeverityMeta(log.action).label}
                                  </span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <ShieldCheck size={40} />
                   </div>
                   <div>
                      <p className="text-lg font-black text-oku-darkgrey">All Clear</p>
                      <p className="text-sm text-oku-darkgrey/40">No flagged access events detected in the current review window.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

function getSeverityMeta(action: string) {
  if (action.includes('UNAUTHORIZED') || action.includes('SECURITY')) {
    return {
      label: 'High',
      text: 'text-rose-600',
      dot: 'bg-rose-400',
    }
  }

  if (action.includes('LOGIN_FAILURE')) {
    return {
      label: 'Review',
      text: 'text-amber-600',
      dot: 'bg-amber-400',
    }
  }

  return {
    label: 'Info',
    text: 'text-oku-darkgrey/50',
    dot: 'bg-oku-darkgrey/30',
  }
}

function SecurityStat({ title, value, sub, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-glass-3d !p-8 !rounded-[2.5rem] flex items-center gap-6 group shadow-xl border border-white/80"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-display font-black text-oku-darkgrey leading-none mb-1">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/30">{title}</p>
        <p className="text-[9px] font-medium text-oku-darkgrey/30 italic mt-1">{sub}</p>
      </div>
    </motion.div>
  )
}
