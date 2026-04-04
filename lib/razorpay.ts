import Razorpay from 'razorpay'

export const IS_RAZORPAY_ENABLED = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
)

export const razorpay = IS_RAZORPAY_ENABLED
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  : null

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  if (!razorpay) {
    throw new Error('Razorpay is not initialized. Please check your environment variables.')
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Razorpay Order Error:', error)
    throw new Error('Failed to create Razorpay order')
  }
}
