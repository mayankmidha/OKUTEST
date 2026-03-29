import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Universal iCal Feed for OKU Therapy
 * Complies with RFC 5545 for Apple, Google, and Outlook subscription.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: practitionerProfileId } = await params
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  const profile = await prisma.practitionerProfile.findUnique({
    where: { id: practitionerProfileId },
    include: { user: { select: { name: true } } }
  })

  // Security Guard: Check iCalSecret match
  if (!profile || profile.iCalSecret !== secret) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Fetch confirmed sessions
  const appointments = await prisma.appointment.findMany({
    where: { 
        practitionerId: profile.userId,
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
    },
    include: { client: { select: { name: true } }, service: { select: { name: true } } }
  })

  // Build the .ics content
  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OKU Therapy//Clinical Intelligence Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:OKU: ${profile.user.name}`,
    "X-WR-TIMEZONE:UTC",
  ].join("\r\n") + "\r\n"

  appointments.forEach(app => {
    const start = app.startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z"
    const end = app.endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z"
    const created = app.createdAt.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z"
    
    ics += [
      "BEGIN:VEVENT",
      `UID:${app.id}@okutherapy.com`,
      `DTSTAMP:${created}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:OKU: ${app.service.name} w/ ${app.client?.name || 'Patient'}`,
      `DESCRIPTION:Clinical therapy session via OKU Platform. Status: ${app.status}`,
      `LOCATION:OKU Secure Video Room`,
      "END:VEVENT",
    ].join("\r\n") + "\r\n"
  })

  ics += "END:VCALENDAR"

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="oku-schedule-${profile.id}.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  })
}
