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
    const { userId, newPassword } = await req.json()

    if (!userId || !newPassword) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ADMIN_RESET_PASSWORD_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
