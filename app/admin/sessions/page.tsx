'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Bell, LogOut, Calendar } from 'lucide-react'

export default function AdminSessionsPage() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock sessions data
    setSessions([
      {
        id: '1',
        client: {
          name: 'Sarah Johnson',
          email: 'sarah@client.com'
        },
        practitioner: {
          name: 'Dr. Suraj Singh',
          email: 'suraj@okutherapy.com'
        },
        service: 'Individual Therapy',
        date: '2024-03-25',
        time: '10:00 AM',
        duration: '60 mins',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        amount: 1500,
        type: 'VIDEO'
      },
      {
        id: '2',
        client: {
          name: 'Michael Chen',
          email: 'michael@client.com'
        },
        practitioner: {
          name: 'Tanisha Singh',
          email: 'tanisha@okutherapy.com'
        },
        service: 'Follow-up Session',
        date: '2024-03-25',
        time: '2:00 PM',
        duration: '50 mins',
        status: 'SCHEDULED',
        paymentStatus: 'PENDING',
        amount: 1200,
        type: 'VIDEO'
      },
      {
        id: '3',
        client: {
          name: 'Emma Wilson',
          email: 'emma@client.com'
        },
        practitioner: {
          name: 'Dr. Rananjay Singh',
          email: 'rananjay@okutherapy.com'
        },
        service: 'Initial Consultation',
        date: '2024-03-26',
        time: '11:00 AM',
        duration: '90 mins',
        status: 'SCHEDULED',
        paymentStatus: 'PENDING',
        amount: 2000,
        type: 'IN-PERSON'
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
                Session Management
              </h1>
              <p className="text-oku-taupe mt-2">View all therapy sessions</p>
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

        {/* Sessions Table */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-card shadow-sm border border-oku-taupe/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-oku-taupe/10">
                <thead className="bg-oku-cream/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Session Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Practitioner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-oku-taupe/10">
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-oku-dark">{session.service}</div>
                          <div className="text-sm text-oku-taupe">{session.duration}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-oku-dark">{session.client.name}</div>
                          <div className="text-oku-taupe">{session.client.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-oku-dark">{session.practitioner.name}</div>
                          <div className="text-oku-taupe">{session.practitioner.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        <div>{session.date}</div>
                        <div>{session.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          session.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          session.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        ₹{session.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          session.type === 'VIDEO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {session.type}
                        </span>
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
