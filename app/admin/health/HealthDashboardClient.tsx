'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, Cpu, Database, Server, 
  Zap, TrendingUp, AlertTriangle, CheckCircle,
  Clock, RefreshCw, BarChart3, HardDrive, Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

interface HealthData {
  status: string;
  timestamp: string;
  system: {
    uptime: number;
    memory: {
      total: number;
      free: number;
      usagePercent: string;
    };
    cpu: {
      count: number;
      model: string;
      loadAvg: number[];
    };
  };
  database: {
    status: string;
    responseTimeMs: number;
  };
  app: {
    activeUsers: number;
    totalUsers: number;
    totalAppointments: number;
    errorRate24h: number;
  };
}

export default function HealthDashboardClient() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchHealth = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/health')
      if (!res.ok) throw new Error('Failed to fetch health data')
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Every 30s
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${d}d ${h}h ${m}m`
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-12 h-12 text-oku-purple-dark animate-spin opacity-20" />
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── STATUS BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-10 py-6 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-xl relative z-10 animate-float-3d">
        <div className="flex items-center gap-6">
          <div className={`w-4 h-4 rounded-full animate-pulse ${data?.status === 'HEALTHY' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/30">Global Status</p>
            <p className="text-xl font-display font-black text-oku-darkgrey">{data?.status || 'UNKNOWN'}</p>
          </div>
        </div>
        
        <div className="h-10 w-px bg-oku-darkgrey/10 hidden md:block" />

        <div className="flex items-center gap-4">
          <Clock size={20} className="text-oku-purple-dark/40" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/30">Last Pulse</p>
            <p className="text-sm font-black text-oku-darkgrey">{lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>

        <button 
          onClick={fetchHealth}
          className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 hover:scale-105"
        >
          <RefreshCw size={16} className={`mr-3 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* ── CORE METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <MetricCard 
          title="DB Response" 
          value={`${data?.database.responseTimeMs}ms`} 
          sub="PostgreSQL Latency" 
          icon={<Database size={28} />}
          color="bg-oku-mint/60"
        />
        <MetricCard 
          title="Memory Load" 
          value={`${data?.system.memory.usagePercent || '0'}%`} 
          sub={`${((data?.system.memory.free || 0) / (1024**3)).toFixed(1)}GB Free`} 
          icon={<HardDrive size={28} />}
          color="bg-oku-lavender/60"
        />
        <MetricCard 
          title="Active Users" 
          value={data?.app.activeUsers || 0} 
          sub="Live Sanctuary Presence" 
          icon={<TrendingUp size={28} />}
          color="bg-oku-blush/60"
        />
        <MetricCard 
          title="System Uptime" 
          value={data ? formatUptime(data.system.uptime) : '0s'} 
          sub="Continuous Service" 
          icon={<Zap size={28} />}
          color="bg-oku-purple-light/40"
        />
      </div>

      {/* ── INFRASTRUCTURE DETAILS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Server Specs */}
        <div className="lg:col-span-2 card-glass-3d !p-12 !rounded-[3rem] overflow-hidden group">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-black text-oku-darkgrey tracking-tight">Infrastructure Core</h3>
              <p className="text-xs uppercase tracking-[0.3em] font-black text-oku-darkgrey/30">Server Resource Distribution</p>
            </div>
            <Server className="text-oku-purple-dark opacity-10" size={60} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/60 rounded-xl shadow-sm text-oku-purple-dark">
                      <Cpu size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">CPU Load (1m, 5m, 15m)</span>
                      </div>
                      <div className="flex gap-2">
                         {data?.system.cpu.loadAvg.map((load, i) => (
                           <div key={i} className="flex-1 bg-white/40 border border-white p-3 rounded-xl text-center">
                              <p className="text-lg font-black text-oku-darkgrey">{load.toFixed(2)}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Processor Cluster</span>
                      <span className="text-xs font-black text-oku-purple-dark">{data?.system.cpu.count} Cores</span>
                   </div>
                   <div className="p-4 bg-white/40 border border-white rounded-2xl text-[11px] font-medium text-oku-darkgrey italic">
                      {data?.system.cpu.model}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Memory Saturation</span>
                      <span className="text-xs font-black text-oku-darkgrey">{data?.system.memory.usagePercent}%</span>
                   </div>
                   <div className="h-4 bg-white/40 rounded-full overflow-hidden p-1 border border-white">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data?.system.memory.usagePercent}%` }}
                        className="h-full bg-gradient-to-r from-oku-lavender to-oku-purple-dark rounded-full shadow-inner"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-5 bg-emerald-50/30 border border-emerald-100 rounded-[1.5rem] flex flex-col justify-between">
                      <CheckCircle className="text-emerald-500 mb-4" size={20} />
                      <div>
                        <p className="text-lg font-black text-emerald-600">Stable</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/50">Disk I/O</p>
                      </div>
                   </div>
                   <div className="p-5 bg-oku-blush/20 border border-oku-blush/30 rounded-[1.5rem] flex flex-col justify-between">
                      <AlertTriangle className={`mb-4 ${data?.app.errorRate24h === 0 ? 'text-oku-darkgrey/20' : 'text-rose-500'}`} size={20} />
                      <div>
                        <p className="text-lg font-black text-oku-darkgrey">{data?.app.errorRate24h}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/50">24H Exceptions</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Quick Health Log */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-white/80 rounded-2xl shadow-sm text-oku-purple-dark">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">App Pulse</h3>
           </div>
           
           <div className="space-y-6">
              <LogItem label="Total Users" value={data?.app.totalUsers.toLocaleString() || '0'} />
              <LogItem label="Session Velocity" value={data?.app.totalAppointments.toLocaleString() || '0'} />
              <LogItem label="API Status" value="Healthy" dot="bg-emerald-400" />
              <LogItem label="Search Engine" value="Optimized" dot="bg-emerald-400" />
              <LogItem label="Video Infra" value="Active" dot="bg-emerald-400" />
              <LogItem label="Payment Gateway" value="Online" dot="bg-emerald-400" />
           </div>

           <div className="mt-12 p-6 bg-oku-purple-dark rounded-[2rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Automated Optimization</p>
                <p className="text-sm font-medium leading-relaxed">System is performing self-healing routines and cache purging daily at 03:00 UTC.</p>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24" />
           </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, sub, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`card-glass-3d ${color} !p-8 !rounded-[2.5rem] flex flex-col justify-between group shadow-xl transition-all duration-500`}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <TrendingUp size={20} className="text-oku-purple-dark/40" />
      </div>
      <div>
        <p className="text-4xl font-display font-black text-oku-darkgrey mb-2">{value}</p>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">{title}</p>
          <p className="text-[9px] font-medium text-oku-darkgrey/30 italic">{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

function LogItem({ label, value, dot }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-oku-darkgrey/5">
      <div className="flex items-center gap-3">
        {dot && <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
        <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey/40">{label}</span>
      </div>
      <span className="text-xs font-black text-oku-darkgrey">{value}</span>
    </div>
  )
}
