import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Calendar, Clock, Sparkles, Wind, ChevronLeft } from 'lucide-react'
import { JoinCircleButton } from './JoinCircleButton'

export const dynamic = 'force-dynamic'

export default async function ClientCirclesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  // Fetch all upcoming confirmed group sessions
  const circles = await prisma.appointment.findMany({
    where: {
      isGroupSession: true,
      status: 'CONFIRMED',
      startTime: { gte: new Date() },
    },
    include: {
      practitioner: {
        select: {
          name: true,
          avatar: true,
          practitionerProfile: { select: { specialization: true } },
        },
      },
      participants: {
        select: { id: true, userId: true },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  // Separate joined vs available
  const joinedCircleIds = new Set(
    circles
      .filter((c) => c.participants.some((p) => p.userId === userId))
      .map((c) => c.id)
  )

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Community Healing</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Your <span className="text-oku-purple-dark italic">Circles.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Safe, facilitated group spaces for shared healing.
            </p>
          </div>

          <Link href="/circles" className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-10 self-start lg:self-auto">
            <Sparkles size={16} className="mr-3 text-oku-purple-dark" /> Browse All Circles
          </Link>
        </div>

        {/* Joined circles section */}
        {joinedCircleIds.size > 0 && (
          <section className="mb-20">
            <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-10">
              Joined <span className="text-oku-purple-dark italic">Circles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {circles
                .filter((c) => joinedCircleIds.has(c.id))
                .map((circle) => {
                  const [title, desc] = (circle.notes || '|').split('|')
                  const spotsLeft = (circle.maxParticipants || 10) - circle.participants.length
                  return (
                    <CircleCard
                      key={circle.id}
                      circle={circle}
                      title={title}
                      desc={desc}
                      spotsLeft={spotsLeft}
                      isJoined
                      userId={userId}
                    />
                  )
                })}
            </div>
          </section>
        )}

        {/* Available circles section */}
        <section>
          <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight mb-10">
            {joinedCircleIds.size > 0
              ? <>More <span className="text-oku-purple-dark italic">Circles</span></>
              : <>Upcoming <span className="text-oku-purple-dark italic">Circles</span></>
            }
          </h2>

          {circles.filter((c) => !joinedCircleIds.has(c.id)).length === 0 ? (
            <div className="py-32 text-center card-glass-3d !bg-white/40">
              <Wind className="mx-auto text-oku-purple-dark/20 mb-8 animate-float-3d" size={64} />
              <h3 className="heading-display text-3xl text-oku-darkgrey">
                {joinedCircleIds.size > 0
                  ? "You've joined all available circles."
                  : 'New circles are forming...'}
              </h3>
              <p className="text-oku-darkgrey/40 italic font-display mt-4 text-xl">
                Check back soon for upcoming sessions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {circles
                .filter((c) => !joinedCircleIds.has(c.id))
                .map((circle) => {
                  const [title, desc] = (circle.notes || '|').split('|')
                  const spotsLeft = (circle.maxParticipants || 10) - circle.participants.length
                  return (
                    <CircleCard
                      key={circle.id}
                      circle={circle}
                      title={title}
                      desc={desc}
                      spotsLeft={spotsLeft}
                      isJoined={false}
                      userId={userId}
                    />
                  )
                })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ── Internal server component for each card ──────────────────────────────────
interface CircleCardProps {
  circle: {
    id: string
    startTime: Date
    endTime: Date
    priceSnapshot: number | null
    maxParticipants: number
    participants: { id: string; userId: string }[]
    practitioner: {
      name: string | null
      avatar: string | null
      practitionerProfile: { specialization: string[] } | null
    }
  }
  title: string
  desc: string
  spotsLeft: number
  isJoined: boolean
  userId: string
}

function CircleCard({ circle, title, desc, spotsLeft, isJoined }: CircleCardProps) {
  const isFull = spotsLeft <= 0

  return (
    <div className={`card-glass-3d !p-10 group hover:shadow-2xl transition-all duration-700 relative flex flex-col ${isJoined ? '!bg-oku-lavender/40 border-2 border-oku-purple-dark/20' : '!bg-white/60'}`}>
      {/* Joined badge */}
      {isJoined && (
        <div className="absolute -top-3 left-8">
          <span className="bg-oku-purple-dark text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
            Joined
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-10 mt-2">
        <div className="w-14 h-14 rounded-[1.2rem] bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
          <Users size={28} />
        </div>
        {isFull ? (
          <span className="bg-oku-peach text-oku-darkgrey/60 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
            At Capacity
          </span>
        ) : (
          <span className="bg-oku-mint text-oku-darkgrey/60 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
            {spotsLeft} Spot{spotsLeft !== 1 ? 's' : ''} Left
          </span>
        )}
      </div>

      <Link href={`/circles/${circle.id}`} className="group/title">
        <h3 className="heading-display text-2xl text-oku-darkgrey mb-3 group-hover/title:text-oku-purple-dark transition-colors">
          {title || 'Community Circle'}
        </h3>
      </Link>
      <p className="text-oku-darkgrey/60 text-sm leading-relaxed mb-10 italic font-display flex-1">
        {desc || 'A facilitated space for shared growth and exploration.'}
      </p>

      <div className="space-y-5 pt-8 border-t border-oku-darkgrey/5">
        {/* Facilitator + price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
              <img
                src={circle.practitioner?.avatar || '/wp-content/wp-content/uploads/2025/07/placeholder.jpg'}
                className="w-full h-full object-cover"
                alt={circle.practitioner?.name || 'Facilitator'}
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">
                {circle.practitioner?.name}
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-oku-purple-dark opacity-60">
                Facilitator
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-oku-darkgrey">₹{circle.priceSnapshot || 1500}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">per session</p>
          </div>
        </div>

        {/* Date + time */}
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40 px-1">
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            {new Date(circle.startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} />
            {new Date(circle.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Join button (client component) or joined state */}
        {isJoined ? (
          <div className="btn-pill-3d w-full !py-4 bg-oku-lavender/60 text-oku-purple-dark border-oku-lavender/60 text-center text-xs font-black uppercase tracking-widest pointer-events-none">
            You are in this circle
          </div>
        ) : (
          <JoinCircleButton
            circleId={circle.id}
            isFull={isFull}
          />
        )}
      </div>
    </div>
  )
}
