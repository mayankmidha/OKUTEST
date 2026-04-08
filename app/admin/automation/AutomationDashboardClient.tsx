'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, Clock,
  RotateCw, AlertCircle, CheckCircle2,
  Calendar, Layers
} from 'lucide-react'
import { motion } from 'motion/react'

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
          value={data?.summary?.activeCount || 0} 
          sub="Queues operating normally" 
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
          title="Aged Payments" 
          value={data?.metrics?.agedPendingPayments || 0} 
          sub="Pending more than 30 mins" 
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Live queues and scheduled routines</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(data?.summary?.status)}`}>
                {data?.summary?.status || 'IDLE'}
              </span>
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
                         <p className="text-xs text-oku-darkgrey/50 mt-2">{task.detail}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                         <p className="text-xs font-black text-oku-darkgrey/60">Last Activity</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">
                           {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Not yet'}
                         </p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-2">
                           Workload: {task.workload || 0}
                         </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(task.status)}`}>
                        {task.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Queue Summary */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl">
           <h3 className="text-xl font-display font-black text-oku-darkgrey mb-8">Operational Watch</h3>
           <div className="space-y-4">
              <QueueCard
                label="Reminder Queue"
                value={data?.metrics?.dueReminders || 0}
                icon={<Calendar size={18} />}
              />
              <QueueCard
                label="No-Show Candidates"
                value={data?.metrics?.noShowCandidates || 0}
                icon={<AlertCircle size={18} />}
              />
              <QueueCard
                label="Deletion Requests"
                value={data?.metrics?.deletionRequests || 0}
                icon={<CheckCircle2 size={18} />}
              />
              <QueueCard
                label="Feed-Ready Practitioners"
                value={`${data?.metrics?.feedReadyPractitioners || 0}/${data?.metrics?.syncEnabledPractitioners || 0}`}
                icon={<Layers size={18} />}
              />
           </div>

           <div className="mt-12 p-8 bg-oku-purple-dark rounded-[2rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Health Status</p>
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={24} className={`${data?.summary?.attentionCount > 0 ? 'text-amber-300' : 'text-emerald-400'}`} />
                 <p className="text-sm font-light leading-relaxed">
                    {data?.summary?.message || 'No automation summary available.'} {data?.summary?.executions24h ?? 0} queue events were processed in the last 24 hours.
                 </p>
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

function QueueCard({ label, value, icon }: any) {
  return (
    <div className="w-full p-5 bg-white/40 border border-white rounded-2xl flex items-center gap-4">
       <div className="p-2 bg-oku-lavender rounded-lg text-oku-purple-dark group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="flex-1">
          <p className="text-xs font-black text-oku-darkgrey uppercase tracking-widest">{label}</p>
          <p className="text-lg font-display font-black text-oku-darkgrey mt-2">{value}</p>
       </div>
    </div>
  )
}

function getStatusStyles(status?: string) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700'
    case 'PARTIAL':
      return 'bg-sky-100 text-sky-700'
    case 'ATTENTION':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-white/70 text-oku-darkgrey/60 border border-white'
  }
}
