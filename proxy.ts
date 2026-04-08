import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'
import rateLimit from './lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

// ---------------------------------------------------------------------------
// Route classification helpers
// ---------------------------------------------------------------------------

/** Any route that requires a valid session (any role). */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/session",
  "/api/user",
  "/api/mood",
  "/api/documents",
  "/api/messages",
  "/api/sessions",
  "/api/book",
  "/api/checkout",
  "/api/video",
  "/api/ai",
  "/api/clinical",
  "/api/tasks",
  "/api/activities",
  "/api/availability",
  "/api/assessments",
  "/api/notes",
]

/** Routes that require role === 'ADMIN'. */
const ADMIN_PREFIXES = ["/admin", "/api/admin"]

/** Routes that require role === 'THERAPIST' or 'ADMIN'. */
const PRACTITIONER_PREFIXES = ["/practitioner", "/api/practitioner"]

/** Paths that never need auth — checked before anything else. */
const PUBLIC_EXACT = ["/", "/about-us", "/faq", "/privacy", "/terms", "/contact", "/people", "/therapists"]
const PUBLIC_PREFIXES = ["/auth", "/api/auth", "/api/therapists", "/circles", "/assessments", "/_next", "/public", "/dashboard/client/assessments", "/dashboard/client/circles/join"]

function isPublic(pathname: string): boolean {
  if (pathname === "/favicon.ico") return true
  if (PUBLIC_EXACT.includes(pathname)) return true
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/")
}

/** Where to send a user whose role doesn't match the requested route. */
function roleDashboard(role: string | undefined): string {
  if (role === "CLIENT") return "/dashboard/client"
  if (role === "THERAPIST") return "/practitioner/dashboard"
  if (role === "ADMIN") return "/admin/dashboard"
  return "/auth/login"
}

const PRACTITIONER_SETUP_EXACT = [
  "/practitioner/profile",
  "/practitioner/support",
  "/api/practitioner/profile",
  "/api/practitioner/kyc-upload",
  "/api/practitioner/onboarding-complete",
]

// ---------------------------------------------------------------------------
// Proxy function (Next.js 16 equivalent of middleware)
// ---------------------------------------------------------------------------

export default auth(async function proxy(req) {
  const session = req.auth
  const { nextUrl } = req as NextRequest & { auth: typeof session }
  const { pathname } = nextUrl

  const isAuthenticated = !!session
  const role: string | undefined = session?.user?.role
  const isDeleted = !!session?.user?.isDeleted
  const practitionerVerified = !!session?.user?.practitionerVerified
  const practitionerOnboarded = !!session?.user?.practitionerOnboarded

  // 1. Allow public paths immediately
  if (isPublic(pathname)) {
    // If already authenticated and trying to access auth pages, bounce to dashboard
    if (isAuthenticated && !isDeleted && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(roleDashboard(role), nextUrl.origin))
    }
    return NextResponse.next()
  }

  // 2. Global API rate limiting (skip auth endpoints)
  if (isApiRoute(pathname) && !pathname.startsWith("/api/auth")) {
    const id = (req as any).ip ?? "anonymous"
    const { isRateLimited } = await limiter.check(60, id)
    if (isRateLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please take a breath." },
        { status: 429 },
      )
    }
  }

  // 3. Unauthenticated — bounce to login or return 401 for API calls
  const isProtected =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ADMIN_PREFIXES.some((p) => pathname.startsWith(p)) ||
    PRACTITIONER_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected && !isAuthenticated) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/auth/login", nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isDeleted) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Account unavailable" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/auth/login?deleted=true", nextUrl.origin))
  }

  // 4. Consent gate — authenticated users who haven't signed consent
  // EXEMPT ADMINS from clinical consent
  const isConsentExempt = pathname === "/consent" || pathname.startsWith("/auth") || pathname.startsWith("/api/auth") || role === "ADMIN"
  const needsConsent = (role === "THERAPIST" || role === "CLIENT") && !session?.user?.hasSignedConsent
  
  if (isAuthenticated && !isConsentExempt && needsConsent) {
    if (isApiRoute(pathname)) {
      // Allow user to fetch their own profile even without consent
      if (pathname === "/api/user/profile" || pathname === "/api/user/consent") {
          return NextResponse.next()
      }
      return NextResponse.json({ error: "Consent required" }, { status: 403 })
    }
    return NextResponse.redirect(new URL("/consent", nextUrl.origin))
  }

  // 5. Admin-only routes
  if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (role !== "ADMIN") {
      if (isApiRoute(pathname)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL(roleDashboard(role), nextUrl.origin))
    }
  }

  // 6. Practitioner-only routes
  if (PRACTITIONER_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (role !== "THERAPIST" && role !== "ADMIN") {
      if (isApiRoute(pathname)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL(roleDashboard(role), nextUrl.origin))
    }

    if (
      role === "THERAPIST" &&
      (!practitionerVerified || !practitionerOnboarded) &&
      !PRACTITIONER_SETUP_EXACT.includes(pathname)
    ) {
      if (isApiRoute(pathname)) {
        return NextResponse.json(
          { error: "Practitioner profile setup and verification required" },
          { status: 403 }
        )
      }

      const setupUrl = new URL("/practitioner/profile", nextUrl.origin)
      setupUrl.searchParams.set("setup", "required")
      return NextResponse.redirect(setupUrl)
    }
  }

  // 7. Role-based /dashboard root redirect
  if (pathname === "/dashboard" && isAuthenticated) {
    if (role === "THERAPIST") {
      return NextResponse.redirect(new URL("/practitioner/dashboard", nextUrl.origin))
    }
    if (role === "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard/client", nextUrl.origin))
    }
  }

  return NextResponse.next()
})

// ---------------------------------------------------------------------------
// Matcher — which paths this proxy runs on
// ---------------------------------------------------------------------------

export const proxyConfig = {
  matcher: [
    /*
     * Run on all paths except Next.js internals and static assets.
     * Public routes are allowed through inside the proxy function itself.
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
