import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { awardReferralRewardForAppointment } from '@/lib/referrals'

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
      // 1. Update Payment Record
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { 
            status: PaymentStatus.COMPLETED,
            updatedAt: new Date()
        }
      });

      // 2. Update Appointment Status
      if (paymentRecord.appointmentId) {
        await prisma.appointment.update({
            where: { id: paymentRecord.appointmentId },
            data: { 
                status: AppointmentStatus.SCHEDULED,
                updatedAt: new Date()
            }
        });
        console.log(`[RAZORPAY_WEBHOOK] Appointment ${paymentRecord.appointmentId} confirmed.`);
        
        try {
            await awardReferralRewardForAppointment(paymentRecord.appointmentId);
        } catch (e) {
            console.error('Failed to award referral reward via Razorpay', e);
        }
      }
    } else {
      console.warn(`Payment record not found for Razorpay Order ID: ${payment.order_id}`);
    }
  }

  return new NextResponse(null, { status: 200 })
}
