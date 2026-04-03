'use client'

import { useState } from 'react'
import { Sparkles, Brain, Users, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function ToolRecommendationHub({ clientId }: { clientId: string }) {
  const [isSending, setIsSending] = useState<string | null>(null)
  const [sentTools, setSentTools] = useState<string[]>([])

  const tools = [
    { id: 'adhd-timer', name: 'Pomodoro Protocol', type: 'ADHD', icon: Brain },
    { id: 'adhd-menu', name: 'Dopamine Menu Template', type: 'ADHD', icon: Sparkles },
    { id: 'circle-adhd', name: 'ADHD Peer Support Circle', type: 'CIRCLE', icon: Users },
    { id: 'circle-anxiety', name: 'Anxiety Management Circle', type: 'CIRCLE', icon: Users },
  ]

  const recommend = async (toolId: string) => {
    setIsSending(toolId)
    // In production, this would send a notification/message to the client
    await new Promise(r => setTimeout(r, 1000))
    setSentTools([...sentTools, toolId])
    setIsSending(null)
  }

  return (
    <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden mt-8">
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-oku-lavender" /> Care Recommendations
        </h3>
        <p className="text-xs text-white/40 mb-8 italic">Recommend specific ADHD tools or support groups to this patient.</p>
        
        <div className="space-y-3">
            {tools.map(tool => {
                const isSent = sentTools.includes(tool.id)
                return (
                    <button 
                        key={tool.id}
                        disabled={isSent || !!isSending}
                        onClick={() => recommend(tool.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isSent ? 'bg-oku-lavender/10 border-transparent opacity-50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-4">
                            <tool.icon size={18} className="text-oku-lavender" />
                            <div className="text-left">
                                <p className="text-xs font-bold">{tool.name}</p>
                                <p className="text-[8px] uppercase tracking-widest opacity-40">{tool.type}</p>
                            </div>
                        </div>
                        {isSent ? (
                            <CheckCircle2 size={16} className="text-oku-lavender" />
                        ) : (
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-oku-lavender group-hover:text-oku-dark transition-colors">
                                {isSending === tool.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
      </div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-oku-purple/5 rounded-full blur-3xl" />
    </div>
  )
}
