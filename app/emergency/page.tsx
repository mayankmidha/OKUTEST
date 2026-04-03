'use client'

import { motion } from 'motion/react'
import { Phone, AlertTriangle, Shield, Heart, Wind, ArrowRight, ExternalLink, LifeBuoy } from 'lucide-react'
import Link from 'next/link'

const emergencyContacts = [
  {
    name: "Vandrevala Foundation",
    phone: "1860 2662 345",
    description: "24/7 Helpline for crisis intervention and suicide prevention.",
    availability: "Always Active",
    color: "bg-oku-lavender/60"
  },
  {
    name: "AASRA",
    phone: "+91-9820466726",
    description: "Professional counseling and support for those in distress.",
    availability: "24 Hours",
    color: "bg-oku-mint/60"
  },
  {
    name: "KIRAN Helpline",
    phone: "1800-599-0019",
    description: "Government-run mental health rehabilitation helpline.",
    availability: "24 Hours",
    color: "bg-oku-blush/60"
  },
  {
    name: "Emergency Services",
    phone: "112 / 100",
    description: "Immediate physical danger or medical emergency.",
    availability: "Immediate Response",
    color: "bg-red-50/50"
  }
]

export default function EmergencyPage() {
  return (
    <div className="oku-page-public min-h-screen bg-oku-blush/10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-red-100/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-lavender/30 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-4 mb-8">
             <span className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-red-200 animate-pulse flex items-center gap-2">
                <AlertTriangle size={14} /> Critical Support
             </span>
          </div>
          <h1 className="heading-display text-7xl md:text-9xl text-oku-darkgrey tracking-tighter leading-[0.85] mb-12">
            You are <br />
            <span className="text-oku-purple-dark italic">not alone.</span>
          </h1>
          <p className="text-2xl text-oku-darkgrey/60 font-display italic border-l-4 border-red-200 pl-8 leading-relaxed max-w-2xl">
            If you are in immediate distress or danger, please reach out to one of the following verified resources. There are people ready to hold space for you right now.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {emergencyContacts.map((contact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card-glass-3d !p-10 ${contact.color} group hover:shadow-2xl transition-all duration-700`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center text-oku-darkgrey shadow-sm group-hover:scale-110 transition-transform">
                  <Phone size={32} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 bg-white/40 px-4 py-2 rounded-full border border-white">
                  {contact.availability}
                </span>
              </div>
              <h3 className="heading-display text-4xl text-oku-darkgrey mb-4">{contact.name}</h3>
              <p className="text-xl text-oku-darkgrey/60 italic font-display mb-10 leading-relaxed">"{contact.description}"</p>
              <a 
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-6 text-xl tracking-widest font-bold"
              >
                {contact.phone}
              </a>
            </motion.div>
          ))}
        </div>

        <div className="card-glass-3d !p-16 md:!p-24 !bg-white/60 !rounded-[4rem] relative overflow-hidden">
           <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey mb-8 leading-[0.9]">Wait for <br /><span className="text-oku-purple-dark italic">clarity.</span></h2>
                <p className="text-xl text-oku-darkgrey/60 leading-relaxed italic font-display border-l-4 border-oku-purple-dark/10 pl-8">
                  Try a 2-minute grounding exercise while you wait for support. Focus on your breath, feel the support of the earth, and know that this moment will pass.
                </p>
              </div>
              <div className="space-y-6">
                 {[
                   "Breathe in for 4, hold for 4, out for 6.",
                   "Name 5 things you can see.",
                   "Press your palms together firmly.",
                   "Take a slow sip of water."
                 ].map((tip, i) => (
                   <div key={i} className="flex items-center gap-6 p-6 bg-white/40 rounded-2xl border border-white">
                      <Wind size={20} className="text-oku-purple-dark/40 animate-pulse" />
                      <p className="text-sm font-bold text-oku-darkgrey/70">{tip}</p>
                   </div>
                 ))}
              </div>
           </div>
           <LifeBuoy size={300} strokeWidth={0.5} className="absolute -bottom-20 -right-20 text-oku-purple-dark/5 rotate-12" />
        </div>
      </div>
    </div>
  )
}
