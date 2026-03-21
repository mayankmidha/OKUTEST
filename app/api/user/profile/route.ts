import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { name, phone, bio } = await req.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        bio
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
