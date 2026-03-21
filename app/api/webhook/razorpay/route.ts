import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('X-Razorpay-Signature') as string

  // Verify Razorpay signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    console.log(`Razorpay Payment successful for ${payment.order_id}`)
    
    // Logic to update Appointment and Payment records in Prisma
    /*
    await prisma.appointment.update({
      where: { razorpayOrderId: payment.order_id },
      data: { status: 'confirmed', paidAt: new Date(), razorpayPaymentId: payment.id }
    })
    */
  }

  return new NextResponse(null, { status: 200 })
}
