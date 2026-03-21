import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AppointmentStatus } from "@prisma/client"

export async function POST(req: Request) {
  const session = await auth()
  const { practitionerId, startTime, guestName, guestEmail } = await req.json()

  if (!practitionerId || !startTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Ensure "15-Min Trial" service exists
  const service = await prisma.service.upsert({
    where: { name: "15-Min Free Consultation" },
    update: {},
    create: {
      name: "15-Min Free Consultation",
      description: "Initial consultation to discuss therapy goals and fit.",
      duration: 15,
      price: 0,
    },
  })

  const start = new Date(startTime)
  const end = new Date(start.getTime() + 15 * 60000)

  // Correctly resolve practitionerId (it might be a profile ID)
  let finalPractitionerId = practitionerId
  const profile = await prisma.practitionerProfile.findUnique({
    where: { id: practitionerId },
    select: { userId: true }
  })
  if (profile) {
    finalPractitionerId = profile.userId
  }

  // If logged in, create real appointment
  if (session?.user?.id) {
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        practitionerId: finalPractitionerId,
        serviceId: service.id,
        startTime: start,
        endTime: end,
        status: AppointmentStatus.SCHEDULED,
        notes: "Trial Consultation Call",
      }
    })
    return NextResponse.json(appointment)
  }

  // If guest, we just acknowledge. Frontend handles redirection and storage.
  // We log the lead for nurturing
  if (!session?.user?.id && guestEmail) {
    // In a real app, we'd use a Guest/Lead table or send to CRM
    // For now, we'll log it in AuditLog with a special system ID or just acknowledge
    console.log(`[LEAD CAPTURED] Name: ${guestName}, Email: ${guestEmail}`)
  }

  return NextResponse.json({ 
    message: "Trial call requested as guest",
    redirect: "/auth/signup" 
  })
}
