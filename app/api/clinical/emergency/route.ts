import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { triggerEmergencyAlert } from "@/lib/notifications"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { appointmentId } = await req.json()

    if (!appointmentId) {
      return new NextResponse('Missing appointment ID', { status: 400 })
    }

    // Verify the person triggering is the practitioner or authorized admin
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { practitioner: true, client: true }
    })

    if (!appointment) {
        return new NextResponse('Appointment not found', { status: 404 })
    }

    if (appointment.practitionerId !== session.user.id && session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized to trigger emergency for this session', { status: 403 })
    }

    // Trigger the Industrial-grade Emergency Protocol
    await triggerEmergencyAlert({
        appointmentId,
        riskLevel: 'HIGH', // Manual triggers are always high risk
        clinicalSignals: ['MANUAL_PRACTITIONER_TRIGGER', 'IN_SESSION_CRISIS_ALERT']
    })

    // Log the emergency activity for HIPAA audit trail
    await prisma.userActivity.create({
        data: {
            userId: session.user.id,
            action: 'EMERGENCY_TRIGGERED',
            category: 'CLINICAL_SAFETY',
            metadata: { appointmentId, clientId: appointment.clientId },
        }
    })

    return NextResponse.json({ success: true, message: 'Emergency protocols activated.' })

  } catch (e) {
    console.error('[EMERGENCY_API_ERROR]', e)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
