import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { LogForm } from './LogForm'

export const dynamic = 'force-dynamic'

async function getTodayLog(userId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/adhd/daily-log`, {
      headers: { Cookie: '' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AdhdLogPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  // Fetch today's log directly via prisma to avoid internal fetch complexity
  const { prisma } = await import('@/lib/prisma')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const existing = await prisma.adhdDailyLog.findFirst({
    where: {
      userId: session.user.id,
      date: { gte: today, lt: tomorrow },
    },
  })

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="py-12 px-6 lg:px-12 max-w-2xl mx-auto min-h-screen bg-oku-lavender/5">
      {/* Back */}
      <Link
        href="/dashboard/client/adhd"
        className="inline-flex items-center gap-2 text-sm text-oku-darkgrey/50 hover:text-oku-purple-dark transition-colors mb-10"
      >
        <ArrowLeft size={16} /> Back to ADHD Hub
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-oku-purple-dark/10 flex items-center justify-center">
            <BookOpen size={24} className="text-oku-purple-dark" />
          </div>
          <span className="chip">Daily Check-In</span>
        </div>
        <h1 className="heading-display text-5xl text-oku-darkgrey tracking-tighter">
          How are you<span className="text-oku-purple-dark italic"> today?</span>
        </h1>
        <p className="text-oku-darkgrey/50 text-sm">{todayStr}</p>
        {existing && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oku-mint/20 border border-oku-mint/30 text-sm text-oku-darkgrey/70">
            <span className="w-2 h-2 rounded-full bg-oku-mint" />
            You&apos;ve already logged today — updating your entry.
          </div>
        )}
      </div>

      <LogForm existing={existing} />
    </div>
  )
}
