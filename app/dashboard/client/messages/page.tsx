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
    <div className="clinic-shell">
      <div className="mb-10 sm:mb-12">
        <h1 className="heading-display text-4xl tracking-tight text-oku-darkgrey sm:text-5xl">
          Secure Messages
        </h1>
        <p className="clinic-copy mt-3">Communicate securely with your care team between sessions.</p>
      </div>

      {therapists.length === 0 ? (
        <div className="clinic-surface text-center sm:p-12">
            <MessageSquare size={48} className="text-oku-taupe/20 mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-display font-bold text-oku-dark mb-4">No active connections</h2>
            <p className="text-oku-taupe italic max-w-md mx-auto mb-8">You can securely message your therapist here once you have booked your first session.</p>
            <Link href="/dashboard/client/therapists" className="btn-primary inline-flex w-full justify-center px-8 py-4 shadow-xl sm:w-auto sm:px-10">Browse Specialists</Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
            {/* Contacts Sidebar */}
            <div className="space-y-4">
                <div className="clinic-surface bg-[#faf7f2]/90 p-4 sm:p-6">
                    <p className="clinic-kicker mb-4 ml-2">Care Team</p>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 xl:mx-0 xl:block xl:space-y-2 xl:overflow-visible xl:px-0 xl:pb-0">
                        {therapists.map(t => (
                            <Link 
                                key={t.id} 
                                href={`/dashboard/client/messages?t=${t.id}`}
                                className={`flex min-w-[220px] items-center gap-4 rounded-[1.35rem] p-4 transition-all xl:min-w-0 ${activeTherapistId === t.id ? 'border border-white/80 bg-white text-oku-darkgrey shadow-sm' : 'border border-oku-taupe/10 bg-white/72 text-oku-darkgrey/75 hover:border-white hover:bg-white'}`}
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

                <div className="clinic-surface bg-oku-purple/5 p-4 sm:p-6">
                    <ShieldCheck size={20} className="text-oku-purple mb-3" />
                    <p className="text-xs text-oku-taupe leading-relaxed">
                        This portal uses protected transport and account access controls. Do not use it for medical emergencies. In an emergency, please call your local emergency services.
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
                    <div className="clinic-surface flex min-h-[24rem] items-center justify-center sm:min-h-[37.5rem]">
                        <p className="text-oku-taupe font-display italic">Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
