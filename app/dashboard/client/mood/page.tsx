'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ClientMoodPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
          <p className="text-gray-600 mb-8">You need to be logged in to track your mood.</p>
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

  const moodOptions = [
    { emoji: '😊', label: 'Happy', color: 'bg-green-100 hover:bg-green-200' },
    { emoji: '😌', label: 'Calm', color: 'bg-blue-100 hover:bg-blue-200' },
    { emoji: '😔', label: 'Sad', color: 'bg-gray-100 hover:bg-gray-200' },
    { emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { emoji: '😡', label: 'Angry', color: 'bg-red-100 hover:bg-red-200' },
    { emoji: '😴', label: 'Tired', color: 'bg-purple-100 hover:bg-purple-200' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mood) {
      // Save mood to localStorage (in real app, would save to database)
      const moodEntry = {
        mood,
        notes,
        date: new Date().toISOString(),
        user: user.email
      }
      const existingMoods = JSON.parse(localStorage.getItem('moods') || '[]')
      existingMoods.push(moodEntry)
      localStorage.setItem('moods', JSON.stringify(existingMoods))
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setMood('')
        setNotes('')
      }, 2000)
    }
  }

  const recentMoods = JSON.parse(localStorage.getItem('moods') || '[]')
    .filter((m: any) => m.user === user.email)
    .slice(-5)
    .reverse()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mood Tracking</h1>
              <p className="mt-2 text-gray-600">Track your emotional well-being</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">How are you feeling today?</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select your mood
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {moodOptions.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setMood(option.label)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            mood === option.label
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 ' + option.color
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="text-sm font-medium text-gray-900">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's on your mind today?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!mood || submitted}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitted ? '✓ Saved!' : 'Save Mood'}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Moods</h2>
              </div>
              <div className="p-6">
                {recentMoods.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No mood entries yet. Start tracking above!</p>
                ) : (
                  <div className="space-y-4">
                    {recentMoods.map((entry: any, index: number) => {
                      const moodOption = moodOptions.find(m => m.label === entry.mood)
                      return (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{moodOption?.emoji}</span>
                              <div>
                                <div className="font-medium text-gray-900">{entry.mood}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          {entry.notes && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              "{entry.notes}"
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mood Insights</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{recentMoods.length}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {recentMoods.filter((m: any) => m.mood === 'Happy').length}
                  </div>
                  <div className="text-sm text-gray-600">Happy Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {recentMoods.filter((m: any) => m.mood === 'Anxious').length}
                  </div>
                  <div className="text-sm text-gray-600">Anxious Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
