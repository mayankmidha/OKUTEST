import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { AppointmentStatus, UserRole } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Handle form data
    const formData = await req.formData()
    const practitionerProfileId = formData.get('therapistId') as string
    const dateStr = formData.get('date') as string
    const timeStr = formData.get('time') as string

    if (!practitionerProfileId || !dateStr || !timeStr) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Combine date and time
    const startTime = new Date(dateStr)
    const [hours, minutes] = timeStr.split(':')
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Calculate end time (default 1 hour)
    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + 1)

    // Ensure ClientProfile exists for the user
    let clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
          data: { userId: session.user.id }
      })
    }

    // Ensure a default service exists
    const service = await prisma.service.upsert({
        where: { name: 'Standard Therapy Session' },
        update: {},
        create: {
            name: 'Standard Therapy Session',
            description: 'One hour individual therapy session',
            duration: 60,
            price: 150.0,
            isActive: true
        }
    })

    // Correctly resolve practitionerId (it might be a profile ID)
    let finalPractitionerId = practitionerProfileId
    const profile = await prisma.practitionerProfile.findUnique({
      where: { id: practitionerProfileId },
      select: { userId: true }
    })
    if (profile) {
      finalPractitionerId = profile.userId
    }

    // Create Appointment with PENDING status (requires advance payment)
    const appointment = await prisma.appointment.create({
      data: {
          clientId: session.user.id,
          practitionerId: finalPractitionerId,
          serviceId: service.id,
          startTime: startTime,
          endTime: endTime,
          status: AppointmentStatus.PENDING
      }
    })

    // LOG THE ACTION
    await createAuditLog({
        userId: session.user.id,
        action: 'APPOINTMENT_CREATED',
        resourceType: 'Appointment',
        resourceId: appointment.id,
        changes: JSON.stringify({ status: AppointmentStatus.SCHEDULED })
    })

    // Redirect to payment page (using appointment ID as checkout session ID)
    return NextResponse.redirect(new URL(`/checkout/${appointment.id}`, req.url), 303)

  } catch (e) {
      console.error('Appointment creation error:', e)
      return new NextResponse('Error creating appointment', { status: 500 })
  }
}
