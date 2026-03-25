import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import rateLimit from './lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per minute
})

export function middleware(request: NextRequest) {
  // 1. Global API Rate Limiting
  if (request.nextUrl.pathname.startsWith('/api')) {
    const id = request.ip || 'anonymous'
    const limit = 60 // 60 requests per minute per IP
    const { isRateLimited } = limiter.check(limit, id)

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please take a breath.' },
        { status: 429 }
      )
    }
  }

  // 2. Clinical Route Protection (Additional layer)
  if (request.nextUrl.pathname.startsWith('/practitioner')) {
    // Note: Deep auth checks are handled by NextAuth in app routes
    // But we can add header-based security or geo-fencing here if needed.
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/practitioner/:path*',
    '/admin/:path*'
  ],
}
