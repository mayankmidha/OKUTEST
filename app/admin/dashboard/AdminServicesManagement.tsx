'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Save, Loader2, DollarSign, Clock } from 'lucide-react'
import { createService, updateServiceDefinition, deleteServiceDefinition } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export function AdminServicesManagement({ services }: { services: any[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', duration: 60, price: 1500, description: '', isActive: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createService(formData)
      setIsCreating(false)
      setFormData({ name: '', duration: 60, price: 1500, description: '', isActive: true })
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (id: string, e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateServiceDefinition(id, formData)
      setEditingId(null)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service? If it is linked to past appointments, it will be archived instead.')) return
    setIsSubmitting(true)
    try {
      const res = await deleteServiceDefinition(id)
      if (res.mode === 'archived') {
        alert('Service was linked to existing appointments. It has been archived (set to inactive) instead of deleted.')
      }
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (service: any) => {
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description || '',
      isActive: service.isActive
    })
    setEditingId(service.id)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h3 className="heading-display text-4xl text-oku-darkgrey">Clinical <span className="italic text-oku-purple-dark">Offerings</span></h3>
            <p className="text-oku-darkgrey/40 text-sm font-display italic">Manage the types of care provided on the platform.</p>
         </div>
         <button 
           onClick={() => setIsCreating(!isCreating)}
           className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 text-[10px]"
         >
           {isCreating ? 'Cancel' : <><Plus size={14} className="mr-2" /> Add Service</>}
         </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="card-glass-3d !p-10 !bg-white/60 space-y-6 animate-in fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <input required placeholder="Service Name (e.g. EMDR Therapy)" className="input-pastel" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="number" placeholder="Duration (minutes)" className="input-pastel" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} />
            <input required type="number" placeholder="Base Price (INR)" className="input-pastel" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
            <input placeholder="Description" className="input-pastel" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button disabled={isSubmitting} type="submit" className="btn-pill-3d bg-oku-purple-dark text-white w-full !py-4">
            {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />} Save Service
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(s => (
          <div key={s.id} className="card-glass-3d !p-8 !bg-white/40 group">
            {editingId === s.id ? (
              <form onSubmit={(e) => handleUpdate(s.id, e)} className="space-y-4">
                <input required className="input-pastel !p-3 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="flex gap-4">
                  <input required type="number" className="input-pastel !p-3 text-sm" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} />
                  <input required type="number" className="input-pastel !p-3 text-sm" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-oku-darkgrey">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  Active Status
                </label>
                <div className="flex gap-2">
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-oku-mint text-oku-darkgrey font-bold py-2 rounded-xl">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white border border-oku-taupe/20 text-oku-taupe font-bold py-2 rounded-xl">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="font-bold text-xl text-oku-darkgrey">{s.name}</h4>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(s)} className="text-oku-purple-dark p-2 hover:bg-oku-purple/10 rounded-full"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><Trash2 size={14}/></button>
                  </div>
                </div>
                <p className="text-xs text-oku-taupe italic font-display mb-6 line-clamp-2 min-h-[40px]">{s.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe">
                      <Clock size={12} /> {s.duration} MIN
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">
                      <DollarSign size={12} /> ₹{s.price}
                   </div>
                </div>
                <div className={`mt-4 w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.isActive ? 'bg-oku-mint text-oku-darkgrey' : 'bg-oku-peach text-oku-taupe'}`}>
                  {s.isActive ? 'Active' : 'Archived'}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
