import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Calendar,
  Clock,
  ChevronLeft,
  ShieldCheck,
  Video,
  CheckCircle2,
  WifiOff,
  MessageSquare,
} from 'lucide-react'
import { JoinCircleButton } from '../JoinCircleButton'
import { AnonymousPreChat } from '@/components/AnonymousPreChat'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CircleDetailPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const { id } = await params
  const userId = session.user.id

  // Fetch appointment with all needed relations + User Profile for Alias
  const [appointment, userProfile] = await Promise.all([
    prisma.appointment.findUnique({
        where: { id },
        include: {
          practitioner: {
            select: {
              name: true,
              avatar: true,
              practitionerProfile: { select: { specialization: true } },
            },
          },
          service: { select: { name: true } },
          participants: { select: { id: true, userId: true, joinedAt: true } },
          circleWaitlist: { select: { id: true, userId: true } },
        },
    }),
    prisma.clientProfile.findUnique({
        where: { userId },
        select: { anonymousAlias: true }
    })
  ])

  if (!appointment || !appointment.isGroupSession) {
    redirect('/dashboard/client/circles')
  }

  const isMember = appointment.participants.some((p) => p.userId === userId)
  const isOnWaitlist = appointment.circleWaitlist.some((w) => w.userId === userId)
  const participantCount = appointment.participants.length
  const maxParticipants = appointment.maxParticipants || 10
  const isFull = participantCount >= maxParticipants
  const spotsLeft = maxParticipants - participantCount
  const waitlistCount = appointment.circleWaitlist.length

  // Parse title and description from notes field (stored as "title|description")
  const [notesTitle, notesDesc] = (appointment.notes || '|').split('|')
  const circleTitle = notesTitle?.trim() || appointment.service?.name || 'Community Circle'
  const circleDescription =
    notesDesc?.trim() ||
    'A facilitated group space for shared healing and collective growth.'

  const startDate = new Date(appointment.startTime)
  const endDate = new Date(appointment.endTime)
  const dayLabel = startDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const timeLabel = `${startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`

  const specializations = appointment.practitioner?.practitionerProfile?.specialization || []

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d pointer-events-none" />

      <div className="relative z-10 space-y-12">
        {/* Back nav */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/client/circles"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
          >
            <ChevronLeft size={13} /> All Circles
          </Link>
          {isMember && (
            <span className="inline-flex items-center gap-2 bg-oku-mint/40 text-oku-darkgrey px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-oku-mint/60">
              <CheckCircle2 size={12} className="text-green-600" /> You&apos;re In
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content — left 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title + meta */}
            <div className="space-y-5">
              {specializations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specializations.slice(0, 3).map((s) => (
                    <span key={s} className="chip bg-white/60 border-white/80 text-oku-darkgrey/70">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="heading-display text-5xl lg:text-7xl text-oku-darkgrey tracking-tighter">
                {circleTitle.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-oku-purple-dark italic">
                  {circleTitle.split(' ').slice(-1)}
                </span>
              </h1>

              <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 leading-relaxed">
                {circleDescription}
              </p>
            </div>

            {/* Facilitator */}
            <div className="card-glass-3d !p-8 !bg-white/60">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 mb-5">
                Facilitated by
              </p>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <img
                    src={appointment.practitioner?.avatar || '/wp-content/wp-content/wp-content/uploads/2025/07/placeholder.jpg'}
                    className="w-full h-full object-cover"
                    alt={appointment.practitioner?.name || 'Facilitator'}
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-oku-darkgrey">
                    {appointment.practitioner?.name || 'Your Facilitator'}
                  </p>
                  {specializations[0] && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark/60 mt-1">
                      {specializations[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <div className="card-glass-3d !p-8 !bg-oku-lavender/20 border-oku-purple-dark/10">
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-oku-purple-dark mt-1 flex-shrink-0" size={22} />
                <div>
                  <p className="text-sm font-bold text-oku-darkgrey mb-2">
                    Your privacy is protected
                  </p>
                  <p className="text-sm text-oku-darkgrey/60 leading-relaxed">
                    All participants appear by first name only. Sessions are not recorded.
                    What is shared in the circle stays in the circle.
                  </p>
                </div>
              </div>
            </div>

            {/* Anonymous Pre-Chat (Only for Members) */}
            {isMember && (
              <div className="pt-10">
                <div className="flex items-center gap-3 mb-8 ml-2">
                    <MessageSquare size={18} className="text-oku-purple-dark opacity-40" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark">Community Safe-Space Chat</h2>
                </div>
                <AnonymousPreChat 
                  circleId={id} 
                  userAlias={userProfile?.anonymousAlias || 'Quiet Seeker'} 
                />
              </div>
            )}
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-6">
            {/* Schedule card */}
            <div className="card-glass-3d !p-8 !bg-white/70 space-y-6">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">
                Schedule
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-oku-darkgrey">
                  <Calendar size={16} className="text-oku-purple-dark flex-shrink-0" />
                  <span className="text-sm font-semibold">{dayLabel}</span>
                </div>
                <div className="flex items-center gap-3 text-oku-darkgrey">
                  <Clock size={16} className="text-oku-purple-dark flex-shrink-0" />
                  <span className="text-sm font-semibold">{timeLabel}</span>
                </div>
              </div>

              {/* Member count */}
              <div className="pt-4 border-t border-oku-darkgrey/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-oku-darkgrey/60">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Members
                    </span>
                  </div>
                  <span className="text-sm font-bold text-oku-darkgrey">
                    {participantCount} / {maxParticipants}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-oku-darkgrey/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-oku-purple-dark rounded-full transition-all"
                    style={{ width: `${(participantCount / maxParticipants) * 100}%` }}
                  />
                </div>
                {!isFull && !isMember && (
                  <p className="text-[9px] text-oku-darkgrey/40 mt-2 uppercase tracking-widest font-black">
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                  </p>
                )}
                {waitlistCount > 0 && isFull && (
                  <p className="text-[9px] text-oku-darkgrey/40 mt-2 uppercase tracking-widest font-black">
                    {waitlistCount} on waitlist
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-oku-darkgrey/5 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                  Session fee
                </span>
                <span className="text-2xl font-bold text-oku-darkgrey">
                  ₹{appointment.priceSnapshot || 1500}
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div className="card-glass-3d !p-8 !bg-white/60 space-y-4">
              {isMember ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <p className="text-sm font-bold text-oku-darkgrey">You&apos;re a member</p>
                  </div>
                  <Link
                    href={`/dashboard/client/circles/${id}/session`}
                    className="btn-pill-3d w-full !py-5 bg-oku-purple-dark text-white border-oku-purple-dark text-center flex items-center justify-center gap-3"
                  >
                    <Video size={16} /> Join Live Session
                  </Link>
                </>
              ) : isFull ? (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <WifiOff size={18} className="text-oku-darkgrey/40" />
                    <p className="text-sm font-bold text-oku-darkgrey">Circle is full</p>
                  </div>
                  {isOnWaitlist ? (
                    <div className="btn-pill-3d w-full !py-5 bg-white border-oku-darkgrey/20 text-oku-darkgrey/50 text-center pointer-events-none text-xs font-black uppercase tracking-widest">
                      On Waitlist
                    </div>
                  ) : (
                    <JoinCircleButton circleId={id} isFull={true} />
                  )}
                </>
              ) : (
                <JoinCircleButton circleId={id} isFull={false} />
              )}

              <p className="text-[9px] text-oku-darkgrey/40 text-center uppercase tracking-widest font-black pt-2">
                Secure · Anonymised · Not recorded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
