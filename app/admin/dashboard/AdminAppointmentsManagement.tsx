'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Briefcase, Plus, Trash2, Edit2, Loader2, Save, X, CheckCircle2, AlertTriangle, Search } from 'lucide-react'
import { createManualAppointment, updateAppointmentStatus, deleteAppointment } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

export function AdminAppointmentsManagement({ appointments, therapists, clients, services }: { 
  appointments: any[], 
  therapists: any[],
  clients: any[],
  services: any[]
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    clientId: '',
    practitionerId: '',
    serviceId: services[0]?.id || '',
    startTime: '',
    endTime: '',
    status: 'SCHEDULED'
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting('create')
    try {
      await createManualAppointment({
        ...formData,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        status: formData.status as any
      })
      setIsCreating(false)
      setFormData({
        clientId: '',
        practitionerId: '',
        serviceId: services[0]?.id || '',
        startTime: '',
        endTime: '',
        status: 'SCHEDULED'
      })
      router.refresh()
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    setIsSubmitting(id)
    try {
      await updateAppointmentStatus(id, status as any)
      router.refresh()
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this appointment record?')) return
    setIsSubmitting(id)
    try {
      await deleteAppointment(id)
      router.refresh()
    } finally {
      setIsSubmitting(null)
    }
  }

  const filtered = appointments.filter(a => 
    a.client?.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.practitioner?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
         <div>
            <h3 className="heading-display text-4xl text-oku-darkgrey">Global <span className="italic text-oku-purple-dark">Ledger</span></h3>
            <p className="text-oku-darkgrey/40 text-sm font-display italic">Oversee every clinical window in the system.</p>
         </div>
         <button 
           onClick={() => setIsCreating(!isCreating)}
           className="btn-pill-3d bg-oku-darkgrey text-white !py-3 !px-8 text-[10px]"
         >
           {isCreating ? 'Cancel' : <><Plus size={14} className="mr-2" /> Manual Booking</>}
         </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="card-glass-3d !p-12 !bg-white/60 space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Patient</label>
                 <select required className="input-pastel appearance-none" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                    <option value="">Select Seeker...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Therapist</label>
                 <select required className="input-pastel appearance-none" value={formData.practitionerId} onChange={e => setFormData({...formData, practitionerId: e.target.value})}>
                    <option value="">Select Practitioner...</option>
                    {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Service</label>
                 <select required className="input-pastel appearance-none" value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})}>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration}m)</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Start Time</label>
                 <input type="datetime-local" required className="input-pastel" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">End Time</label>
                 <input type="datetime-local" required className="input-pastel" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Initial Status</label>
                 <select className="input-pastel appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending Payment</option>
                 </select>
              </div>
           </div>
           <button disabled={isSubmitting === 'create'} type="submit" className="btn-pill-3d bg-oku-purple-dark text-white w-full !py-5 shadow-2xl">
              {isSubmitting === 'create' ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />} Establish Appointment
           </button>
        </form>
      )}

      <div className="card-glass-3d !p-0 !bg-white/40 overflow-hidden shadow-xl border-none">
         <div className="p-10 border-b border-white/60 flex justify-between items-center bg-white/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/40">Active Records</h4>
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-darkgrey/20 group-focus-within:text-oku-purple-dark transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search ledger..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="pl-12 pr-6 py-3 bg-white/60 border border-white rounded-full text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-oku-lavender/50 w-64 transition-all"
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[9px] font-black uppercase tracking-widest text-oku-taupe border-b border-white/60">
                     <th className="p-8">Session Context</th>
                     <th className="p-8">Timeline</th>
                     <th className="p-8">Governance</th>
                     <th className="p-8 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/40">
                  {filtered.map(a => (
                     <tr key={a.id} className="hover:bg-white/40 transition-all duration-500 group">
                        <td className="p-8">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-oku-darkgrey">{a.service?.name || 'Care Session'}</span>
                              <div className="flex items-center gap-2 mt-2">
                                 <span className="text-[10px] text-oku-taupe font-display italic">Seeker: {a.client?.name || 'Anonymous'}</span>
                                 <span className="w-1 h-1 rounded-full bg-oku-taupe/20" />
                                 <span className="text-[10px] text-oku-purple-dark font-black uppercase tracking-widest">Facilitator: {a.practitioner?.name?.split(' ')[0]}</span>
                              </div>
                           </div>
                        </td>
                        <td className="p-8">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[10px] font-black text-oku-darkgrey">
                                 <Calendar size={12} className="opacity-40" /> {new Date(a.startTime).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-oku-taupe">
                                 <Clock size={12} className="opacity-40" /> {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </div>
                        </td>
                        <td className="p-8">
                           <select 
                             value={a.status}
                             disabled={isSubmitting === a.id}
                             onChange={(e) => handleStatusChange(a.id, e.target.value)}
                             className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none border transition-all ${
                               a.status === 'CONFIRMED' ? 'bg-oku-mint border-oku-mint text-emerald-700' :
                               a.status === 'CANCELLED' ? 'bg-oku-peach border-oku-peach text-rose-700' :
                               'bg-oku-lavender border-oku-lavender text-oku-purple-dark'
                             }`}
                           >
                              <option value="SCHEDULED">Scheduled</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="PENDING">Pending</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                           </select>
                        </td>
                        <td className="p-8 text-right">
                           <button 
                             onClick={() => handleDelete(a.id)}
                             disabled={isSubmitting === a.id}
                             className="p-3 text-oku-darkgrey/10 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                           >
                              {isSubmitting === a.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
