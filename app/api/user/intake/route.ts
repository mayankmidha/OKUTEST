import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { 
        hasSignedConsent, 
        hasAcceptedPrivacy, 
        medicalHistory, 
        legalName,
        currentAddress,
        permanentAddress,
        emergencyContact1,
        emergencyContact2
    } = await req.json()

    const intake = await prisma.intakeForm.upsert({
      where: { userId: session.user.id },
      update: {
        legalName,
        currentAddress,
        permanentAddress,
        emergencyContact1,
        emergencyContact2,
        hasSignedConsent,
        hasAcceptedPrivacy,
        medicalHistory,
        signedAt: new Date()
      },
      create: {
        userId: session.user.id,
        legalName,
        currentAddress,
        permanentAddress,
        emergencyContact1,
        emergencyContact2,
        hasSignedConsent,
        hasAcceptedPrivacy,
        medicalHistory,
        signedAt: new Date()
      }
    })

    // Update ClientProfile to mark as onboarded
    await prisma.clientProfile.update({
        where: { userId: session.user.id },
        data: { isOnboarded: true }
    })

    return NextResponse.json(intake)
  } catch (error) {
    console.error("Intake form error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
