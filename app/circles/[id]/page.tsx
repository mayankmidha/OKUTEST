import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Users, Calendar, Clock, ChevronLeft, ShieldCheck,
  Sparkles, CheckCircle2, ArrowRight, Lock
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CircleDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  const circle = await prisma.appointment.findUnique({
    where: { id },
    include: {
      practitioner: {
        select: {
          name: true,
          avatar: true,
          practitionerProfile: {
            select: { specialization: true, bio: true }
          }
        }
      },
      participants: true,
    }
  })

  if (!circle || !circle.isGroupSession) {
    notFound()
  }

  const [title, desc] = (circle.notes || '|').split('|')
  const spotsLeft = (circle.maxParticipants || 10) - (circle.participants?.length || 0)
  const isFull = spotsLeft <= 0
  const isJoined = session?.user ? circle.participants?.some(p => p.userId === session.user.id) : false
  const specialization = circle.practitioner?.practitionerProfile?.specialization ?? []

  const joinHref = `/circles/${id}/join`

  return (
    <div className="oku-page-public min-h-screen bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/30 rounded-full blur-[140px] opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-36 pb-32 relative z-10">
        <Link
          href="/circles"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors mb-16 bg-white/40 px-6 py-3 rounded-full border border-white/60 shadow-sm"
        >
          <ChevronLeft size={14} /> Back to Circles
        </Link>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="chip bg-white/60 border-white/80 text-oku-purple-dark" style={{ marginBottom: 28, display: 'inline-block' }}>
                Verified Circle
              </span>
              <h1 className="heading-display text-6xl md:text-8xl text-oku-darkgrey tracking-tighter leading-[0.85] mb-8">
                {title?.split(' ').slice(0, -1).join(' ') || 'Therapeutic'}{' '}
                <br />
                <span className="text-oku-purple-dark italic">
                  {title?.split(' ').slice(-1)[0] || 'Circle'}
                </span>
              </h1>
              <p className="text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed border-l-4 border-oku-purple-dark/20 pl-10 max-w-2xl">
                {desc || 'A safe, facilitated space for shared growth and exploration.'}
              </p>
            </div>

            {/* Facilitator + Privacy cards */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="card-glass-3d !p-10 !bg-oku-lavender/20 flex flex-col justify-between group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={circle.practitioner?.avatar || '/wp-content/uploads/2025/07/placeholder.jpg'}
                      alt={circle.practitioner?.name || 'Facilitator'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Facilitated by</p>
                    <p className="text-lg font-bold text-oku-darkgrey">{circle.practitioner?.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialization.slice(0, 2).map((s, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/60 rounded-full border border-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-glass-3d !p-10 !bg-oku-mint/20 flex flex-col justify-between group">
                <ShieldCheck size={32} className="text-oku-purple-dark mb-8 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">Privacy Tier</p>
                  <p className="text-xl font-bold text-oku-darkgrey">High-Safety</p>
                  <p className="text-xs text-oku-darkgrey/40 italic mt-1">Clinical-grade encryption</p>
                </div>
              </div>
            </div>

            {/* Session details */}
            <section className="card-glass-3d !p-12 !bg-white/40">
              <h3 className="heading-display text-3xl text-oku-darkgrey mb-10">
                Sanctuary <span className="italic opacity-40">Protocol</span>
              </h3>
              <div className="space-y-5">
                {[
                  `90-minute facilitated sessions`,
                  `Maximum ${circle.maxParticipants} participants for intimacy`,
                  `Safe, trauma-informed moderation`,
                  `Anonymous participation optional`,
                ].map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:translate-x-2 transition-transform"
                  >
                    <div className="w-8 h-8 rounded-xl bg-oku-lavender/60 flex items-center justify-center text-oku-purple-dark flex-shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-sm font-bold text-oku-darkgrey/70 italic">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quote */}
            <div className="card-glass-3d !p-10 !bg-oku-babyblue/20 border-dashed border-2">
              <Sparkles size={24} className="text-oku-purple-dark/40 mb-6 animate-float-3d" />
              <p className="text-sm font-display italic text-oku-darkgrey/60 leading-relaxed">
                "A circle is a place where we meet eye to eye, heart to heart — sharing the burden of being human."
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 card-glass-3d !p-12 !bg-white shadow-2xl !rounded-[4rem] border-2 border-white">
              {/* Price */}
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Session Rate</span>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <p className="heading-display text-6xl text-oku-darkgrey">₹{circle.priceSnapshot || 500}</p>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark">Per session</p>
                    <p className="text-[9px] font-bold text-oku-darkgrey/40 italic">90 minutes</p>
                  </div>
                </div>
              </div>

              {/* Date + Time */}
              <div className="space-y-4 mb-12">
                <div className="p-6 bg-oku-lavender/20 rounded-3xl border border-oku-lavender/40 flex items-center gap-4">
                  <Calendar size={20} className="text-oku-purple-dark flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Date</p>
                    <p className="text-sm font-bold text-oku-darkgrey">
                      {new Date(circle.startTime).toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-oku-mint/20 rounded-3xl border border-oku-mint/40 flex items-center gap-4">
                  <Clock size={20} className="text-oku-purple-dark flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Time Window</p>
                    <p className="text-sm font-bold text-oku-darkgrey">
                      {new Date(circle.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      {' — '}
                      {new Date(circle.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      {' IST'}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-oku-peach/20 rounded-3xl border border-oku-peach/40 flex items-center gap-4">
                  <Users size={20} className="text-oku-purple-dark flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Availability</p>
                    <p className="text-sm font-bold text-oku-darkgrey">
                      {isFull ? 'Circle is full' : `${spotsLeft} of ${circle.maxParticipants} spots remaining`}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={isJoined ? `/dashboard/client/circles/${id}` : isFull ? '#' : joinHref}
                className={`btn-pill-3d w-full !py-6 flex items-center justify-center gap-4 text-xs ${
                  isJoined 
                    ? 'bg-oku-mint text-oku-mint-dark border-oku-mint shadow-inner'
                    : isFull
                      ? 'bg-oku-taupe/10 text-oku-taupe pointer-events-none'
                      : 'bg-oku-darkgrey border-oku-darkgrey text-white pulse-cta'
                }`}
              >
                {isJoined ? (
                  <>
                    <CheckCircle2 size={18} /> Already Enrolled
                  </>
                ) : isFull ? (
                  'At Capacity'
                ) : (
                  <>
                    {session ? 'Join this Circle' : 'Sign up to Join'}
                    <ArrowRight size={16} />
                    {!session && <Lock size={14} />}
                  </>
                )}
              </Link>

              <div className="mt-8 flex justify-center items-center gap-2 opacity-30 hover:opacity-70 transition-all duration-700">
                <ShieldCheck size={14} className="text-oku-purple-dark" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">Verified Clinical Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
