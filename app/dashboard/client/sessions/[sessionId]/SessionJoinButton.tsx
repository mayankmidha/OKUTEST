'use client'

import { useState } from 'react'
import { Video, Loader2 } from 'lucide-react'

export function SessionJoinButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/join`, { method: 'POST' })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to get session token')
      }
      const { token, callId, apiKey } = await res.json()
      // Redirect to the video room with credentials in query params
      // The video room page handles StreamVideoClient initialisation
      window.location.href = `/session/${sessionId}?callId=${callId}&apiKey=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="flex items-center gap-3 px-8 py-4 rounded-full bg-oku-darkgrey text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-purple-dark transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 animate-pulse"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
        {loading ? 'Connecting...' : 'Join Session'}
      </button>
      {error && <p className="text-xs text-red-500 max-w-xs text-right">{error}</p>}
    </div>
  )
}
