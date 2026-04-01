import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    console.error("[CONSENT_SIGN_ERROR] No session or user ID found", { session })
    return NextResponse.json({ 
        success: false, 
        message: "You must be logged in to sign the clinical consent. Your session may have expired." 
    }, { status: 401 })
  }

  try {
    const { agreementContent, version = "1.0" } = await req.json()
    const userId = session.user.id

    // 1. Create Consent Log
    await prisma.informedConsent.create({
      data: {
        userId,
        version,
        agreementContent,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      }
    })

    // 2. Update User Status
    await prisma.user.update({
      where: { id: userId },
      data: { hasSignedConsent: true }
    })

    // 3. Log Audit Event
    await prisma.auditLog.create({
        data: {
            userId,
            action: 'CONSENT_SIGNED',
            resourceType: 'USER',
            resourceId: userId,
            changes: JSON.stringify({ version, status: 'SIGNED' })
        }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[CONSENT_SIGN_ERROR] Database operation failed:", error)
    return NextResponse.json({ 
        success: false, 
        message: "Database error: Could not finalize consent record." 
    }, { status: 500 })
  }
}
