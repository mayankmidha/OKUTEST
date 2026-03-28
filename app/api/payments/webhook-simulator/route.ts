import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { awardReferralRewardForAppointment } from '@/lib/referrals'

export async function POST(req: Request) {
  try {
    const { sessionId, method } = await req.json()

    if (!sessionId) {
      return new NextResponse('Missing sessionId', { status: 400 })
    }

    // Simulate real webhook behavior (confirmed only after payment)
    // Here sessionId is actually appointmentId
    const updatedAppointment = await prisma.appointment.update({
      where: { id: sessionId },
      include: { client: true },
      data: {
          status: AppointmentStatus.CONFIRMED,
      }
    })

    // Update associated payment(s)
    await prisma.payment.updateMany({
        where: { appointmentId: sessionId },
        data: {
            status: PaymentStatus.COMPLETED,
            processor: method
        }
    })

    // LOG THE ACTION
    await createAuditLog({
        userId: updatedAppointment.clientId || 'system',
        action: 'PAYMENT_PROCESSED',
        resourceType: 'Payment',
        resourceId: sessionId,
        changes: JSON.stringify({ status: 'CONFIRMED', method })
    })

    await awardReferralRewardForAppointment(sessionId)

    return NextResponse.json({ success: true })
  } catch (e) {
      console.error('Webhook simulator error:', e)
      return new NextResponse('Error simulating webhook', { status: 500 })
  }
}
