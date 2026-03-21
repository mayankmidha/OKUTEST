'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function V1LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple demo authentication
    if (email && password) {
      // Determine role based on email
      const isAdmin = email.includes('admin')
      const isTherapist = email.includes('therapist') || email.includes('practitioner')
      
      let redirectUrl = '/dashboard/client'
      if (isAdmin) redirectUrl = '/admin/dashboard'
      else if (isTherapist) redirectUrl = '/practitioner/dashboard'
      
      // Store user in localStorage for session
      localStorage.setItem('user', JSON.stringify({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: isAdmin ? 'ADMIN' : isTherapist ? 'THERAPIST' : 'CLIENT'
      }))
      
      router.push(redirectUrl)
    } else {
      setError('Please enter email and password')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold">OKU Therapy</Link>
            <div className="flex space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-gray-900">Services</Link>
              <Link href="/about-us" className="text-gray-700 hover:text-gray-900">About Us</Link>
              <Link href="/people" className="text-gray-700 hover:text-gray-900">People</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OKU Therapy</h1>
          <p className="text-lg text-gray-600">Welcome back! Please login to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Credentials:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Client:</span> client@demo.com / demo123
            </div>
            <div>
              <span className="font-medium">Practitioner:</span> practitioner@demo.com / demo123
            </div>
            <div>
              <span className="font-medium">Admin:</span> admin@demo.com / demo123
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p><strong>Note:</strong> Use these credentials to test different dashboard access levels.</p>
            <p>Client → Client Dashboard | Practitioner → Therapist Dashboard | Admin → Admin Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}
