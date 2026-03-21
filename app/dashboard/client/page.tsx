'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, FileText, Heart, MessageSquare, Video, CreditCard, Settings, Bell, LogOut, Search, Filter, Star, MapPin, Phone, Mail } from 'lucide-react'
import { therapists, getAvailableTherapists } from '@/lib/therapists'

export default function ClientDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
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
    
    setUpcomingAppointments([
      {
        id: '1',
        therapist: therapists[0],
        date: '2024-03-25',
        time: '10:00 AM',
        type: 'Individual Therapy',
        status: 'confirmed',
        duration: '60 mins',
        location: 'Online',
        notes: 'Initial consultation'
      }
    ])
    
    setNotifications([
      {
        id: '1',
        title: 'Appointment Reminder',
        message: 'Your session with Dr. Suraj Singh is tomorrow at 10:00 AM',
        type: 'reminder',
        date: '2024-03-24',
        read: false
      }
    ])
    
    setLoading(false)
  }, [])

  const availableTherapists = getAvailableTherapists()
  const allSpecialties = Array.from(new Set(therapists.flatMap(t => t.specialties)))
  
  const filteredTherapists = availableTherapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSpecialty = specialtyFilter === 'all' || 
                           therapist.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()))
    
    return matchesSearch && matchesSpecialty
  })

  const handleBookAppointment = (therapist: any) => {
    setSelectedTherapist(therapist)
    setBookingStep(2)
  }

  const handleTimeSlotSelect = (date: string, time: string) => {
    alert(`Appointment booked with ${selectedTherapist.name} on ${date} at ${time}`)
    setBookingStep(3)
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
              <h1 className="text-3xl font-bold text-oku-dark font-display">
                Welcome back, {user.name || user.email}
              </h1>
              <p className="text-oku-taupe mt-2">Your mental health journey continues</p>
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

        {/* Quick Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{upcomingAppointments.length}</p>
                </div>
                <div className="h-12 w-12 bg-oku-blue/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-oku-blue" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-oku-taupe">Therapists Available</p>
                  <p className="text-2xl font-bold text-oku-dark mt-1">{availableTherapists.length}</p>
                </div>
                <div className="h-12 w-12 bg-oku-green/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-oku-green" />
                </div>
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
            </div>
          </div>
        </div>

        {/* Booking Flow */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-card shadow-sm border border-oku-taupe/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-oku-dark font-display">Book a Session</h2>
              <div className="flex items-center gap-2 text-sm text-oku-taupe">
                {bookingStep > 1 && (
                  <button 
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className="text-oku-purple hover:text-oku-blue font-medium"
                  >
                    ← Back
                  </button>
                )}
                <span className="text-oku-taupe">Step {bookingStep} of 3</span>
              </div>
            </div>

            {bookingStep === 1 && (
              <div>
                <h3 className="text-lg font-medium text-oku-dark mb-4">Find Your Therapist</h3>
                
                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-oku-taupe" />
                    <input
                      type="text"
                      placeholder="Search by name, specialty, or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="px-4 py-2 border border-oku-taupe/20 rounded-lg focus:ring-2 focus:ring-oku-purple focus:border-transparent"
                    >
                      <option value="all">All Specialties</option>
                      {allSpecialties.map(specialty => (
                        <option key={specialty} value={specialty.toLowerCase()}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Therapist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                  {filteredTherapists.map((therapist) => (
                    <div key={therapist.id} className="bg-white border border-oku-taupe/20 rounded-lg p-4 hover:border-oku-purple/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <img 
                          src={therapist.image} 
                          alt={therapist.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-oku-dark">{therapist.name}</h3>
                          <p className="text-sm text-oku-taupe mb-2">{therapist.title}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {therapist.specialties.slice(0, 3).map(specialty => (
                              <span key={specialty} className="text-xs bg-oku-purple/10 text-oku-purple px-2 py-1 rounded-full">
                                {specialty}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-oku-taupe">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{therapist.rating}</span>
                            </div>
                            <span>• {therapist.experience} experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-oku-taupe">
                            <span>• ₹{therapist.consultationFee}/session</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookAppointment(therapist)}
                        className="w-full mt-4 bg-oku-purple text-white py-2 rounded-lg font-medium hover:bg-oku-purple/90 transition-colors"
                      >
                        Book Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookingStep === 2 && selectedTherapist && (
              <div>
                <h3 className="text-lg font-medium text-oku-dark mb-4">Select Date & Time</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Available Dates</label>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="text-center p-2 border border-oku-taupe/20 rounded">
                          <div className="text-xs font-medium">{day}</div>
                          <div className="text-xs text-oku-taupe">25</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-oku-dark mb-2">Available Time Slots</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeSlotSelect('2024-03-25', time)}
                          className="w-full text-left px-3 py-2 border border-oku-taupe/20 rounded hover:bg-oku-purple/10 hover:border-oku-purple/50 transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-oku-dark mb-2">Appointment Confirmed!</h3>
                  <p className="text-oku-taupe mb-4">
                    Your session with <strong>{selectedTherapist?.name}</strong> is scheduled for <strong>March 25, 2024 at 10:00 AM</strong>
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="px-6 py-3 border border-oku-taupe/20 rounded-lg hover:bg-oku-cream transition-colors"
                  >
                    Reschedule
                  </button>
                  <Link
                    href="/dashboard/client"
                    className="px-6 py-3 bg-oku-purple text-white rounded-lg font-medium hover:bg-oku-purple/90 transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-card shadow-sm border border-oku-taupe/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-oku-dark font-display">Your Upcoming Sessions</h2>
              <Link 
                href="/dashboard/client/appointments"
                className="text-sm text-oku-purple hover:text-oku-blue font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-oku-cream/50 rounded-card border-l-4 border-oku-green">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-oku-green/10 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-oku-green" />
                    </div>
                    <div>
                      <p className="font-medium text-oku-dark">{appointment.therapist.name}</p>
                      <p className="text-sm text-oku-taupe">{appointment.type} • {appointment.duration}</p>
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
        </div>
      </div>
    </div>
  )
}
