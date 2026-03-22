import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { hasSignedConsent, hasAcceptedPrivacy, medicalHistory, emergencyContact } = await req.json()

    const intake = await prisma.intakeForm.upsert({
      where: { userId: session.user.id },
      update: {
        hasSignedConsent,
        hasAcceptedPrivacy,
        medicalHistory,
        emergencyContact,
        signedAt: new Date()
      },
      create: {
        userId: session.user.id,
        hasSignedConsent,
        hasAcceptedPrivacy,
        medicalHistory,
        emergencyContact,
        signedAt: new Date()
      }
    })

    return NextResponse.json(intake)
  } catch (error) {
    console.error("Intake form error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
