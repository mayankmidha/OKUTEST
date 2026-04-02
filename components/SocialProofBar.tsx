'use client'

import { motion } from 'motion/react'
import { ShieldCheck, Star, Users, Zap } from 'lucide-react'

interface Props {
  practitionerCount: number
  sessionCount: number
  clientCount: number
}

export function SocialProofBar({ practitionerCount, sessionCount, clientCount }: Props) {
  return (
    <>
      {/* Floating stats ribbon — sits above the hero, sticks to top after scroll */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] pointer-events-none">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto mb-6 px-4 pointer-events-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.12)] px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 divide-x divide-oku-darkgrey/10">
              <div className="flex items-center gap-2 text-center">
                <Users size={13} className="text-oku-purple-dark shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-oku-darkgrey leading-none">
                    {practitionerCount} specialists
                  </p>
                </div>
              </div>
              <div className="pl-5 flex items-center gap-2">
                <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] font-black text-oku-darkgrey leading-none">All verified</p>
              </div>
              <div className="pl-5 flex items-center gap-2">
                <Star size={13} className="text-oku-butter shrink-0" />
                <p className="text-[10px] font-black text-oku-darkgrey leading-none">Free first consult</p>
              </div>
              <div className="pl-5 hidden sm:flex items-center gap-2">
                <Zap size={13} className="text-oku-purple-dark shrink-0" />
                <p className="text-[10px] font-black text-oku-darkgrey leading-none">₹1,500 / hr</p>
              </div>
            </div>
            <a
              href="/therapists"
              className="shrink-0 bg-oku-darkgrey text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple-dark transition-colors"
            >
              Browse →
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}
