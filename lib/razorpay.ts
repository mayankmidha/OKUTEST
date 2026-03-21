// lib/razorpay.ts
// Stub for Razorpay integration
// In a real environment, you'd use the `razorpay` package: `npm install razorpay`

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  // Mock implementation for the stub
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    console.warn("Razorpay credentials not found. Using mock order ID.");
    return { id: `order_mock_${Math.random().toString(36).substring(7)}` };
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(key_id + ":" + key_secret).toString('base64'),
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Razorpay Error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};
