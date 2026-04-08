import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('clientId')?.trim() || null

  try {
    const isTherapist = session.user.role === UserRole.THERAPIST

    if (isTherapist && !patientId) {
      return new NextResponse("Missing client ID", { status: 400 })
    }

    if (isTherapist && patientId) {
      const relationship = await prisma.appointment.findFirst({
        where: {
          practitionerId: session.user.id,
          clientId: patientId,
        },
        select: { id: true },
      })

      if (!relationship) {
        return new NextResponse("You can only view documents for clients in your caseload.", { status: 403 })
      }
    }

    const documents = await prisma.document.findMany({
      where: isTherapist
        ? {
            clientId: patientId!,
            practitionerId: session.user.id,
            OR: [
              { uploadedBy: 'PRACTITIONER' },
              { isPrivate: false },
            ],
          }
        : {
            clientId: session.user.id,
            OR: [
              { uploadedBy: 'CLIENT' },
              { isPrivate: false },
            ],
          },
      select: {
        id: true,
        name: true,
        type: true,
        uploadedBy: true,
        isPrivate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("GET Documents error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await req.json().catch(() => null)
    return new NextResponse("Use the secure upload endpoint for document files.", { status: 400 })
  } catch (error) {
    console.error("POST Document error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
