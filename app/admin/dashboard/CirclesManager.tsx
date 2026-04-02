'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, Users, DollarSign, Loader2, Sparkles, Clock, X, UserPlus, Edit2 } from 'lucide-react'
import { createCircle, deleteCircle, addParticipantToCircle, removeParticipantFromCircle } from '../actions'
import { 
  createCircleByPractitioner, 
  deleteCircleByPractitioner, 
  addParticipantToCircleByPractitioner, 
  removeParticipantFromCircleByPractitioner 
} from '@/app/practitioner/actions'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function CirclesManager({ practitioners, existingCircles, allClients }: { practitioners: any[], existingCircles: any[], allClients: any[] }) {
  const { data: session } = useSession()
  const role = session?.user?.role
  const isPractitioner = role === 'THERAPIST'

  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedClientToAdd, setSelectedClientToAdd] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxCapacity: 10,
    price: 1500,
    practitionerId: isPractitioner ? session?.user?.id : (practitioners[0]?.id || '')
  })
  const router = useRouter()

  useEffect(() => {
    if (isPractitioner && session?.user?.id) {
      setFormData(prev => ({ ...prev, practitionerId: session.user.id }))
    } else if (!isPractitioner && practitioners.length > 0 && !formData.practitionerId) {
      setFormData(prev => ({ ...prev, practitionerId: practitioners[0].id }))
    }
  }, [isPractitioner, session?.user?.id, practitioners])

  const handleAddParticipant = async (circleId: string) => {
    if (!selectedClientToAdd) return
    setIsUpdating(`add-${circleId}`)
    try {
      if (isPractitioner) {
        await addParticipantToCircleByPractitioner(circleId, selectedClientToAdd)
      } else {
        await addParticipantToCircle(circleId, selectedClientToAdd)
      }
      setSelectedClientToAdd('')
    } catch (err: any) {
      alert(err.message || 'Failed to add participant')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveParticipant = async (participantId: string) => {
    if (!confirm('Remove seeker from this circle?')) return
    setIsUpdating(`remove-${participantId}`)
    try {
      if (isPractitioner) {
        await removeParticipantFromCircleByPractitioner(participantId)
      } else {
        await removeParticipantFromCircle(participantId)
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove participant')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setIsUpdating('form')
    try {
      if (isPractitioner) {
        await createCircleByPractitioner({
          ...formData,
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime)
        })
      } else {
        await createCircle({
          ...formData,
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime),
          description: `${formData.title}|${formData.description}`
        })
      }
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        maxCapacity: 10,
        price: 1500,
        practitionerId: isPractitioner ? session?.user?.id : (practitioners[0]?.id || '')
      })
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to create circle')
    } finally {
      setIsCreating(false)
      setIsUpdating(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this circle?')) return
    try {
      if (isPractitioner) {
        await deleteCircleByPractitioner(id)
      } else {
        await deleteCircle(id)
      }
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete circle')
    }
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
              {isPractitioner ? (
                <div className="input-pastel bg-white/40 flex items-center">
                  <span className="text-xs font-bold text-oku-darkgrey">{session?.user?.name}</span>
                  <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-oku-purple-dark">You</span>
                </div>
              ) : (
                <select 
                  className="input-pastel appearance-none"
                  value={formData.practitionerId}
                  onChange={e => setFormData({...formData, practitionerId: e.target.value})}
                >
                  {practitioners.map(p => (
                    <option key={p.id} value={p.user.id}>{p.user.name}</option>
                  ))}
                </select>
              )}
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
              
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                  <div className="flex items-center gap-2"><Calendar size={12} /> {new Date(circle.startTime).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><Clock size={12} /> {new Date(circle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                {/* Participant Management */}
                <div className="pt-6 border-t border-oku-darkgrey/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4 flex justify-between">
                        Roster ({circle.participants?.length || 0} / {circle.maxParticipants})
                    </p>
                    <div className="space-y-2 mb-6">
                        {(circle.participants || []).map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between bg-white/40 p-2 rounded-xl border border-white/60">
                                <span className="text-[10px] font-bold truncate max-w-[120px]">{p.user?.name || 'Unknown'}</span>
                                <button 
                                    onClick={() => handleRemoveParticipant(p.id)}
                                    disabled={isUpdating === `remove-${p.id}`}
                                    className="text-oku-taupe/40 hover:text-red-500 transition-colors"
                                >
                                    {isUpdating === `remove-${p.id}` ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                            value={selectedClientToAdd}
                            onChange={(e) => setSelectedClientToAdd(e.target.value)}
                            className="flex-1 bg-white/60 border border-white rounded-lg text-[9px] px-2 outline-none"
                        >
                            <option value="">Add Seeker...</option>
                            {allClients.filter(c => !circle.participants.some((p:any) => p.userId === c.id)).map((c:any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => handleAddParticipant(circle.id)}
                            disabled={!selectedClientToAdd || isUpdating === `add-${circle.id}`}
                            className="bg-oku-darkgrey text-white p-2 rounded-lg hover:bg-oku-purple-dark transition-all disabled:opacity-20"
                        >
                            {isUpdating === `add-${circle.id}` ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest pt-4 mt-auto">
                  <span className="text-oku-purple-dark">Lead: {circle.practitioner?.name?.split(' ')[0]}</span>
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
