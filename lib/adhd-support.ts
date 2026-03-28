type AssessmentLike = {
  assessment: {
    title: string
  }
  result?: string | null
  score?: number | null
  completedAt: Date
}

const ADHD_KEYWORDS = ['adhd', 'executive function', 'conners', 'vanderbilt', 'asrs']

function hasAdhdTitle(title: string) {
  const normalizedTitle = title.toLowerCase()
  return ADHD_KEYWORDS.some((keyword) => normalizedTitle.includes(keyword))
}

function buildSupportIntensity(result?: string | null) {
  const normalizedResult = (result || '').toLowerCase()

  if (
    normalizedResult.includes('high') ||
    normalizedResult.includes('severe') ||
    normalizedResult.includes('significant')
  ) {
    return 'HIGH_SUPPORT'
  }

  if (
    normalizedResult.includes('moderate') ||
    normalizedResult.includes('elevated') ||
    normalizedResult.includes('mild')
  ) {
    return 'MEDIUM_SUPPORT'
  }

  return 'LIGHT_SUPPORT'
}

export function getAdhdSupportPlan(assessmentAnswers: AssessmentLike[]) {
  const relevantAssessments = assessmentAnswers.filter((answer) => hasAdhdTitle(answer.assessment.title))

  if (relevantAssessments.length === 0) {
    return null
  }

  const latestAssessment = relevantAssessments[0]
  const supportIntensity = buildSupportIntensity(latestAssessment.result)

  const strategies =
    supportIntensity === 'HIGH_SUPPORT'
      ? [
          'Shrink today into the next 10-minute action instead of the full task.',
          'Use body-doubling or accountability before starting high-friction work.',
          'Move urgent tasks into a visual short list with only 3 priorities.',
          'Plan a sensory reset before and after demanding transitions.',
        ]
      : supportIntensity === 'MEDIUM_SUPPORT'
        ? [
            'Break tasks into smaller starts and define what “done for now” means.',
            'Set one visible timer for focus and one for breaks.',
            'Keep recurring responsibilities in the same place every day.',
            'Capture distractions quickly so you can return without losing the thread.',
          ]
        : [
            'Use one anchor task each morning to reduce decision fatigue.',
            'Set reminders for transitions, not just deadlines.',
            'Stack important tasks next to existing routines when possible.',
            'Review what worked this week before changing your system.',
          ]

  return {
    latestAssessmentTitle: latestAssessment.assessment.title,
    latestAssessmentResult: latestAssessment.result || 'Support profile available',
    supportIntensity,
    summary:
      supportIntensity === 'HIGH_SUPPORT'
        ? 'Your recent clinical data suggests higher support may help with overwhelm, transitions, and follow-through right now.'
        : supportIntensity === 'MEDIUM_SUPPORT'
          ? 'Your recent clinical data suggests structure and pacing support could make day-to-day functioning easier.'
          : 'Your recent clinical data suggests light executive-function scaffolding may help you stay steady and reduce friction.',
    strategies,
    sessionPrepPrompts: [
      'What tasks feel bigger in my head than they are in practice?',
      'Where do I lose time or momentum most often during the week?',
      'What kind of structure helps without making me feel trapped?',
    ],
  }
}
