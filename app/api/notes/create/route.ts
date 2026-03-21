import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, AppointmentStatus } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.PRACTITIONER) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
      const formData = await req.formData()
      const sessionId = formData.get('sessionId') as string // This is appointmentId
      const subjective = formData.get('subjective') as string
      const objective = formData.get('objective') as string
      const assessment = formData.get('assessment') as string
      const plan = formData.get('plan') as string

      if (!sessionId) {
        return new NextResponse('Missing session ID', { status: 400 })
      }

      // Upsert the SOAP note (create if doesn't exist, update if it does)
      await prisma.soapNote.upsert({
        where: { appointmentId: sessionId },
        update: {
            subjective,
            objective,
            assessment,
            plan,
        },
        create: {
            appointmentId: sessionId,
            subjective,
            objective,
            assessment,
            plan,
        }
      })
      
      // Update appointment status to 'COMPLETED'
      await prisma.appointment.update({
          where: { id: sessionId },
          data: { status: AppointmentStatus.COMPLETED }
      })

      return NextResponse.redirect(new URL('/practitioner/dashboard', req.url), 303)
  } catch (e) {
      console.error('Error saving clinical note:', e)
      return new NextResponse('Error saving clinical note', { status: 500 })
  }
}
