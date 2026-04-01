'use client'

import { useState } from 'react'
import { Brain, Save, Trash2 } from 'lucide-react'

export function BrainDump() {
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<{id: number, text: string, date: string}[]>([])

  const saveEntry = () => {
    if (!content.trim()) return
    setEntries([{ id: Date.now(), text: content, date: new Date().toLocaleString() }, ...entries])
    setContent('')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-oku-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-oku-teal" size={24} />
        <h2 className="text-xl font-display font-semibold text-oku-dark">Brain Dump</h2>
      </div>
      <p className="text-sm text-oku-darkgrey/70 mb-4 font-sans">
        Get thoughts out of your head immediately so they don't block your working memory.
      </p>

      <div className="mb-6">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="I need to remember to..."
          className="w-full h-32 bg-oku-background border border-oku-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-oku-teal/20 resize-none mb-3"
        />
        <button 
          onClick={saveEntry}
          className="w-full bg-oku-teal text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-oku-teal/90 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={16} /> Dump It
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="p-4 bg-oku-background/50 rounded-xl border border-oku-border border-dashed relative group">
            <p className="text-sm text-oku-dark mb-2 pr-6 whitespace-pre-wrap">{entry.text}</p>
            <span className="text-[10px] uppercase tracking-widest text-oku-darkgrey/50">{entry.date}</span>
            <button 
              onClick={() => deleteEntry(entry.id)}
              className="absolute top-4 right-4 text-oku-darkgrey/30 hover:text-oku-error transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
