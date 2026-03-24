import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuth = !!req.auth
  const { nextUrl } = req

  // Skip consent check for public pages, auth, and the consent page itself
  const isPublicPage = ["/", "/auth/login", "/auth/signup", "/consent", "/api/auth"].some(path => nextUrl.pathname.startsWith(path))

  // If authenticated but not signed consent, redirect to /consent
  if (isAuth && !isPublicPage && !req.auth?.user?.hasSignedConsent) {
      return NextResponse.redirect(new URL("/consent", nextUrl))
  }

  // If the user is on the root dashboard page, redirect based on role
  if (nextUrl.pathname === "/dashboard" && isAuth) {
    const role = req.auth?.user?.role
    if (role === "THERAPIST") {
      return NextResponse.redirect(new URL("/practitioner/dashboard", nextUrl))
    }
  }

  // Role-based protection
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
  matcher: ["/dashboard/:path*", "/practitioner/:path*", "/admin/:path*"],
}
