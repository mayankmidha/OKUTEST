import { NextResponse } from 'next/server'

export async function GET() {
  // Mock appointments data
  const appointments = [
    {
      id: '1',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T11:00:00Z',
      notes: 'Initial consultation - anxiety management',
      client: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com'
      }
    },
    {
      id: '2', 
      startTime: '2024-01-15T14:00:00Z',
      endTime: '2024-01-15T15:00:00Z',
      notes: 'Follow-up session - depression treatment',
      client: {
        name: 'Michael Chen',
        email: 'michael@example.com'
      }
    },
    {
      id: '3',
      startTime: '2024-01-16T09:00:00Z', 
      endTime: '2024-01-16T10:00:00Z',
      notes: 'Trauma therapy session',
      client: {
        name: 'Emma Davis',
        email: 'emma@example.com'
      }
    }
  ]

  const stats = {
    appointments: appointments.length,
    clients: 3,
    completed: 12
  }

  return NextResponse.json({
    todays: appointments,
    stats: stats
  })
}
