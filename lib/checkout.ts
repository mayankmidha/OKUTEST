export type CheckoutEntityType = 'APPOINTMENT' | 'GROUP_SESSION' | 'ASSESSMENT'

export function normalizeCheckoutType(type?: string | null): CheckoutEntityType {
  const normalized = (type || 'APPOINTMENT').toUpperCase()

  if (normalized === 'GROUP_SESSION') return 'GROUP_SESSION'
  if (normalized === 'ASSESSMENT') return 'ASSESSMENT'

  return 'APPOINTMENT'
}
