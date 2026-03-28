const PSYCHIATRY_KEYWORDS = [
  'psychiat',
  'medication management',
  'psychopharmacology',
  'medication review',
]

type PractitionerProfileLike = {
  specialization?: string[] | null
} | null | undefined

export type PractitionerDiscipline = 'PSYCHIATRIST' | 'THERAPIST'

export function getPractitionerDiscipline(profile: PractitionerProfileLike): PractitionerDiscipline {
  const specializations = profile?.specialization ?? []
  const combined = specializations.join(' ').toLowerCase()

  return PSYCHIATRY_KEYWORDS.some((keyword) => combined.includes(keyword))
    ? 'PSYCHIATRIST'
    : 'THERAPIST'
}

export function isPsychiatristProfile(profile: PractitionerProfileLike): boolean {
  return getPractitionerDiscipline(profile) === 'PSYCHIATRIST'
}

export function getPractitionerDisciplineLabel(profile: PractitionerProfileLike): string {
  return isPsychiatristProfile(profile) ? 'Psychiatrist' : 'Therapist'
}
