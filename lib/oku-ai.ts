import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

type RecentAssessment = {
  title?: string | null
  result?: string | null
  score?: number | null
}

type LegacyTranscriptContext = {
  serviceName?: string | null
  clientName?: string | null
  practitionerName?: string | null
  recentAssessments?: RecentAssessment[]
}

export type OkuAiSettings = {
  okuAiEnabled: boolean
  multilingualAiEnabled: boolean
  autoTranslateTranscripts: boolean
  adhdCareModeEnabled: boolean
  requireConsentBeforeTranscription: boolean
  transcriptRetentionDays: number
}

type AnalyzeClinicalTranscriptInput = {
  transcriptContent: string
  patientName?: string | null
  sessionType?: string | null
  practitionerName?: string | null
  recentAssessments?: RecentAssessment[]
  settings?: Partial<OkuAiSettings>
}

type TranscribeClinicalAudioInput = {
  audioBase64: string
  mimeType: string
  languageHint?: string | null
  settings?: Partial<OkuAiSettings>
}

type RawTranscriptAnalysis = {
  detectedLanguage?: unknown
  summary?: unknown
  sentiment?: unknown
  riskLevel?: unknown
  keyInsights?: unknown
  sentimentScores?: {
    distress?: unknown
    hope?: unknown
    regulation?: unknown
    engagement?: unknown
  } | unknown
  clinicalSignals?: unknown
  adhdSignals?: unknown
  careRecommendations?: unknown
  soapNote?: {
    S?: unknown
    O?: unknown
    A?: unknown
    P?: unknown
  } | unknown
}

export type TranscriptAnalysis = {
  detectedLanguage: string
  summary: string
  sentiment: string
  riskLevel: string
  keyInsights: string[]
  sentimentScores: {
    distress: number
    hope: number
    regulation: number
    engagement: number
  }
  clinicalSignals: string[]
  adhdSignals: string[]
  careRecommendations: string[]
  soapNote: {
    S: string
    O: string
    A: string
    P: string
  }
}

export type AudioTranscription = {
  transcript: string
  detectedLanguage: string
}

export type ClinicalScribeDraft = {
  subjective: string
  objective: string
  assessment: string
  plan: string
  careFocus: string[]
  adhdSupportSuggestions: string[]
}

const DEFAULT_SETTINGS: OkuAiSettings = {
  okuAiEnabled: true,
  multilingualAiEnabled: true,
  autoTranslateTranscripts: true,
  adhdCareModeEnabled: true,
  requireConsentBeforeTranscription: true,
  transcriptRetentionDays: 365,
}

const DEFAULT_ANALYSIS: TranscriptAnalysis = {
  detectedLanguage: 'Unknown',
  summary: 'Transcript received, but advanced analysis is still pending.',
  sentiment: 'STABLE',
  riskLevel: 'LOW',
  keyInsights: [],
  sentimentScores: {
    distress: 0,
    hope: 0,
    regulation: 0,
    engagement: 0,
  },
  clinicalSignals: [],
  adhdSignals: [],
  careRecommendations: [],
  soapNote: {
    S: '',
    O: '',
    A: '',
    P: '',
  },
}

function clampScore(value: unknown) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 0
  }

  return Math.max(0, Math.min(100, Number(numericValue.toFixed(2))))
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .slice(0, 8)
}

function extractJsonObject(text: string) {
  const cleaned = text.replace(/```json|```/gi, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in model response')
    }

    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
  }
}

function normalizeTranscriptAnalysis(rawAnalysis: RawTranscriptAnalysis): TranscriptAnalysis {
  const rawSoapNote =
    rawAnalysis.soapNote && typeof rawAnalysis.soapNote === 'object'
      ? rawAnalysis.soapNote as TranscriptAnalysis['soapNote']
      : DEFAULT_ANALYSIS.soapNote

  const rawScores =
    rawAnalysis.sentimentScores && typeof rawAnalysis.sentimentScores === 'object'
      ? rawAnalysis.sentimentScores as TranscriptAnalysis['sentimentScores']
      : DEFAULT_ANALYSIS.sentimentScores

  return {
    detectedLanguage: String(rawAnalysis.detectedLanguage || DEFAULT_ANALYSIS.detectedLanguage).trim(),
    summary: String(rawAnalysis.summary || DEFAULT_ANALYSIS.summary).trim(),
    sentiment: String(rawAnalysis.sentiment || DEFAULT_ANALYSIS.sentiment).trim().toUpperCase(),
    riskLevel: String(rawAnalysis.riskLevel || DEFAULT_ANALYSIS.riskLevel).trim().toUpperCase(),
    keyInsights: asStringArray(rawAnalysis.keyInsights),
    sentimentScores: {
      distress: clampScore(rawScores.distress),
      hope: clampScore((rawScores as any).hope),
      regulation: clampScore(rawScores.regulation),
      engagement: clampScore((rawScores as any).engagement),
    },
    clinicalSignals: asStringArray(rawAnalysis.clinicalSignals),
    adhdSignals: asStringArray(rawAnalysis.adhdSignals),
    careRecommendations: asStringArray(rawAnalysis.careRecommendations),
    soapNote: {
      S: String(rawSoapNote.S || '').trim(),
      O: String(rawSoapNote.O || '').trim(),
      A: String(rawSoapNote.A || '').trim(),
      P: String(rawSoapNote.P || '').trim(),
    },
  }
}

function buildSettingsOverride(settings?: Partial<OkuAiSettings>) {
  return {
    ...DEFAULT_SETTINGS,
    ...(settings || {}),
  }
}

function normalizeTranscriptInput(
  input: string | AnalyzeClinicalTranscriptInput,
  legacyContext?: LegacyTranscriptContext
) {
  if (typeof input === 'string') {
    return {
      transcriptContent: input,
      patientName: legacyContext?.clientName,
      sessionType: legacyContext?.serviceName,
      practitionerName: legacyContext?.practitionerName,
      recentAssessments: legacyContext?.recentAssessments,
      settings: DEFAULT_SETTINGS,
    }
  }

  return {
    ...input,
    recentAssessments: input.recentAssessments || [],
    settings: buildSettingsOverride(input.settings),
  }
}

function inferTranscriptSignals(transcriptContent: string) {
  const normalizedTranscript = transcriptContent.toLowerCase()

  const riskKeywords = [
    'suicide',
    'kill myself',
    'self harm',
    'self-harm',
    'overdose',
    'end my life',
    'hurt myself',
    'violent',
    'voices',
    'hallucination',
  ]
  const distressKeywords = ['overwhelmed', 'anxious', 'panic', 'hopeless', 'can’t cope', "can't cope", 'stressed']
  const improvementKeywords = ['better', 'improved', 'calmer', 'stable', 'hopeful', 'progress']
  const adhdKeywords = [
    'adhd',
    'distracted',
    'distractible',
    'time blindness',
    'forgot',
    'forgetful',
    'task paralysis',
    'impulsive',
    'executive function',
    'procrastination',
    'hyperfocus',
  ]

  const hasCriticalRisk = riskKeywords.some((keyword) => normalizedTranscript.includes(keyword))
  const hasDistress = distressKeywords.some((keyword) => normalizedTranscript.includes(keyword))
  const hasImprovement = improvementKeywords.some((keyword) => normalizedTranscript.includes(keyword))
  const hasAdhdMarkers = adhdKeywords.some((keyword) => normalizedTranscript.includes(keyword))

  return {
    riskLevel: hasCriticalRisk ? 'HIGH' : hasDistress ? 'MEDIUM' : 'LOW',
    sentiment: hasCriticalRisk ? 'AT_RISK' : hasDistress ? 'DISTRESSED' : hasImprovement ? 'IMPROVING' : 'STABLE',
    clinicalSignals: [
      hasCriticalRisk ? 'Acute risk language detected in transcript.' : null,
      hasDistress ? 'Transcript reflects elevated distress or overwhelm.' : null,
      hasImprovement ? 'Transcript includes markers of stabilization or progress.' : null,
    ].filter(Boolean) as string[],
    adhdSignals: hasAdhdMarkers
      ? [
          'Break tasks into one visible next step.',
          'Use external reminders, timers, and written capture systems.',
          'Reduce overwhelm by narrowing focus to one priority block at a time.',
        ]
      : [],
  }
}

function fallbackTranscriptAnalysis(input: ReturnType<typeof normalizeTranscriptInput>): TranscriptAnalysis {
  const inferredSignals = inferTranscriptSignals(input.transcriptContent)

  return {
    ...DEFAULT_ANALYSIS,
    detectedLanguage: 'Unknown',
    summary: input.settings.autoTranslateTranscripts
      ? 'Transcript captured. OKU Core fallback analysis generated a provisional English summary pending live model output.'
      : 'Transcript captured. OKU Core fallback analysis generated a provisional clinical summary pending live model output.',
    sentiment: inferredSignals.sentiment,
    riskLevel: inferredSignals.riskLevel,
    keyInsights: [
      `Session type: ${input.sessionType || 'Clinical session'}`,
      input.patientName ? `Patient context available for ${input.patientName}.` : 'Patient identity not supplied.',
      inferredSignals.clinicalSignals[0] || 'Fallback analysis used heuristic transcript markers.',
    ].filter(Boolean),
    sentimentScores: {
      distress: inferredSignals.riskLevel === 'HIGH' ? 92 : inferredSignals.riskLevel === 'MEDIUM' ? 68 : 22,
      hope: inferredSignals.sentiment === 'IMPROVING' ? 74 : inferredSignals.sentiment === 'AT_RISK' ? 18 : 44,
      regulation: inferredSignals.sentiment === 'IMPROVING' ? 66 : inferredSignals.riskLevel === 'HIGH' ? 24 : 41,
      engagement: inferredSignals.sentiment === 'IMPROVING' ? 72 : 48,
    },
    clinicalSignals: inferredSignals.clinicalSignals,
    adhdSignals: inferredSignals.adhdSignals,
    careRecommendations: [
      inferredSignals.riskLevel === 'HIGH'
        ? 'Escalate to direct clinician review immediately.'
        : 'Review transcript manually before finalizing clinical documentation.',
      inferredSignals.adhdSignals.length > 0
        ? 'Consider structured executive-function supports in follow-up planning.'
        : 'Use transcript themes to guide next-session focus.',
    ],
    soapNote: {
      S: 'Fallback clinical summary generated from transcript heuristics.',
      O: 'Detailed structured note pending model-assisted review.',
      A: inferredSignals.clinicalSignals[0] || 'No acute heuristic flags detected.',
      P: inferredSignals.riskLevel === 'HIGH'
        ? 'Prioritize clinician review and safety assessment.'
        : 'Review transcript manually and complete plan in session context.',
    },
  }
}

function buildTranscriptPrompt(input: ReturnType<typeof normalizeTranscriptInput>) {
  return `
You are OKU CORE AI, a multilingual clinical intelligence system for psychotherapy and psychiatry.

Requirements:
- Multilingual understanding is ${input.settings.multilingualAiEnabled ? 'enabled' : 'disabled'}.
- Automatic transcript translation is ${input.settings.autoTranslateTranscripts ? 'enabled' : 'disabled'}.
- ADHD care mode is ${input.settings.adhdCareModeEnabled ? 'enabled' : 'disabled'}.
- Understand and analyze the transcript even if it is written in Hindi, Urdu, Punjabi, Arabic, Spanish, French, English, or code-switched across multiple languages.
- Detect the dominant language used in the transcript.
- Keep the raw transcript untouched.
- Write the clinical summary and SOAP note in professional English.
- Be trauma-informed, clinically grounded, and concise.
- Flag attention and executive-function patterns when they appear, especially ADHD-like markers such as distractibility, time blindness, task paralysis, impulsivity, forgetfulness, overwhelm, inconsistent follow-through, or emotional dysregulation.
- Use sentiment in a clinical way, not as a generic mood label.
- Do not invent suicidal, homicidal, psychotic, or abuse risk. Only elevate risk when clear markers appear in the transcript.

Session context:
${JSON.stringify(
    {
      patientName: input.patientName,
      sessionType: input.sessionType,
      practitionerName: input.practitionerName,
      recentAssessments: input.recentAssessments || [],
    },
    null,
    2
  )}

Return ONLY valid JSON using this exact shape:
{
  "detectedLanguage": "English / Hindi / Mixed / ...",
  "summary": "2-3 paragraphs in English",
  "sentiment": "IMPROVING | STABLE | DISTRESSED | AT_RISK",
  "riskLevel": "LOW | MEDIUM | HIGH",
  "keyInsights": ["..."],
  "sentimentScores": {
    "distress": 0 to 100,
    "hope": 0 to 100,
    "regulation": 0 to 100,
    "engagement": 0 to 100
  },
  "clinicalSignals": ["..."],
  "adhdSignals": ["..."],
  "careRecommendations": ["..."],
  "soapNote": {
    "S": "...",
    "O": "...",
    "A": "...",
    "P": "..."
  }
}

Transcript:
${input.transcriptContent}
`.trim()
}

function createModel(systemInstruction: string, modelName = 'gemini-1.5-flash') {
  if (!process.env.GEMINI_API_KEY) {
    return null
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
  })
}

export async function getOkuAiSettings(): Promise<OkuAiSettings> {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'global' },
    select: {
      okuAiEnabled: true,
      multilingualAiEnabled: true,
      autoTranslateTranscripts: true,
      adhdCareModeEnabled: true,
      requireConsentBeforeTranscription: true,
      transcriptRetentionDays: true,
    },
  })

  return {
    ...DEFAULT_SETTINGS,
    ...(settings || {}),
  }
}

export async function transcribeClinicalAudio(input: TranscribeClinicalAudioInput): Promise<AudioTranscription> {
  const settings = buildSettingsOverride(input.settings)
  const model = createModel(
    'You are OKU CORE AI transcription. Transcribe clinical audio accurately, preserve meaning, support multilingual speech, and respond with strict JSON only.'
  )

  if (!settings.okuAiEnabled || !model) {
    throw new Error('OKU_AI_TRANSCRIPTION_OFFLINE')
  }

  const prompt = `
Transcribe this clinical audio as accurately as possible.

Rules:
- Multilingual transcription is ${settings.multilingualAiEnabled ? 'enabled' : 'disabled'}.
- Preserve speaker turns when obvious, using labels like "Practitioner:" and "Client:".
- Do not summarize.
- Do not omit filler that changes clinical meaning.
- If the spoken language is mixed, say "Mixed" and name the dominant language.
- Use the provided language hint only if it matches the audio: ${input.languageHint || 'none'}.

Return ONLY JSON:
{
  "transcript": "full transcript text",
  "detectedLanguage": "English / Hindi / Mixed / ..."
}
`.trim()

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        data: input.audioBase64,
        mimeType: input.mimeType,
      },
    },
  ])

  const parsed = extractJsonObject(result.response.text()) as {
    transcript?: unknown
    detectedLanguage?: unknown
  }

  const transcript = String(parsed.transcript || '').trim()

  if (!transcript) {
    throw new Error('AUDIO_TRANSCRIPTION_EMPTY')
  }

  return {
    transcript,
    detectedLanguage: String(parsed.detectedLanguage || 'Unknown').trim(),
  }
}

export async function analyzeClinicalTranscript(
  input: string | AnalyzeClinicalTranscriptInput,
  legacyContext?: LegacyTranscriptContext
) {
  const normalizedInput = normalizeTranscriptInput(input, legacyContext)
  const model = createModel(
    'You are OKU CORE AI. Produce clinically grounded, multilingual transcript analysis as strict JSON.'
  )

  if (!normalizedInput.settings.okuAiEnabled || !model) {
    return fallbackTranscriptAnalysis(normalizedInput)
  }

  try {
    const result = await model.generateContent(buildTranscriptPrompt(normalizedInput))
    const parsed = extractJsonObject(result.response.text()) as RawTranscriptAnalysis
    return normalizeTranscriptAnalysis(parsed)
  } catch (error) {
    console.error('[OKU_AI_ANALYSIS_FALLBACK]', error)
    return fallbackTranscriptAnalysis(normalizedInput)
  }
}

export async function draftClinicalScribe({
  patientName,
  sessionType,
  recentMoods,
  recentAssessments,
  activeGoals,
  adhdCareModeEnabled,
}: {
  patientName?: string | null
  sessionType?: string | null
  recentMoods: Array<{ score: number; notes: string | null }>
  recentAssessments: Array<{ title: string; result: string | null }>
  activeGoals?: string | null
  adhdCareModeEnabled?: boolean
}): Promise<ClinicalScribeDraft> {
  const model = createModel(
    'You are OKU CLINICAL SCRIBE. Draft concise, trauma-informed SOAP notes as strict JSON.'
  )

  if (!model) {
    return {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      careFocus: [],
      adhdSupportSuggestions: [],
    }
  }

  const result = await model.generateContent(`
Return only JSON with:
- subjective
- objective
- assessment
- plan
- careFocus (array)
- adhdSupportSuggestions (array)

Draft a note for ${patientName || 'the client'} in a ${sessionType || 'clinical session'}.
Recent moods: ${JSON.stringify(recentMoods)}
Recent assessments: ${JSON.stringify(recentAssessments)}
Active goals: ${activeGoals || 'Not provided'}

ADHD care mode is ${adhdCareModeEnabled === false ? 'disabled' : 'enabled'}.
Only include ADHD support suggestions if executive-function or ADHD patterns are relevant.
  `.trim())

  const parsed = extractJsonObject(result.response.text()) as Partial<ClinicalScribeDraft>

  return {
    subjective: String(parsed.subjective || '').trim(),
    objective: String(parsed.objective || '').trim(),
    assessment: String(parsed.assessment || '').trim(),
    plan: String(parsed.plan || '').trim(),
    careFocus: asStringArray(parsed.careFocus),
    adhdSupportSuggestions: asStringArray(parsed.adhdSupportSuggestions),
  }
}

export function getRoleAwareAiInstruction({
  role,
  preferredLanguage,
  hasAdhdSignals,
  context,
}: {
  role: string
  preferredLanguage?: string | null
  hasAdhdSignals?: boolean
  context?: string | null
}) {
  const languageInstruction = preferredLanguage
    ? `Reply in ${preferredLanguage} unless the user clearly writes in another language.`
    : 'Reply in the same language the user uses. If the user mixes languages, respond naturally in that mix when appropriate.'

  const focusInstruction = hasAdhdSignals
    ? 'When useful, offer ADHD-friendly support with short steps, low-overwhelm structure, and practical next actions.'
    : 'Prefer emotionally grounded, concrete, low-jargon guidance.'

  if (role === 'ADMIN') {
    return `${languageInstruction} ${focusInstruction} You are advising an operations leader. Prioritize risk, reliability, revenue, clinician safety, and launch readiness.${context ? ` Focus context: ${context}.` : ''}`
  }

  if (role === 'THERAPIST') {
    return `${languageInstruction} ${focusInstruction} You are a clinical co-pilot for a licensed practitioner. Help with preparation, pattern spotting, care coordination, and burnout awareness.${context ? ` Focus context: ${context}.` : ''}`
  }

  if (context === 'adhd_helper') {
    return `${languageInstruction} ${focusInstruction} You are an ADHD support companion for a therapy client. Use tiny steps, visible structure, time-boxing, body doubling, and anti-shame language. Do not diagnose, but do translate clinical recommendations into daily action.`
  }

  return `${languageInstruction} ${focusInstruction} You are a compassionate client support companion. Be supportive, non-diagnostic, and practical, and encourage escalation to the care team when risk is present.${context ? ` Focus context: ${context}.` : ''}`
}
