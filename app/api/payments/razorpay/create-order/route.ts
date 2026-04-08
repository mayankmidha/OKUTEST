import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.json(
      {
        error: 'Legacy Razorpay order creation is retired. Use the hosted checkout flow instead.',
      },
      { status: 410 }
    )
  } catch (error: any) {
    console.error('[RAZORPAY_CREATE_ORDER]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
