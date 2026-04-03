'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, FileText, ChevronRight, Layout, Edit2, Check, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function AssessmentTemplateManager({ assessments }: { assessments: any[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const startEdit = (assessment: any) => {
    setIsEditing(assessment.id)
    setEditData({ ...assessment, questions: JSON.stringify(assessment.questions, null, 2) })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
        // In production, call an API to update assessment template
        await new Promise(r => setTimeout(r, 1000))
        alert("Assessment Template Updated Successfully.")
        setIsEditing(null)
    } finally {
        setIsSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Assessment <span className="italic text-oku-purple-dark">Templates</span></h2>
        <button className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 flex items-center gap-2">
            <Plus size={16} /> Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-4">
            {assessments.map(a => (
                <button 
                    key={a.id}
                    onClick={() => startEdit(a)}
                    className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${isEditing === a.id ? 'bg-oku-dark text-white border-oku-dark shadow-2xl' : 'bg-white/60 border-white/60 hover:border-oku-purple/30'}`}
                >
                    <div className="flex items-center gap-4">
                        <FileText size={20} className={isEditing === a.id ? 'text-oku-lavender' : 'text-oku-darkgrey/20'} />
                        <div className="text-left">
                            <p className="text-sm font-bold">{a.title}</p>
                            <p className={`text-[8px] uppercase tracking-widest ${isEditing === a.id ? 'text-white/40' : 'text-oku-darkgrey/30'}`}>{a.price > 0 ? 'Paid' : 'Public'}</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className={isEditing === a.id ? 'text-white/20' : 'text-oku-darkgrey/10'} />
                </button>
            ))}
        </div>

        <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div 
                        key="editor"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="card-glass-3d !p-12 !bg-white/40"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="heading-display text-2xl">Template <span className="italic">Editor</span></h3>
                            <button onClick={() => setIsEditing(null)} className="p-3 rounded-xl bg-white border border-white/60 text-oku-darkgrey/20 hover:text-oku-red transition-all"><X size={18}/></button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">Assessment Title</label>
                                <input 
                                    className="input-pastel" 
                                    value={editData.title}
                                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">Questions (JSON Protocol)</label>
                                <textarea 
                                    className="w-full h-96 bg-white/60 border-2 border-white rounded-[2rem] p-8 font-mono text-xs focus:outline-none focus:ring-4 focus:ring-oku-lavender/50 transition-all shadow-inner"
                                    value={editData.questions}
                                    onChange={(e) => setEditData({...editData, questions: e.target.value})}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button 
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="btn-pill-3d bg-oku-dark text-white flex-1 !py-5 flex items-center justify-center gap-3 shadow-2xl"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Commit Template Changes
                                </button>
                                <button className="p-5 rounded-pill bg-oku-blush/20 text-oku-blush-dark hover:bg-oku-blush/40 transition-all"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center bg-white/20 border-2 border-dashed border-white/60 rounded-[4rem] p-20 text-center"
                    >
                        <Layout size={48} className="text-oku-darkgrey/10 mb-8" />
                        <p className="text-xl font-display italic text-oku-darkgrey/30">Select a template to engage clinical protocol editor.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
