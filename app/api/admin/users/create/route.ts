import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        emailVerified: new Date()
      }
    })

    // If therapist, create practitioner profile
    if (role === UserRole.THERAPIST) {
        await prisma.practitionerProfile.create({
            data: {
                userId: user.id,
                bio: 'New practitioner joining the Oku collective.',
                specialization: [],
                hourlyRate: 100,
                isVerified: true
            }
        })
    } else if (role === UserRole.CLIENT) {
        await prisma.clientProfile.create({
            data: {
                userId: user.id
            }
        })
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error("[ADMIN_CREATE_USER_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
