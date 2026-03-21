'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Clock, DollarSign, FileText, Video, Settings, Bell, TrendingUp, Star, MessageSquare, LogOut, UserPlus, Award, Target, Activity } from 'lucide-react'

export default function TherapistDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [todaySessions, setTodaySessions] = useState<any[]>([])
  const [weeklyStats, setWeeklyStats] = useState<any>({})
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')
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
    
    // Mock data for therapist dashboard
    setTodaySessions([
      {
        id: '1',
        client: { name: 'Sarah Johnson', email: 'sarah@email.com' },
        time: '10:00 AM',
        duration: '60 mins',
        type: 'Individual Therapy',
        status: 'confirmed',
        location: 'Online',
        notes: 'Initial consultation'
      },
      {
        id: '2',
        client: { name: 'Michael Chen', email: 'michael@email.com' },
        time: '2:00 PM',
        duration: '45 mins',
        type: 'Follow-up',
        status: 'confirmed',
        location: 'Online',
        notes: 'Progress review'
      }
    ])
    
    setWeeklyStats({
      totalSessions: 24,
      totalHours: 36,
      earnings: 24000,
      averageRating: 4.8,
      newClients: 3,
      completedSessions: 22,
      cancelledSessions: 2
    })
    
    setUpcomingSessions([
      {
        id: '3',
        client: { name: 'Emma Davis', email: 'emma@email.com' },
        date: '2024-03-26',
        time: '11:00 AM',
        type: 'Individual Therapy',
        status: 'scheduled'
      },
      {
        id: '4',
        client: { name: 'James Wilson', email: 'james@email.com' },
        date: '2024-03-27',
        time: '3:00 PM',
        type: 'Assessment',
        status: 'scheduled'
      }
    ])
    
    setNotifications([
      {
        id: '1',
        title: 'New Client Booking',
        message: 'Emma Davis booked a session for tomorrow',
        type: 'booking',
        date: '2024-03-25',
        read: false
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment received for session with Sarah Johnson',
        type: 'payment',
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
          <p className="text-oku-taupe mb-8">You need to be logged in to access your dashboard.</p>
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
                Practice Dashboard
              </h1>
              <p className="text-oku-taupe mt-2">Manage your therapy practice efficiently</p>
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

        {/* Navigation Tabs */}
        <div className="px-4 py-6 sm:px-0 mb-6">
          <div className="bg-white rounded-card shadow-sm border border-oku-taupe/10 p-1">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'appointments', label: 'Appointments', icon: Video },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'availability', label: 'Availability', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-oku-purple text-white' 
                      : 'text-oku-taupe hover:bg-oku-cream hover:text-oku-dark'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Total Sessions</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">{weeklyStats.totalSessions}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-oku-blue" />
                    </div>
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
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Earnings</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹{weeklyStats.earnings.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-purple/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-oku-purple" />
                    </div>
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
                </div>
              </div>

              {/* Today's Schedule */}
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
                          <p className="font-medium text-oku-dark">{session.client.name}</p>
                          <p className="text-sm text-oku-taupe">{session.type} • {session.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-oku-dark">{session.time}</p>
                        <p className="text-sm text-oku-taupe">{session.location}</p>
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
                    href="/practitioner/activity"
                    className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {[
                    { type: 'session', title: 'Session Completed', client: 'Sarah Johnson', date: '2024-03-24', status: 'completed' },
                    { type: 'booking', title: 'New Booking', client: 'Emma Davis', date: '2024-03-23', status: 'confirmed' },
                    { type: 'payment', title: 'Payment Received', client: 'Michael Chen', date: '2024-03-22', status: 'completed' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-oku-cream/50 rounded-card">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.type === 'session' ? 'bg-oku-blue/10' : 
                        activity.type === 'booking' ? 'bg-oku-green/10' : 'bg-oku-purple/10'
                      }`}>
                        {activity.type === 'session' ? (
                          <Video className="h-5 w-5 text-oku-blue" />
                        ) : activity.type === 'booking' ? (
                          <UserPlus className="h-5 w-5 text-oku-green" />
                        ) : (
                          <DollarSign className="h-5 w-5 text-oku-purple" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-oku-dark">{activity.title}</p>
                        <p className="text-sm text-oku-taupe">{activity.client} • {activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <h2 className="text-lg font-semibold text-oku-dark mb-4 font-display">Weekly Schedule</h2>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={day} className="border border-oku-taupe/20 rounded-lg p-4">
                    <h3 className="font-medium text-oku-dark mb-3">{day}</h3>
                    <div className="space-y-2">
                      {index < 5 ? (
                        <>
                          <div className="text-sm p-2 bg-oku-green/10 text-oku-green rounded">10:00 AM - Sarah J.</div>
                          <div className="text-sm p-2 bg-oku-blue/10 text-oku-blue rounded">2:00 PM - Michael C.</div>
                        </>
                      ) : (
                        <div className="text-sm text-oku-taupe text-center py-4">No sessions</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-oku-dark font-display">Client Management</h2>
                  <Link 
                    href="/practitioner/clients"
                    className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Sarah Johnson', email: 'sarah@email.com', sessions: 12, nextSession: '2024-03-25', status: 'active' },
                    { name: 'Michael Chen', email: 'michael@email.com', sessions: 8, nextSession: '2024-03-26', status: 'active' },
                    { name: 'Emma Davis', email: 'emma@email.com', sessions: 4, nextSession: '2024-03-26', status: 'new' }
                  ].map((client, index) => (
                    <div key={index} className="border border-oku-taupe/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-oku-purple/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-oku-purple" />
                        </div>
                        <div>
                          <p className="font-medium text-oku-dark">{client.name}</p>
                          <p className="text-sm text-oku-taupe">{client.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-oku-taupe">Sessions:</span>
                          <span className="font-medium text-oku-dark">{client.sessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-oku-taupe">Next Session:</span>
                          <span className="font-medium text-oku-dark">{client.nextSession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-oku-taupe">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' ? 'bg-oku-green/10 text-oku-green' : 
                            client.status === 'new' ? 'bg-oku-blue/10 text-oku-blue' : 'bg-oku-taupe/10 text-oku-taupe'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-oku-dark font-display">Upcoming Appointments</h2>
                <Link 
                  href="/practitioner/appointments"
                  className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                >
                  Manage →
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-oku-cream/50 rounded-card border-l-4 border-oku-blue">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-oku-blue/10 rounded-full flex items-center justify-center">
                        <Video className="h-5 w-5 text-oku-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-oku-dark">{appointment.client.name}</p>
                        <p className="text-sm text-oku-taupe">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-oku-dark">{appointment.time}</p>
                      <p className="text-sm text-oku-taupe">{appointment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">This Month</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹{weeklyStats.earnings.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-oku-green" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Total Earned</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹{(weeklyStats.earnings * 3).toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-purple/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-oku-purple" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Avg per Session</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹{Math.round(weeklyStats.earnings / weeklyStats.totalSessions)}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-oku-blue" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Pending</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹4,500</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-orange/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-oku-orange" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-oku-dark font-display">Availability Settings</h2>
                <Link 
                  href="/practitioner/availability"
                  className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                >
                  Configure →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-oku-dark mb-4">Working Hours</h3>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-oku-cream/50 rounded">
                        <span className="font-medium text-oku-dark">{day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-oku-taupe">9:00 AM - 6:00 PM</span>
                          <div className="h-2 w-2 bg-oku-green rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-oku-dark mb-4">Weekend Availability</h3>
                  <div className="space-y-3">
                    {['Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-oku-cream/50 rounded">
                        <span className="font-medium text-oku-dark">{day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-oku-taupe">10:00 AM - 2:00 PM</span>
                          <div className="h-2 w-2 bg-oku-orange rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-oku-blue/5 border border-oku-blue/20 rounded-card p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-oku-blue" />
                <div className="flex-1">
                  <p className="font-medium text-oku-dark">New Notifications</p>
                  <p className="text-sm text-oku-taupe">{notifications.filter(n => !n.read).length} unread notifications</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, read: true })))
                  }}
                  className="text-sm text-oku-blue hover:text-oku-purple font-medium transition-colors"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
