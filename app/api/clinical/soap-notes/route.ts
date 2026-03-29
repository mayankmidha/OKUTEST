import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const soapNote = await req.json()
    
    // Validate required fields
    if (!soapNote.appointmentId || !soapNote.subjective || !soapNote.objective || !soapNote.assessment || !soapNote.plan) {
      return new NextResponse('Missing required SOAP fields', { status: 400 })
    }

    // Verify practitioner has access to this appointment
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: soapNote.appointmentId,
        practitionerId: session.user.id
      }
    })

    if (!appointment) {
      return new NextResponse('Appointment not found or access denied', { status: 404 })
    }

    // Create or update SOAP note
    const note = await prisma.soapNote.upsert({
      where: { appointmentId: soapNote.appointmentId },
      update: {
        subjective: soapNote.subjective,
        objective: soapNote.objective,
        assessment: soapNote.assessment,
        plan: soapNote.plan,
        status: soapNote.status || 'DRAFT',
        updatedAt: new Date()
      },
      create: {
        appointmentId: soapNote.appointmentId,
        subjective: soapNote.subjective,
        objective: soapNote.objective,
        assessment: soapNote.assessment,
        plan: soapNote.plan,
        status: soapNote.status || 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Log clinical action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SOAP_NOTE_' + (soapNote.status || 'DRAFT').toUpperCase(),
        resourceType: 'SOAP_NOTE',
        resourceId: note.id,
        changes: JSON.stringify({
          appointmentId: soapNote.appointmentId,
          status: soapNote.status || 'DRAFT'
        })
      }
    })

    return NextResponse.json(note)

  } catch (error) {
    console.error('[SOAP_NOTE_SAVE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return new NextResponse('Appointment ID required', { status: 400 })
    }

    // Get SOAP note with access control
    const soapNote = await prisma.soapNote.findFirst({
      where: {
        appointmentId,
        appointment: {
          OR: [
            { practitionerId: session.user.id },
            { clientId: session.user.id }
          ]
        }
      }
    })

    if (!soapNote) {
      return new NextResponse('SOAP note not found', { status: 404 })
    }

    return NextResponse.json(soapNote)

  } catch (error) {
    console.error('[SOAP_NOTE_GET_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
