'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, TrendingUp, Users, FileText, Heart, MessageSquare, Video, CreditCard, Settings, Bell } from 'lucide-react'

export default function ClientDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock data for demo
    setUpcomingSessions([
      {
        id: '1',
        therapist: 'Dr. Suraj Singh',
        date: '2024-03-25',
        time: '10:00 AM',
        type: 'Individual Therapy',
        status: 'confirmed'
      },
      {
        id: '2',
        therapist: 'Tanisha Singh',
        date: '2024-03-28',
        time: '2:00 PM',
        type: 'Assessment',
        status: 'pending'
      }
    ])
    
    setRecentActivity([
      {
        id: '1',
        type: 'session',
        title: 'Session with Dr. Suraj Singh',
        description: 'Completed individual therapy session',
        date: '2024-03-20',
        status: 'completed'
      },
      {
        id: '2',
        type: 'assessment',
        title: 'Anxiety Assessment',
        description: 'Completed anxiety assessment',
        date: '2024-03-18',
        status: 'completed'
      }
    ])
    
    setNotifications([
      {
        id: '1',
        title: 'Session Reminder',
        message: 'Your session with Dr. Suraj Singh is tomorrow at 10:00 AM',
        type: 'reminder',
        date: '2024-03-24',
        read: false
      }
    ])
    
    setLoading(false)
  }, [])

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
          <p className="text-oku-taupe mb-8">You need to be logged in to access the dashboard.</p>
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
              <h1 className="text-3xl font-bold text-oku-dark font-display">Welcome back, {user.name || user.email}</h1>
              <p className="text-oku-taupe mt-2">Here's your mental health journey overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-oku-taupe hover:text-oku-dark transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-oku-red rounded-full"></span>
                )}
              </button>
              <Link 
                href="/dashboard/client/profile"
                className="p-2 text-oku-taupe hover:text-oku-dark transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{upcomingSessions.length}</p>
                </div>
                <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-oku-blue" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/client/book"
                  className="text-sm text-oku-blue hover:text-oku-purple font-medium transition-colors"
                >
                  Book New Session →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Completed Sessions</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">12</p>
                </div>
                <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-oku-green" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/client/sessions"
                  className="text-sm text-oku-green hover:text-oku-purple font-medium transition-colors"
                >
                  View All Sessions →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Assessments</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">3</p>
                </div>
                <div className="h-12 w-12 bg-oku-purple/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-oku-purple" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/client/assessments"
                  className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                >
                  Take Assessment →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Mood Score</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">7.2/10</p>
                </div>
                <div className="h-12 w-12 bg-oku-pink/10 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-oku-pink" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/client/mood"
                  className="text-sm text-oku-pink hover:text-oku-purple font-medium transition-colors"
                >
                  Track Mood →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <h2 className="text-lg font-semibold text-oku-dark mb-4 font-display">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/dashboard/client/book"
                className="flex items-center gap-3 p-4 bg-oku-blue/5 border border-oku-blue/20 rounded-card hover:bg-oku-blue/10 transition-colors"
              >
                <Video className="h-5 w-5 text-oku-blue" />
                <div>
                  <p className="font-medium text-oku-dark">Book Session</p>
                  <p className="text-xs text-oku-taupe">Schedule with therapist</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/client/assessments"
                className="flex items-center gap-3 p-4 bg-oku-purple/5 border border-oku-purple/20 rounded-card hover:bg-oku-purple/10 transition-colors"
              >
                <FileText className="h-5 w-5 text-oku-purple" />
                <div>
                  <p className="font-medium text-oku-dark">Assessment</p>
                  <p className="text-xs text-oku-taupe">Take mental health test</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/client/mood"
                className="flex items-center gap-3 p-4 bg-oku-pink/5 border border-oku-pink/20 rounded-card hover:bg-oku-pink/10 transition-colors"
              >
                <Heart className="h-5 w-5 text-oku-pink" />
                <div>
                  <p className="font-medium text-oku-dark">Track Mood</p>
                  <p className="text-xs text-oku-taupe">Daily mood journal</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/client/messages"
                className="flex items-center gap-3 p-4 bg-oku-green/5 border border-oku-green/20 rounded-card hover:bg-oku-green/10 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-oku-green" />
                <div>
                  <p className="font-medium text-oku-dark">Messages</p>
                  <p className="text-xs text-oku-taupe">Chat with therapist</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6 sm:px-0">
          {/* Upcoming Sessions */}
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-oku-dark font-display">Upcoming Sessions</h2>
              <Link 
                href="/dashboard/client/sessions"
                className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-oku-cream/50 rounded-card">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      session.status === 'confirmed' ? 'bg-oku-green/10' : 'bg-oku-orange/10'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        session.status === 'confirmed' ? 'text-oku-green' : 'text-oku-orange'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-oku-dark">{session.therapist}</p>
                      <p className="text-sm text-oku-taupe">{session.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-oku-dark">{session.time}</p>
                    <p className="text-sm text-oku-taupe">{session.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-oku-dark font-display">Recent Activity</h2>
              <Link 
                href="/dashboard/client/activity"
                className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-4 bg-oku-cream/50 rounded-card">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.type === 'session' ? 'bg-oku-blue/10' : 'bg-oku-purple/10'
                  }`}>
                    {activity.type === 'session' ? (
                      <Video className="h-5 w-5 text-oku-blue" />
                    ) : (
                      <FileText className="h-5 w-5 text-oku-purple" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-oku-dark">{activity.title}</p>
                    <p className="text-sm text-oku-taupe">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-oku-taupe">{activity.date}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-oku-green/10 text-oku-green' 
                        : 'bg-oku-orange/10 text-oku-orange'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-oku-blue/5 border border-oku-blue/20 rounded-card p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-oku-blue" />
                <div className="flex-1">
                  <p className="font-medium text-oku-dark">New Notification</p>
                  <p className="text-sm text-oku-taupe">{notifications.find(n => !n.read)?.message}</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, read: true })))
                  }}
                  className="text-sm text-oku-blue hover:text-oku-purple font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
