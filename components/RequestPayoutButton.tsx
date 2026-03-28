'use client'

import { useState, useTransition } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { requestPractitionerPayout } from '@/app/practitioner/actions'

export function RequestPayoutButton({
  amount,
  minimumAmount,
}: {
  amount: number
  minimumAmount: number
}) {
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const disabled = amount <= 0 || amount < minimumAmount

  const handleClick = () => {
    if (disabled) return

    const confirmed = window.confirm(
      `Request a cash out for $${amount.toFixed(2)}?`
    )

    if (!confirmed) return

    setMessage('')

    startTransition(async () => {
      try {
        await requestPractitionerPayout({ amount })
        setMessage('Cash-out request submitted for admin approval.')
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to submit payout request right now.')
      }
    })
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isPending}
        className="btn-primary w-full py-4 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
        {disabled ? `Minimum cash out is $${minimumAmount.toFixed(2)}` : 'Request Cash Out'}
      </button>
      {message && (
        <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">
          {message}
        </p>
      )}
    </div>
  )
}
