import { appendPrivateInboxRecord } from '@/lib/private-storage'

type CaptureLeadInput = {
  channel: 'contact' | 'trial'
  name?: string | null
  email?: string | null
  phone?: string | null
  message?: string | null
  metadata?: Record<string, unknown>
}

export async function captureLead(input: CaptureLeadInput) {
  await appendPrivateInboxRecord(`${input.channel}.ndjson`, {
    capturedAt: new Date().toISOString(),
    channel: input.channel,
    name: input.name || null,
    email: input.email || null,
    phone: input.phone || null,
    message: input.message || null,
    metadata: input.metadata || {},
  })
}
