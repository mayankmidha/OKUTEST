import Link from 'next/link'
import { CheckCircle2, MailCheck, TriangleAlert } from 'lucide-react'

import { sendWelcomeEmail } from '@/lib/notifications'
import { verifyEmailToken } from '@/lib/auth-user'

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string
    sent?: string
  }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token, sent } = await searchParams

  let status: 'sent' | 'success' | 'expired' | 'invalid' = sent === '1' ? 'sent' : 'invalid'

  if (token) {
    const result = await verifyEmailToken(token)

    if (result.ok) {
      status = 'success'
      sendWelcomeEmail(result.userId).catch((error) => {
        console.error('[WELCOME_EMAIL_AFTER_VERIFY_ERROR]', error)
      })
    } else {
      status = result.reason
    }
  }

  const config = {
    sent: {
      icon: <MailCheck size={40} className="text-oku-purple-dark" />,
      title: 'Check your inbox',
      body: 'We sent a verification link to your email. Please confirm it before signing in.',
      ctaLabel: 'Back to Login',
      ctaHref: '/auth/login',
    },
    success: {
      icon: <CheckCircle2 size={40} className="text-green-700" />,
      title: 'Email verified',
      body: 'Your account is now confirmed. You can sign in and continue your setup.',
      ctaLabel: 'Sign In',
      ctaHref: '/auth/login?message=Email verified. You can sign in now.',
    },
    expired: {
      icon: <TriangleAlert size={40} className="text-amber-600" />,
      title: 'Verification link expired',
      body: 'This verification link is no longer active. Return to login and request a fresh verification email.',
      ctaLabel: 'Back to Login',
      ctaHref: '/auth/login',
    },
    invalid: {
      icon: <TriangleAlert size={40} className="text-red-600" />,
      title: 'Verification link invalid',
      body: 'This verification link could not be validated. Return to login and request a new verification email if needed.',
      ctaLabel: 'Back to Login',
      ctaHref: '/auth/login',
    },
  } as const

  const current = config[status]

  return (
    <div className="min-h-screen bg-oku-lavender/20 flex items-center justify-center p-6">
      <div className="w-full max-w-xl card-glass-3d !p-12 !bg-white/60 !rounded-[3rem] shadow-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-8">
          {current.icon}
        </div>
        <h1 className="heading-display text-5xl text-oku-darkgrey mb-4 tracking-tighter">
          {current.title}
        </h1>
        <p className="text-base text-oku-darkgrey/60 font-display italic leading-relaxed max-w-md mx-auto mb-10">
          {current.body}
        </p>
        <Link
          href={current.ctaHref}
          className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white inline-flex items-center justify-center !px-10 !py-5"
        >
          {current.ctaLabel}
        </Link>
      </div>
    </div>
  )
}
