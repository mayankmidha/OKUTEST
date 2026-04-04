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
    <div className="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-oku-lavender/10 px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-10 lg:py-12 xl:px-12">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-8 sm:mb-16 lg:mb-20 lg:flex-row lg:items-end lg:gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 shadow-sm transition-colors hover:text-oku-darkgrey sm:px-5"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Community Healing</span>
            </div>
            <h1 className="heading-display text-4xl tracking-tighter text-oku-darkgrey sm:text-5xl lg:text-7xl xl:text-8xl">
              Your <span className="text-oku-purple-dark italic">Circles.</span>
            </h1>
            <p className="border-l-4 border-oku-purple-dark/10 pl-4 text-base text-oku-darkgrey/60 font-display italic sm:pl-6 sm:text-lg lg:pl-8 lg:text-xl">
              Safe, facilitated group spaces for shared healing.
            </p>
          </div>

          <Link href="/circles" className="btn-pill-3d inline-flex w-full items-center justify-center self-start bg-white border-white text-oku-darkgrey !px-7 !py-4 sm:w-auto sm:!px-10 lg:self-auto">
            <Sparkles size={16} className="mr-3 text-oku-purple-dark" /> Browse All Circles
          </Link>
        </div>

        {/* Joined circles section */}
        {joinedCircleIds.size > 0 && (
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <h2 className="heading-display mb-8 text-3xl tracking-tight text-oku-darkgrey sm:mb-10 sm:text-4xl">
              Joined <span className="text-oku-purple-dark italic">Circles</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
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
                    />
                  )
                })}
            </div>
          </section>
        )}

        {/* Available circles section */}
        <section>
          <h2 className="heading-display mb-8 text-3xl tracking-tight text-oku-darkgrey sm:mb-10 sm:text-4xl">
            {joinedCircleIds.size > 0
              ? <>More <span className="text-oku-purple-dark italic">Circles</span></>
              : <>Upcoming <span className="text-oku-purple-dark italic">Circles</span></>
            }
          </h2>

          {circles.filter((c) => !joinedCircleIds.has(c.id)).length === 0 ? (
            <div className="card-glass-3d !bg-white/40 px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32">
              <Wind className="mx-auto text-oku-purple-dark/20 mb-8 animate-float-3d" size={64} />
              <h3 className="heading-display text-2xl text-oku-darkgrey sm:text-3xl">
                {joinedCircleIds.size > 0
                  ? "You've joined all available circles."
                  : 'New circles are forming...'}
              </h3>
              <p className="mt-4 text-base text-oku-darkgrey/40 font-display italic sm:text-lg lg:text-xl">
                Check back soon for upcoming sessions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
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
}

function CircleCard({ circle, title, desc, spotsLeft, isJoined }: CircleCardProps) {
  const isFull = spotsLeft <= 0

  return (
    <div className={`card-glass-3d group relative flex flex-col transition-all duration-700 hover:shadow-2xl !p-6 sm:!p-8 lg:!p-10 ${isJoined ? '!bg-oku-lavender/40 border-2 border-oku-purple-dark/20' : '!bg-white/60'}`}>
      {/* Joined badge */}
      {isJoined && (
        <div className="absolute -top-3 left-6 sm:left-8">
          <span className="bg-oku-purple-dark text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
            Joined
          </span>
        </div>
      )}

      <div className="mt-2 mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-oku-lavender text-oku-purple-dark shadow-sm sm:h-14 sm:w-14 sm:rounded-[1.2rem]">
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
        <h3 className="heading-display mb-3 text-xl text-oku-darkgrey transition-colors group-hover/title:text-oku-purple-dark sm:text-2xl">
          {title || 'Community Circle'}
        </h3>
      </Link>
      <p className="mb-8 flex-1 text-sm leading-relaxed text-oku-darkgrey/60 italic font-display sm:mb-10">
        {desc || 'A facilitated space for shared growth and exploration.'}
      </p>

      <div className="space-y-5 border-t border-oku-darkgrey/5 pt-6 sm:pt-8">
        {/* Facilitator + price */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md">
              <img
                src={circle.practitioner?.avatar || '/wp-content/uploads/2025/07/placeholder.jpg'}
                className="h-full w-full object-cover"
                alt={circle.practitioner?.name || 'Facilitator'}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">
                {circle.practitioner?.name}
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-oku-purple-dark opacity-60">
                Facilitator
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-bold text-oku-darkgrey">₹{circle.priceSnapshot || 1500}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">per session</p>
          </div>
        </div>

        {/* Date + time */}
        <div className="flex flex-col gap-3 px-1 text-[9px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="btn-pill-3d w-full !py-4 bg-oku-lavender/60 text-center text-[11px] font-black uppercase tracking-widest text-oku-purple-dark border-oku-lavender/60 pointer-events-none sm:text-xs">
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
