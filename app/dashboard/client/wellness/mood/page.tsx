import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { MoodChart } from './MoodChart'

export const dynamic = 'force-dynamic'

export default async function MoodPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const entries = await prisma.moodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: {
      id: true,
      mood: true,
      notes: true,
      createdAt: true,
    },
  })

  // Serialize dates for client component
  const serialized = entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }))

  return (
    <div className="py-12 px-6 lg:px-12 max-w-3xl mx-auto min-h-screen bg-oku-lavender/5">
      {/* Back */}
      <Link
        href="/dashboard/client/wellness"
        className="inline-flex items-center gap-2 text-sm text-oku-darkgrey/50 hover:text-oku-purple-dark transition-colors mb-10"
      >
        <ArrowLeft size={16} /> Back to Wellness Hub
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-oku-purple-dark/10 flex items-center justify-center">
            <Heart size={24} className="text-oku-purple-dark" />
          </div>
          <span className="chip">30-Day Tracker</span>
        </div>
        <h1 className="heading-display text-5xl text-oku-darkgrey tracking-tighter">
          Mood <span className="text-oku-purple-dark italic">Tracker.</span>
        </h1>
        <p className="text-oku-darkgrey/60 text-lg">
          Patterns emerge when you pay attention. Keep showing up.
        </p>
      </div>

      <MoodChart entries={serialized} />
    </div>
  )
}
