import crypto from 'crypto'

import { UserRole } from '@prisma/client'

import { generateAnonymousAlias } from '@/lib/aliases'
import { appendPrivateInboxRecord } from '@/lib/private-storage'
import { prisma } from '@/lib/prisma'
import { createReferralCode } from '@/lib/referrals'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'
const EMAIL_VERIFICATION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function ensureUserAppSetup(userId: string, options?: {
  name?: string | null
  markEmailVerified?: boolean
}) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      role: true,
      emailVerified: true,
      referralCode: true,
      clientProfile: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!user) return null

  const data: Record<string, unknown> = {}

  if (!user.referralCode) {
    data.referralCode = await createReferralCode(user.name || options?.name || 'OKU')
  }

  if (options?.markEmailVerified && !user.emailVerified) {
    data.emailVerified = new Date()
  }

  if (user.role === UserRole.CLIENT && !user.clientProfile) {
    data.clientProfile = {
      create: {
        anonymousAlias: generateAnonymousAlias(),
      },
    }
  }

  if (Object.keys(data).length === 0) {
    return user
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      role: true,
      emailVerified: true,
      referralCode: true,
    },
  })
}

export async function issueEmailVerificationToken(email: string) {
  const normalizedEmail = normalizeAuthEmail(email)
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS)

  await prisma.verificationToken.deleteMany({
    where: { identifier: normalizedEmail },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token,
      expires,
    },
  })

  return {
    token,
    expires,
    verificationUrl: `${APP_URL}/auth/verify-email?token=${token}`,
  }
}

export async function sendVerificationEmail(input: {
  email: string
  name?: string | null
  verificationUrl: string
  expires: Date
}) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    await appendPrivateInboxRecord('email-verification.ndjson', {
      email: input.email,
      verificationUrl: input.verificationUrl,
      expiresAt: input.expires.toISOString(),
      source: 'email-verification-fallback',
    })
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Oku Therapy <noreply@okutherapy.com>',
        to: [input.email],
        subject: 'Verify Your Email — Oku Therapy',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 32px; font-weight: 800; color: #4A4458; margin: 0; letter-spacing: -1px;">Oku Therapy</h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #4A4458; margin-bottom: 16px;">Verify your email</h2>
            <p style="color: #6B6480; font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
              Hello ${input.name || 'there'},<br/>
              Please confirm this email address before signing in to your Oku Therapy account. This verification link stays active for 30 days.
            </p>
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="${input.verificationUrl}" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">
                Verify Email
              </a>
            </div>
            <p style="color: #9B96AD; font-size: 13px; line-height: 1.6; text-align: center; margin-bottom: 8px;">
              If you did not create this account, you can ignore this message.
            </p>
            <hr style="border: none; border-top: 1px solid #F0EEF8; margin: 32px 0;" />
            <p style="color: #C4BFD4; font-size: 11px; text-align: center;">
              &copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[EMAIL_VERIFICATION_RESEND_ERROR]', error)
    }
  } catch (error) {
    console.error('[EMAIL_VERIFICATION_EMAIL_ERROR]', error)
  }
}

export async function sendVerificationEmailForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
    },
  })

  if (!user || user.emailVerified) {
    return false
  }

  const issued = await issueEmailVerificationToken(user.email)

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    verificationUrl: issued.verificationUrl,
    expires: issued.expires,
  })

  return true
}

export async function verifyEmailToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return { ok: false as const, reason: 'invalid' as const }
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => null)
    return { ok: false as const, reason: 'expired' as const }
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
    select: {
      id: true,
      emailVerified: true,
    },
  })

  if (!user) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => null)
    return { ok: false as const, reason: 'invalid' as const }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: user.emailVerified || new Date() },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    }),
  ])

  return {
    ok: true as const,
    alreadyVerified: Boolean(user.emailVerified),
    userId: user.id,
  }
}

export async function hasPendingEmailVerification(email: string) {
  const normalizedEmail = normalizeAuthEmail(email)
  const token = await prisma.verificationToken.findFirst({
    where: {
      identifier: normalizedEmail,
    },
    select: {
      token: true,
    },
  })

  return Boolean(token)
}

export async function getAuthUserState(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      hasSignedConsent: true,
      emailVerified: true,
      deletionRequestedAt: true,
      clientProfile: {
        select: {
          adhdDiagnosed: true,
        },
      },
      practitionerProfile: {
        select: {
          isVerified: true,
          isOnboarded: true,
        },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    role: user.role,
    hasSignedConsent: !!user.hasSignedConsent,
    adhdDiagnosed: !!user.clientProfile?.adhdDiagnosed,
    practitionerVerified: !!user.practitionerProfile?.isVerified,
    practitionerOnboarded: !!user.practitionerProfile?.isOnboarded,
    isDeleted: !!user.deletionRequestedAt,
    emailVerified: !!user.emailVerified,
  }
}
