import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { amount, currency = 'INR' } = await req.json()

    const order = await createRazorpayOrder(amount, currency)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('[RAZORPAY_CREATE_ORDER]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
