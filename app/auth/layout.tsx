import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login - OKU Therapy',
  description: 'Sign in to your OKU Therapy workspace',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-oku-cream">
      {children}
    </div>
  )
}
