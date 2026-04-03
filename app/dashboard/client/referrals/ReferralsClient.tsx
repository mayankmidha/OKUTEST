'use client'

import { motion as m, AnimatePresence } from 'motion/react'
import { 
  Gift, Sparkles, Heart, ArrowRight, Copy, Share2, 
  Wind, ShieldCheck, CheckCircle2, MessageCircle, Clock, 
  Users, Award, Wallet
} from 'lucide-react'
import { useState } from 'react'

interface ReferralsClientProps {
  referralCode: string
  balance: number
  ledger: any[]
}

export default function ReferralsClient({ referralCode, balance, ledger }: ReferralsClientProps) {
  const [copied, setCopy] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopy(true)
    setTimeout(() => setCopy(false), 2000)
  }

  const shareOnWhatsApp = () => {
    const text = `Join Oku Therapy, a clinical sanctuary for deep healing. Use my key ${referralCode} to get 50% off your first session: https://okutherapy.com/auth/signup?ref=${referralCode}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen text-oku-darkgrey bg-oku-lavender/5">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 relative z-10">
        <m.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm">Growth Circle</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Referral Sovereignty</span>
          </div>
          <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter leading-[0.85]">
            Share the <span className="text-oku-purple-dark italic">Light.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 max-w-2xl leading-relaxed">
            Invite those you care about into the sanctuary. When they begin their journey, we honor your shared commitment to healing.
          </p>
        </m.div>

        <m.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass-3d !p-10 !bg-oku-darkgrey text-white flex items-center gap-8 shadow-2xl"
        >
           <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-oku-lavender shadow-inner">
              <Wallet size={32} strokeWidth={1.5} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Care Balance</p>
              <p className="text-4xl font-bold tracking-tighter">{balance} <span className="text-sm font-display italic opacity-60 ml-2">Sessions</span></p>
           </div>
        </m.div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 relative z-10">
        {/* Main Invite Card */}
        <div className="lg:col-span-7">
           <m.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="card-glass-3d !p-16 !bg-white/60 !rounded-[4rem] shadow-2xl relative overflow-hidden h-full border-none"
           >
              <div className="relative z-10">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-oku-lavender flex items-center justify-center text-oku-purple-dark mb-12 animate-float-3d shadow-sm">
                    <Gift size={40} strokeWidth={1.5} />
                 </div>
                 <h2 className="heading-display text-5xl text-oku-darkgrey mb-8 tracking-tighter leading-[0.9]">Gift a moment <br/>of <span className="text-oku-purple-dark italic">unfolding.</span></h2>
                 <p className="text-xl text-oku-darkgrey/60 font-display italic mb-12 max-w-md leading-relaxed">
                    Refer a friend and they'll receive <strong>50% off</strong> their first session. Once they complete it, your next session is entirely on us.
                 </p>

                 <div className="space-y-6 max-w-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 ml-4">Your Unique Key</p>
                    <div className="flex items-center gap-4 bg-white border border-white p-2 rounded-full shadow-xl group hover:shadow-2xl transition-all">
                       <span className="flex-1 px-8 font-display text-2xl font-bold tracking-[0.2em] text-oku-darkgrey">{referralCode}</span>
                       <button 
                         onClick={handleCopy}
                         className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-5 !px-10 !text-[9px] shadow-sm hover:scale-[1.02] active:scale-95"
                       >
                          {copied ? <CheckCircle2 size={16} /> : <div className="flex items-center gap-2"><Copy size={14} /> <span>Copy</span></div>}
                       </button>
                    </div>
                    <button 
                      onClick={shareOnWhatsApp}
                      className="w-full py-5 rounded-full border border-oku-mint text-oku-darkgrey font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-oku-mint/10 transition-all"
                    >
                       <MessageCircle size={16} className="text-oku-mint" /> Share on WhatsApp
                    </button>
                 </div>
              </div>
              <Sparkles size={300} strokeWidth={0.5} className="absolute -bottom-20 -right-20 text-oku-purple-dark/5 pointer-events-none" />
           </m.div>
        </div>

        {/* Status Ledger */}
        <div className="lg:col-span-5 space-y-8 flex flex-col">
           <div className="card-glass-3d !p-12 !bg-white/40 flex-1 border-none shadow-xl">
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-10 tracking-tighter">Referral <span className="italic text-oku-purple-dark">Ledger</span></h3>
              
              {ledger.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                   <Users className="mx-auto text-oku-purple-dark/20 mb-6" size={40} />
                   <p className="text-xl font-display italic text-oku-darkgrey/30">Your invited circle is quiet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   {ledger.map((r, i) => (
                     <div key={r.id} className="flex items-center justify-between p-6 bg-white/60 rounded-3xl border border-white group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-5">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${r.status === 'COMPLETED' ? 'bg-oku-mint text-oku-darkgrey' : 'bg-oku-lavender text-oku-purple-dark'}`}>
                              {r.name.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-oku-darkgrey">{r.name}</p>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-30">{new Date(r.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${r.status === 'COMPLETED' ? 'bg-oku-mint/30 text-oku-darkgrey' : 'bg-oku-lavender/40 text-oku-purple-dark'}`}>
                              {r.status}
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <div className="card-glass-3d !p-10 !bg-oku-mint/20 border-none">
              <div className="flex items-center gap-6">
                 <ShieldCheck size={24} className="text-oku-mint animate-float-3d" />
                 <p className="text-sm font-bold text-oku-darkgrey/60 italic leading-relaxed">
                   "We grow through trusted connection. Every referal helps us keep the sanctuary sustainable and safe."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
