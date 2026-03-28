import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export async function PATCH(req: Request) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { 
        name,
        bio,
        indiaSessionRate,
        internationalSessionRate,
        licenseNumber,
        specialization,
        education,
        experienceYears,
        linkedinUrl,
        websiteUrl,
    } = await req.json()

    const parsedIndiaSessionRate = Number.parseFloat(String(indiaSessionRate ?? ''))
    const parsedInternationalSessionRate = Number.parseFloat(String(internationalSessionRate ?? ''))

    // Update User and PractitionerProfile in a transaction
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      }),
      prisma.practitionerProfile.update({
        where: { userId: session.user.id },
        data: {
          bio,
          hourlyRate: Number.isNaN(parsedInternationalSessionRate) ? null : parsedInternationalSessionRate,
          indiaSessionRate: Number.isNaN(parsedIndiaSessionRate) ? null : parsedIndiaSessionRate,
          internationalSessionRate: Number.isNaN(parsedInternationalSessionRate) ? null : parsedInternationalSessionRate,
          licenseNumber,
          specialization,
          education,
          experienceYears: parseInt(experienceYears) || 0,
          linkedinUrl,
          websiteUrl,
          baseCurrency: 'INR',
        }
      })
    ])

    return NextResponse.json({ user: updatedUser, profile: updatedProfile })
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
