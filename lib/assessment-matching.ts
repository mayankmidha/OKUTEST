export const CATEGORY_MATCHES: Record<string, { title: string, slug: string }> = {
  'Anxiety & Depression': { title: 'Self-Discovery Screening (GAD-7/PHQ-9)', slug: 'anxiety' },
  'ADHD': { title: 'Executive Function Exploration', slug: 'adhd' },
  'Trauma': { title: 'Nervous System Pulse Check', slug: 'trauma-screen' },
  'Executive Function': { title: 'Focus & Cognitive Map', slug: 'adhd' },
  'General': { title: 'Clinical Baseline Intake', slug: 'intake' }
};

export function getMatchingAssessment(category: string) {
  return CATEGORY_MATCHES[category] || CATEGORY_MATCHES['General'];
}
