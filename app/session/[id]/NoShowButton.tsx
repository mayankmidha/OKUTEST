'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserMinus, Loader2 } from 'lucide-react'

export default function NoShowButton({ sessionId, startTime }: { sessionId: string, startTime: string }) {
  const [isGracePeriodActive, setIsGracePeriodActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkGracePeriod = () => {
      const start = new Date(startTime)
      const graceTime = new Date(start.getTime() + 15 * 60000)
      setIsGracePeriodActive(new Date() < graceTime)
    }

    checkGracePeriod()
    const interval = setInterval(checkGracePeriod, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [startTime])

  const handleNoShow = async () => {
    if (!confirm('Are you sure you want to mark this as a "No Show"? This will increment the client\'s no-show count and conclude the session record.')) {
        return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/no-show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      if (res.ok) {
        alert('Recorded as No Show.')
        router.push('/practitioner/dashboard')
      } else {
        const text = await res.text()
        alert(text || 'Error recording no-show')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleNoShow}
      disabled={isGracePeriodActive || loading}
      className={`w-full py-4 rounded-pill font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
        isGracePeriodActive 
        ? 'bg-white/5 text-white/20 cursor-not-allowed' 
        : 'bg-white text-oku-dark hover:bg-oku-purple'
      }`}
    >
      {loading ? (
          <Loader2 className="animate-spin" size={14} />
      ) : (
          <UserMinus size={14} />
      )}
      Mark as No Show
    </button>
  )
}
