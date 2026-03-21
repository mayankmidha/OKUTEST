'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { BrandAuthShell } from '@/components/brand-auth-shell'
import { okuCtaCopy } from '@/lib/cta-copy'
import { loginUser } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const result = loginUser(email, password)
    
    if (result.success && result.user) {
      // Redirect based on role
      const redirectUrl = result.user.role === 'THERAPIST' ? '/practitioner/dashboard' : 
                         result.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'
      router.push(redirectUrl)
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }
    
    setIsLoading(false)
  }

  return (
    <BrandAuthShell
      description={okuCtaCopy.entry.loginDescription}
      eyebrow={okuCtaCopy.entry.loginBadge}
      footer={
        <p>
          Don&apos;t have an account yet?{' '}
          <Link className="font-medium text-[#2f6a5b] transition hover:text-stone-900" href="/auth/signup">
            Create a private account
          </Link>
        </p>
      }
      title={okuCtaCopy.entry.loginTitle}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#2f6a5b] focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#2f6a5b] focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-stone-600">
          Demo: Use any email/password. Add "therapist" to email for therapist login.
        </p>
      </div>
    </BrandAuthShell>
  )
}
