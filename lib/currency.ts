export const SUPPORTED_CURRENCIES = [
  'INR',
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'CAD',
  'AED',
  'SAR',
  'SGD',
  'JPY',
  'NZD',
  'CHF',
] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export type ExchangeRateTable = {
  base: SupportedCurrency
  rates: Record<string, number>
  updatedAt?: string | null
  source?: 'live' | 'fallback'
}

const DEFAULT_CURRENCY: SupportedCurrency = 'INR'

const FALLBACK_EXCHANGE_RATES_FROM_INR: Record<SupportedCurrency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AUD: 0.019,
  CAD: 0.016,
  AED: 0.044,
  SAR: 0.045,
  SGD: 0.016,
  JPY: 1.82,
  NZD: 0.021,
  CHF: 0.011,
}

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
  CAD: 'en-CA',
  AED: 'en-AE',
  SAR: 'en-SA',
  SGD: 'en-SG',
  JPY: 'ja-JP',
  NZD: 'en-NZ',
  CHF: 'de-CH',
}

const LOCATION_TO_CURRENCY: Record<string, SupportedCurrency> = {
  IN: 'INR',
  INDIA: 'INR',
  US: 'USD',
  USA: 'USD',
  UNITEDSTATES: 'USD',
  UNITEDSTATESOFAMERICA: 'USD',
  CA: 'CAD',
  CANADA: 'CAD',
  AU: 'AUD',
  AUSTRALIA: 'AUD',
  GB: 'GBP',
  UK: 'GBP',
  UNITEDKINGDOM: 'GBP',
  ENGLAND: 'GBP',
  SCOTLAND: 'GBP',
  WALES: 'GBP',
  IE: 'EUR',
  IRELAND: 'EUR',
  FR: 'EUR',
  FRANCE: 'EUR',
  DE: 'EUR',
  GERMANY: 'EUR',
  IT: 'EUR',
  ITALY: 'EUR',
  ES: 'EUR',
  SPAIN: 'EUR',
  PT: 'EUR',
  PORTUGAL: 'EUR',
  NL: 'EUR',
  NETHERLANDS: 'EUR',
  BE: 'EUR',
  BELGIUM: 'EUR',
  AT: 'EUR',
  AUSTRIA: 'EUR',
  FI: 'EUR',
  FINLAND: 'EUR',
  GR: 'EUR',
  GREECE: 'EUR',
  AE: 'AED',
  UAE: 'AED',
  UNITEDARABEMIRATES: 'AED',
  SA: 'SAR',
  SAUDIARABIA: 'SAR',
  SG: 'SGD',
  SINGAPORE: 'SGD',
  JP: 'JPY',
  JAPAN: 'JPY',
  NZ: 'NZD',
  NEWZEALAND: 'NZD',
  CH: 'CHF',
  SWITZERLAND: 'CHF',
}

function normalizeLocationKey(location?: string | null) {
  return (location || '').replace(/[^A-Za-z]/g, '').toUpperCase()
}

function roundMoney(amount: number) {
  return Number(amount.toFixed(2))
}

export function normalizeCurrencyCode(currency?: string | null): SupportedCurrency {
  const normalized = (currency || DEFAULT_CURRENCY).trim().toUpperCase()

  if (SUPPORTED_CURRENCIES.includes(normalized as SupportedCurrency)) {
    return normalized as SupportedCurrency
  }

  return DEFAULT_CURRENCY
}

function buildRateTableForBase(base: SupportedCurrency): ExchangeRateTable {
  if (base === 'INR') {
    return {
      base,
      rates: { ...FALLBACK_EXCHANGE_RATES_FROM_INR },
      source: 'fallback',
    }
  }

  const baseRate = FALLBACK_EXCHANGE_RATES_FROM_INR[base] || 1
  const rebasedRates = Object.fromEntries(
    SUPPORTED_CURRENCIES.map((currency) => [
      currency,
      currency === base ? 1 : FALLBACK_EXCHANGE_RATES_FROM_INR[currency] / baseRate,
    ])
  )

  return {
    base,
    rates: rebasedRates,
    source: 'fallback',
  }
}

export function getFallbackExchangeRates(base: SupportedCurrency = DEFAULT_CURRENCY) {
  return buildRateTableForBase(base)
}

export async function getLiveExchangeRates(base: SupportedCurrency = DEFAULT_CURRENCY) {
  const normalizedBase = normalizeCurrencyCode(base)
  const symbols = SUPPORTED_CURRENCIES.filter((currency) => currency !== normalizedBase).join(',')

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${normalizedBase}&symbols=${symbols}`,
      {
        next: { revalidate: 60 * 60 },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch live exchange rates for ${normalizedBase}`)
    }

    const data = await response.json() as {
      base?: string
      date?: string
      rates?: Record<string, number>
    }

    return {
      base: normalizedBase,
      rates: {
        [normalizedBase]: 1,
        ...(data.rates || {}),
      },
      updatedAt: data.date || null,
      source: 'live' as const,
    }
  } catch (error) {
    console.error('[CURRENCY_RATES_FALLBACK]', error)
    return getFallbackExchangeRates(normalizedBase)
  }
}

export function formatCurrency(amount: number, currency?: string) {
  const activeCurrency = normalizeCurrencyCode(currency)

  const formatter = new Intl.NumberFormat(CURRENCY_LOCALES[activeCurrency], {
    style: 'currency',
    currency: activeCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export function getCurrencyForLocation(location?: string | null) {
  const normalizedLocation = normalizeLocationKey(location)

  if (!normalizedLocation) {
    return null
  }

  if (SUPPORTED_CURRENCIES.includes(normalizedLocation as SupportedCurrency)) {
    return normalizedLocation as SupportedCurrency
  }

  return LOCATION_TO_CURRENCY[normalizedLocation] || null
}

export function detectCurrency(location?: string | null) {
  const explicitCurrency = getCurrencyForLocation(location)
  if (explicitCurrency) {
    return explicitCurrency
  }

  if (typeof window !== 'undefined') {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale
    const region = locale.split('-')[1]
    const localeCurrency = getCurrencyForLocation(region)
    if (localeCurrency) {
      return localeCurrency
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone === 'Asia/Kolkata' || timezone.startsWith('Asia/Calcutta')) {
      return 'INR'
    }
  }

  return DEFAULT_CURRENCY
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  exchangeRateTable: ExchangeRateTable = getFallbackExchangeRates()
) {
  const normalizedFrom = normalizeCurrencyCode(from)
  const normalizedTo = normalizeCurrencyCode(to)

  if (!Number.isFinite(amount)) {
    return 0
  }

  if (normalizedFrom === normalizedTo) {
    return roundMoney(amount)
  }

  const baseCurrency = normalizeCurrencyCode(exchangeRateTable.base)
  const normalizedRates = {
    [baseCurrency]: 1,
    ...exchangeRateTable.rates,
  }

  const fromRate = normalizedFrom === baseCurrency ? 1 : normalizedRates[normalizedFrom]
  const toRate = normalizedTo === baseCurrency ? 1 : normalizedRates[normalizedTo]

  if (fromRate && toRate) {
    const baseAmount = normalizedFrom === baseCurrency ? amount : amount / fromRate
    const convertedAmount = normalizedTo === baseCurrency ? baseAmount : baseAmount * toRate
    return roundMoney(convertedAmount)
  }

  const fallbackRates = getFallbackExchangeRates(baseCurrency)
  const fallbackFromRate = normalizedFrom === fallbackRates.base ? 1 : fallbackRates.rates[normalizedFrom]
  const fallbackToRate = normalizedTo === fallbackRates.base ? 1 : fallbackRates.rates[normalizedTo]
  const fallbackBaseAmount = normalizedFrom === fallbackRates.base ? amount : amount / fallbackFromRate
  const fallbackConvertedAmount =
    normalizedTo === fallbackRates.base ? fallbackBaseAmount : fallbackBaseAmount * fallbackToRate

  return roundMoney(fallbackConvertedAmount)
}

export function autoConvert(
  amount: number,
  userLocation?: string | null,
  sourceCurrency: string = 'USD',
  exchangeRateTable?: ExchangeRateTable
) {
  const currency = detectCurrency(userLocation)
  const rates = exchangeRateTable || getFallbackExchangeRates(normalizeCurrencyCode(sourceCurrency))

  return {
    amount: convertCurrency(amount, sourceCurrency, currency, rates),
    currency,
  }
}

export function localizeAmount(
  amount: number,
  userLocation?: string | null,
  sourceCurrency: string = 'INR',
  exchangeRateTable?: ExchangeRateTable,
  preferredCurrency?: string | null
) {
  const currency = normalizeCurrencyCode(preferredCurrency || detectCurrency(userLocation))
  const rates = exchangeRateTable || getFallbackExchangeRates(normalizeCurrencyCode(sourceCurrency))

  return {
    amount: convertCurrency(amount, sourceCurrency, currency, rates),
    currency,
  }
}

export const convertToINR = (amount: number, sourceCurrency: string = 'USD') => {
  return convertCurrency(amount, sourceCurrency, 'INR')
}
