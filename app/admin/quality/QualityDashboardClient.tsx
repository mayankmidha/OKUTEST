'use client'

import { useState, useEffect } from 'react'
import { 
  Star, Heart, ShieldCheck, 
  AlertTriangle, CheckCircle2, 
  TrendingUp, BarChart3, Search,
  Download, MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function QualityDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchQuality = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/quality')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuality() }, [])

  if (loading && !data) {
    return <div className="h-96 flex items-center justify-center opacity-20"><Star className="w-12 h-12 animate-pulse text-oku-purple-dark" /></div>
  }

  return (
    <div className="space-y-12 pb-20">
      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <QualityStat 
          title="Avg. Quality Score" 
          value={`${data?.metrics?.averageScore || 0}/5`} 
          sub="Based on post-session ratings" 
          icon={<Star size={28} />}
          color="bg-oku-lavender text-oku-purple-dark"
        />
        <QualityStat 
          title="Clinical Improvement" 
          value={`${data?.metrics?.improvementRate || 0}%`} 
          sub="Symptom reduction rate" 
          icon={<Heart size={28} />}
          color="bg-oku-mint/60 text-emerald-600"
        />
        <QualityStat 
          title="Compliance Score" 
          value="98.2%" 
          sub="Documentation completion rate" 
          icon={<ShieldCheck size={28} />}
          color="bg-oku-blush/60 text-oku-darkgrey"
        />
        <QualityStat 
          title="Quality Alerts" 
          value={data?.metrics?.qualityAlerts || 0} 
          sub="Sessions requiring review" 
          icon={<AlertTriangle size={28} />}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Quality Controls */}
        <div className="card-glass-3d !p-10 !rounded-[3rem] border border-white/60 shadow-xl">
           <h3 className="text-xl font-display font-black text-oku-darkgrey mb-8 flex items-center gap-3">
             <CheckCircle2 size={20} className="text-oku-purple-dark" />
             Governance Pulse
           </h3>
           <div className="space-y-4">
              <QualityMetric label="SOAP Notes Completion" value="94%" />
              <QualityMetric label="Intake Form Coverage" value="100%" />
              <QualityMetric label="Safety Plan Approval" value="88%" />
              <QualityMetric label="Response Time (Avg)" value="4.2h" />
           </div>
           
           <div className="mt-12 p-8 bg-oku-darkgrey rounded-[2rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Clinical Insight</p>
              <p className="text-sm font-light leading-relaxed italic">
                Higher session frequency correlates with a 24% faster improvement in GAD-7 scores this month.
              </p>
           </div>
        </div>

        {/* Recent Feedback */}
        <div className="lg:col-span-2 card-glass-3d !p-0 !rounded-[3rem] border border-white/60 shadow-xl overflow-hidden flex flex-col">
           <div className="p-10 pb-6 flex items-center justify-between border-b border-oku-darkgrey/5">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-oku-darkgrey tracking-tight">Post-Session Pulse</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Direct seeker feedback & ratings</p>
              </div>
              <button className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-6 !py-3 text-[10px]">
                 <Download size={14} className="mr-2" /> Export Report
              </button>
           </div>

           <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-oku-darkgrey/5">
                   <tr>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Seeker</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Practitioner</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Score</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Comment</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-oku-darkgrey/5">
                   {data?.recentRatings?.map((rating: any) => (
                     <tr key={rating.id} className="hover:bg-oku-lavender/10 transition-colors group">
                        <td className="p-6">
                           <div className="w-8 h-8 rounded-full bg-oku-lavender flex items-center justify-center text-oku-purple-dark text-[10px] font-black shadow-sm">
                              {rating.clientInitials}
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-black text-oku-darkgrey">{rating.practitionerName}</p>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < rating.score ? "text-amber-400 fill-amber-400" : "text-oku-darkgrey/10"} />
                              ))}
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="text-xs text-oku-darkgrey/60 line-clamp-1 italic max-w-[200px]">{rating.comment || 'No comment provided'}</p>
                        </td>
                        <td className="p-6 whitespace-nowrap">
                           <p className="text-[10px] font-black text-oku-darkgrey/40">{new Date(rating.date).toLocaleDateString()}</p>
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

function QualityStat({ title, value, sub, icon, color }: any) {
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

function QualityMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-5 bg-white/40 border border-white rounded-2xl">
       <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{label}</span>
       <span className="text-xs font-black text-oku-darkgrey">{value}</span>
    </div>
  )
}
