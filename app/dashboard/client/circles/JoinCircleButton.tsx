'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

interface JoinCircleButtonProps {
  circleId: string
  isFull: boolean
  requiresPayment: boolean
}

export function JoinCircleButton({ circleId, isFull, requiresPayment }: JoinCircleButtonProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleJoin() {
    if (isFull || status === 'loading' || status === 'success') return

    setStatus('loading')

    if (requiresPayment) {
      router.push(`/dashboard/client/checkout?type=GROUP_SESSION&id=${circleId}`)
      return
    }

    try {
      const response = await fetch(`/api/circles/${circleId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Could not join circle.' }))
        throw new Error(data.message || 'Could not join circle.')
      }

      setStatus('success')
      router.push(`/dashboard/client/circles/${circleId}`)
      router.refresh()
    } catch (error: any) {
      setErrorMsg(error.message || 'Could not join circle.')
      setStatus('error')
    }
  }

  if (isFull) {
    return (
      <div className="btn-pill-3d w-full !py-4 bg-oku-taupe/10 text-oku-taupe border-oku-taupe/10 text-center text-xs pointer-events-none">
        Waiting List Only
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="btn-pill-3d w-full !py-4 bg-oku-mint/60 text-oku-darkgrey border-oku-mint/60 flex items-center justify-center gap-3 text-xs pointer-events-none">
        <CheckCircle2 size={16} /> Joined!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoin}
        disabled={status === 'loading'}
        className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 pulse-cta flex items-center justify-center gap-3 text-xs disabled:opacity-60 disabled:cursor-not-allowed disabled:animate-none"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Joining...
          </>
        ) : (
          <>
            {requiresPayment ? 'Pay & Join' : 'Join this Circle'} <ArrowRight size={16} />
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-[10px] text-red-500 font-bold text-center px-2">{errorMsg}</p>
      )}
    </div>
  )
}
