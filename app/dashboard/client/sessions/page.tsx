'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Users, FileText, Heart, MessageSquare, Video, CreditCard, Settings, Bell, LogOut } from 'lucide-react'

export default function ClientSessionsPage() {
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
        therapist: {
          name: 'Dr. Suraj Singh',
          title: 'Consultant Psychiatrist',
          image: '/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg'
        },
        date: '2024-03-25',
        time: '10:00 AM',
        type: 'Individual Therapy',
        status: 'completed',
        duration: '60 mins',
        location: 'Online',
        notes: 'Initial consultation',
        paymentStatus: 'paid'
      },
      {
        id: '2',
        therapist: {
          name: 'Dr. Suraj Singh',
          title: 'Consultant Psychiatrist',
          image: '/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg'
        },
        date: '2024-04-01',
        time: '2:00 PM',
        type: 'Follow-up Session',
        status: 'upcoming',
        duration: '60 mins',
        location: 'Online',
        notes: 'Medication review',
        paymentStatus: 'pending'
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
          <p className="text-oku-taupe mb-8">You need to be logged in to access your sessions.</p>
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
                Your Sessions
              </h1>
              <p className="text-oku-taupe mt-2">View and manage your therapy sessions</p>
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

        {/* Sessions List */}
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={session.therapist.image} 
                      alt={session.therapist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-oku-dark">{session.therapist.name}</h3>
                      <p className="text-sm text-oku-taupe">{session.therapist.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-oku-taupe">{session.type} • {session.duration}</span>
                        <span className="text-sm text-oku-taupe">• {session.location}</span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-oku-taupe mt-1">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-oku-dark">{session.time}</p>
                    <p className="text-sm text-oku-taupe">{session.date}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : session.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        session.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
