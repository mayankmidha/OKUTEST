import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-11' as any,
      appInfo: {
        name: 'Oku Therapy',
      },
    })
  : null

export const isStripeConfigured = Boolean(stripeClient)

export function getStripeClient() {
  if (!stripeClient) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY before using Stripe payments.')
  }

  return stripeClient
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured. Set STRIPE_WEBHOOK_SECRET.')
  }

  return webhookSecret
}
