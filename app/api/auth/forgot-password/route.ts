import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json() as { email?: string }
    const { email } = body

    if (!email || typeof email !== 'string') {
      // Always return 200 to not reveal if email exists
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists (but don't reveal)
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } })

      // Generate a secure random token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: { email: normalizedEmail, token, expiresAt },
      })

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'}/auth/reset-password?token=${token}`
      const resendApiKey = process.env.RESEND_API_KEY

      if (!resendApiKey) {
        console.log(`[FORGOT_PASSWORD_STUB] Reset link for ${normalizedEmail}: ${resetUrl}`)
      } else {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Oku Therapy <noreply@okutherapy.com>',
              to: [normalizedEmail],
              subject: 'Reset Your Password — Oku Therapy',
              html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px; background: #FDFCF8; border-radius: 24px;">
                  <div style="margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 800; color: #4A4458; margin: 0; letter-spacing: -1px;">Oku Therapy</h1>
                  </div>
                  <h2 style="font-size: 22px; font-weight: 700; color: #4A4458; margin-bottom: 16px;">Reset your password</h2>
                  <p style="color: #6B6480; font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
                    Hello ${user.name || 'there'},<br/>
                    We received a request to reset the password for your Oku Therapy account. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
                  </p>
                  <div style="text-align: center; margin-bottom: 40px;">
                    <a href="${resetUrl}" style="display: inline-block; background: #4A4458; color: #ffffff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">
                      Reset Password
                    </a>
                  </div>
                  <p style="color: #9B96AD; font-size: 13px; line-height: 1.6; text-align: center; margin-bottom: 8px;">
                    If you didn't request this, you can safely ignore this email. Your password won't change.
                  </p>
                  <hr style="border: none; border-top: 1px solid #F0EEF8; margin: 32px 0;" />
                  <p style="color: #C4BFD4; font-size: 11px; text-align: center;">
                    &copy; ${new Date().getFullYear()} Oku Therapy Integrated. All rights reserved.
                  </p>
                </div>
              `,
            }),
          })

          if (!res.ok) {
            const err = await res.text()
            console.error(`[RESEND_ERROR] Forgot-password email failed: ${err}`)
          }
        } catch (e) {
          console.error('[FORGOT_PASSWORD_EMAIL_ERROR]', e)
        }
      }
    }

    // Always return 200
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error)
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  }
}
