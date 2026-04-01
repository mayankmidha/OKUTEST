'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserX } from 'lucide-react'

// Named export for appointments page — takes appointmentId
export function NoShowButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNoShow = async () => {
    if (!confirm('Mark this client as no-show for this session?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${appointmentId}/no-show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: appointmentId })
      })
      if (res.ok) {
        router.refresh()
      } else {
        const err = await res.text()
        alert(err || 'Failed to record no-show.')
      }
    } catch {
      alert('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleNoShow}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-100 text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Mark as no-show"
    >
      <UserX size={12} />
      {loading ? '...' : 'No-Show'}
    </button>
  )
}

// Default export for legacy usage — takes sessionId + optional scheduledTime
export default function NoShowButtonLegacy({ sessionId, scheduledTime }: { sessionId: string; scheduledTime?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNoShow = async () => {
    if (!confirm('Mark client as no-show?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/no-show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      if (res.ok) {
        router.refresh()
      } else {
        const err = await res.text()
        alert(err || 'Failed to record no-show.')
      }
    } catch {
      alert('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const isGracePassed = () => {
    if (!scheduledTime) return true
    const scheduled = new Date(scheduledTime)
    const graceLimit = new Date(scheduled.getTime() + 15 * 60000)
    return new Date() >= graceLimit
  }

  return (
    <button
      onClick={handleNoShow}
      disabled={loading || !isGracePassed()}
      className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
        isGracePassed()
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
      }`}
      title={!isGracePassed() ? 'Available after 15 mins of session start' : 'Mark as no-show'}
    >
      {loading ? 'Processing...' : 'No-Show'}
    </button>
  )
}
