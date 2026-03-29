import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ClinicalIntelligence {
  summary: string
  sentiment: string
  riskLevel: RiskLevel
  clinicalSignals: string[]
  suicideRisk: string // Predicted risk description
  violenceRisk: string
  selfHarmDetection: boolean
  emotionRecognition: string[]
  icd10Suggestions: string[]
  treatmentRecommendations: string[]
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
 * Upgraded for industrial-grade risk stratification and clinical decision support.
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
  patientName?: string
  sessionType?: string
  practitionerName?: string
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

export async function getOkuAiSettings() {
  const settings = await prisma.platformSettings.findFirst()
  return {
    okuAiEnabled: settings?.okuAiEnabled ?? true,
    adhdCareModeEnabled: settings?.adhdCareModeEnabled ?? false,
    requireConsentBeforeTranscription: settings?.requireConsentBeforeTranscription ?? true
  }
}
