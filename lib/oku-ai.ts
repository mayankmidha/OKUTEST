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
    
    if (role === 'THERAPIST') return `${base} Provide clinical insights, documentation support, and risk stratification.${adhdAddon} ${context}`;
    return `${base} Provide supportive, non-diagnostic, and trauma-informed guidance.${adhdAddon} ${context}`;
}

export async function getOkuAiSettings() {
  const settings = await prisma.platformSettings.findFirst()
  return {
    okuAiEnabled: settings?.okuAiEnabled ?? true,
    adhdCareModeEnabled: settings?.adhdCareModeEnabled ?? false,
    requireConsentBeforeTranscription: settings?.requireConsentBeforeTranscription ?? true
  }
}
