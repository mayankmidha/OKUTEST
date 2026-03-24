import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { agreementContent, version = "1.0" } = await req.json()

    // 1. Create Consent Log
    await prisma.informedConsent.create({
      data: {
        userId: session.user.id,
        version,
        agreementContent,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      }
    })

    // 2. Update User Status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hasSignedConsent: true }
    })

    // 3. Log Audit Event
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: 'CONSENT_SIGNED',
            resourceType: 'USER',
            resourceId: session.user.id,
            changes: JSON.stringify({ version, status: 'SIGNED' })
        }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CONSENT_SIGN_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
