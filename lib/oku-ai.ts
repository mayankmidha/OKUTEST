import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export function isOkuAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY)
}

function getConfiguredModel(model: string) {
  if (!isOkuAiConfigured()) {
    throw new Error('OKU_AI_PROVIDER_UNAVAILABLE')
  }

  return genAI.getGenerativeModel({ model })
}

/**
 * PII Scrubber (The Privacy Shield)
 * Removes names, emails, and phone numbers before sending data to LLMs.
 */
export function scrubPII(text: string, patientName?: string | null): string {
  if (!text) return text;
  let scrubbed = text;
  
  // Remove specific patient name if provided
  if (patientName) {
    const nameRegex = new RegExp(patientName, 'gi');
    scrubbed = scrubbed.replace(nameRegex, '[PATIENT]');
  }

  // Remove generic email patterns
  scrubbed = scrubbed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  
  // Remove phone numbers (basic pattern)
  scrubbed = scrubbed.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]');

  return scrubbed;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ClinicalIntelligence {
  summary: string
  sentiment: string
  riskLevel: RiskLevel
  clinicalSignals: string[]
  keyInsights: string[] // Legacy support
  sentimentScores: any // Legacy support
  adhdSignals: string[] // Legacy support
  suicideRisk: string // Predicted risk description
  violenceRisk: string
  selfHarmDetection: boolean
  emotionRecognition: string[]
  icd10Suggestions: string[]
  treatmentRecommendations: string[]
  careRecommendations: string[] // Legacy support
  behavioralPatterns: string
  soapNote: {
    S: string
    O: string
    A: string
    P: string
  }
  detectedLanguage: string
}

/**
 * AI Clinical Intelligence 2.0 Engine
 */
export async function analyzeClinicalTranscript({
  transcriptContent,
  patientName = "The Patient",
  sessionType = "General Therapy",
  practitionerName = "The Therapist",
  recentAssessments = [],
  settings
}: {
  transcriptContent: string
  patientName?: string | null
  sessionType?: string | null
  practitionerName?: string | null
  recentAssessments?: any[]
  settings: any
}): Promise<ClinicalIntelligence> {
  const model = getConfiguredModel("gemini-1.5-pro")

  const prompt = `
    You are an advanced Clinical AI Brain for Oku Therapy. You are analyzing a therapy session transcript between ${practitionerName} and ${patientName}.
    Your goal is to provide medical-grade clinical intelligence, risk stratification, and documentation support.

    CONTEXT:
    - Session Type: ${sessionType}
    - Recent Assessments: ${JSON.stringify(recentAssessments)}
    ADHD Care Mode: ${settings.adhdCareModeEnabled ? 'ENABLED' : 'DISABLED'}

    TRANSCRIPT (SCRUBBED FOR PRIVACY):
    """
    ${scrubPII(transcriptContent, patientName)}
    """

    TASK:
    Analyze the transcript and return a JSON object with the following fields:
    1. "summary": Concise clinical summary.
    2. "sentiment": Overall session sentiment.
    3. "riskLevel": One of "LOW", "MEDIUM", "HIGH", "CRITICAL".
    4. "clinicalSignals": List of specific clinical indicators found (e.g. "Anhedonia", "Hypervigilance").
    5. "suicideRisk": Expert prediction of suicide risk based on language and signals.
    6. "violenceRisk": Expert prediction of violence risk to others.
    7. "selfHarmDetection": Boolean if self-harm markers are present.
    8. "emotionRecognition": List of primary emotions detected (e.g. "Grief", "Resentment").
    9. "icd10Suggestions": List of possible ICD-10 codes based on content.
    10. "treatmentRecommendations": Suggested therapeutic interventions or pathways.
    11. "behavioralPatterns": Analysis of speech or thought patterns (e.g. "Pressured speech", "Rumination").
    12. "soapNote": A draft SOAP note (Subjective, Objective, Assessment, Plan).
    13. "detectedLanguage": The primary language of the transcript.

    IMPORTANT: Be objective, clinical, and conservative in risk assessment. Flag CRITICAL if there is immediate threat to life.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ClinicalIntelligence
    }
    
    throw new Error("Failed to parse AI clinical intelligence")
  } catch (error) {
    console.error("[OCI_AI_FATAL]", error)
    throw error
  }
}

// ─── Restoring Required Legacy Functions ────────────────────────────────────

export async function transcribeClinicalAudio(arg1: string | { audioBase64: string; mimeType: string; settings: any }): Promise<{ transcript: string; detectedLanguage: string }> {
    console.warn("[OCI_TRANSCRIBE_UNAVAILABLE] Audio transcription provider is not configured.")
    throw new Error('TRANSCRIPTION_PROVIDER_UNAVAILABLE')
}

export async function draftClinicalScribe(arg1: string | any, arg2: string = ''): Promise<string> {
    const model = getConfiguredModel("gemini-1.5-pro")
    let prompt = ''
    
    if (typeof arg1 === 'object') {
        prompt = `Convert the following clinical context into a professional SOAP note draft: ${JSON.stringify(arg1)}`
    } else {
        prompt = `Convert this transcript into a professional SOAP note format. Context: ${arg2}. Transcript: ${arg1}`
    }
    
    const result = await model.generateContent(prompt)
    return result.response.text()
}

export function getRoleAwareAiInstruction(
    arg1: string | { role: string; name?: string; context?: string; preferredLanguage?: string | null; hasAdhdSignals?: boolean },
    arg2?: string,
    arg3?: string
): string {
    let role: string;
    let name: string = "User";
    let context: string = "";
    let preferredLanguage: string = "English";
    let hasAdhdSignals: boolean = false;

    if (typeof arg1 === 'object') {
        role = arg1.role;
        name = arg1.name || name;
        context = arg1.context || context;
        preferredLanguage = arg1.preferredLanguage || preferredLanguage;
        hasAdhdSignals = !!arg1.hasAdhdSignals;
    } else {
        role = arg1;
        name = arg2 || name;
        context = arg3 || context;
    }

    const base = `You are OCI, the Clinical AI for Oku Therapy. You are assisting ${name} (${role}). Language: ${preferredLanguage}.`;
    const adhdAddon = hasAdhdSignals ? " User shows potential ADHD indicators; be extra structured and supportive." : "";
    
    // Platform Knowledge Base for AI
    const clientKnowledge = `
    PLATFORM FEATURES FOR CLIENTS:
    - To book a session: Go to the 'Upcoming Sessions' or 'Book' tab, select a therapist, choose a time, and complete checkout.
    - To join a video call: Click 'Launch Room' or 'Join Session' from the Dashboard at the time of the appointment.
    - To see clinical records: Go to the 'Clinical Record' tab to view assessments, treatment plans, and mood history.
    - To use ADHD Helper: Go to the 'ADHD Helper' workspace for micro-plans and focus supports.
    - To get a superbill (for insurance): Go to 'Bookings' or 'Past Sessions' and click 'Generate Superbill'.
    - To message a therapist: Use the 'Messages' tab.
    - To refer a friend: Go to 'Referrals' to get a link and earn credits.
    `;

    const therapistKnowledge = `
    PLATFORM FEATURES FOR THERAPISTS:
    - To sync calendars: Go to 'Profile', open the calendar sync section, and copy the private iCal feed link for Apple, Google, or Outlook subscription.
    - To view SOAP notes: Go to the 'Intelligence' or 'Clinical Workspace' for a patient to see AI-generated SOAP notes.
    - To check payouts: Go to 'Billing & Payouts' to see platform fees, pending balances, and total earned.
    - To manage schedule: Go to 'Schedule' to set standard weekly hours, add specific date overrides, or block time off.
    - To manage clients: Go to the 'Patients' tab to assign assessments, view transcripts, and review care plans.
    - To handle high-risk alerts: The AI will automatically flag sessions as HIGH or CRITICAL risk and can trigger emergency protocols.
    `;

    const knowledgeBase = role === 'THERAPIST' ? therapistKnowledge : clientKnowledge;
    
    if (role === 'THERAPIST') return `${base} Provide clinical insights, documentation support, and risk stratification. You are also the platform guide for practitioners. ${knowledgeBase} ${adhdAddon} ${context}`;
    return `${base} Provide supportive, non-diagnostic, and trauma-informed guidance. You are also the platform guide for clients. ${knowledgeBase} ${adhdAddon} ${context}`;
}

export async function getOkuAiSettings() {
  const settings = await prisma.platformSettings.findFirst()
  return {
    okuAiEnabled: settings?.okuAiEnabled ?? true,
    adhdCareModeEnabled: settings?.adhdCareModeEnabled ?? false,
    requireConsentBeforeTranscription: settings?.requireConsentBeforeTranscription ?? true
  }
}

// ─── Client Behaviour Analysis ───────────────────────────────────────────────

export interface ClientBehaviourReport {
  summary: string
  engagementScore: number // 0–100
  moodTrend: 'improving' | 'declining' | 'stable' | 'volatile' | 'insufficient_data'
  patterns: string[]
  riskFlags: string[]
  recommendations: string[]
  nextSessionFocus: string
}

/**
 * Analyses aggregated client behavioural data and returns a therapist-facing report.
 * Uses Gemini Flash (fast + cost-effective for periodic reports).
 */
export async function analyzeClientBehaviour(params: {
  clientName: string
  moodEntries: { mood: number; createdAt: Date; notes?: string | null }[]
  assessmentAnswers: { score: number | null; result: string | null; completedAt: Date; assessment: { title: string } }[]
  adhdLogs: { moodScore: number | null; energyLevel: number; sleepHours: number | null; medicationTaken: boolean; date: Date }[]
  sessionCount: number
  missedSessions: number
}): Promise<ClientBehaviourReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const moodSummary = params.moodEntries.length > 0
    ? `${params.moodEntries.length} mood entries. Scores: ${params.moodEntries.map(m => m.mood).join(', ')}. Notes: ${params.moodEntries.slice(0, 5).map(m => m.notes).filter(Boolean).join(' | ')}`
    : 'No mood data recorded.'

  const assessmentSummary = params.assessmentAnswers.length > 0
    ? params.assessmentAnswers.map(a => `${a.assessment.title}: ${a.result ?? 'No result'} (score ${a.score ?? 'N/A'}) on ${new Date(a.completedAt).toDateString()}`).join('; ')
    : 'No assessments completed.'

  const adhdSummary = params.adhdLogs.length > 0
    ? `${params.adhdLogs.length} ADHD logs. Avg energy: ${Math.round(params.adhdLogs.reduce((a, b) => a + b.energyLevel, 0) / params.adhdLogs.length)}/100. Avg sleep: ${(params.adhdLogs.reduce((a, b) => a + (b.sleepHours ?? 0), 0) / params.adhdLogs.length).toFixed(1)}h. Medication adherence: ${Math.round((params.adhdLogs.filter(l => l.medicationTaken).length / params.adhdLogs.length) * 100)}%.`
    : 'No ADHD tracking data.'

  const prompt = `
You are a clinical AI assistant for OKU Therapy. Analyze the following patient data and provide a structured behavioural report for the treating therapist.

PATIENT: ${params.clientName}
SESSION HISTORY: ${params.sessionCount} sessions completed, ${params.missedSessions} missed.

MOOD DATA (last 30 days): ${moodSummary}

SCREENING RESULTS: ${assessmentSummary}

ADHD TRACKING: ${adhdSummary}

Return a JSON object with:
1. "summary": 2-3 sentence clinical summary of the patient's current trajectory.
2. "engagementScore": Integer 0-100 reflecting overall engagement with care (attendance, mood logging, assessments).
3. "moodTrend": Exactly one of: "improving", "declining", "stable", "volatile", "insufficient_data".
4. "patterns": Array of 3-5 specific behavioural patterns observed (clinical language).
5. "riskFlags": Array of 0-3 risk flags that need therapist attention. Empty array if none.
6. "recommendations": Array of 3-4 specific recommendations for the next session or care plan.
7. "nextSessionFocus": One sentence describing the primary suggested focus for the next session.

Be clinical, concise, and actionable. Base everything only on the data provided.
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ClientBehaviourReport
    }
    throw new Error('Failed to parse behaviour report')
  } catch (error) {
    console.error('[OCI_BEHAVIOUR_ERROR]', error)
    return {
      summary: 'Insufficient data to generate a full report at this time.',
      engagementScore: 0,
      moodTrend: 'insufficient_data',
      patterns: [],
      riskFlags: [],
      recommendations: ['Schedule a check-in session', 'Encourage mood logging', 'Assign a baseline assessment'],
      nextSessionFocus: 'Establish rapport and gather more baseline data.',
    }
  }
}

/**
 * ADHD Task Atomizer
 * Breaks a large, overwhelming task into small, manageable "atoms"
 */
export async function analyzeAssessmentResult(params: {
  patientName: string
  assessmentTitle: string
  score: number | null
  result: string | null
  answers: any
}): Promise<{ 
  aiInterpretation: string
  clinicalCuration: string
  personalizedRecommendations: string[]
  therapistNotes: string
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

  const prompt = `
    You are OKU AI, a clinical intelligence assistant. You are analyzing the results of a ${params.assessmentTitle} assessment for ${scrubPII(params.patientName, params.patientName)}.
    
    DATA:
    - Assessment: ${params.assessmentTitle}
    - Calculated Score: ${params.score ?? 'N/A'}
    - Initial Result: ${params.result ?? 'Completed'}
    - User Answers: ${JSON.stringify(params.answers)}
    
    TASK:
    Provide a multi-layered curation of this result:
    1. "aiInterpretation": A gentle, patient-facing explanation of what this result might mean for their daily life. Avoid being diagnostic; use phrases like "This suggests..." or "You might be experiencing...".
    2. "clinicalCuration": A deeper, data-driven analysis of their specific answer patterns (e.g. if they scored particularly high on specific items).
    3. "personalized Recommendations": 3-4 actionable "Next Steps" for the user (e.g. mindfulness, sleep hygiene, or specific questions to ask their therapist).
    4. "therapistNotes": A concise 1-2 sentence briefing for their therapist to read before the next session.

    FORMAT:
    Return ONLY a JSON object.
  `

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error("Failed to parse assessment analysis")
  } catch (error) {
    console.error("[OCI_ASSESSMENT_AI_ERROR]", error)
    return {
      aiInterpretation: "We've received your results. Your therapist will review these with you in your next session to provide a full clinical context.",
      clinicalCuration: "Results logged for clinical review.",
      personalizedRecommendations: ["Share these results with your therapist", "Continue monitoring your mood in the dashboard"],
      therapistNotes: "Patient completed assessment. Analysis was unable to be generated automatically; please review manually."
    }
  }
}

export async function atomizeTask(taskTitle: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
  
  const prompt = `
    You are an expert ADHD Productivity Coach. Your goal is to help a user who is feeling overwhelmed.
    The user has a task: "${taskTitle}".
    
    TASK:
    Break this task down into 3-5 tiny, concrete, and manageable "Atoms".
    Each atom should take less than 10 minutes and feel "too small to fail".
    Use gentle, encouraging language.
    
    FORMAT:
    Return ONLY a JSON array of strings.
    Example: ["Open the document", "Write just the first sentence", "Save and close"]
  `

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return ["Start the first step", "Keep going", "Finish up"]
  } catch (error) {
    console.error("[OCI_ATOMIZE_ERROR]", error)
    return ["Break it down", "Take a breath", "Start small"]
  }
}
