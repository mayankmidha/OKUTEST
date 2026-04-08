import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AppointmentStatus } from "@prisma/client"
import { checkPractitionerAvailability } from "@/lib/availability"
import { sendBookingConfirmation } from "@/lib/notifications"
import { captureLead } from "@/lib/lead-capture"

export async function POST(req: Request) {
  const session = await auth()
  const { practitionerId, startTime, guestName, guestEmail } = await req.json()

  if (!practitionerId || !startTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const start = new Date(startTime)
  const profile = await prisma.practitionerProfile.findUnique({
    where: { id: practitionerId },
    select: { id: true, userId: true }
  })

  if (!profile) {
    return NextResponse.json({ error: "Practitioner not found" }, { status: 404 })
  }

  // 1. Smart Availability Check
  const availability = await checkPractitionerAvailability({
    practitionerProfileId: profile.id,
    startTime: start,
    durationMinutes: 10,
    bufferMinutes: 5 // Industrial standard buffer
  })

  if (!availability.available) {
    return NextResponse.json({ 
        error: "SLOT_UNAVAILABLE", 
        message: availability.reason || "This slot is no longer available" 
    }, { status: 409 })
  }

  // 2. Ensure "10-Min Free Consultation" service exists
  const service = await prisma.service.upsert({
    where: { name: "10-Min Free Consultation" },
    update: { duration: 10 },
    create: {
      name: "10-Min Free Consultation",
      description: "Initial 10-minute meet to discuss therapy fit.",
      duration: 10,
      price: 0,
    },
  })

  const end = new Date(start.getTime() + 10 * 60000)

  // 3. If logged in, create real appointment
  if (session?.user?.id) {
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        practitionerId: profile.userId,
        serviceId: service.id,
        startTime: start,
        endTime: end,
        status: AppointmentStatus.SCHEDULED,
        notes: "Trial Meet Call (10 Min)",
        isTrial: true,
        trialDuration: 10
      }
    })

    // Send booking confirmation (non-blocking)
    sendBookingConfirmation(appointment.id).catch((e) => console.error('[TRIAL_BOOKING_CONFIRMATION_ERROR]', e))

    return NextResponse.json(appointment)
  }

  // 4. If guest, acknowledge lead
  if (guestEmail) {
    await captureLead({
      channel: 'trial',
      name: guestName,
      email: guestEmail,
      metadata: {
        practitionerId,
        startTime: start.toISOString(),
      },
    })
  }

  return NextResponse.json({ 
    message: "Trial call requested as guest",
    redirect: `/auth/signup?email=${encodeURIComponent(guestEmail || '')}&name=${encodeURIComponent(guestName || '')}` 
  })
}
