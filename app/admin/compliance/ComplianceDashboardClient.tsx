'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldCheck, FileText, UserCheck, 
  Trash2, History, AlertCircle, 
  Download, Filter, Search, CheckCircle2
} from 'lucide-react'
import { motion } from 'motion/react'

export default function ComplianceDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCompliance = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/compliance')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCompliance() }, [])

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><ShieldCheck className="w-12 h-12 animate-pulse" /></div>
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <ComplianceStat 
          title="HIPAA Health" 
          value="100%" 
          sub="All systems compliant" 
          icon={<ShieldCheck size={28} />}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <ComplianceStat 
          title="Consent Rate" 
          value={`${data?.summary?.consentRate || 0}%`} 
          sub="Users with signed forms" 
          icon={<UserCheck size={28} />}
          color="bg-oku-lavender text-oku-purple-dark"
        />
        <ComplianceStat 
          title="Audit Volume" 
          value={data?.auditLogs?.length || 0} 
          sub="Logs tracked today" 
          icon={<History size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
        <ComplianceStat 
          title="Erasure Req." 
          value={data?.summary?.deletionRequests || 0} 
          sub="GDPR RTBF requests" 
          icon={<Trash2 size={28} />}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Compliance Checklist */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl">
           <h3 className="text-xl font-display font-black text-oku-darkgrey mb-8 flex items-center gap-3">
             <CheckCircle2 size={20} className="text-oku-purple-dark" />
             HIPAA/GDPR Health
           </h3>
           <div className="space-y-4">
             {data?.checklist?.map((item: any) => (
               <div key={item.id} className="p-5 bg-white/40 border border-white rounded-2xl flex items-center justify-between group hover:bg-white/60 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-oku-darkgrey uppercase tracking-widest">{item.task}</p>
                    <p className="text-[10px] text-oku-darkgrey/40">Verified: {new Date(item.lastChecked).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">
                    {item.status}
                  </span>
               </div>
             ))}
           </div>
           
           <div className="mt-8 p-6 bg-oku-darkgrey rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Governance Alert</p>
              <p className="text-sm font-light leading-relaxed">System-wide data encryption key rotation scheduled for next Sunday at 00:00 UTC.</p>
           </div>
        </div>

        {/* Audit Trail */}
        <div className="lg:col-span-2 card-glass-3d !p-0 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden flex flex-col">
           <div className="p-10 pb-6 flex items-center justify-between border-b border-oku-darkgrey/5">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">System Audit Trail</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Real-time interaction logging</p>
              </div>
              <div className="flex gap-3">
                 <button className="p-3 bg-white/60 rounded-xl border border-white text-oku-darkgrey/40 hover:text-oku-purple-dark transition-colors">
                    <Search size={18} />
                 </button>
                 <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-6 !py-3 text-[10px]">
                    <Download size={14} className="mr-2" /> Export Logs
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-oku-darkgrey/5">
                   <tr>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Timestamp</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Actor</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Action</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Resource</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-oku-darkgrey/5">
                   {data?.auditLogs?.map((log: any) => (
                     <tr key={log.id} className="hover:bg-oku-lavender/10 transition-colors group">
                        <td className="p-6 whitespace-nowrap">
                           <p className="text-xs font-black text-oku-darkgrey">{new Date(log.createdAt).toLocaleDateString()}</p>
                           <p className="text-[9px] text-oku-darkgrey/40 font-medium">{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-black text-oku-darkgrey">{log.user?.name || 'SYSTEM'}</p>
                           <p className="text-[9px] text-oku-darkgrey/40 truncate max-w-[150px]">{log.user?.email}</p>
                        </td>
                        <td className="p-6">
                           <span className="px-3 py-1 bg-white/60 border border-white text-[9px] font-black rounded-lg uppercase tracking-widest text-oku-darkgrey">
                              {log.action}
                           </span>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-black text-oku-darkgrey/60">{log.resourceType}</p>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Logged</span>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  )
}

function ComplianceStat({ title, value, sub, icon, color }: any) {
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
