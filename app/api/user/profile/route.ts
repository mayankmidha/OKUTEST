import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        practitionerProfile: true
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { 
        name, phone, bio, 
        emergencyContactName, emergencyContactPhone, 
        preferredLanguage, timezone 
    } = await req.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        bio,
        clientProfile: {
            update: {
                emergencyContactName,
                emergencyContactPhone,
                preferredLanguage,
                timezone
            }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
