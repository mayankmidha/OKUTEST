import { NextResponse } from 'next/server'
import { processDailyReminders } from '@/lib/notifications'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET handler — secured with CRON_SECRET header
// Intended to be called by Vercel Cron or an external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    console.log('[CRON_DAILY] Starting daily reminder processing...')
    const processed = await processDailyReminders()
    const timestamp = new Date().toISOString()
    console.log(`[CRON_DAILY] Processed ${processed} reminders at ${timestamp}`)

    return NextResponse.json({ processed, timestamp })
  } catch (error) {
    console.error('[CRON_DAILY_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
