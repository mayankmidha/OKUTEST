import { prisma } from '@/lib/prisma'
import { analyzeClinicalTranscript, getOkuAiSettings, ClinicalIntelligence } from './oku-ai'

/**
 * MASTER AI UPGRADE: Long-Term Memory
 * Fetches historical context for a patient to provide continuity in AI analysis.
 */
export async function getPatientClinicalMemory(clientId: string) {
  const pastSessions = await prisma.appointment.findMany({
    where: {
      clientId,
      status: 'COMPLETED',
      transcript: { isNot: null },
    },
    include: {
      transcript: true,
      soapNote: true,
    },
    orderBy: { startTime: 'desc' },
    take: 5,
  })

  if (pastSessions.length === 0) return null

  const historySummary = pastSessions
    .map((s, i) => {
      const date = s.startTime.toDateString()
      const summary = s.transcript?.summary || 'No summary available'
      const plan = s.soapNote?.plan || 'No plan recorded'
      return `[Session ${pastSessions.length - i} on ${date}]: Summary: ${summary}. Plan: ${plan}.`
    })
    .join('\n\n')

  return historySummary
}

/**
 * MASTER AI UPGRADE: Historical Analysis Pipeline
 * Wraps the standard analysis with historical memory and multilingual translation.
 */
export async function analyzeTranscriptWithMemory({
  appointmentId,
  transcriptContent,
  clientId,
}: {
  appointmentId: string
  transcriptContent: string
  clientId: string
}): Promise<ClinicalIntelligence> {
  const [appointment, memory, settings] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        practitioner: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
    getPatientClinicalMemory(clientId),
    getOkuAiSettings(),
  ])

  if (!appointment) throw new Error('Appointment not found')

  // Multilingual Support: Instruction to LLM to handle Hinglish/Code-switching
  const enhancedContent = `
    HISTORICAL MEMORY (LAST 5 SESSIONS):
    ${memory || 'No historical data available for this new patient.'}

    CURRENT TRANSCRIPT (MAY CONTAIN CODE-SWITCHING OR MULTILINGUAL DIALOGUE):
    ${transcriptContent}
  `

  return analyzeClinicalTranscript({
    transcriptContent: enhancedContent,
    patientName: `Patient-${clientId.slice(-4)}`,
    sessionType: appointment.service?.name,
    practitionerName: appointment.practitioner.name,
    settings,
  })
}
