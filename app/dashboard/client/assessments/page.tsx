'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ClientAssessmentsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access assessments.</p>
          <Link 
            href="/auth/login"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
              <p className="mt-2 text-gray-600">Track your mental health journey</p>
            </div>
            <Link 
              href="/dashboard/client"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Anxiety Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">Evaluate your anxiety levels and get personalized insights.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Completed 2 days ago</span>
                <Link 
                  href="/dashboard/client/assessments/anxiety"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Take Assessment
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Depression Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">Monitor your mood and emotional well-being.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Not completed</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  Start Assessment
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Stress Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">Identify stress triggers and coping mechanisms.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Completed 1 week ago</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Results</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Anxiety Assessment</h3>
                    <p className="mt-1 text-sm text-gray-500">Score: 45/100 - Mild Anxiety</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Mild
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Stress Assessment</h3>
                    <p className="mt-1 text-sm text-gray-500">Score: 62/100 - Moderate Stress</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      Moderate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
