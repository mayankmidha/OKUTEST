import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing. Stripe features will fail.");
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder_disabled', {
  apiVersion: '2025-02-11' as any,
  appInfo: {
    name: 'Oku Therapy',
  },
});
