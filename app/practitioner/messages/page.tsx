import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SecureChat } from '@/components/SecureChat'
import { MessageSquare, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'

export const dynamic = 'force-dynamic'

export default async function PractitionerMessagesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
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

  const clients = appointments.map(a => a.client).filter(Boolean) as any[]
  const { c: cParam } = await searchParams
  const activeClientId = cParam || (clients.length > 0 ? clients[0].id : null)
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
        <div className="rounded-[2rem] border border-oku-taupe/10 bg-white p-8 text-center shadow-xl sm:rounded-[3rem] sm:p-12">
            <MessageSquare size={48} className="text-oku-taupe/20 mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-4">No active patients</h2>
            <p className="text-oku-taupe italic max-w-md mx-auto mb-8">Once patients book sessions with you, they will appear here for secure messaging.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
            {/* Contacts Sidebar */}
            <div className="space-y-4">
                <div className="custom-scrollbar rounded-[2rem] border border-oku-taupe/5 bg-oku-cream-warm/50 p-4 sm:max-h-[500px] sm:overflow-y-auto sm:p-6 sm:rounded-[2.5rem]">
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4 ml-2">Patient Roster</p>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:block sm:space-y-2 sm:overflow-visible sm:px-0 sm:pb-0">
                        {clients.map(c => (
                            <Link 
                                key={c.id} 
                                href={`/practitioner/messages?c=${c.id}`}
                                className={`flex min-w-[220px] items-center gap-4 rounded-2xl p-4 transition-all sm:min-w-0 ${activeClientId === c.id ? 'bg-oku-dark text-white shadow-lg' : 'border border-oku-taupe/10 bg-white text-oku-dark hover:border-oku-purple'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-oku-purple/10 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-oku-purple text-xs">
                                    {c.avatar ? <img src={c.avatar} alt={c.name || 'Patient avatar'} className="w-full h-full object-cover" /> : c.name?.substring(0,2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate text-sm">{c.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] bg-oku-dark p-4 text-white shadow-xl sm:rounded-[2.5rem] sm:p-6">
                    <ShieldCheck size={20} className="text-oku-purple mb-3" />
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                        Messages are protected in transit and stored with platform access controls. Please maintain clinical boundaries during asynchronous chat.
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
                    <div className="flex min-h-[24rem] items-center justify-center rounded-[2rem] border border-oku-taupe/10 bg-white shadow-sm sm:rounded-[3rem] sm:min-h-[37.5rem]">
                        <p className="text-oku-taupe font-display italic">Select a patient to view messages.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </PractitionerShell>
  )
}
