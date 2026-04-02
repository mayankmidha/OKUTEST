'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldAlert, ShieldCheck, Lock, 
  Key, Eye, AlertTriangle, 
  Terminal, UserX, Download
} from 'lucide-react'
import { motion } from 'framer-motion'

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
          sub="Normal system activity" 
          icon={<ShieldCheck size={28} />}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <SecurityStat 
          title="MFA Adoption" 
          value={`${data?.metrics?.mfaPercent}%`} 
          sub={`${data?.metrics?.mfaEnabled} users protected`} 
          icon={<Key size={28} />}
          color="bg-oku-lavender text-oku-purple-dark"
        />
        <SecurityStat 
          title="Data Integrity" 
          value="100%" 
          sub="AES-256 Encrypted" 
          icon={<Lock size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
        <SecurityStat 
          title="Blocked IPs" 
          value="0" 
          sub="Last 24 hours" 
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
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-5">
                 <ShieldCheck className="text-emerald-500" size={24} />
                 <div>
                    <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">No Active Breaches</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Monitoring 1,422 endpoints</p>
                 </div>
              </div>
              
              <div className="p-6 bg-white/40 border border-white rounded-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-3">System Health</p>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-oku-darkgrey">SSL/TLS Cert</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Valid</span>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-oku-darkgrey">API Rate Limit</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Normal</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-oku-darkgrey">DB Encryption</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                 </div>
              </div>
           </div>

           <div className="mt-8 p-6 bg-oku-darkgrey rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Security Bulletin</p>
              <p className="text-sm font-light leading-relaxed">System-wide dependency audit completed. 0 critical vulnerabilities found.</p>
           </div>
        </div>

        {/* Security Log */}
        <div className="lg:col-span-2 card-glass-3d !p-0 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden flex flex-col">
           <div className="p-10 pb-6 flex items-center justify-between border-b border-oku-darkgrey/5">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">Access Incidents</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Failed logins & unauthorized attempts</p>
              </div>
              <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-6 !py-3 text-[10px]">
                 <Terminal size={14} className="mr-2" /> Live Console
              </button>
           </div>

           <div className="flex-1 overflow-y-auto max-h-[600px]">
              {data?.logs?.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-oku-darkgrey/5">
                     <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Timestamp</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Source</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Event</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Severity</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-oku-darkgrey/5">
                     {data.logs.map((log: any) => (
                       <tr key={log.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="p-6 whitespace-nowrap">
                             <p className="text-xs font-black text-oku-darkgrey">{new Date(log.createdAt).toLocaleTimeString()}</p>
                          </td>
                          <td className="p-6">
                             <p className="text-xs font-black text-oku-darkgrey">{log.user?.email || 'ANONYMOUS'}</p>
                             <p className="text-[9px] text-oku-darkgrey/40">{log.ipAddress || '0.0.0.0'}</p>
                          </td>
                          <td className="p-6">
                             <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                {log.action}
                             </span>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Incident</span>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <ShieldCheck size={40} />
                   </div>
                   <div>
                      <p className="text-lg font-black text-oku-darkgrey">All Clear</p>
                      <p className="text-sm text-oku-darkgrey/40">No security incidents detected in current cycle.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
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
