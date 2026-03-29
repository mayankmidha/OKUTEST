import { ASSESSMENTS } from './assessments'

/**
 * Industrial-grade Clinical Intelligence Engine.
 * Automatically scores validated assessments and provides clinical ranges.
 * Required for Insurance/B2B scale.
 */
export function calculateAssessmentResult(assessmentId: string, answers: Record<string, number>) {
  const assessment = ASSESSMENTS.find(a => a.id === assessmentId)
  if (!assessment) return null

  // Calculate Raw Score
  let totalScore = 0
  Object.values(answers).forEach(val => {
    totalScore += val
  })

  // Find Clinical Range
  const scoringTier = assessment.scoring.find(tier => 
    totalScore >= tier.min && totalScore <= tier.max
  )

  return {
    score: totalScore,
    result: scoringTier?.result || 'Completed',
    description: scoringTier?.description || 'Assessment successfully completed.'
  }
}

/**
 * Determines if a result requires immediate clinical escalation.
 */
export function isHighRisk(assessmentId: string, score: number) {
    if (assessmentId === 'phq-9' && score >= 15) return true
    if (assessmentId === 'gad-7' && score >= 15) return true
    if (assessmentId === 'pcl-5' && score >= 33) return true
    return false
}
