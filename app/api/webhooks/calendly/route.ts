import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { AppointmentStatus } from "@prisma/client"

/**
 * Calendly Webhook Handler for OKU Therapy
 * Protects against double-bookings by blocking OKU slots when 
 * therapist is booked on personal Calendly.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const eventType = payload.event
    
    // We only care about new invitee creations (bookings)
    if (eventType !== 'invitee.created') {
        return NextResponse.json({ received: true })
    }

    const { invitee, event } = payload.payload
    const calendlyUri = event.uri
    const startTime = new Date(event.start_time)
    const endTime = new Date(event.end_time)
    
    // Find the practitioner by their calendly link (stored in OKU internally)
    // We match by the user's Calendly profile URL or email
    const profile = await prisma.practitionerProfile.findFirst({
        where: { 
            OR: [
                { googleCalendarEmail: invitee.email },
                { outlookCalendarEmail: invitee.email },
                { calendlyLink: { contains: invitee.email.split('@')[0] } } // Heuristic match
            ]
        }
    })

    if (!profile) {
        console.warn("[CALENDLY_WEBHOOK] No matching OKU practitioner for:", invitee.email)
        return NextResponse.json({ error: "No matching practitioner" }, { status: 404 })
    }

    // Create an EXTERNAL_BLOCK appointment in OKU to prevent overlapping bookings
    await prisma.appointment.create({
        data: {
            clientId: "SYSTEM_EXTERNAL_BLOCK", // Special system ID
            practitionerId: profile.userId,
            startTime,
            endTime,
            status: AppointmentStatus.EXTERNAL_BLOCK,
            priceSnapshot: 0,
            pricingRegion: "EXTERNAL",
            serviceId: "EXTERNAL_BLOCK_SERVICE" // Placeholder service
        }
    })

    console.log(`[OKU_SYNC] Blocked slot for ${profile.userId} due to Calendly booking: ${startTime}`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[CALENDLY_WEBHOOK_ERROR]", error)
    return new NextResponse("Webhook Error", { status: 500 })
  }
}
