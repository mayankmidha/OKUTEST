import { ASSESSMENTS, type Assessment } from '@/lib/assessments'

type AssessmentOption = { label: string; value: number }
type AssessmentQuestion = { id: string; text: string; options?: AssessmentOption[] }

export type RenderableAssessment = {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  timeEstimate?: string
  questionCount: number
  timeframe?: string
  questions: AssessmentQuestion[]
  options: AssessmentOption[]
  scoring: Assessment['scoring']
  highRiskThreshold?: number
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isOption(value: unknown): value is AssessmentOption {
  if (!value || typeof value !== 'object') return false

  const option = value as Record<string, unknown>

  return typeof option.label === 'string' && typeof option.value === 'number'
}

function isQuestion(value: unknown): value is AssessmentQuestion {
  if (!value || typeof value !== 'object') return false

  const question = value as Record<string, unknown>

  return typeof question.text === 'string'
}

export function slugifyAssessmentTitle(title: string) {
  return normalizeText(title || 'assessment')
}

export function findCatalogAssessment(input: { id?: string | null; slug?: string | null; title?: string | null }) {
  const byId = (input.id || '').toLowerCase()
  const bySlug = normalizeText(input.slug || '')
  const byTitle = normalizeText(input.title || '')

  return (
    ASSESSMENTS.find((assessment) => {
      return (
        assessment.id.toLowerCase() === byId ||
        normalizeText(assessment.slug) === bySlug ||
        normalizeText(assessment.title) === byTitle ||
        normalizeText(assessment.title) === bySlug
      )
    }) || null
  )
}

function normalizeQuestions(rawQuestions: unknown, fallbackOptions: AssessmentOption[]) {
  if (!Array.isArray(rawQuestions)) return []

  const normalizedQuestions: AssessmentQuestion[] = []

  rawQuestions.forEach((question, index) => {
    if (typeof question === 'string') {
      normalizedQuestions.push({
        id: String(index + 1),
        text: question,
        options: fallbackOptions,
      })
      return
    }

    if (!isQuestion(question)) return

    const record = question as Record<string, unknown>
    const rawOptions = Array.isArray(record.options) ? record.options.filter(isOption) : fallbackOptions

    normalizedQuestions.push({
      id: typeof record.id === 'string' ? record.id : String(index + 1),
      text: typeof record.text === 'string' ? record.text : '',
      options: rawOptions.length > 0 ? rawOptions : fallbackOptions,
    })
  })

  return normalizedQuestions
}

function deriveSharedOptions(questions: AssessmentQuestion[], fallbackOptions: AssessmentOption[]) {
  if (questions.length === 0) return fallbackOptions

  const first = questions[0]?.options ?? fallbackOptions
  if (first.length === 0) return fallbackOptions

  const allShareSameOptions = questions.every((question) => {
    const currentOptions = question.options ?? []
    return JSON.stringify(currentOptions) === JSON.stringify(first)
  })

  return allShareSameOptions ? first : fallbackOptions
}

export function normalizeAssessmentForRender(assessment: any): RenderableAssessment {
  const catalog = findCatalogAssessment({
    id: assessment?.id,
    slug: assessment?.slug,
    title: assessment?.title,
  })

  const fallbackOptions = catalog?.options ?? []
  const questions = catalog?.questions ?? normalizeQuestions(assessment?.questions, fallbackOptions)
  const sharedOptions = catalog?.options ?? deriveSharedOptions(questions, fallbackOptions)

  return {
    id: assessment?.id ?? catalog?.id ?? '',
    slug: assessment?.slug ?? catalog?.slug ?? slugifyAssessmentTitle(assessment?.title ?? catalog?.title ?? 'assessment'),
    title: assessment?.title ?? catalog?.title ?? 'Assessment',
    description: assessment?.description ?? catalog?.description ?? 'Complete this screening to record your responses.',
    longDescription: assessment?.longDescription ?? catalog?.longDescription,
    timeEstimate: assessment?.timeEstimate ?? catalog?.timeEstimate,
    questionCount: questions.length,
    timeframe: assessment?.timeframe ?? catalog?.timeframe,
    questions,
    options: sharedOptions,
    scoring: assessment?.scoring ?? catalog?.scoring ?? [],
    highRiskThreshold: assessment?.highRiskThreshold ?? catalog?.highRiskThreshold,
  }
}
