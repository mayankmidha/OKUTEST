'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Save, ArrowLeft, 
  Settings, Layout, PlusCircle, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
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

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: [...questions[0].options]
    }])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q))
  }

  const handleSave = async () => {
    if (!title || questions.some(q => !q.text)) {
      alert('Please provide a title and text for all questions.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/practitioner/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions })
      })

      if (response.ok) {
        router.push('/practitioner/assessments')
      } else {
        throw new Error('Failed to save assessment')
      }
    } catch (error) {
      console.error(error)
      alert('Error saving assessment')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PractitionerShell
      title="Build Assessment"
      description="Create custom clinical screenings for your patients."
      badge="Architect"
      currentPath="/practitioner/assessments"
      canPostBlogs={canPostBlogs}
      heroActions={
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary py-4 px-10 flex items-center gap-3 shadow-xl disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? 'Architecting...' : 'Deploy Assessment'}
        </button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2 block">Assessment Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Post-Session Reflection"
                    className="w-full bg-oku-cream-warm/30 border-none rounded-2xl p-4 text-lg font-bold placeholder:opacity-30 focus:ring-2 focus:ring-oku-purple/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2 block">Clinical Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Purpose and instructions for the patient..."
                    className="w-full bg-oku-cream-warm/30 border-none rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-oku-purple/20 transition-all"
                  />
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark ml-4">Screening Items</h3>
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm group relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-10 h-10 rounded-xl bg-oku-purple/10 text-oku-purple flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <button 
                      onClick={() => removeQuestion(q.id)}
                      className="p-2 text-oku-taupe hover:text-oku-danger transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input 
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    placeholder="Enter your clinical question here..."
                    className="w-full bg-transparent border-none p-0 text-xl font-display font-bold placeholder:opacity-20 focus:ring-0 mb-6 text-oku-dark"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {q.options.map((opt) => (
                      <div key={opt.value} className="bg-oku-cream-warm/20 p-4 rounded-2xl border border-oku-taupe/5 text-center">
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">{opt.label}</p>
                        <p className="font-bold text-oku-dark">{opt.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <button 
              onClick={addQuestion}
              className="w-full py-8 border-2 border-dashed border-oku-taupe/20 rounded-[2.5rem] flex items-center justify-center gap-3 text-oku-taupe hover:text-oku-purple hover:border-oku-purple/40 hover:bg-oku-purple/5 transition-all group"
            >
              <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Add Clinical Item</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings size={16} className="text-oku-purple" /> Architecture
             </h3>
             <div className="space-y-4 text-xs opacity-70 leading-relaxed italic">
                <p>• Questions use a standard 0-3 clinical scale.</p>
                <p>• Assessments are instantly available to all assigned patients.</p>
                <p>• Scoring is aggregated for longitudinal tracking.</p>
             </div>
          </div>
          
          <div className="bg-oku-purple/5 p-8 rounded-[2.5rem] border border-oku-purple/10">
             <h3 className="text-sm font-black uppercase tracking-widest text-oku-purple mb-4">Preview Mode</h3>
             <div className="p-6 bg-white rounded-3xl shadow-sm border border-oku-taupe/5">
                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Patient View</p>
                <p className="font-bold text-oku-dark leading-tight">{title || 'Assessment Title'}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-oku-purple">
                  <span>Start Screening</span>
                  <ChevronRight size={14} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </PractitionerShell>
  )
}
