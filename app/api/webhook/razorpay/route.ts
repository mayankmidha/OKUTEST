import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { finalizeCheckoutPayment } from '@/lib/payment-finalization'

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error("⚠️ RAZORPAY_WEBHOOK_SECRET is missing");
    return new NextResponse('Webhook secret configuration error', { status: 500 })
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('x-razorpay-signature') || headersList.get('X-Razorpay-Signature')

  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 })
  }

  // Verify Razorpay signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    console.log(`Razorpay Payment captured for order: ${payment.order_id}`)
    
    // Find the payment record by order ID
    const paymentRecord = await prisma.payment.findFirst({
      where: { razorpayOrderId: payment.order_id }
    });

    if (paymentRecord) {
      await finalizeCheckoutPayment({
        paymentId: paymentRecord.id,
        appointmentId: paymentRecord.appointmentId,
        assignmentId: paymentRecord.assignedAssessmentId,
        processor: 'razorpay',
      })
    } else {
      console.warn(`Payment record not found for Razorpay Order ID: ${payment.order_id}`);
    }
  }

  return new NextResponse(null, { status: 200 })
}
