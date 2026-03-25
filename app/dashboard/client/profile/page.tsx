'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Bell, LogOut, User } from 'lucide-react'

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock profile data
    setProfile({
      name: 'Sarah Johnson',
      email: 'sarah@client.com',
      phone: '+1-555-0123',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      emergencyContact: {
        name: 'John Johnson',
        relationship: 'Spouse',
        phone: '+1-555-0124'
      },
      preferences: {
        language: 'English',
        timezone: 'UTC-5',
        notifications: true
      }
    })
    
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/auth/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-oku-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oku-purple mx-auto"></div>
          <p className="mt-4 text-oku-dark">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-oku-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-oku-dark mb-4 font-display">Please Login</h1>
          <p className="text-oku-taupe mb-8">You need to be logged in to access your profile.</p>
          <Link 
            href="/auth/login"
            className="btn-primary"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-oku-cream">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-oku-dark font-display">
                Your Profile
              </h1>
              <p className="text-oku-taupe mt-2">Manage your personal information</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/client"
                className="text-oku-taupe hover:text-oku-dark transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-oku-taupe hover:text-oku-dark transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-oku-purple" />
                  <h2 className="text-xl font-semibold text-oku-dark">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile?.name || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Email</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile?.phone || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profile?.dateOfBirth || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Gender</label>
                    <input
                      type="text"
                      value={profile?.gender || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <h2 className="text-xl font-semibold text-oku-dark mb-6">Emergency Contact</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={profile?.emergencyContact?.name || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Relationship</label>
                    <input
                      type="text"
                      value={profile?.emergencyContact?.relationship || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={profile?.emergencyContact?.phone || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="h-6 w-6 text-oku-purple" />
                  <h2 className="text-xl font-semibold text-oku-dark">Preferences</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Language</label>
                    <input
                      type="text"
                      value={profile?.preferences?.language || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Timezone</label>
                    <input
                      type="text"
                      value={profile?.preferences?.timezone || ''}
                      className="w-full px-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-oku-dark">Email Notifications</label>
                    <div className={`w-12 h-6 rounded-full ${
                      profile?.preferences?.notifications ? 'bg-oku-purple' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        profile?.preferences?.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-oku-purple text-white py-3 rounded-lg font-medium hover:bg-oku-purple/90 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
