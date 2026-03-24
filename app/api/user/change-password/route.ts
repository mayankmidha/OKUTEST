import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return new NextResponse("Invalid current password", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
