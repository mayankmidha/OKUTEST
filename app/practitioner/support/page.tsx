import { Mail, Phone, MessageSquare, ShieldAlert, LifeBuoy } from 'lucide-react'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { DashboardCard } from '@/components/DashboardCard'

export default function PractitionerSupportPage() {
  return (
    <PractitionerShell
      title="Practitioner Support"
      description="Technical assistance and clinical operations support for your practice."
      badge="Help Desk"
      currentPath="/practitioner/support"
    >
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <DashboardCard title="Internal Inquiry" icon={<MessageSquare size={20} strokeWidth={1.5} />}>
              <form className="space-y-6 mt-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Category</label>
                       <select className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm appearance-none focus:outline-none focus:border-oku-purple">
                          <option>Technical Issue (App/Video)</option>
                          <option>Payout / Billing Inquiry</option>
                          <option>Patient Management</option>
                          <option>Clinical Compliance</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Urgency</label>
                       <select className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm appearance-none focus:outline-none focus:border-oku-purple">
                          <option>Standard</option>
                          <option>Urgent (Blocking active session)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Description</label>
                    <textarea rows={6} placeholder="Describe the operational support you need..." className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" />
                 </div>
                 <button type="button" className="btn-primary py-5 px-12 shadow-xl">Submit to Operations</button>
              </form>
           </DashboardCard>
        </div>

        <div className="space-y-8">
           <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-oku-purple" /> Practitioner SLA
                 </h3>
                 <p className="text-xs opacity-60 leading-relaxed italic">
                    Technical issues blocking live sessions are prioritized and typically resolved within 15 minutes during active clinic hours.
                 </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
           </div>

           <div className="bg-oku-purple/5 p-8 rounded-[2.5rem] border border-oku-purple/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-oku-purple mb-6">Operations Hub</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-oku-taupe"><Mail size={18} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Clinic Email</p>
                       <p className="text-sm font-bold text-oku-dark">ops@okutherapy.com</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-oku-taupe"><LifeBuoy size={18} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Admin Hot-line</p>
                       <p className="text-sm font-bold text-oku-dark">+91 [Internal Ops]</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PractitionerShell>
  )
}
