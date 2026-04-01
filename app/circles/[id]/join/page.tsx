import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Lock } from 'lucide-react'
import { JoinCircleForm } from './JoinCircleForm'

export const dynamic = 'force-dynamic'

export default async function CircleJoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const circle = await prisma.appointment.findUnique({
    where: { id },
    include: {
      practitioner: { select: { name: true } },
      participants: true
    }
  })

  if (!circle || !circle.isGroupSession) {
    notFound()
  }

  const [title] = (circle.notes || '|').split('|')
  const isFull = (circle.participants?.length || 0) >= (circle.maxParticipants || 10)

  if (isFull) {
    redirect(`/circles/${id}?error=full`)
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden flex flex-col justify-center py-20">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/20 rounded-full blur-[140px] opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/10 rounded-full blur-[120px]" />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 w-full">
        <Link
          href={`/circles/${id}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors mb-12"
        >
          <ChevronLeft size={14} /> Back to Details
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="chip bg-white/60 border-white/80 text-oku-purple-dark mb-8" style={{ display: 'inline-block' }}>Final Step</span>
            <h1 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter leading-tight mb-8">
              Claim your spot in <br />
              <span className="text-oku-purple-dark italic">{title || 'the Circle'}</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic leading-relaxed border-l-4 border-oku-purple-dark/20 pl-10">
              Facilitated by {circle.practitioner?.name}. <br />
              Secure, confidential, and transformative.
            </p>
            
            <div className="mt-12 space-y-6">
               <div className="flex items-center gap-4 text-oku-darkgrey/40">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clinical Data Shield Active</span>
               </div>
               <div className="flex items-center gap-4 text-oku-darkgrey/40">
                  <Lock size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Session</span>
               </div>
            </div>
          </div>

          <div className="card-glass-3d !p-12 !bg-white shadow-2xl !rounded-[3rem]">
            <JoinCircleForm circleId={id} isAuthenticated={!!session} />
          </div>
        </div>
      </div>
    </div>
  )
}
