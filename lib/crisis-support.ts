type CrisisAssessment = {
  isCrisis: boolean
  severity: 'none' | 'high' | 'immediate'
  matchedSignals: string[]
  response: string
}

const IMMEDIATE_RISK_PATTERNS: Array<[RegExp, string]> = [
  [/\bkill myself\b/i, 'kill myself'],
  [/\bend my life\b/i, 'end my life'],
  [/\bsuicid(?:e|al)\b/i, 'suicidal language'],
  [/\bwant to die\b/i, 'want to die'],
  [/\bhurt myself\b/i, 'hurt myself'],
  [/\bself[- ]harm\b/i, 'self-harm'],
  [/\bcan(?:not|'t) go on\b/i, "can't go on"],
]

const HIGH_DISTRESS_PATTERNS: Array<[RegExp, string]> = [
  [/\bpanic attack\b/i, 'panic attack'],
  [/\bunsafe\b/i, 'feels unsafe'],
  [/\boverdos(?:e|ing)\b/i, 'overdose'],
  [/\bcut myself\b/i, 'cutting'],
  [/\bhopeless\b/i, 'hopelessness'],
]

function buildImmediateResponse() {
  return [
    "I'm really glad you reached out.",
    "I can't provide emergency intervention, but this sounds like a safety emergency.",
    'If you might act on these thoughts or are in immediate danger, call local emergency services now or go to the nearest emergency room.',
    'You can also open the Emergency page in OKU right now for crisis contacts and next steps.',
    'If you can, stay with another person, move away from anything you could use to hurt yourself, and contact a trusted supporter immediately.',
  ].join(' ')
}

function buildHighDistressResponse() {
  return [
    "I'm here with you.",
    "What you shared sounds serious, and I don't want to treat it like a routine chat.",
    'If your safety may be at risk, contact a trusted person now and use the Emergency page in OKU for immediate crisis numbers.',
    'If this becomes an immediate risk, call local emergency services right away.',
  ].join(' ')
}

function buildLowRiskResponse() {
  return [
    "I'm here with you.",
    'Take one slow breath in, then a longer breath out.',
    'If you want, tell me the hardest part of this moment in one sentence.',
    'If you need urgent human help, open the Emergency page for crisis contacts.',
  ].join(' ')
}

export function assessCrisisMessage(message: string): CrisisAssessment {
  const normalized = message.trim()

  if (!normalized) {
    return {
      isCrisis: false,
      severity: 'none',
      matchedSignals: [],
      response: buildLowRiskResponse(),
    }
  }

  const immediateSignals = IMMEDIATE_RISK_PATTERNS.filter(([pattern]) =>
    pattern.test(normalized)
  ).map(([, label]) => label)

  if (immediateSignals.length > 0) {
    return {
      isCrisis: true,
      severity: 'immediate',
      matchedSignals: immediateSignals,
      response: buildImmediateResponse(),
    }
  }

  const highDistressSignals = HIGH_DISTRESS_PATTERNS.filter(([pattern]) =>
    pattern.test(normalized)
  ).map(([, label]) => label)

  if (highDistressSignals.length > 0) {
    return {
      isCrisis: true,
      severity: 'high',
      matchedSignals: highDistressSignals,
      response: buildHighDistressResponse(),
    }
  }

  return {
    isCrisis: false,
    severity: 'none',
    matchedSignals: [],
    response: buildLowRiskResponse(),
  }
}
