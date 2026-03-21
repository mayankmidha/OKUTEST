'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Clock, DollarSign, FileText, Video, Settings, Bell, TrendingUp, Star, MessageSquare, LogOut } from 'lucide-react'

export default function PractitionerDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [todaySessions, setTodaySessions] = useState<any[]>([])
  const [weeklyStats, setWeeklyStats] = useState<any>({})
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth/login')
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock data for demo
    setTodaySessions([
      {
        id: '1',
        client: 'Sarah Johnson',
        time: '10:00 AM',
        type: 'Individual Therapy',
        status: 'confirmed',
        duration: '60 mins'
      },
      {
        id: '2',
        client: 'Michael Chen',
        time: '2:00 PM',
        type: 'Assessment',
        status: 'confirmed',
        duration: '90 mins'
      }
    ])
    
    setWeeklyStats({
      totalSessions: 24,
      totalHours: 36,
      totalEarnings: 54000,
      averageRating: 4.8,
      newClients: 3
    })
    
    setUpcomingSessions([
      {
        id: '1',
        client: 'Sarah Johnson',
        date: '2024-03-25',
        time: '10:00 AM',
        type: 'Individual Therapy',
        status: 'confirmed'
      },
      {
        id: '2',
        client: 'Emma Wilson',
        date: '2024-03-26',
        time: '3:00 PM',
        type: 'Follow-up',
        status: 'pending'
      }
    ])
    
    setNotifications([
      {
        id: '1',
        title: 'New Booking',
        message: 'Emma Wilson booked a session for March 26',
        type: 'booking',
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
              <h1 className="text-3xl font-bold text-oku-dark font-display">Therapist Dashboard</h1>
              <p className="text-oku-taupe mt-2">Manage your practice and clients</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-oku-taupe hover:text-oku-dark transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-oku-red rounded-full"></span>
                )}
              </button>
              <Link 
                href="/practitioner/profile"
                className="p-2 text-oku-taupe hover:text-oku-dark transition-colors"
              >
                <Settings className="h-5 w-5" />
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

        {/* Today's Schedule */}
        <div className="px-4 py-6 sm:px-0 mb-8">
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-oku-dark font-display">Today's Schedule</h2>
              <Link 
                href="/practitioner/schedule"
                className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
              >
                View Full Schedule →
              </Link>
            </div>
            <div className="space-y-4">
              {todaySessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-oku-cream/50 rounded-card border-l-4 border-oku-green">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-oku-green/10 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-oku-green" />
                    </div>
                    <div>
                      <p className="font-medium text-oku-dark">{session.client}</p>
                      <p className="text-sm text-oku-taupe">{session.type} • {session.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-oku-dark">{session.time}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-oku-green/10 text-oku-green">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Weekly Sessions</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{weeklyStats.totalSessions}</p>
                </div>
                <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-oku-blue" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/practitioner/schedule"
                  className="text-sm text-oku-blue hover:text-oku-purple font-medium transition-colors"
                >
                  Manage Schedule →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Total Hours</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{weeklyStats.totalHours}</p>
                </div>
                <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-oku-green" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/practitioner/analytics"
                  className="text-sm text-oku-green hover:text-oku-purple font-medium transition-colors"
                >
                  View Analytics →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Earnings</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">₹{weeklyStats.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-oku-purple/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-oku-purple" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/practitioner/earnings"
                  className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                >
                  View Earnings →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Avg Rating</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{weeklyStats.averageRating}</p>
                </div>
                <div className="h-12 w-12 bg-oku-pink/10 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-oku-pink" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/practitioner/reviews"
                  className="text-sm text-oku-pink hover:text-oku-purple font-medium transition-colors"
                >
                  View Reviews →
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
                href="/practitioner/schedule"
                className="flex items-center gap-3 p-4 bg-oku-blue/5 border border-oku-blue/20 rounded-card hover:bg-oku-blue/10 transition-colors"
              >
                <Calendar className="h-5 w-5 text-oku-blue" />
                <div>
                  <p className="font-medium text-oku-dark">Schedule</p>
                  <p className="text-xs text-oku-taupe">Manage availability</p>
                </div>
              </Link>
              
              <Link 
                href="/practitioner/clients"
                className="flex items-center gap-3 p-4 bg-oku-green/5 border border-oku-green/20 rounded-card hover:bg-oku-green/10 transition-colors"
              >
                <Users className="h-5 w-5 text-oku-green" />
                <div>
                  <p className="font-medium text-oku-dark">Clients</p>
                  <p className="text-xs text-oku-taupe">View client list</p>
                </div>
              </Link>
              
              <Link 
                href="/practitioner/appointments"
                className="flex items-center gap-3 p-4 bg-oku-purple/5 border border-oku-purple/20 rounded-card hover:bg-oku-purple/10 transition-colors"
              >
                <Video className="h-5 w-5 text-oku-purple" />
                <div>
                  <p className="font-medium text-oku-dark">Sessions</p>
                  <p className="text-xs text-oku-taupe">View appointments</p>
                </div>
              </Link>
              
              <Link 
                href="/practitioner/notes"
                className="flex items-center gap-3 p-4 bg-oku-pink/5 border border-oku-pink/20 rounded-card hover:bg-oku-pink/10 transition-colors"
              >
                <FileText className="h-5 w-5 text-oku-pink" />
                <div>
                  <p className="font-medium text-oku-dark">Notes</p>
                  <p className="text-xs text-oku-taupe">Session notes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions & New Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6 sm:px-0">
          {/* Upcoming Sessions */}
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-oku-dark font-display">Upcoming Sessions</h2>
              <Link 
                href="/practitioner/appointments"
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
                      <p className="font-medium text-oku-dark">{session.client}</p>
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

          {/* New Clients */}
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-oku-dark font-display">New Clients</h2>
              <Link 
                href="/practitioner/clients"
                className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-oku-cream/50 rounded-card">
                <div className="h-10 w-10 bg-oku-blue/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-oku-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-oku-dark">Emma Wilson</p>
                  <p className="text-sm text-oku-taupe">Joined March 20, 2024</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-oku-blue/10 text-oku-blue">
                    New
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-oku-cream/50 rounded-card">
                <div className="h-10 w-10 bg-oku-green/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-oku-green" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-oku-dark">Michael Chen</p>
                  <p className="text-sm text-oku-taupe">Joined March 18, 2024</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-oku-green/10 text-oku-green">
                    Active
                  </span>
                </div>
              </div>
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
                  <p className="font-medium text-oku-dark">New Booking</p>
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
