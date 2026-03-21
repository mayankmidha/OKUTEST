'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, Calendar, DollarSign, FileText, Settings, Bell, LogOut, UserPlus, TrendingUp, Activity, Award, Shield, CheckCircle, AlertTriangle, Clock, Star, Eye, Edit, Trash2, Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [pendingTherapists, setPendingTherapists] = useState<any[]>([])
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
    
    // Mock admin data
    setStats({
      totalTherapists: 6,
      activeTherapists: 5,
      totalClients: 124,
      activeClients: 89,
      totalSessions: 487,
      monthlyRevenue: 125000,
      pendingApplications: 3,
      systemHealth: 'Good'
    })
    
    setPendingTherapists([
      {
        id: '1',
        name: 'Dr. Jane Smith',
        email: 'jane@therapy.com',
        specialties: ['Clinical Psychology', 'CBT'],
        experience: '8 years',
        appliedDate: '2024-03-20',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Dr. John Doe',
        email: 'john@therapy.com',
        specialties: ['Psychiatry', 'Medication Management'],
        experience: '12 years',
        appliedDate: '2024-03-22',
        status: 'pending'
      }
    ])
    
    setNotifications([
      {
        id: '1',
        title: 'Pending Applications',
        message: '3 therapist applications awaiting review',
        type: 'pending',
        date: '2024-03-25',
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
                Admin Dashboard
              </h1>
              <p className="text-oku-taupe mt-2">System management and oversight</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-oku-taupe hover:text-oku-dark transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-oku-red rounded-full"></span>
                )}
              </button>
              <Link 
                href="/admin/settings"
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
                { id: 'therapists', label: 'Therapists', icon: Users },
                { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Total Therapists</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">{stats.totalTherapists}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-oku-blue" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Active Therapists</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">{stats.activeTherapists}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-oku-green" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Total Clients</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">{stats.totalClients}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-purple/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-oku-purple" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oku-taupe">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-oku-dark mt-1">₹{stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-oku-green" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Applications */}
              <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-oku-dark font-display">Pending Applications</h2>
                  <Link 
                    href="/admin/onboarding"
                    className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
                  >
                    Review All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {pendingTherapists.map((therapist) => (
                    <div key={therapist.id} className="flex items-center justify-between p-4 bg-oku-cream/50 rounded-card border-l-4 border-oku-orange">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-oku-orange/10 rounded-full flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-oku-orange" />
                        </div>
                        <div>
                          <p className="font-medium text-oku-dark">{therapist.name}</p>
                          <p className="text-sm text-oku-taupe">{therapist.specialties.join(', ')} • {therapist.experience}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-oku-green text-white text-xs rounded hover:bg-oku-green/90 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-oku-red text-white text-xs rounded hover:bg-oku-red/90 transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
