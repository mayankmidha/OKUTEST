'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, LogOut, Users, Video } from 'lucide-react'

import { JoinCircleButton } from '../JoinCircleButton'

interface CircleMembershipActionsProps {
  circleId: string
  sessionHref: string
  isMember: boolean
  isOnWaitlist: boolean
  isFull: boolean
  requiresPayment: boolean
}

export function CircleMembershipActions({
  circleId,
  sessionHref,
  isMember,
  isOnWaitlist,
  isFull,
  requiresPayment,
}: CircleMembershipActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function runAction(endpoint: string, method: 'POST' | 'DELETE', body?: Record<string, unknown>) {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Request failed.' }))
        throw new Error(data.message || 'Request failed.')
      }

      router.refresh()
    } catch (actionError: any) {
      setError(actionError.message || 'Request failed.')
    } finally {
      setStatus('idle')
    }
  }

  async function reportConcern() {
    const reason = window.prompt('What would you like to report?')
    if (!reason) return

    const details = window.prompt('Add any extra details (optional).') || ''
    await runAction(`/api/circles/${circleId}/report`, 'POST', { reason, details })
  }

  return (
    <div className="space-y-4">
      {isMember ? (
        <>
          <Link
            href={sessionHref}
            className="btn-pill-3d w-full !py-5 bg-oku-purple-dark text-white border-oku-purple-dark text-center flex items-center justify-center gap-3"
          >
            <Video size={16} /> Join Live Session
          </Link>
          <button
            onClick={() => runAction(`/api/circles/${circleId}/leave`, 'POST')}
            disabled={status === 'loading'}
            className="btn-pill-3d w-full !py-4 bg-white border-oku-darkgrey/10 text-oku-darkgrey flex items-center justify-center gap-3 text-xs"
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><LogOut size={16} /> Leave Circle</>}
          </button>
          <button
            onClick={reportConcern}
            disabled={status === 'loading'}
            className="btn-pill-3d w-full !py-4 bg-red-50 border-red-100 text-red-700 flex items-center justify-center gap-3 text-xs"
          >
            <AlertTriangle size={16} /> Report Concern
          </button>
        </>
      ) : isOnWaitlist ? (
        <button
          onClick={() => runAction(`/api/circles/${circleId}/waitlist`, 'DELETE')}
          disabled={status === 'loading'}
          className="btn-pill-3d w-full !py-5 bg-white border-oku-darkgrey/10 text-oku-darkgrey flex items-center justify-center gap-3 text-xs"
        >
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Leave Waitlist</>}
        </button>
      ) : isFull ? (
        <button
          onClick={() => runAction(`/api/circles/${circleId}/waitlist`, 'POST')}
          disabled={status === 'loading'}
          className="btn-pill-3d w-full !py-5 bg-oku-darkgrey text-white border-oku-darkgrey flex items-center justify-center gap-3 text-xs"
        >
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><Users size={16} /> Join Waitlist</>}
        </button>
      ) : (
        <JoinCircleButton circleId={circleId} isFull={false} requiresPayment={requiresPayment} />
      )}

      {error && (
        <p className="text-center text-[10px] font-bold text-red-500">{error}</p>
      )}
    </div>
  )
}
