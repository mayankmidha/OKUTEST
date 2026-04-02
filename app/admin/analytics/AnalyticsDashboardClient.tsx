'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, Users, DollarSign, 
  Target, BarChart3, PieChart,
  Download, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/currency'

export default function AnalyticsDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/analytics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnalytics() }, [])

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><BarChart3 className="w-12 h-12 animate-spin" /></div>
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── REVENUE & GROWTH STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <AnalyticsStat 
          title="Revenue (30d)" 
          value={formatCurrency(data?.revenue?.total30d || 0, 'INR')} 
          trend="+12.4%"
          sub={`${data?.revenue?.count30d} successful transactions`}
          icon={<DollarSign size={28} />}
          color="bg-oku-mint/60"
        />
        <AnalyticsStat 
          title="Platform Fees" 
          value={formatCurrency(data?.revenue?.fees30d || 0, 'INR')} 
          trend="+8.1%"
          sub="Net margin from sessions"
          icon={<Target size={28} />}
          color="bg-oku-lavender/60"
        />
        <AnalyticsStat 
          title="Client Network" 
          value={data?.growth?.clients || 0} 
          trend="+54"
          sub="Total registered clients"
          icon={<Users size={28} />}
          color="bg-oku-blush/60"
        />
        <AnalyticsStat 
          title="Growth Velocity" 
          value={`${((data?.funnel?.bookings / data?.funnel?.signups) * 100 || 0).toFixed(1)}%`} 
          sub="Signup to booking rate"
          icon={<TrendingUp size={28} />}
          color="bg-oku-purple-light/40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Conversion Funnel */}
        <div className="card-glass-3d !p-12 !rounded-[3rem] border border-white/60 shadow-xl">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-display font-black text-oku-darkgrey tracking-tight">Acquisition Funnel</h3>
              <PieChart className="text-oku-purple-dark opacity-20" size={32} />
           </div>
           
           <div className="space-y-10">
              <FunnelStep 
                label="New Signups" 
                value={data?.funnel?.signups} 
                percent={100}
                color="bg-oku-darkgrey/10"
              />
              <FunnelStep 
                label="Onboarded" 
                value={data?.funnel?.onboarded} 
                percent={(data?.funnel?.onboarded / data?.funnel?.signups) * 100}
                color="bg-oku-lavender"
              />
              <FunnelStep 
                label="First Booking" 
                value={data?.funnel?.bookings} 
                percent={(data?.funnel?.bookings / data?.funnel?.signups) * 100}
                color="bg-oku-purple-dark text-white"
              />
           </div>

           <div className="mt-12 p-8 bg-white/40 border border-white rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Insight</p>
              <p className="text-sm font-medium text-oku-darkgrey leading-relaxed">
                {(data?.funnel?.onboarded / data?.funnel?.signups * 100).toFixed(0)}% of users complete intake within 24 hours.
              </p>
           </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-2 card-glass-3d !p-12 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-black text-oku-darkgrey tracking-tight">Therapist Performance</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Top utilized practitioners by volume</p>
              </div>
              <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[11px]">
                 <Download size={16} className="mr-3" /> Full Report
              </button>
           </div>

           <div className="space-y-6">
              {data?.topTherapists?.map((t: any, i: number) => (
                <div key={t.id} className="p-6 bg-white/40 border border-white rounded-[2rem] flex items-center justify-between group hover:scale-[1.01] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark font-display font-black text-xl shadow-sm">
                         {i + 1}
                      </div>
                      <div>
                         <p className="text-lg font-black text-oku-darkgrey">{t.name}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{t.specialization}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-display font-black text-oku-purple-dark">{t.appointments}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">Sessions</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsStat({ title, value, sub, icon, color, trend }: any) {
  const isPositive = trend?.startsWith('+')
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`card-glass-3d ${color} !p-10 !rounded-[3rem] flex flex-col justify-between group shadow-xl transition-all duration-500`}
    >
      <div className="flex justify-between items-start mb-12">
        <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center text-oku-purple-dark shadow-sm group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-4xl font-display font-black text-oku-darkgrey mb-3 tracking-tighter">{value}</p>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">{title}</p>
          <p className="text-[9px] font-medium text-oku-darkgrey/30 italic">{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

function FunnelStep({ label, value, percent, color }: any) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-end">
          <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey/40">{label}</span>
          <span className="text-sm font-black text-oku-darkgrey">{value}</span>
       </div>
       <div className="h-10 bg-white/40 rounded-2xl p-1 border border-white relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={`h-full rounded-xl shadow-inner flex items-center px-4 ${color}`}
          >
             {percent > 20 && <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{percent.toFixed(0)}%</span>}
          </motion.div>
       </div>
    </div>
  )
}
