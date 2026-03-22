import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('clientId') // For therapists fetching a client's files

  try {
    const isTherapist = session.user.role === UserRole.THERAPIST
    
    const documents = await prisma.document.findMany({
      where: {
        AND: [
          // Filter by client if provided (for therapists) or by self (for clients)
          { clientId: patientId || session.user.id },
          // If practitioner fetching, must be assigned to this client
          isTherapist ? { practitionerId: session.user.id } : {},
          // If client fetching, only see non-private or self-uploaded
          !isTherapist ? {
            OR: [
                { uploadedBy: 'CLIENT' },
                { isPrivate: false }
            ]
          } : {}
        ]
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
    const { name, url, type, clientId, isPrivate } = await req.json()
    const isTherapist = session.user.role === UserRole.THERAPIST

    if (!name || !url || !type) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Determine the practitioner/client IDs
    // If therapist uploads, they specify the clientId.
    // If client uploads, they must specify which therapist it's for (first appointment match usually)
    let finalClientId = clientId
    let finalPractitionerId = session.user.id

    if (!isTherapist) {
        finalClientId = session.user.id
        // Find therapist for this client
        const lastAppt = await prisma.appointment.findFirst({
            where: { clientId: session.user.id },
            select: { practitionerId: true }
        })
        if (!lastAppt) return new NextResponse("No assigned practitioner found.", { status: 400 })
        finalPractitionerId = lastAppt.practitionerId
    }

    const document = await prisma.document.create({
      data: {
        name,
        url,
        type,
        clientId: finalClientId,
        practitionerId: finalPractitionerId,
        uploadedBy: isTherapist ? 'THERAPIST' : 'CLIENT',
        isPrivate: isPrivate || false
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("POST Document error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
