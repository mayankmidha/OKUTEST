import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, SoapNoteStatus } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const soapNote = await req.json()
    
    // Auto-save draft functionality
    if (soapNote.status === 'DRAFT') {
      const note = await prisma.soapNote.upsert({
        where: { appointmentId: soapNote.appointmentId },
        update: {
          subjective: soapNote.subjective,
          objective: soapNote.objective,
          assessment: soapNote.assessment,
          plan: soapNote.plan,
          status: SoapNoteStatus.DRAFT,
          updatedAt: new Date()
        },
        create: {
          appointmentId: soapNote.appointmentId,
          subjective: soapNote.subjective,
          objective: soapNote.objective,
          assessment: soapNote.assessment,
          plan: soapNote.plan,
          status: SoapNoteStatus.DRAFT,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return NextResponse.json({ message: 'Draft saved', note })
    }

    return new NextResponse('Invalid draft request', { status: 400 })

  } catch (error) {
    console.error('[SOAP_NOTE_DRAFT_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
