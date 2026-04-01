'use client'

import { useState } from 'react'
import { Plus, Trash2, Calendar, Users, DollarSign, Loader2, Sparkles, Clock } from 'lucide-react'
import { createCircle, deleteCircle } from '../actions'
import { useRouter } from 'next/navigation'

export function CirclesManager({ practitioners, existingCircles }: { practitioners: any[], existingCircles: any[] }) {
  const [isCreating, setIsUpdating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxCapacity: 10,
    price: 1500,
    practitionerId: practitioners[0]?.id || ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      await createCircle({
        ...formData,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        description: `${formData.title}|${formData.description}`
      })
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        maxCapacity: 10,
        price: 1500,
        practitionerId: practitioners[0]?.id || ''
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this circle?')) return
    await deleteCircle(id)
    router.refresh()
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Therapeutic <span className="italic text-oku-purple-dark">Circles</span></h2>
          <p className="text-sm text-oku-darkgrey/40 mt-2 italic font-display">Manage high-impact group healing sessions.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 text-[9px]"
        >
          {showForm ? 'Close Form' : <><Plus size={14} className="mr-2" /> Schedule New Circle</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-glass-3d !p-12 !bg-white/60 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Circle Title</label>
              <input 
                required
                className="input-pastel"
                placeholder="e.g. Navigating Corporate Burnout"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Lead Practitioner</label>
              <select 
                className="input-pastel appearance-none"
                value={formData.practitionerId}
                onChange={e => setFormData({...formData, practitionerId: e.target.value})}
              >
                {practitioners.map(p => (
                  <option key={p.id} value={p.user.id}>{p.user.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Start Time</label>
              <input 
                type="datetime-local"
                required
                className="input-pastel"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">End Time</label>
              <input 
                type="datetime-local"
                required
                className="input-pastel"
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Capacity</label>
              <input 
                type="number"
                className="input-pastel"
                value={formData.maxCapacity}
                onChange={e => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Price (INR)</label>
              <input 
                type="number"
                className="input-pastel"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-2">Description</label>
            <textarea 
              className="input-pastel min-h-[100px]"
              placeholder="What will this circle focus on?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isCreating}
            className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 shadow-2xl hover:bg-oku-purple-dark transition-all"
          >
            {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />}
            Launch Circle Session
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {existingCircles.map((circle) => {
          const [title, desc] = (circle.notes || '|').split('|')
          return (
            <div key={circle.id} className="card-glass-3d !p-8 !bg-white/40 group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
                  <Users size={20} />
                </div>
                <button 
                  onClick={() => handleDelete(circle.id)}
                  className="p-2 text-oku-taupe/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-oku-darkgrey mb-2">{title || 'Untitled Circle'}</h3>
              <p className="text-xs text-oku-darkgrey/60 line-clamp-2 mb-6 italic font-display">{desc}</p>
              
              <div className="space-y-3 pt-6 border-t border-oku-darkgrey/5">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                  <div className="flex items-center gap-2"><Calendar size={12} /> {new Date(circle.startTime).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><Clock size={12} /> {new Date(circle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-oku-purple-dark">Lead: {circle.practitioner?.name?.split(' ')[0]}</span>
                  <span className="bg-oku-mint px-2 py-1 rounded-lg text-oku-darkgrey/60">{circle.participants?.length || 0} / {circle.maxParticipants} Full</span>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-oku-lavender/20 rounded-full blur-3xl group-hover:bg-oku-lavender/40 transition-all" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
