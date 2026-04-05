import { getStripeClient } from './stripe'
import { prisma } from './prisma'

/**
 * STRIPE CONNECT: Practitioner Transfers
 * Handles moving money from the platform account to the therapist's connected account.
 */
export async function transferPayoutToPractitioner(payoutId: string) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      practitioner: {
        include: {
          practitionerProfile: {
            select: { stripeAccountId: true }
          }
        }
      }
    }
  })

  if (!payout) throw new Error('Payout not found')
  if (payout.status === 'COMPLETED') throw new Error('Payout already completed')
  
  const stripeAccountId = payout.practitioner.practitionerProfile?.stripeAccountId
  if (!stripeAccountId) {
    throw new Error('Practitioner does not have a connected Stripe account.')
  }

  const stripe = getStripeClient()

  try {
    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.amount * 100), // convert to cents/paise
      currency: payout.currency.toLowerCase(),
      destination: stripeAccountId,
      description: `Payout for period ${payout.periodStart.toDateString()} - ${payout.periodEnd.toDateString()}`,
      metadata: {
        payoutId: payout.id,
        practitionerId: payout.practitionerId
      }
    })

    // Update payout record in DB
    await prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: 'COMPLETED',
        referenceId: transfer.id,
        processedAt: new Date(),
      }
    })

    return transfer
  } catch (error: any) {
    console.error('[STRIPE_TRANSFER_ERROR]', error)
    
    await prisma.payout.update({
      where: { id: payout.id },
      data: { status: 'FAILED' }
    })

    throw new Error(`Transfer failed: ${error.message}`)
  }
}

/**
 * STRIPE CONNECT: Onboarding
 * Generates an account link for a practitioner to set up their Connect account.
 */
export async function createPractitionerConnectedAccount(userId: string, email: string) {
  const stripe = getStripeClient()

  // 1. Create the account
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { userId }
  })

  // 2. Update the practitioner profile with the account ID
  await prisma.practitionerProfile.update({
    where: { userId },
    data: { stripeAccountId: account.id }
  })

  // 3. Create an account link for the user to complete onboarding
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/practitioner/billing?refresh=true`,
    return_url: `${origin}/practitioner/billing?success=true`,
    type: 'account_onboarding',
  })

  return accountLink.url
}
