'use client'

import { useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AIAssistantWidget({ contextType, title = "AI Assistant" }: { contextType: string, title?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query || 'Analyze everything', context: contextType })
      })
      const data = await res.json()
      if (data.result) {
        setResponse(data.result)
      }
    } catch (error) {
      console.error(error)
      setResponse("The platform mind is momentarily obscured. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getSmartHint = () => {
    if (contextType === 'practitioner_summary') return "Draft summary of today's schedule"
    if (contextType === 'client_insight') return "Reflect on my recent mood trends"
    return "Check platform status"
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-oku-dark text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group ring-4 ring-oku-purple/20"
      >
        <Sparkles size={24} className="group-hover:animate-pulse text-oku-purple" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-24 right-8 z-50 w-96 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white overflow-hidden flex flex-col"
          >
            <div className="bg-oku-dark text-white p-6 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-oku-purple/20 flex items-center justify-center border border-white/10 shadow-inner">
                  <Sparkles size={16} className="text-oku-purple animate-pulse" />
                </div>
                <div>
                   <span className="font-bold text-sm block tracking-tight">OKU CORE</span>
                   <span className="text-[10px] text-oku-purple font-black uppercase tracking-widest opacity-60">System Integrated</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 opacity-40 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="p-8 flex-1 min-h-[300px] flex flex-col">
              {response ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 flex-1"
                >
                  <p className="text-sm text-oku-dark leading-relaxed font-medium bg-oku-cream/30 p-4 rounded-2xl border border-oku-taupe/5 italic">
                    "{response}"
                  </p>
                  <button 
                    onClick={() => { setResponse(null); setQuery(''); }}
                    className="w-full py-4 rounded-2xl bg-oku-purple/20 text-oku-purple-dark text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple/40 transition-all border border-oku-purple/10"
                  >
                    Reset Connection
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleGenerate} className="flex-1 flex flex-col space-y-6">
                  <div className="flex-1 space-y-4">
                    <p className="text-xs text-oku-taupe font-medium leading-relaxed">
                      I am the Oku Core intelligence. I maintain real-time synchronization with all platform systems.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button 
                          type="button"
                          onClick={() => { setQuery(getSmartHint()); }}
                          className="px-3 py-1.5 rounded-full bg-oku-cream text-[9px] font-black uppercase tracking-widest text-oku-taupe border border-oku-taupe/10 hover:border-oku-purple transition-all"
                        >
                          Suggest Insight
                        </button>
                    </div>

                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about schedule, wellness, or platform status..."
                      className="w-full bg-oku-cream-warm/20 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple transition-all resize-none h-32"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-5 flex justify-center items-center gap-3 text-sm shadow-xl active:scale-95 transition-transform"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Query Core <Sparkles size={18} /></>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
