import { prisma } from './prisma'

type CalendarSyncProfile = {
  syncEnabled?: boolean | null
  iCalSecret?: string | null
  calendlyLink?: string | null
  googleCalendarEmail?: string | null
  googleRefreshToken?: string | null
  outlookCalendarEmail?: string | null
  outlookRefreshToken?: string | null
  appleCalendarEmail?: string | null
}

export type CalendarSyncReadiness = {
  enabled: boolean
  canPublishFeed: boolean
  providers: string[]
  mode: 'DISABLED' | 'FEED_READY' | 'MISCONFIGURED'
  summary: string
}

export function getCalendarSyncReadiness(
  profile: CalendarSyncProfile | null | undefined
): CalendarSyncReadiness {
  if (!profile?.syncEnabled) {
    return {
      enabled: false,
      canPublishFeed: false,
      providers: [],
      mode: 'DISABLED',
      summary: 'Calendar feed publishing is turned off for this practitioner.',
    }
  }

  const providers: string[] = []

  if (profile.iCalSecret) providers.push('Private iCal feed')
  if (profile.calendlyLink) providers.push('Calendly reference')
  if (profile.googleCalendarEmail) providers.push('Google calendar email')
  if (profile.outlookCalendarEmail) providers.push('Outlook calendar email')
  if (profile.appleCalendarEmail) providers.push('Apple calendar email')
  if (profile.googleRefreshToken) providers.push('Google OAuth credentials')
  if (profile.outlookRefreshToken) providers.push('Outlook OAuth credentials')

  if (!profile.iCalSecret) {
    return {
      enabled: true,
      canPublishFeed: false,
      providers,
      mode: 'MISCONFIGURED',
      summary: 'Sync is enabled, but the private calendar feed secret is missing.',
    }
  }

  return {
    enabled: true,
    canPublishFeed: true,
    providers,
    mode: 'FEED_READY',
    summary:
      'Private calendar feed is ready. Subscribed calendars can pull events from the OKU iCal feed, but direct provider event push is not configured in this runtime.',
  }
}

/**
 * Universal Calendar Sync Engine
 * Publishes truthful calendar readiness instead of pretending provider sync completed.
 */
export async function syncAppointmentToExternalCalendar(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      practitioner: {
        include: { practitionerProfile: true }
      },
      client: true,
      service: true
    }
  })

  const profile = appointment?.practitioner.practitionerProfile
  if (!appointment || !profile) {
    return {
      ok: false,
      mode: 'MISSING_CONTEXT' as const,
      message: 'Appointment or practitioner profile was not found.',
    }
  }

  const readiness = getCalendarSyncReadiness(profile)

  if (!readiness.enabled) {
    return {
      ok: false,
      mode: 'DISABLED' as const,
      message: readiness.summary,
    }
  }

  if (!readiness.canPublishFeed) {
    return {
      ok: false,
      mode: 'MISCONFIGURED' as const,
      message: readiness.summary,
    }
  }

  console.info(`[CALENDAR_FEED_READY] Appointment ${appointment.id} is available through the practitioner's private iCal feed.`)

  return {
    ok: true,
    mode: readiness.mode,
    message: readiness.summary,
    providers: readiness.providers,
    feedPath: `/api/practitioner/schedule/feed/${profile.id}?secret=${profile.iCalSecret}`,
  }
}

/**
 * Checks whether external blocks already stored in OKU overlap the requested slot.
 */
export async function checkExternalCalendarConflicts(practitionerId: string, startTime: Date, endTime: Date) {
    const conflict = await prisma.appointment.findFirst({
      where: {
        practitionerId,
        status: 'EXTERNAL_BLOCK',
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      select: { id: true },
    })

    return Boolean(conflict)
}
