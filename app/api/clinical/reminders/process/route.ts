import { NextResponse } from 'next/server'
import { processDailyReminders } from '@/lib/notifications'

// This endpoint would be called by a CRON job (e.g., Vercel Cron or GitHub Action)
export async function GET(req: Request) {
  // Simple auth check for cron (In production, use an API key in headers)
  const authHeader = req.headers.get('authorization')
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const count = await processDailyReminders()
    return NextResponse.json({ success: true, remindersSent: count })
  } catch (error) {
    console.error("[REMINDER_PROCESS_ERROR]", error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
