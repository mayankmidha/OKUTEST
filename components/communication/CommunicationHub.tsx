'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, Smartphone, CheckCircle, AlertTriangle, Settings } from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'

interface NotificationPreference {
  id: string
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP'
  enabled: boolean
  timing: 'IMMEDIATE' | 'DAILY' | 'WEEKLY'
  categories: string[]
}

interface CommunicationHubProps {
  userId: string
  isPractitioner?: boolean
}

export function CommunicationHub({ userId, isPractitioner = false }: CommunicationHubProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotificationPreferences()
    fetchMessages()
  }, [userId])

  const fetchNotificationPreferences = async () => {
    try {
      const response = await fetch(`/api/notifications/preferences?userId=${userId}`)
      const prefs = await response.json()
      setPreferences(prefs)
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/recent?userId=${userId}`)
      const msgs = await response.json()
      setMessages(msgs)
      setUnreadCount(msgs.filter((msg: any) => !msg.isRead).length)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
    setLoading(false)
  }

  const updatePreference = async (prefId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prefId, enabled })
      })

      if (response.ok) {
        setPreferences(prev => 
          prev.map(p => p.id === prefId ? { ...p, enabled } : p)
        )
      }
    } catch (error) {
      console.error('Failed to update preference:', error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH'
      })
      
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }

  const sendMessage = async (recipientId: string, content: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: recipientId,
          content
        })
      })

      if (response.ok) {
        const newMessage = await response.json()
        setMessages(prev => [newMessage, ...prev])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-premium border border-oku-taupe/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-oku-purple/20 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-oku-purple" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-oku-dark">Communication Hub</h2>
              <p className="text-oku-taupe">Messages and notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-oku-taupe" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-oku-rose rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </div>
            <button className="text-oku-taupe hover:text-oku-purple transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-oku-dark mb-4">Notification Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Notifications */}
            <DashboardCard variant="lavender" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-oku-lavender-dark" />
                  <div>
                    <p className="font-medium text-oku-dark">Email Notifications</p>
                    <p className="text-sm text-oku-taupe">Appointment reminders, updates</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('email', !preferences.find(p => p.type === 'EMAIL')?.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.find(p => p.type === 'EMAIL')?.enabled
                      ? 'bg-oku-purple'
                      : 'bg-oku-taupe/30'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.find(p => p.type === 'EMAIL')?.enabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </DashboardCard>

            {/* SMS Notifications */}
            <DashboardCard variant="glacier" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-oku-glacier-dark" />
                  <div>
                    <p className="font-medium text-oku-dark">SMS Notifications</p>
                    <p className="text-sm text-oku-taupe">Urgent alerts, reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('sms', !preferences.find(p => p.type === 'SMS')?.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.find(p => p.type === 'SMS')?.enabled
                      ? 'bg-oku-purple'
                      : 'bg-oku-taupe/30'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.find(p => p.type === 'SMS')?.enabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </DashboardCard>

            {/* Push Notifications */}
            <DashboardCard variant="matcha" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-oku-matcha-dark" />
                  <div>
                    <p className="font-medium text-oku-dark">Push Notifications</p>
                    <p className="text-sm text-oku-taupe">Real-time updates</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('push', !preferences.find(p => p.type === 'PUSH')?.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.find(p => p.type === 'PUSH')?.enabled
                      ? 'bg-oku-purple'
                      : 'bg-oku-taupe/30'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.find(p => p.type === 'PUSH')?.enabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </DashboardCard>

            {/* In-App Notifications */}
            <DashboardCard variant="rose" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-oku-rose-dark" />
                  <div>
                    <p className="font-medium text-oku-dark">In-App Notifications</p>
                    <p className="text-sm text-oku-taupe">Platform messages</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('in_app', !preferences.find(p => p.type === 'IN_APP')?.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.find(p => p.type === 'IN_APP')?.enabled
                      ? 'bg-oku-purple'
                      : 'bg-oku-taupe/30'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.find(p => p.type === 'IN_APP')?.enabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <DashboardCard variant="white" className="p-6">
        <h3 className="text-lg font-bold text-oku-dark mb-6">Recent Messages</h3>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oku-purple"></div>
            <p className="ml-3 text-oku-taupe">Loading messages...</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-oku-taupe/40 mx-auto mb-4" />
            <p className="text-oku-taupe">No messages yet</p>
            <p className="text-sm text-oku-taupe">Start a conversation to see messages here</p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="space-y-4">
            {messages.slice(0, 10).map((message: any) => (
              <div 
                key={message.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:bg-oku-taupe/5 ${
                  !message.isRead ? 'bg-oku-purple/5 border-oku-purple/20' : 'bg-white border-oku-taupe/10'
                }`}
                onClick={() => markAsRead(message.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-oku-purple/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-oku-purple">
                          {(message.sender?.name || 'Unknown').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-oku-dark text-sm">
                          {message.sender?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-oku-taupe">
                          {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-oku-dark">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-oku-purple rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {messages.length > 10 && (
              <div className="text-center pt-4">
                <button className="text-oku-purple hover:text-oku-purple-dark transition-colors">
                  View all messages
                </button>
              </div>
            )}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
