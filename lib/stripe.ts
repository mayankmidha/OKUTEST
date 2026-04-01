import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("⚠️ STRIPE_SECRET_KEY is missing. Stripe features will fail. Please set it in .env");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-11' as any,
  appInfo: {
    name: 'Oku Therapy',
  },
});
