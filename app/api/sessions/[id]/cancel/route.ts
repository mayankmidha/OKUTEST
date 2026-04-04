import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getStripeClient, isStripeConfigured } from '@/lib/stripe'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { sendCancellationEmail } from '@/lib/notifications'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const reason: string | undefined = body.reason

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        payments: true,
        client: true,
        practitioner: true,
        service: true,
      },
    })

    if (!appointment) {
      return new NextResponse('Session not found', { status: 404 })
    }

    const isClient = appointment.clientId === session.user.id
    const isPractitioner = appointment.practitionerId === session.user.id

    if (!isClient && !isPractitioner) {
      return new NextResponse('Unauthorized access to this session.', { status: 403 })
    }

    // Cannot cancel already-terminal statuses
    const terminalStatuses: AppointmentStatus[] = [
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
    ]
    if (terminalStatuses.includes(appointment.status)) {
      return new NextResponse(
        `Cannot cancel a session with status: ${appointment.status}`,
        { status: 400 }
      )
    }

    const now = Date.now()
    const hoursUntilSession =
      (new Date(appointment.startTime).getTime() - now) / 3_600_000

    let refunded = false

    if (hoursUntilSession > 8) {
      // Attempt refund
      const completedPayment = appointment.payments.find(
        (p) =>
          p.status === PaymentStatus.COMPLETED &&
          p.processor === 'stripe' &&
          p.stripePaymentId
      )

      let refundFailed = false;

      if (completedPayment?.stripePaymentId) {
        try {
          if (!isStripeConfigured) {
            throw new Error('Stripe refunds are not configured in this environment.')
          }

          const stripe = getStripeClient()
          await stripe.refunds.create({
            payment_intent: completedPayment.stripePaymentId,
          })
          await prisma.payment.update({
            where: { id: completedPayment.id },
            data: { status: PaymentStatus.REFUNDED },
          })
          refunded = true
        } catch (stripeErr) {
          console.error('[CANCEL_REFUND_ERROR]', stripeErr)
          // Proceed with cancellation even if refund fails; mark as PENDING for manual review
          refundFailed = true;
        }
      }

      await prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CANCELLED,
          refundStatus: refunded ? 'PROCESSED' : (refundFailed ? 'PENDING' : 'NONE'),
          cancellationReason: reason ?? null,
        },
      })
    } else {
      // Within 8-hour window — no refund
      await prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CANCELLED,
          refundStatus: 'NONE',
          cancellationReason: reason ?? null,
        },
      })
    }

    // Fire-and-forget: notifications
    sendCancellationEmail(id, refunded).catch((e) =>
      console.error('[CANCEL_EMAIL_ERROR]', e)
    )

    return NextResponse.json({ success: true, refunded })
  } catch (error) {
    console.error('[SESSION_CANCEL_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
