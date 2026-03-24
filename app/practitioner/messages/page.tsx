import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SecureChat } from '@/components/SecureChat'
import { MessageSquare, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export default async function PractitionerMessagesPage({ searchParams }: { searchParams: { c?: string } }) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [appointments, profile] = await Promise.all([
    prisma.appointment.findMany({
      where: { practitionerId: session.user.id },
      include: { client: true },
      distinct: ['clientId']
    }),
    prisma.practitionerProfile.findUnique({
      where: { userId: session.user.id },
      select: { canPostBlogs: true }
    })
  ])

  const clients = appointments.map(a => a.client)
  const activeClientId = (await searchParams).c || (clients.length > 0 ? clients[0].id : null)
  const activeClient = clients.find(c => c.id === activeClientId)

  return (
    <PractitionerShell
      title="Client Portal Messages"
      description="Manage secure, asynchronous communications with your patient roster."
      badge="Messages"
      currentPath="/practitioner/messages"
      canPostBlogs={profile?.canPostBlogs}
    >
      {clients.length === 0 ? (
        <div className="bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-xl text-center">
            <MessageSquare size={48} className="text-oku-taupe/20 mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-4">No active patients</h2>
            <p className="text-oku-taupe italic max-w-md mx-auto mb-8">Once patients book sessions with you, they will appear here for secure messaging.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">
            {/* Contacts Sidebar */}
            <div className="space-y-4">
                <div className="bg-oku-cream-warm/50 p-6 rounded-[2.5rem] border border-oku-taupe/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4 ml-2">Patient Roster</p>
                    <div className="space-y-2">
                        {clients.map(c => (
                            <Link 
                                key={c.id} 
                                href={`/practitioner/messages?c=${c.id}`}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeClientId === c.id ? 'bg-oku-dark text-white shadow-lg' : 'bg-white text-oku-dark border border-oku-taupe/10 hover:border-oku-purple'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-oku-purple/10 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-oku-purple text-xs">
                                    {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" /> : c.name?.substring(0,2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate text-sm">{c.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-oku-dark text-white p-6 rounded-[2.5rem] shadow-xl">
                    <ShieldCheck size={20} className="text-oku-purple mb-3" />
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                        All communications are E2E encrypted. Please ensure clinical boundaries are maintained during asynchronous chat.
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
                {activeClient ? (
                    <SecureChat 
                        currentUserId={session.user.id} 
                        contactId={activeClient.id} 
                        contactName={activeClient.name || 'Patient'} 
                        contactAvatar={activeClient.avatar}
                    />
                ) : (
                    <div className="h-[600px] bg-white rounded-[3rem] border border-oku-taupe/10 flex items-center justify-center shadow-sm">
                        <p className="text-oku-taupe font-display italic">Select a patient to view messages.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </PractitionerShell>
  )
}
