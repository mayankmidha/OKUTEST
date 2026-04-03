'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, BarChart3, PieChart, 
  ArrowUpRight, ArrowDownRight,
  Globe, Target, Users, Zap,
  Download, Calendar, Filter
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/currency'

export default function BIDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchBI = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bi')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBI() }, [])

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><TrendingUp className="w-12 h-12 animate-pulse text-oku-purple-dark" /></div>
  }

  const revenueGrowth = ((data?.metrics?.currentMonthRevenue / data?.metrics?.lastMonthRevenue - 1) * 100 || 0).toFixed(1)

  return (
    <div className="space-y-12 pb-20">
      {/* ── PREDICTIVE METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <BIStat 
          title="Projected Signups" 
          value={data?.projections?.signups || 0} 
          trend={`+${(data?.projections?.signups / data?.projections?.currentSignups * 100 || 0).toFixed(0)}%`}
          sub="Expected total this month" 
          icon={<Users size={28} />}
          color="bg-oku-lavender text-oku-purple-dark"
        />
        <BIStat 
          title="Projected Revenue" 
          value={formatCurrency(data?.projections?.revenue || 0, 'INR')} 
          trend={`${revenueGrowth}%`}
          sub="Forecasted monthly total" 
          icon={<TrendingUp size={28} />}
          color="bg-oku-mint/60 text-emerald-600"
        />
        <BIStat 
          title="Current LTV" 
          value={formatCurrency(data?.metrics?.avgLTV || 0, 'INR')} 
          sub="Avg revenue per client" 
          icon={<Target size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
        <BIStat 
          title="Market Reach" 
          value="India (Pan)" 
          sub="Available in 28 states" 
          icon={<Globe size={28} />}
          color="bg-oku-purple-light/40 text-oku-purple-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Market Dynamics */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">Market Indicators</h3>
              <PieChart size={24} className="text-oku-purple-dark/20" />
           </div>
           
           <div className="space-y-6">
              {data?.marketTrends?.map((trend: any, i: number) => (
                <div key={i} className="p-5 bg-white/40 border border-white rounded-2xl flex items-center justify-between group hover:bg-white transition-colors">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{trend.category}</p>
                      <p className="text-sm font-bold text-oku-darkgrey mt-1">{trend.volume} Volume</p>
                   </div>
                   <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                      <ArrowUpRight size={14} />
                      {trend.growth}
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-6 bg-oku-darkgrey rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">BI Recommendation</p>
              <p className="text-sm font-light leading-relaxed">
                Strategic focus on <span className="text-oku-mint font-bold italic">ADHD Management</span> could yield a 3x higher conversion rate based on current traffic patterns.
              </p>
           </div>
        </div>

        {/* Revenue Velocity */}
        <div className="lg:col-span-2 card-glass-3d !p-12 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-black text-oku-darkgrey tracking-tight">Revenue Dynamics</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Current month performance vs projection</p>
              </div>
              <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[11px]">
                 <Download size={16} className="mr-3" /> Full BI Report
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Growth toward goal</span>
                       <span className="text-xs font-black text-oku-darkgrey">72%</span>
                    </div>
                    <div className="h-4 bg-white/40 rounded-full p-1 border border-white overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '72%' }}
                         className="h-full bg-oku-purple-dark rounded-full shadow-inner"
                       />
                    </div>
                 </div>

                 <div className="p-8 bg-oku-lavender/30 border border-oku-lavender/40 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/60 mb-2">Insight</p>
                    <p className="text-sm font-medium text-oku-darkgrey leading-relaxed">
                       Retention is 14% higher for seekers who engage with more than 3 circle sessions per month.
                    </p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-6 bg-white/40 border border-white rounded-[2rem]">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                       <TrendingUp size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Last Month</p>
                       <p className="text-lg font-black text-oku-darkgrey">{formatCurrency(data?.metrics?.lastMonthRevenue || 0, 'INR')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-6 bg-oku-dark text-white rounded-[2rem] shadow-xl">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-oku-mint">
                       <Zap size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Projected Run Rate</p>
                       <p className="text-lg font-black">{formatCurrency(data?.projections?.revenue || 0, 'INR')}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function BIStat({ title, value, sub, icon, color, trend }: any) {
  const isPositive = trend?.startsWith('+')
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card-glass-3d ${color} !p-8 !rounded-[2.5rem] flex flex-col justify-between group shadow-xl transition-all duration-500`}
    >
      <div className="flex justify-between items-start mb-10">
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
        <p className="text-3xl font-display font-black text-oku-darkgrey mb-2 tracking-tighter leading-none">{value}</p>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">{title}</p>
          <p className="text-[9px] font-medium text-oku-darkgrey/30 italic">{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}
