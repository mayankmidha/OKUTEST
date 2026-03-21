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
    const { bio, hourlyRate } = await req.json()

    const profile = await prisma.practitionerProfile.update({
      where: { userId: session.user.id },
      data: {
        bio,
        hourlyRate: parseFloat(hourlyRate)
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
