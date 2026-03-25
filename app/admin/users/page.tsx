'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Bell, LogOut, Users } from 'lucide-react'

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Mock users data
    setUsers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@client.com',
        role: 'CLIENT',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        lastLogin: '2024-03-25'
      },
      {
        id: '2',
        name: 'Dr. Suraj Singh',
        email: 'suraj@okutherapy.com',
        role: 'THERAPIST',
        status: 'ACTIVE',
        createdAt: '2024-01-10',
        lastLogin: '2024-03-25'
      },
      {
        id: '3',
        name: 'Tanisha Singh',
        email: 'tanisha@okutherapy.com',
        role: 'THERAPIST',
        status: 'ACTIVE',
        createdAt: '2024-01-12',
        lastLogin: '2024-03-24'
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@okutherapy.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2024-01-01',
        lastLogin: '2024-03-25'
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
                User Management
              </h1>
              <p className="text-oku-taupe mt-2">Manage all platform users</p>
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

        {/* Users Table */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-card shadow-sm border border-oku-taupe/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-oku-taupe/10">
                <thead className="bg-oku-cream/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-oku-dark uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-oku-taupe/10">
                  {users.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-oku-purple/20 flex items-center justify-center">
                              <Users className="h-6 w-6 text-oku-purple" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-oku-dark">{userItem.name}</div>
                            <div className="text-sm text-oku-taupe">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          userItem.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-800'
                            : userItem.role === 'THERAPIST'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          userItem.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        {userItem.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-oku-taupe">
                        {userItem.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
