import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.json(
      {
        error: 'Legacy PaymentIntent checkout is retired. Use the hosted checkout endpoints instead.',
      },
      { status: 410 }
    )
  } catch (error: any) {
    console.error('[STRIPE_CREATE_INTENT]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
