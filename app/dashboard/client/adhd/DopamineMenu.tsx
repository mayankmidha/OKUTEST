'use client'

import { useState } from 'react'
import { Sparkles, Plus, Trash2 } from 'lucide-react'

export function DopamineMenu() {
  const [items, setItems] = useState([
    { id: 1, title: 'Drink a glass of cold water', type: 'quick' },
    { id: 2, title: 'Stretch arms to the ceiling', type: 'quick' },
    { id: 3, title: 'Listen to one upbeat song', type: 'medium' },
  ])
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (!newItem.trim()) return
    setItems([...items, { id: Date.now(), title: newItem, type: 'quick' }])
    setNewItem('')
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="bg-oku-background rounded-2xl p-6 border border-oku-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-oku-purple" size={24} />
        <h2 className="text-xl font-display font-semibold text-oku-dark">Dopamine Menu</h2>
      </div>
      <p className="text-sm text-oku-darkgrey/70 mb-6 font-sans">
        Quick hits of dopamine to reset your brain without getting stuck scrolling.
      </p>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-oku-border/50">
            <span className="text-sm text-oku-dark font-medium">{item.title}</span>
            <button onClick={() => removeItem(item.id)} className="text-oku-darkgrey/40 hover:text-oku-error transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add a new dopamine hit..."
          className="flex-1 bg-white border border-oku-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oku-purple/20"
        />
        <button onClick={addItem} className="bg-oku-purple text-white p-2 rounded-xl hover:bg-oku-purple-dark transition-colors">
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
