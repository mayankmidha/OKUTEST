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
    const { name, bio, hourlyRate, licenseNumber, specialization } = await req.json()

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
          hourlyRate: parseFloat(hourlyRate),
          licenseNumber,
          specialization
        }
      })
    ])

    return NextResponse.json({ user: updatedUser, profile: updatedProfile })
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
