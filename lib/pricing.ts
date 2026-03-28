import { convertCurrency, normalizeCurrencyCode } from '@/lib/currency'

export const INDIA_PRICING_REGION = 'INDIA'
export const INTERNATIONAL_PRICING_REGION = 'INTERNATIONAL'
export const DEFAULT_INDIA_SESSION_RATE = 2500
export const DEFAULT_INTERNATIONAL_SESSION_RATE = 4000

type PractitionerPricingProfile = {
  indiaSessionRate?: number | null
  internationalSessionRate?: number | null
  hourlyRate?: number | null
  baseCurrency?: string | null
}

type AppointmentBillingLike = {
  priceSnapshot?: number | null
  service?: {
    price?: number | null
  } | null
}

function roundMoney(amount: number) {
  return Number(amount.toFixed(2))
}

function toValidRate(amount?: number | null) {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return null
  }

  return roundMoney(amount)
}

function resolveLegacyRateInInr(profile?: PractitionerPricingProfile | null) {
  const legacyRate = toValidRate(profile?.hourlyRate)

  if (!legacyRate) {
    return null
  }

  const legacyCurrency = normalizeCurrencyCode(profile?.baseCurrency || 'USD')
  return roundMoney(convertCurrency(legacyRate, legacyCurrency, 'INR'))
}

export function isIndiaLocation(location?: string | null) {
  return (location || '').trim().toLowerCase() === 'india'
}

export function resolvePractitionerPricing(profile?: PractitionerPricingProfile | null) {
  const legacyRateInInr = resolveLegacyRateInInr(profile)

  const indiaSessionRate =
    toValidRate(profile?.indiaSessionRate) ??
    legacyRateInInr ??
    DEFAULT_INDIA_SESSION_RATE

  const internationalSessionRate =
    toValidRate(profile?.internationalSessionRate) ??
    legacyRateInInr ??
    DEFAULT_INTERNATIONAL_SESSION_RATE

  return {
    indiaSessionRate,
    internationalSessionRate,
  }
}

export function resolvePractitionerSessionPrice(
  profile?: PractitionerPricingProfile | null,
  clientLocation?: string | null
) {
  const pricing = resolvePractitionerPricing(profile)
  const pricingRegion = isIndiaLocation(clientLocation)
    ? INDIA_PRICING_REGION
    : INTERNATIONAL_PRICING_REGION

  return {
    pricingRegion,
    amountInInr:
      pricingRegion === INDIA_PRICING_REGION
        ? pricing.indiaSessionRate
        : pricing.internationalSessionRate,
    ...pricing,
  }
}

export function getAppointmentBillingAmount(appointment?: AppointmentBillingLike | null) {
  return roundMoney(
    toValidRate(appointment?.priceSnapshot) ??
      toValidRate(appointment?.service?.price) ??
      0
  )
}
