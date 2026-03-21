'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NoShowButton({ sessionId, scheduledTime }: { sessionId: string, scheduledTime: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNoShow = async () => {
    // Basic confirmation
    if (!confirm('Mark client as no-show and charge full fee?')) return

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
    } catch (e) {
      alert('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Grace period logic (client side)
  const isGracePassed = () => {
    const scheduled = new Date(scheduledTime)
    const graceLimit = new Date(scheduled.getTime() + 15 * 60000)
    return new Date() >= graceLimit
  }

  return (
    <button 
      onClick={handleNoShow}
      disabled={loading || !isGracePassed()}
      className={`px-4 py-2 rounded-pill text-[10px] uppercase tracking-widest font-black transition-all ${
        isGracePassed() 
        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
      }`}
      title={!isGracePassed() ? "Available after 15 mins of session start" : ""}
    >
      {loading ? 'Processing...' : 'No-Show'}
    </button>
  )
}
