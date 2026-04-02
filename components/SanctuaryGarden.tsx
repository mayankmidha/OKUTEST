'use client'

import { motion } from 'framer-motion'
import { TreePine, Flower2, Cloud, Sparkles, Sun } from 'lucide-react'

interface GardenState {
  sessionCount: number
  moodCount: number
  lastMoodColor: string
  assessmentCount: number
}

export function SanctuaryGarden({ state }: { state: GardenState }) {
  // Logic to determine garden "growth level"
  const treeScale = Math.min(1 + (state.sessionCount * 0.1), 2.5)
  const flowerCount = Math.min(state.moodCount, 12)
  const insightFireflies = Math.min(state.assessmentCount * 2, 10)

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-oku-lavender/20 to-oku-mint/10 rounded-[4rem] border border-white/60 shadow-inner overflow-hidden group">
      
      {/* ── SKY ELEMENTS ── */}
      <div className="absolute top-10 left-10 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
          <Sun className="text-oku-peach-dark animate-pulse" size={48} strokeWidth={1} />
      </div>

      <motion.div 
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 opacity-10"
      >
          <Cloud size={64} className="text-white" />
      </motion.div>

      {/* ── THE GUARDIAN TREE (Growth based on Sessions) ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: treeScale }}
            transition={{ type: "spring", stiffness: 50 }}
            className="relative"
          >
              <TreePine 
                size={120} 
                strokeWidth={0.5} 
                className="text-oku-darkgrey/20 drop-shadow-2xl" 
              />
              {state.sessionCount > 0 && (
                <motion.div 
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-4 left-1/2 -translate-x-1/2"
                >
                    <Sparkles size={20} className="text-oku-lavender animate-float-3d" />
                </motion.div>
              )}
          </motion.div>
          <div className="w-32 h-4 bg-oku-darkgrey/5 rounded-full blur-md -mt-2" />
      </div>

      {/* ── FLOWERS (Growth based on Mood Logs) ── */}
      <div className="absolute bottom-4 inset-x-10 flex justify-around items-end">
          {Array.from({ length: flowerCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <Flower2 
                size={24 + (i % 3) * 4} 
                className={`${state.lastMoodColor || 'text-oku-purple-dark'} opacity-40 hover:opacity-100 transition-opacity cursor-pointer`}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}
      </div>

      {/* ── FIREFLIES (Insights based on Assessments) ── */}
      {Array.from({ length: insightFireflies }).map((_, i) => (
        <motion.div
          key={`ff-${i}`}
          animate={{ 
            x: [Math.random() * 400, Math.random() * 400],
            y: [Math.random() * 300, Math.random() * 300],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-oku-purple rounded-full blur-[1px] z-20 shadow-[0_0_10px_#A594F9]"
        />
      ))}

      {/* ── GROUND ── */}
      <div className="absolute bottom-0 w-full h-12 bg-white/40 backdrop-blur-sm border-t border-white/20" />

      {/* ── HUD ── */}
      <div className="absolute top-8 right-8 text-right space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Sanctuary Growth</p>
          <p className="text-xs font-display italic text-oku-darkgrey/60">
            {state.sessionCount === 0 ? "A seed is planted." : `Level ${state.sessionCount} Resilience`}
          </p>
      </div>
    </div>
  )
}
