import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'
import Link from 'next/link'
import {
  ChevronLeft, Video, Clock, Calendar, User,
  CheckCircle2, XCircle, AlertCircle, RotateCcw,
  Download, Star
} from 'lucide-react'
import { SessionJoinButton } from './SessionJoinButton'
import { RatingWidget } from '../../sessions/RatingWidget'

export const dynamic = 'force-dynamic'

function formatIST(date: Date) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST'
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  SCHEDULED:   { label: 'Scheduled',   color: 'bg-oku-babyblue/60 text-oku-darkgrey',   icon: <Clock size={13} /> },
  CONFIRMED:   { label: 'Confirmed',   color: 'bg-oku-mint/80 text-oku-darkgrey',       icon: <CheckCircle2 size={13} /> },
  COMPLETED:   { label: 'Completed',   color: 'bg-oku-lavender/80 text-oku-purple-dark', icon: <CheckCircle2 size={13} /> },
  CANCELLED:   { label: 'Cancelled',   color: 'bg-oku-peach/60 text-oku-darkgrey/60',   icon: <XCircle size={13} /> },
  NO_SHOW:     { label: 'No Show',     color: 'bg-oku-blush/60 text-oku-darkgrey/60',   icon: <AlertCircle size={13} /> },
  RESCHEDULED: { label: 'Rescheduled', color: 'bg-white/60 text-oku-darkgrey/60',       icon: <RotateCcw size={13} /> },
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')
  if (session.user.role !== UserRole.CLIENT) redirect('/practitioner/dashboard')

  const { sessionId } = await params

  const appt = await prisma.appointment.findUnique({
    where: { id: sessionId },
    include: {
      practitioner: {
        select: {
          name: true,
          avatar: true,
          practitionerProfile: { select: { specialization: true, bio: true } },
        },
      },
      service: { select: { name: true, duration: true } },
      soapNote: { select: { id: true, subjective: true } },
    },
  })

  // Ownership check — no cross-tenant leakage
  if (!appt || appt.clientId !== session.user.id) {
    redirect('/dashboard/client/sessions')
  }

  const now = new Date()
  const start = new Date(appt.startTime)
  const minsUntilStart = (start.getTime() - now.getTime()) / 60000
  const canJoin =
    appt.status === AppointmentStatus.CONFIRMED && minsUntilStart <= 10 && minsUntilStart > -60

  const existingRating = await prisma.rating.findFirst({
    where: { clientId: session.user.id, appointmentId: sessionId },
  })

  const meta = STATUS_META[appt.status] ?? STATUS_META.SCHEDULED

  return (
    <div className="py-12 px-6 lg:px-12 max-w-4xl mx-auto min-h-screen">
      {/* Back */}
      <Link
        href="/dashboard/client/sessions"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60 mb-10"
      >
        <ChevronLeft size={13} /> All Sessions
      </Link>

      <div className="space-y-8">
        {/* Header card */}
        <div className="card-glass-3d !p-10 !bg-white/60">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="space-y-3">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${meta.color}`}>
                {meta.icon} {meta.label}
              </span>
              <h1 className="heading-display text-4xl text-oku-darkgrey tracking-tighter">
                {appt.service?.name ?? 'Therapy Session'}
              </h1>
              <p className="text-oku-darkgrey/50 font-display italic">
                with {appt.practitioner?.name ?? 'Your Practitioner'}
              </p>
            </div>

            {canJoin && (
              <SessionJoinButton sessionId={sessionId} />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-glass-3d !p-8 !bg-white/40 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Date & Time</p>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-oku-purple-dark/60" />
              <span className="font-bold text-oku-darkgrey">{formatIST(start)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-oku-purple-dark/60" />
              <span className="text-sm text-oku-darkgrey/60">{appt.service?.duration ?? 60} minutes</span>
            </div>
          </div>

          <div className="card-glass-3d !p-8 !bg-white/40 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Practitioner</p>
            <div className="flex items-center gap-4">
              {appt.practitioner?.avatar ? (
                <img
                  src={appt.practitioner.avatar}
                  alt={appt.practitioner.name ?? ''}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-oku-lavender flex items-center justify-center">
                  <User size={20} className="text-oku-purple-dark" />
                </div>
              )}
              <div>
                <p className="font-bold text-oku-darkgrey">{appt.practitioner?.name}</p>
                <p className="text-xs text-oku-darkgrey/40 font-display italic">
                  {(appt.practitioner?.practitionerProfile?.specialization as string[] | null)?.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session summary (post-session) */}
        {appt.soapNote?.subjective && (
          <div className="card-glass-3d !p-8 !bg-oku-lavender/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4">Session Notes</p>
            <p className="text-sm text-oku-darkgrey/70 font-display italic leading-relaxed">
              {appt.soapNote.subjective}
            </p>
          </div>
        )}

        {/* Cancellation / rescheduling */}
        {(appt.status === AppointmentStatus.SCHEDULED || appt.status === AppointmentStatus.CONFIRMED) && (
          <div className="flex gap-4 flex-wrap">
            <Link
              href={`/dashboard/client/sessions?reschedule=${sessionId}`}
              className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 flex items-center gap-2"
            >
              <RotateCcw size={15} /> Reschedule
            </Link>
            <Link
              href={`/dashboard/client/sessions?cancel=${sessionId}`}
              className="btn-pill-3d bg-oku-peach/40 border-oku-peach/40 text-oku-darkgrey/60 !px-8 !py-4 flex items-center gap-2"
            >
              <XCircle size={15} /> Cancel
            </Link>
          </div>
        )}

        {/* Rating prompt — only after completion and not yet rated */}
        {appt.status === AppointmentStatus.COMPLETED && !existingRating && (
          <div className="card-glass-3d !p-8 !bg-oku-butter/40">
            <div className="flex items-center gap-3 mb-6">
              <Star size={18} className="text-oku-purple-dark/60" />
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                How was your session?
              </p>
            </div>
            <RatingWidget appointmentId={sessionId} />
          </div>
        )}
      </div>
    </div>
  )
}
