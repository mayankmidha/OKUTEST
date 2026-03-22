import { Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'

export default function ClientSupportPage() {
  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Help Desk" 
        description="Our clinical operations team is standing by to assist you."
      />

      <div className="grid lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2 space-y-8">
           <DashboardCard title="Submit a Request" icon={<MessageSquare size={20} strokeWidth={1.5} />}>
              <form className="space-y-6 mt-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Subject</label>
                       <select className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm appearance-none focus:outline-none focus:border-oku-purple">
                          <option>Booking Issue</option>
                          <option>Technical Problem</option>
                          <option>Billing Question</option>
                          <option>Clinical Feedback</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Priority</label>
                       <select className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm appearance-none focus:outline-none focus:border-oku-purple">
                          <option>Normal</option>
                          <option>High (Session scheduled today)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Message</label>
                    <textarea rows={6} placeholder="How can we help you unfold today?" className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" />
                 </div>
                 <button type="button" className="btn-primary py-5 px-12 shadow-xl">Send Secure Message</button>
              </form>
           </DashboardCard>
        </div>

        <div className="space-y-8">
           <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-oku-purple" /> Security Note
                 </h3>
                 <p className="text-xs opacity-60 leading-relaxed italic">
                    Support messages are encrypted. However, for medical emergencies, please do not wait for a reply. Call your local emergency services immediately.
                 </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
           </div>

           <div className="bg-oku-purple/5 p-8 rounded-[2.5rem] border border-oku-purple/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-oku-purple mb-6">Direct Channels</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-oku-taupe"><Mail size={18} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Email</p>
                       <p className="text-sm font-bold text-oku-dark">care@okutherapy.com</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-oku-taupe"><Phone size={18} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Operations</p>
                       <p className="text-sm font-bold text-oku-dark">+91 [Platform Contact]</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
