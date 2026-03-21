import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuth = !!req.auth
  const { nextUrl } = req

  // If the user is on the root dashboard page, redirect based on role
  if (nextUrl.pathname === "/dashboard" && isAuth) {
    const role = req.auth?.user?.role
    if (role === "THERAPIST") {
      return NextResponse.redirect(new URL("/practitioner/dashboard", nextUrl))
    }
  }

  // Prevent users from accessing practitioner dashboard
  if (nextUrl.pathname.startsWith("/practitioner") && isAuth) {
    const role = req.auth?.user?.role
    if (role !== "THERAPIST") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard", "/practitioner/:path*"],
}
