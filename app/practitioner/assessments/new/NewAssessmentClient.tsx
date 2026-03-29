'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Trash2, 
    Save, 
    Settings, 
    PlusCircle, 
    ChevronRight, 
    Sparkles, 
    Eye, 
    Layout, 
    MousePointer2,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    DollarSign
} from 'lucide-react'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

interface Question {
  id: string
  text: string
  options: { label: string; value: number }[]
}

export default function NewAssessmentClient({ canPostBlogs = false }: { canPostBlogs?: boolean }) {
  const router = useRouter()
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
  
  const [isSaving, setIsSaving] = useState(false)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [showAiModal, setShowAiPrompt] = useState(false)

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: [...questions[0].options]
    }])
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
    } catch (e) {
        alert("Clinical AI had a neural disruption. Please try again.")
    } finally {
        setIsAiGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!title || questions.some(q => !q.text)) {
      alert('Provide title and questions.')
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
      title="Clinical Architect"
      description="Design Typeform-style clinical screenings."
      badge="OCI v4.0"
      currentPath="/practitioner/assessments"
      canPostBlogs={canPostBlogs}
    >
      <div className="max-w-6xl mx-auto py-10 space-y-12">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-premium">
            <div className="flex gap-4">
                <button 
                    onClick={() => setShowAiPrompt(true)}
                    className="flex items-center gap-3 bg-oku-dark text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-oku-purple-dark transition-all shadow-xl"
                >
                    <Sparkles size={16} /> Magic AI Builder
                </button>
            </div>
            <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-3 bg-oku-lavender text-oku-purple-dark px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-oku-purple-dark hover:text-white transition-all border border-oku-lavender-dark/20"
            >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Deploy to Patients
            </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left: Builder */}
            <div className="lg:col-span-8 space-y-10">
                <section className="card-pebble space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-2">Assessment Title</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="input-pebble text-3xl font-bold border-none bg-transparent focus:bg-oku-cream-warm/30" 
                            placeholder="e.g. Weekly Mindfulness Audit"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe ml-2">Patient Context</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="input-pebble min-h-[100px] border-none bg-transparent focus:bg-oku-cream-warm/30" 
                            placeholder="Explain the clinical purpose of this screening..."
                        />
                    </div>
                </section>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-dark ml-6 mb-4 flex items-center gap-3">
                        <Layout size={14} className="text-oku-purple" /> Questionnaire Architecture
                    </h3>
                    <AnimatePresence>
                        {questions.map((q, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/80 backdrop-blur-sm p-10 rounded-[3.5rem] border border-white shadow-premium group relative"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-[10px] font-black text-oku-purple bg-oku-purple/10 px-4 py-2 rounded-full uppercase tracking-widest">Item {idx+1}</span>
                                    <button onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} className="text-oku-taupe hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <input 
                                    value={q.text}
                                    onChange={e => {
                                        const newQ = [...questions];
                                        newQ[idx].text = e.target.value;
                                        setQuestions(newQ);
                                    }}
                                    className="w-full bg-transparent border-none p-0 text-xl font-display font-bold text-oku-dark focus:ring-0 placeholder:opacity-20 mb-8"
                                    placeholder="Ask your clinical question here..."
                                />
                                <div className="grid grid-cols-4 gap-4">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="bg-oku-cream-warm/20 p-4 rounded-2xl border border-oku-taupe/5 text-center">
                                            <p className="text-[9px] font-black text-oku-taupe uppercase mb-1">{opt.label}</p>
                                            <p className="font-bold text-oku-dark">{opt.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <button 
                        onClick={addQuestion}
                        className="w-full py-10 border-2 border-dashed border-oku-purple/20 rounded-[3.5rem] text-oku-purple flex flex-col items-center justify-center gap-2 hover:bg-oku-purple/5 transition-all group"
                    >
                        <PlusCircle size={24} className="group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Step</span>
                    </button>
                </div>
            </div>

            {/* Right: Settings & Preview */}
            <div className="lg:col-span-4 space-y-8">
                <section className="bg-oku-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <DollarSign className="text-oku-lavender" />
                            <h3 className="font-bold uppercase tracking-widest text-[10px]">Session Economics</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] uppercase tracking-widest text-white/40 font-black">Assessment Fee (INR)</label>
                            <input 
                                type="number" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-2xl font-bold text-white outline-none focus:border-oku-purple" 
                            />
                            <p className="text-[9px] text-white/30 italic">Collected automatically from patients upon clinical submission.</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </section>

                <section className="bg-oku-purple/5 p-10 rounded-[3rem] border border-oku-purple/10">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-6 flex items-center gap-2">
                        <Eye size={14} /> Patient Preview
                    </h3>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-oku-lavender flex items-center justify-center text-[10px] font-black">OCI</div>
                            <span className="text-[8px] font-black uppercase bg-oku-matcha text-oku-matcha-dark px-2 py-1 rounded-md">Validated</span>
                        </div>
                        <div>
                            <p className="font-bold text-oku-dark">{title || "New Screening"}</p>
                            <p className="text-[10px] text-oku-taupe mt-1 line-clamp-2">{description || "Clinical summary placeholder..."}</p>
                        </div>
                        <div className="pt-4 border-t border-oku-taupe/5 flex justify-between items-center">
                            <span className="text-sm font-bold text-oku-purple">Free</span>
                            <button className="p-3 bg-oku-dark text-white rounded-xl"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
          <div className="fixed inset-0 z-50 bg-oku-dark/60 backdrop-blur-md flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[4rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              >
                  <h3 className="text-3xl font-display font-bold text-oku-dark tracking-tighter mb-4 flex items-center gap-3">
                      <Sparkles className="text-oku-purple" /> Clinical AI Architect
                  </h3>
                  <p className="text-sm text-oku-taupe mb-8 leading-relaxed">
                      Describe the assessment you want to build. Our AI will generate the questions, scoring logic, and professional titles based on clinical standards.
                  </p>
                  <textarea 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full bg-oku-cream-warm/50 border border-oku-taupe/10 rounded-[2rem] p-8 text-lg outline-none focus:border-oku-purple min-h-[150px] mb-8"
                    placeholder="e.g. A 5-question intake form for an adult dealing with work-related burnout and sleep issues."
                  />
                  <div className="flex gap-4">
                      <button 
                        onClick={generateWithAi}
                        disabled={isAiGenerating || !aiPrompt}
                        className="flex-1 bg-oku-dark text-white py-6 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                          {isAiGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
                          Architect with OCI
                      </button>
                      <button onClick={() => setShowAiPrompt(false)} className="px-10 border border-oku-taupe/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-cream-warm">Cancel</button>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/5 rounded-full blur-3xl" />
              </motion.div>
          </div>
      )}
    </PractitionerShell>
  )
}
