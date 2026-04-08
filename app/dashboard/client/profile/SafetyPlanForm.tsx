'use client'

import { useState } from 'react'
import { ShieldAlert, Plus, Trash2, Save, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'

interface SafetyPlanProps {
  initialPlan?: any
}

export function SafetyPlanForm({ initialPlan }: SafetyPlanProps) {
  const [warningSigns, setWarningSigns] = useState<string[]>(initialPlan?.warningSigns || [])
  const [copingStrategies, setCopingStrategies] = useState<string[]>(initialPlan?.copingStrategies || [])
  const [reasonsToLive, setReasonsToLive] = useState<string[]>(initialPlan?.reasonsToLive || [])
  const [isSaving, setIsSaving] = useState(false)

  const addItem = (list: string[], setList: (val: string[]) => void) => {
    setList([...list, ''])
  }

  const updateItem = (index: number, val: string, list: string[], setList: (val: string[]) => void) => {
    const newList = [...list]
    newList[index] = val
    setList(newList)
  }

  const removeItem = (index: number, list: string[], setList: (val: string[]) => void) => {
    setList(list.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
        await fetch('/api/user/safety-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                warningSigns,
                copingStrategies,
                reasonsToLive
            })
        })
        alert("Safety Plan Updated. This is a secure, private document. 🛡️")
    } finally {
        setIsSaving(false)
    }
  }

  return (
    <section className="card-glass-3d !p-12 !bg-oku-dark text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-oku-red/20 flex items-center justify-center text-oku-red border border-oku-red/30">
                <ShieldAlert size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-display font-bold tracking-tight">Personal Safety Plan</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Secure & Confidential Protocol</p>
            </div>
        </div>

        <div className="space-y-12">
            {/* Warning Signs */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-oku-lavender">1. Warning Signs</h3>
                    <button onClick={() => addItem(warningSigns, setWarningSigns)} className="text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <Plus size={12} /> Add Trigger
                    </button>
                </div>
                <p className="text-xs text-white/40 italic">Thoughts, images, mood, situations, or behavior that indicate a crisis might be developing.</p>
                <div className="space-y-3">
                    {warningSigns.map((item, i) => (
                        <div key={i} className="flex gap-3">
                            <input 
                                value={item} 
                                onChange={(e) => updateItem(i, e.target.value, warningSigns, setWarningSigns)}
                                placeholder="e.g. Isolation, trouble sleeping..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-oku-lavender/20"
                            />
                            <button onClick={() => removeItem(i, warningSigns, setWarningSigns)} className="text-white/20 hover:text-oku-red transition-colors"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coping Strategies */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-oku-lavender">2. Internal Coping Strategies</h3>
                    <button onClick={() => addItem(copingStrategies, setCopingStrategies)} className="text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <Plus size={12} /> Add Strategy
                    </button>
                </div>
                <p className="text-xs text-white/40 italic">Things I can do to take my mind off my problems without contacting another person.</p>
                <div className="space-y-3">
                    {copingStrategies.map((item, i) => (
                        <div key={i} className="flex gap-3">
                            <input 
                                value={item} 
                                onChange={(e) => updateItem(i, e.target.value, copingStrategies, setCopingStrategies)}
                                placeholder="e.g. Deep breathing, walking, listening to music..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-oku-lavender/20"
                            />
                            <button onClick={() => removeItem(i, copingStrategies, setCopingStrategies)} className="text-white/20 hover:text-oku-red transition-colors"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reasons to Live */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-oku-lavender">3. Anchors & Reasons to Live</h3>
                    <button onClick={() => addItem(reasonsToLive, setReasonsToLive)} className="text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <Plus size={12} /> Add Anchor
                    </button>
                </div>
                <div className="space-y-3">
                    {reasonsToLive.map((item, i) => (
                        <div key={i} className="flex gap-3">
                            <input 
                                value={item} 
                                onChange={(e) => updateItem(i, e.target.value, reasonsToLive, setReasonsToLive)}
                                placeholder="What keeps you grounded?"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-oku-lavender/20"
                            />
                            <button onClick={() => removeItem(i, reasonsToLive, setReasonsToLive)} className="text-white/20 hover:text-oku-red transition-colors"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-white/5">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-oku-lavender text-oku-dark py-5 rounded-pill font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-oku-lavender/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Commit to Secure Vault
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 text-[8px] font-black uppercase tracking-widest text-white/20">
                    <AlertCircle size={12} /> This plan is stored in your protected account space
                </div>
            </div>
        </div>
      </div>

      {/* Abstract safety pulse */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-oku-red/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
