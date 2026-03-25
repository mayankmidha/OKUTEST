import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'
import rateLimit from './lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
})

export default auth((req) => {
  const isAuth = !!req.auth
  const { nextUrl } = req

  // 1. Global API Rate Limiting
  if (nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/auth')) {
    const id = (req as any).ip || 'anonymous'
    const limit = 60 
    const { isRateLimited } = limiter.check(limit, id)

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please take a breath.' },
        { status: 429 }
      )
    }
  }

  // 2. Skip consent check for public pages, auth, and the consent page itself
  const isPublicPage = ["/", "/auth/login", "/auth/signup", "/consent", "/api/auth"].some(path => nextUrl.pathname.startsWith(path))

  // 3. Consent Flow
  if (isAuth && !isPublicPage && !req.auth?.user?.hasSignedConsent) {
      return NextResponse.redirect(new URL("/consent", nextUrl))
  }

  // 4. Role-based Dashboard Redirect
  if (nextUrl.pathname === "/dashboard" && isAuth) {
    const role = req.auth?.user?.role
    if (role === "THERAPIST") {
      return NextResponse.redirect(new URL("/practitioner/dashboard", nextUrl))
    }
  }

  // 5. Protected Routes & Authorization
  if (nextUrl.pathname.startsWith("/practitioner") && isAuth) {
    const role = req.auth?.user?.role
    if (role !== "THERAPIST") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  if (nextUrl.pathname.startsWith("/admin") && isAuth) {
    const role = req.auth?.user?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/api/:path*", 
    "/dashboard/:path*", 
    "/practitioner/:path*", 
    "/admin/:path*",
    "/consent"
  ],
}
