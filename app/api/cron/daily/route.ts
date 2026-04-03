import { NextResponse } from 'next/server'
import { processDailyReminders } from '@/lib/notifications'
import { processNoShows } from '@/lib/no-show-automation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET handler — secured with CRON_SECRET header
// Intended to be called by Vercel Cron or an external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production CRON_SECRET must be set. Vercel Cron automatically sends
  // Authorization: Bearer <CRON_SECRET> with every invocation.
  // Locally you can hit the endpoint manually without the header.
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    console.log('[CRON_DAILY] Starting daily reminder processing...')
    const reminderCount = await processDailyReminders()
    
    console.log('[CRON_DAILY] Starting no-show processing...')
    const noShowCount = await processNoShows()

    const timestamp = new Date().toISOString()
    console.log(`[CRON_DAILY] Processed ${reminderCount} reminders and ${noShowCount} no-shows at ${timestamp}`)

    return NextResponse.json({ 
        reminders: reminderCount, 
        noShows: noShowCount,
        timestamp 
    })
  } catch (error) {
    console.error('[CRON_DAILY_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
