import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      include: {
        appointment: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[VAULT_PAYMENTS_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
