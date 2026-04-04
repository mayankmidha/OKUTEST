import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SecureChat } from '@/components/SecureChat'
import { MessageSquare, ShieldCheck } from 'lucide-react'
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
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:py-12">
      <div className="mb-10 sm:mb-12">
        <h1 className="text-3xl font-display font-bold tracking-tighter text-oku-dark sm:text-4xl lg:text-5xl">
          Secure Messages
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-display italic text-oku-taupe sm:text-base lg:text-lg">Communicate securely with your care team between sessions.</p>
      </div>

      {therapists.length === 0 ? (
        <div className="rounded-[2rem] border border-oku-taupe/10 bg-white p-8 text-center shadow-xl sm:rounded-[3rem] sm:p-12">
            <MessageSquare size={48} className="text-oku-taupe/20 mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-4">No active connections</h2>
            <p className="text-oku-taupe italic max-w-md mx-auto mb-8">You can securely message your therapist here once you have booked your first session.</p>
            <Link href="/dashboard/client/therapists" className="btn-primary inline-flex w-full justify-center px-8 py-4 shadow-xl sm:w-auto sm:px-10">Browse Specialists</Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
            {/* Contacts Sidebar */}
            <div className="space-y-4">
                <div className="rounded-[2rem] border border-oku-taupe/5 bg-oku-cream-warm/50 p-4 sm:p-6 sm:rounded-[2.5rem]">
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-4 ml-2">Care Team</p>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 xl:mx-0 xl:block xl:space-y-2 xl:overflow-visible xl:px-0 xl:pb-0">
                        {therapists.map(t => (
                            <Link 
                                key={t.id} 
                                href={`/dashboard/client/messages?t=${t.id}`}
                                className={`flex min-w-[220px] items-center gap-4 rounded-2xl p-4 transition-all xl:min-w-0 ${activeTherapistId === t.id ? 'bg-oku-dark text-white shadow-lg' : 'border border-oku-taupe/10 bg-white text-oku-dark hover:border-oku-purple'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-oku-purple/20 overflow-hidden flex-shrink-0">
                                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" alt={t.name || 'Therapist'} /> : <div className="w-full h-full flex items-center justify-center">🧘</div>}
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                    <p className="font-bold truncate text-sm">{t.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-oku-purple/10 bg-oku-purple/5 p-4 sm:rounded-[2.5rem] sm:p-6">
                    <ShieldCheck size={20} className="text-oku-purple mb-3" />
                    <p className="text-xs text-oku-taupe leading-relaxed">
                        This portal is encrypted. Do not use this for medical emergencies. In an emergency, please call your local emergency services.
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="min-w-0">
                {activeTherapist ? (
                    <SecureChat 
                        currentUserId={session.user.id} 
                        contactId={activeTherapist.id} 
                        contactName={activeTherapist.name || 'Therapist'} 
                        contactAvatar={activeTherapist.avatar}
                    />
                ) : (
                    <div className="flex min-h-[24rem] items-center justify-center rounded-[2rem] border border-oku-taupe/10 bg-white shadow-sm sm:rounded-[3rem] sm:min-h-[37.5rem]">
                        <p className="text-oku-taupe font-display italic">Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
