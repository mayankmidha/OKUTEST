'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertTriangle } from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'

interface TimeSlot {
  id: string
  startTime: Date
  endTime: Date
  available: boolean
  practitionerId: string
  practitionerName: string
  serviceType: string
  location?: string
  price: number
}

interface SmartSchedulerProps {
  practitionerId: string
  clientId: string
  onBooking: (slot: TimeSlot) => void
  selectedDate?: Date
}

export function SmartScheduler({ practitionerId, clientId, onBooking, selectedDate }: SmartSchedulerProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: selectedDate || new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  })

  // Fetch available slots
  useEffect(() => {
    fetchAvailableSlots()
  }, [practitionerId, dateRange])

  const fetchAvailableSlots = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/scheduling/available-slots?practitionerId=${practitionerId}&startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`)
      const slots = await response.json()
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to fetch available slots:', error)
    }
    setLoading(false)
  }

  const handleBooking = async (slot: TimeSlot) => {
    if (!slot.available) return
    
    setBookingLoading(true)
    try {
      // Create appointment
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practitionerId: slot.practitionerId,
          startTime: slot.startTime.toISOString(),
          serviceId: slot.serviceType
        })
      })

      if (response.ok) {
        const appointment = await response.json()
        onBooking(slot)
        setSelectedSlot(slot)
      } else {
        const error = await response.json()
        alert(error.message || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    }
    setBookingLoading(false)
  }

  const groupSlotsByDay = (slots: TimeSlot[]) => {
    const grouped: Record<string, TimeSlot[]> = {}
    
    slots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(slot)
    })
    
    return grouped
  }

  const timeSlots = groupSlotsByDay(availableSlots)
  const sortedDates = Object.keys(timeSlots).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-premium border border-oku-taupe/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-oku-purple/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-oku-purple" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-oku-dark">Smart Scheduling</h2>
              <p className="text-oku-taupe">Intelligent appointment booking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
              className="px-4 py-2 border border-oku-taupe/20 rounded-xl"
            />
            <span className="text-oku-taupe">to</span>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
              className="px-4 py-2 border border-oku-taupe/20 rounded-xl"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oku-purple"></div>
            <p className="ml-3 text-oku-taupe">Finding available slots...</p>
          </div>
        )}

        {/* Time Slots */}
        {!loading && sortedDates.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-oku-taupe/40 mx-auto mb-4" />
            <p className="text-oku-taupe">No available slots found for the selected period</p>
          </div>
        )}

        {!loading && sortedDates.length > 0 && (
          <div className="space-y-6">
            {sortedDates.map((dateStr) => (
              <div key={dateStr} className="border border-oku-taupe/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-oku-dark mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-oku-purple" />
                  {new Date(dateStr).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {timeSlots[dateStr].map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleBooking(slot)}
                      disabled={!slot.available || bookingLoading}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedSlot?.id === slot.id
                          ? 'border-oku-purple bg-oku-purple/10'
                          : slot.available
                          ? 'border-oku-taupe/20 hover:border-oku-purple hover:bg-oku-purple/5'
                          : 'border-oku-taupe/10 bg-oku-taupe/5 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-oku-taupe" />
                          <span className="font-medium text-sm">
                            {new Date(slot.startTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        <div className="text-xs text-oku-taupe space-y-1">
                          <div>{slot.serviceType}</div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {slot.location || 'Virtual'}
                          </div>
                          <div className="font-medium">
                            ₹{slot.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {selectedSlot?.id === slot.id && (
                        <div className="mt-2 flex items-center gap-2 text-oku-purple">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Summary */}
      {selectedSlot && (
        <DashboardCard variant="matcha" className="p-6">
          <h3 className="text-lg font-bold text-oku-dark mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-oku-taupe">Date:</span>
              <span className="font-medium">
                {new Date(selectedSlot.startTime).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-oku-taupe">Time:</span>
              <span className="font-medium">
                {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-oku-taupe">Practitioner:</span>
              <span className="font-medium">{selectedSlot.practitionerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-oku-taupe">Service:</span>
              <span className="font-medium">{selectedSlot.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-oku-taupe">Price:</span>
              <span className="font-medium">₹{selectedSlot.price.toLocaleString()}</span>
            </div>
          </div>
          
          <button
            onClick={() => handleBooking(selectedSlot)}
            disabled={bookingLoading || !selectedSlot.available}
            className="w-full btn-primary mt-6"
          >
            {bookingLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </DashboardCard>
      )}
    </div>
  )
}
