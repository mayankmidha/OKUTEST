import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SecureChat } from '@/components/SecureChat'
import { MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function ClientMessagesPage({ searchParams }: { searchParams: { t?: string } }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Find all practitioners the client has had appointments with
  const appointments = await prisma.appointment.findMany({
    where: { clientId: session.user.id },
    include: { practitioner: true },
    distinct: ['practitionerId']
  })

  const therapists = appointments.map(a => a.practitioner)
  const activeTherapistId = searchParams.t || (therapists.length > 0 ? therapists[0].id : null)
  const activeTherapist = therapists.find(t => t.id === activeTherapistId)

  return (
    <div className="py-12 px-10">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
          Secure Messages
        </h1>
        <p className="text-oku-taupe mt-2 font-display italic">Communicate securely with your care team between sessions.</p>
      </div>

      {therapists.length === 0 ? (
        <div className="bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-xl text-center">
            <MessageSquare size={48} className="text-oku-taupe/20 mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-4">No active connections</h2>
            <p className="text-oku-taupe italic max-w-md mx-auto mb-8">You can securely message your therapist here once you have booked your first session.</p>
            <Link href="/dashboard/client/therapists" className="btn-primary py-4 px-10 shadow-xl inline-block">Browse Specialists</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">
            {/* Contacts Sidebar */}
            <div className="space-y-4">
                <div className="bg-oku-cream-warm/50 p-6 rounded-[2.5rem] border border-oku-taupe/5">
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4 ml-2">Care Team</p>
                    <div className="space-y-2">
                        {therapists.map(t => (
                            <Link 
                                key={t.id} 
                                href={`/dashboard/client/messages?t=${t.id}`}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTherapistId === t.id ? 'bg-oku-dark text-white shadow-lg' : 'bg-white text-oku-dark border border-oku-taupe/10 hover:border-oku-purple'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-oku-purple/20 overflow-hidden flex-shrink-0">
                                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🧘</div>}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate text-sm">{t.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-oku-purple/5 p-6 rounded-[2.5rem] border border-oku-purple/10">
                    <ShieldCheck size={20} className="text-oku-purple mb-3" />
                    <p className="text-xs text-oku-taupe leading-relaxed">
                        This portal is encrypted. Do not use this for medical emergencies. In an emergency, please call your local emergency services.
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
                {activeTherapist ? (
                    <SecureChat 
                        currentUserId={session.user.id} 
                        contactId={activeTherapist.id} 
                        contactName={activeTherapist.name || 'Therapist'} 
                        contactAvatar={activeTherapist.avatar}
                    />
                ) : (
                    <div className="h-[600px] bg-white rounded-[3rem] border border-oku-taupe/10 flex items-center justify-center shadow-sm">
                        <p className="text-oku-taupe font-display italic">Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
