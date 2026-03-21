import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const sessionId = formData.get('sessionId') as string // This is actually appointmentId based on frontend usage
  const method = formData.get('method') as string

  if (!sessionId) {
    return new NextResponse('Missing session ID', { status: 400 })
  }

  try {
      // Find the appointment to get the price
      const appointment = await prisma.appointment.findUnique({
        where: { id: sessionId },
        include: { service: true }
      })

      if (!appointment) {
        return new NextResponse('Appointment not found', { status: 404 })
      }

      // Create a Payment record
      await prisma.payment.create({
        data: {
            userId: session.user.id,
            appointmentId: appointment.id,
            amount: appointment.service.price,
            processor: method,
            status: PaymentStatus.PENDING
        }
      })
      
      // Redirect to success page
      return NextResponse.redirect(new URL(`/checkout/${sessionId}/success?method=${method}`, req.url), 303)
  } catch (e) {
      console.error('Error initiating payment:', e)
      return new NextResponse('Error initiating payment', { status: 500 })
  }
}
