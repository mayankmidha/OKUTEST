'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, Play, Clock, Settings,
  RotateCw, AlertCircle, CheckCircle2,
  Calendar, Layers, Filter, Search
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AutomationDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAutomation = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/automation')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAutomation() }, [])

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><Zap className="w-12 h-12 animate-pulse text-oku-purple-dark" /></div>
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AutomationStat 
          title="Active Workflows" 
          value={data?.tasks?.length || 0} 
          sub="Currently running scheduled tasks" 
          icon={<RotateCw size={28} className="animate-spin-slow" />}
          color="bg-oku-lavender/60 text-oku-purple-dark"
        />
        <AutomationStat 
          title="Pending Assessments" 
          value={data?.metrics?.pendingAssessments || 0} 
          sub="Requires automated matching" 
          icon={<Layers size={28} />}
          color="bg-oku-mint/60 text-emerald-600"
        />
        <AutomationStat 
          title="Payment Retries" 
          value={data?.metrics?.pendingPayments || 0} 
          sub="Pending automated recovery" 
          icon={<Zap size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Scheduled Tasks List */}
        <div className="lg:col-span-2 card-glass-3d !p-12 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-black text-oku-darkgrey tracking-tight">Active Automations</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Scheduled system routines</p>
              </div>
              <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[11px]">
                 <Play size={16} className="mr-3" /> Run All Now
              </button>
           </div>

           <div className="space-y-4">
              {data?.tasks?.map((task: any) => (
                <div key={task.id} className="p-6 bg-white/40 border border-white rounded-[2rem] flex items-center justify-between group hover:scale-[1.01] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
                         <Clock size={24} />
                      </div>
                      <div>
                         <p className="text-lg font-black text-oku-darkgrey">{task.name}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{task.schedule}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                         <p className="text-xs font-black text-oku-darkgrey/60">Last Run</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">{new Date(task.lastRun).toLocaleTimeString()}</p>
                      </div>
                      <button className="p-3 bg-white/80 border border-white rounded-xl shadow-sm text-oku-darkgrey hover:text-oku-purple-dark transition-colors">
                         <Play size={16} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* System Log / Quick Actions */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl">
           <h3 className="text-xl font-display font-black text-oku-darkgrey mb-8">Quick Automation</h3>
           <div className="space-y-4">
              <ActionButton label="Clear System Cache" icon={<RotateCw size={18} />} />
              <ActionButton label="Re-sync Calendars" icon={<Calendar size={18} />} />
              <ActionButton label="Generate Daily Report" icon={<FileText size={18} />} />
              <ActionButton label="Purge Audit Logs (>1yr)" icon={<Settings size={18} />} />
           </div>

           <div className="mt-12 p-8 bg-oku-purple-dark rounded-[2rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Health Status</p>
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={24} className="text-emerald-400" />
                 <p className="text-sm font-light leading-relaxed">Automation engine is stable. 422 routines executed in the last 24h.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function AutomationStat({ title, value, sub, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`card-glass-3d ${color} !p-10 !rounded-[3rem] flex items-center gap-8 group shadow-xl transition-all duration-500`}
    >
      <div className="w-20 h-20 rounded-3xl bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <p className="text-4xl font-display font-black text-oku-darkgrey mb-2 tracking-tighter">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40 leading-none">{title}</p>
        <p className="text-[9px] font-medium text-oku-darkgrey/30 italic mt-2">{sub}</p>
      </div>
    </motion.div>
  )
}

function ActionButton({ label, icon }: any) {
  return (
    <button className="w-full p-5 bg-white/40 border border-white rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all text-left">
       <div className="p-2 bg-oku-lavender rounded-lg text-oku-purple-dark group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <span className="text-xs font-black text-oku-darkgrey uppercase tracking-widest">{label}</span>
    </button>
  )
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}
