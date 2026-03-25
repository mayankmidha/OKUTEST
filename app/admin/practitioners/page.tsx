'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Bell, LogOut, Users } from 'lucide-react'

export default function AdminPractitionersPage() {
  const [user, setUser] = useState<any>(null)
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock practitioners data
    setPractitioners([
      {
        id: '1',
        name: 'Dr. Suraj Singh',
        email: 'suraj@okutherapy.com',
        licenseNumber: 'MD-12345',
        specialization: ['Psychiatry', 'Medication Management'],
        experience: '15+ years',
        status: 'VERIFIED',
        createdAt: '2024-01-10',
        totalSessions: 156,
        rating: 4.9,
        hourlyRate: 1500
      },
      {
        id: '2',
        name: 'Tanisha Singh',
        email: 'tanisha@okutherapy.com',
        licenseNumber: 'PSY-67890',
        specialization: ['Clinical Psychology', 'Psychodynamic Therapy'],
        experience: '12+ years',
        status: 'VERIFIED',
        createdAt: '2024-01-12',
        totalSessions: 98,
        rating: 4.8,
        hourlyRate: 1200
      },
      {
        id: '3',
        name: 'Dr. Rananjay Singh',
        email: 'rananjay@okutherapy.com',
        licenseNumber: 'MD-24680',
        specialization: ['Psychiatry', 'Child & Adolescent Psychiatry'],
        experience: '10+ years',
        status: 'PENDING',
        createdAt: '2024-02-15',
        totalSessions: 45,
        rating: 4.7,
        hourlyRate: 1400
      }
    ])
    
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
          <p className="text-oku-taupe mb-8">Admin access required to view this page.</p>
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
                Practitioner Management
              </h1>
              <p className="text-oku-taupe mt-2">Manage therapy practitioners</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/dashboard"
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

        {/* Practitioners Table */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-card shadow-sm border border-oku-taupe/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-oku-taupe/10">
                <thead className="bg-oku-cream/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Practitioner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-oku-taupe/10">
                  {practitioners.map((practitioner) => (
                    <tr key={practitioner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-oku-purple/20 flex items-center justify-center">
                              <Users className="h-6 w-6 text-oku-purple" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-oku-dark">{practitioner.name}</div>
                            <div className="text-sm text-oku-taupe">{practitioner.email}</div>
                            <div className="text-xs text-oku-taupe">License: {practitioner.licenseNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-oku-dark">
                          {practitioner.specialization.map((spec: string, index: number) => (
                            <span key={index} className="inline-block bg-oku-purple/10 text-oku-purple px-2 py-1 rounded text-xs mr-1 mb-1">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        {practitioner.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          practitioner.status === 'VERIFIED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {practitioner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        {practitioner.totalSessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        ⭐ {practitioner.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        ₹{practitioner.hourlyRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-oku-purple hover:text-oku-blue transition-colors mr-2">
                          View
                        </button>
                        <button className="text-oku-purple hover:text-oku-blue transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
