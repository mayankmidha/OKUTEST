'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { 
    Trash2, Save, Sparkles, PlusCircle, 
    ChevronRight, Eye, Layout, GripVertical,
    Loader2, ArrowRight, Settings, AlignLeft,
    CheckCircle2, AlertCircle, Copy, FileText
} from 'lucide-react'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

interface Option { label: string; value: number }
interface Question { id: string; text: string; options: Option[] }

export default function NewAssessmentClient({ canPostBlogs = false }: { canPostBlogs?: boolean }) {
  const router = useRouter()
  
  // Assessment State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ]
    }
  ])
  
  // Builder UI State
  const [activeStep, setActiveStep] = useState(-1) // -1 is Intro Settings, 0+ are questions
  const [isSaving, setIsSaving] = useState(false)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [showAiModal, setShowAiPrompt] = useState(false)

  const addQuestion = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setQuestions([...questions, {
      id: newId,
      text: '',
      options: [...questions[0].options]
    }])
    setActiveStep(questions.length)
  }

  const duplicateQuestion = (idx: number) => {
    const qToCopy = questions[idx]
    const newQuestions = [...questions]
    newQuestions.splice(idx + 1, 0, {
        ...qToCopy,
        id: Math.random().toString(36).substr(2, 9)
    })
    setQuestions(newQuestions)
    setActiveStep(idx + 1)
  }

  const deleteQuestion = (idx: number) => {
    if (questions.length === 1) return
    const newQuestions = questions.filter((_, i) => i !== idx)
    setQuestions(newQuestions)
    if (activeStep >= newQuestions.length) setActiveStep(newQuestions.length - 1)
  }

  const generateWithAi = async () => {
    if (!aiPrompt) return
    setIsAiGenerating(true)
    try {
        const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Create a clinical assessment based on this request: "${aiPrompt}". 
                Respond ONLY with a JSON object: { "title": "...", "description": "...", "questions": [{ "text": "...", "options": [{ "label": "Not at all", "value": 0 }, { "label": "Several days", "value": 1 }, { "label": "More than half the days", "value": 2 }, { "label": "Nearly every day", "value": 3 }] }] }`
            })
        })
        const data = await res.json()
        const aiResponse = JSON.parse(data.result.match(/\{[\s\S]*\}/)[0])
        
        setTitle(aiResponse.title)
        setDescription(aiResponse.description)
        setQuestions(aiResponse.questions.map((q: any) => ({
            ...q,
            id: Math.random().toString(36).substr(2, 9)
        })))
        setShowAiPrompt(false)
        setActiveStep(-1)
    } catch (e) {
        alert("Clinical AI had a neural disruption. Please try again.")
    } finally {
        setIsAiGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!title || questions.some(q => !q.text)) {
      alert('Provide a title and ensure all questions have text.')
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch('/api/practitioner/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions, price: parseFloat(price) || 0 })
      })
      if (response.ok) router.push('/practitioner/assessments')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PractitionerShell
      title="Assessment Studio"
      description="Design immersive, Typeform-style clinical screenings."
      badge="Studio"
      currentPath="/practitioner/assessments"
      canPostBlogs={canPostBlogs}
    >
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-[3rem] border border-oku-darkgrey/5 shadow-2xl overflow-hidden mt-6">
        
        {/* ── LEFT NAVIGATION SIDEBAR ── */}
        <aside className="w-full md:w-80 bg-oku-cream border-r border-oku-darkgrey/5 flex flex-col h-full relative z-20">
            <div className="p-6 border-b border-oku-darkgrey/5">
                <button 
                    onClick={() => setShowAiPrompt(true)}
                    className="w-full bg-oku-purple-dark text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-oku-dark transition-all shadow-md group"
                >
                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /> Auto-Generate with AI
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {/* Intro Settings Node */}
                <button
                    onClick={() => setActiveStep(-1)}
                    className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        activeStep === -1 
                            ? 'bg-white shadow-sm border border-white text-oku-darkgrey' 
                            : 'hover:bg-white/50 text-oku-darkgrey/50'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === -1 ? 'bg-oku-purple/10 text-oku-purple-dark' : 'bg-oku-darkgrey/5'}`}>
                        <Settings size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Welcome Screen</p>
                        <p className="text-xs font-display italic mt-1 truncate max-w-[140px]">{title || 'Untitled Assessment'}</p>
                    </div>
                </button>

                <div className="py-4 flex items-center gap-4">
                    <div className="h-px flex-1 bg-oku-darkgrey/5" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/20">Questions</span>
                    <div className="h-px flex-1 bg-oku-darkgrey/5" />
                </div>

                {/* Question Nodes */}
                <AnimatePresence>
                    {questions.map((q, idx) => (
                        <motion.div 
                            key={q.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <button
                                onClick={() => setActiveStep(idx)}
                                className={`w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all group ${
                                    activeStep === idx 
                                        ? 'bg-white shadow-sm border border-white text-oku-darkgrey' 
                                        : 'hover:bg-white/50 text-oku-darkgrey/50'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${activeStep === idx ? 'bg-oku-mint text-oku-mint-dark' : 'bg-oku-darkgrey/5'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Question {idx + 1}</p>
                                    <p className="text-xs font-display italic truncate">{q.text || 'Empty question...'}</p>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button 
                    onClick={addQuestion}
                    className="w-full mt-4 p-4 rounded-2xl border border-dashed border-oku-purple/20 text-oku-purple-dark text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-oku-purple/5 transition-all"
                >
                    <PlusCircle size={14} /> Add Question
                </button>
            </div>

            <div className="p-6 bg-white border-t border-oku-darkgrey/5">
                 <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-oku-darkgrey text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-oku-dark transition-all shadow-xl pulse-cta"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Deploy Assessment
                </button>
            </div>
        </aside>

        {/* ── RIGHT MAIN EDITOR (TYPEFORM STYLE) ── */}
        <main className="flex-1 bg-[#FAFAFA] relative overflow-y-auto custom-scrollbar flex flex-col justify-center min-h-full">
            <div className="absolute top-8 right-8 flex items-center gap-3 z-50">
                <span className="px-3 py-1.5 bg-white border border-oku-darkgrey/5 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 shadow-sm flex items-center gap-2">
                    <Eye size={12} /> Preview Mode Active
                </span>
            </div>

            <AnimatePresence mode="wait">
                {activeStep === -1 ? (
                    /* ── SETTINGS / WELCOME SCREEN EDITOR ── */
                    <motion.div 
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto w-full p-12 space-y-12"
                    >
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-oku-purple-dark shadow-sm border border-oku-darkgrey/5 mb-6">
                                <AlignLeft size={28} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Welcome Screen</p>
                        </div>

                        <div className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-oku-darkgrey/5">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark ml-4">Assessment Title</label>
                                <input 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-oku-cream/50 border-none rounded-2xl p-6 text-3xl font-display font-bold text-oku-darkgrey outline-none focus:ring-2 focus:ring-oku-purple/20 transition-all placeholder:text-oku-darkgrey/20" 
                                    placeholder="e.g. Clinical Burnout Screener"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark ml-4">Patient Description & Instructions</label>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-oku-cream/50 border-none rounded-2xl p-6 text-lg font-display italic text-oku-darkgrey/70 outline-none focus:ring-2 focus:ring-oku-purple/20 transition-all min-h-[150px] resize-none placeholder:text-oku-darkgrey/20" 
                                    placeholder="Explain the purpose of this screening to your patient..."
                                />
                            </div>

                            <div className="pt-8 border-t border-oku-darkgrey/5 space-y-4">
                                <div className="flex items-center gap-3 ml-4">
                                    <Sparkles className="text-oku-peach-dark" size={16} />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-oku-peach-dark">Premium Access Fee (INR)</label>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-oku-darkgrey/40">₹</span>
                                    <input 
                                        type="number" 
                                        value={price} 
                                        onChange={e => setPrice(e.target.value)}
                                        className="w-full bg-oku-peach/10 border border-oku-peach/20 rounded-2xl py-6 pl-14 pr-6 text-2xl font-bold text-oku-darkgrey outline-none focus:ring-2 focus:ring-oku-peach/30 transition-all" 
                                    />
                                </div>
                                <p className="text-[9px] text-oku-darkgrey/30 italic ml-4">Set to 0 to include in standard care. Paid assessments are unlocked via universal checkout.</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* ── QUESTION EDITOR ── */
                    <motion.div 
                        key={`q-${activeStep}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-4xl mx-auto w-full p-12"
                    >
                        <div className="bg-white rounded-[3rem] shadow-2xl border border-oku-darkgrey/5 overflow-hidden">
                            {/* Question Header Controls */}
                            <div className="bg-oku-darkgrey/5 px-8 py-4 flex justify-between items-center border-b border-oku-darkgrey/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">Question {activeStep + 1}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => duplicateQuestion(activeStep)} className="p-2 text-oku-darkgrey/40 hover:text-oku-purple-dark hover:bg-white rounded-lg transition-all" title="Duplicate">
                                        <Copy size={16} />
                                    </button>
                                    <button onClick={() => deleteQuestion(activeStep)} disabled={questions.length === 1} className="p-2 text-oku-darkgrey/40 hover:text-red-500 hover:bg-white rounded-lg transition-all disabled:opacity-30" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-12 space-y-12">
                                {/* The Question Input */}
                                <div className="flex gap-6 items-start">
                                    <div className="text-3xl font-bold text-oku-purple-dark/20 mt-1">{activeStep + 1}</div>
                                    <div className="flex-1 space-y-2">
                                        <ArrowRight size={24} className="text-oku-purple-dark mb-4" />
                                        <textarea 
                                            value={questions[activeStep].text}
                                            onChange={e => {
                                                const newQ = [...questions];
                                                newQ[activeStep].text = e.target.value;
                                                setQuestions(newQ);
                                            }}
                                            className="w-full bg-transparent border-none p-0 text-3xl md:text-5xl font-bold text-oku-darkgrey focus:ring-0 placeholder:text-oku-darkgrey/10 resize-none min-h-[120px] leading-[1.1] tracking-tighter"
                                            placeholder="Type your question here..."
                                        />
                                    </div>
                                </div>

                                {/* The Options List */}
                                <div className="ml-16 space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4">Multiple Choice Options</p>
                                    {questions[activeStep].options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-lg border-2 border-oku-darkgrey/10 flex items-center justify-center text-[10px] font-black text-oku-darkgrey/30 bg-oku-darkgrey/5">
                                                {oIdx + 1}
                                            </div>
                                            <div className="flex-1 flex items-center bg-white border border-oku-darkgrey/10 rounded-2xl px-5 py-4 focus-within:border-oku-purple focus-within:ring-4 focus-within:ring-oku-purple/5 transition-all shadow-sm group-hover:border-oku-darkgrey/20">
                                                <input 
                                                    value={opt.label}
                                                    onChange={e => {
                                                        const newQ = [...questions];
                                                        newQ[activeStep].options[oIdx].label = e.target.value;
                                                        setQuestions(newQ);
                                                    }}
                                                    className="flex-1 bg-transparent border-none p-0 text-lg font-bold text-oku-darkgrey focus:ring-0"
                                                    placeholder={`Option ${oIdx + 1}`}
                                                />
                                                <div className="flex items-center gap-4 border-l border-oku-darkgrey/10 pl-4 ml-4">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">Score Val</span>
                                                    <input 
                                                        type="number"
                                                        value={opt.value}
                                                        onChange={e => {
                                                            const newQ = [...questions];
                                                            newQ[activeStep].options[oIdx].value = parseInt(e.target.value) || 0;
                                                            setQuestions(newQ);
                                                        }}
                                                        className="w-12 text-center bg-oku-darkgrey/5 border-none rounded-lg p-2 text-sm font-bold text-oku-purple-dark focus:ring-0"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newQ = [...questions];
                                                    newQ[activeStep].options = newQ[activeStep].options.filter((_, i) => i !== oIdx);
                                                    setQuestions(newQ);
                                                }}
                                                className="p-3 text-oku-darkgrey/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={() => {
                                            const newQ = [...questions];
                                            newQ[activeStep].options.push({ label: '', value: newQ[activeStep].options.length });
                                            setQuestions(newQ);
                                        }}
                                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/60 hover:text-oku-purple-dark hover:bg-oku-purple/5 px-4 py-3 rounded-xl transition-all w-fit mt-2"
                                    >
                                        <PlusCircle size={14} /> Add Option
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
      </div>

      {/* ── AI MAGIC GENERATOR MODAL ── */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[100] bg-oku-dark/60 backdrop-blur-md flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden border border-white/20"
              >
                  <div className="relative z-10">
                      <div className="w-16 h-16 bg-oku-lavender rounded-2xl flex items-center justify-center text-oku-purple-dark mb-8 shadow-sm">
                          <Sparkles size={32} />
                      </div>
                      <h3 className="text-4xl font-display font-bold text-oku-darkgrey tracking-tighter mb-4">
                          Clinical AI <span className="italic text-oku-purple-dark">Architect.</span>
                      </h3>
                      <p className="text-sm text-oku-darkgrey/60 font-display italic mb-10 leading-relaxed">
                          Describe the assessment you want to build. Our AI will generate the questions, scoring logic, and professional titles based on clinical standards instantly.
                      </p>
                      
                      <div className="bg-oku-cream-warm/50 rounded-[2rem] border border-oku-taupe/10 p-2 mb-8 focus-within:border-oku-purple/30 focus-within:ring-4 focus-within:ring-oku-purple/5 transition-all">
                          <textarea 
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            className="w-full bg-transparent border-none p-6 text-lg font-display text-oku-darkgrey outline-none min-h-[150px] resize-none"
                            placeholder="e.g. A 5-question intake form for an adult dealing with work-related burnout and sleep issues."
                          />
                      </div>

                      <div className="flex gap-4">
                          <button 
                            onClick={generateWithAi}
                            disabled={isAiGenerating || !aiPrompt}
                            className="flex-1 bg-oku-darkgrey text-white py-6 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-oku-dark transition-all pulse-cta"
                          >
                              {isAiGenerating ? (
                                  <><Loader2 size={16} className="animate-spin" /> Architecting...</>
                              ) : (
                                  <><Sparkles size={16} /> Generate with OCI</>
                              )}
                          </button>
                          <button 
                            onClick={() => setShowAiPrompt(false)} 
                            disabled={isAiGenerating}
                            className="px-10 bg-white border border-oku-darkgrey/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-cream-warm transition-all text-oku-darkgrey"
                          >
                              Cancel
                          </button>
                      </div>
                  </div>
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[80px]" />
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PractitionerShell>
  )
}
