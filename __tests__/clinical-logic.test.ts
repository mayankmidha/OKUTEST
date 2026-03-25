import { describe, it, expect } from 'vitest'
import { getMatchingAssessment } from '../lib/assessment-matching'

describe('Clinical Logic Engine', () => {
  it('should match Anxiety category to GAD-7 assessment', () => {
    const match = getMatchingAssessment('Anxiety & Depression')
    expect(match.slug).toBe('anxiety')
  })

  it('should match ADHD category to Executive Function assessment', () => {
    const match = getMatchingAssessment('ADHD')
    expect(match.slug).toBe('adhd')
  })

  it('should fallback to General Intake for unknown categories', () => {
    const match = getMatchingAssessment('Unknown Category')
    expect(match.slug).toBe('intake')
  })
})
