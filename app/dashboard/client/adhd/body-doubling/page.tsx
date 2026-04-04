import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { BodyDoublingWrapper } from './BodyDoublingWrapper'
import { ArrowLeft, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function BodyDoublingPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.CLIENT) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientProfile: { select: { adhdDiagnosed: true } } },
  })
  if (!user?.clientProfile?.adhdDiagnosed) redirect('/dashboard/client')

  return (
    <div className="min-h-screen bg-oku-mint relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-oku-butter/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 relative z-10">
        <Link
          href="/dashboard/client/adhd"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey mb-10"
        >
          <ArrowLeft size={13} /> ADHD Manager
        </Link>

        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-oku-lavender">
              <Users size={22} className="text-oku-purple-dark" />
            </div>
            <div>
              <h1 className="heading-display text-3xl sm:text-4xl text-oku-darkgrey">Body Doubling</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Focus Sanctuary</p>
            </div>
          </div>
          <p className="max-w-2xl text-sm sm:text-base text-oku-darkgrey/60 font-display italic leading-relaxed">
            Working alongside others — even silently — activates your brain&apos;s focus circuits. Join the sanctuary, set your intention, and focus together.
          </p>
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-oku-lavender/20 px-4 py-2">
            <Zap size={12} className="text-oku-purple-dark" />
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark/70">
              Anonymous focus room with live shared presence
            </p>
          </div>
        </div>

        <BodyDoublingWrapper />
      </div>
    </div>
  )
}
