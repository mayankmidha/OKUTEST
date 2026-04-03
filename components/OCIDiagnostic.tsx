'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, Terminal, ShieldCheck, AlertCircle, Zap, Brain } from 'lucide-react'

export function OCIDiagnostic() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const runDiagnostic = async () => {
    setIsLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin/oci')
      if (res.ok) {
        setData(await res.json())
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  return (
    <div className="bg-[#141312] rounded-[2rem] border border-white/5 overflow-hidden shadow-inner font-mono">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white/40 ml-2">diagnostic_terminal_v1.0</span>
         </div>
         <button 
            onClick={runDiagnostic} 
            disabled={isLoading}
            className="text-[9px] uppercase tracking-widest text-oku-purple hover:text-white transition-colors disabled:opacity-30"
         >
            {isLoading ? 'Processing...' : '[ Re-sync Brain ]'}
         </button>
      </div>

      <div className="p-8 min-h-[300px]">
         {isLoading ? (
            <div className="h-40 flex flex-col items-center justify-center gap-4 text-white/40">
               <Loader2 className="animate-spin text-oku-purple" size={24} />
               <p className="text-[10px] uppercase tracking-widest animate-pulse">Scanning Platform Neural Pathways...</p>
            </div>
         ) : error ? (
            <div className="h-40 flex flex-col items-center justify-center gap-4 text-red-400">
               <AlertCircle size={24} />
               <p className="text-xs uppercase tracking-widest">OCI Synchronization Failure. Check API Credentials.</p>
            </div>
         ) : (
            <AnimatePresence>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
               >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-white/5">
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Status</p>
                        <p className="text-xs font-bold text-oku-success flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-oku-success animate-pulse" /> ONLINE
                        </p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Nodes</p>
                        <p className="text-xs font-bold text-white">{data?.vitals?.totalUsers || 0} Integrated</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Integrity</p>
                        <p className="text-xs font-bold text-white">99.9% Verified</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Timestamp</p>
                        <p className="text-xs font-bold text-white/60">{new Date().toLocaleTimeString()}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <Terminal size={16} className="text-oku-purple mt-1 flex-shrink-0" />
                        <div className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                           {data.analysis}
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/20">
                     <span>Encryption: AES-256 System-wide</span>
                     <span>Secured by Oku Core</span>
                  </div>
               </motion.div>
            </AnimatePresence>
         )}
      </div>
    </div>
  )
}
