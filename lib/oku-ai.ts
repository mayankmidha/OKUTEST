import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

  const prompt = `
    You are an advanced Clinical AI Brain for Oku Therapy. You are analyzing a therapy session transcript between ${practitionerName} and ${patientName}.
    Your goal is to provide medical-grade clinical intelligence, risk stratification, and documentation support.

    CONTEXT:
    - Session Type: ${sessionType}
    - Recent Assessments: ${JSON.stringify(recentAssessments)}
    - ADHD Care Mode: ${settings.adhdCareModeEnabled ? 'ENABLED' : 'DISABLED'}

    TRANSCRIPT:
    """
    ${transcriptContent}
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
    // For now, return a placeholder or use Gemini 1.5 Flash for audio
    console.log("[OCI_TRANSCRIBE] Audio processing requested.")
    return { 
        transcript: "This is a transcribed placeholder for the clinical session audio.",
        detectedLanguage: "en"
    }
}

export async function draftClinicalScribe(arg1: string | any, arg2: string = ''): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
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
    - To sync calendars: Go to 'Profile', scroll to 'Universal Calendar Sync', enter Google/Outlook/Apple/Calendly details, and copy the Magic Sync Link.
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

/**
 * ADHD Task Atomizer
 * Breaks a large, overwhelming task into small, manageable "atoms"
 */
export async function atomizeTask(taskTitle: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  
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
