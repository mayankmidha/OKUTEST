import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.error("⚠️ STRIPE_SECRET_KEY is missing. Stripe features will fail. Please set it in .env");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-11' as any,
  appInfo: {
    name: 'Oku Therapy',
  },
});
