'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { markAsPaid } from '@/app/admin/actions'

export function AdminPayoutButton({ practitionerId, amount }: { practitionerId: string, amount: number }) {
  const [isPending, setIsPending] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  const handlePayout = async () => {
    if (!confirm(`Confirm manual payout of $${amount.toFixed(2)}?`)) return
    setIsPending(true)
    try {
      await markAsPaid(practitionerId, amount)
      setIsPaid(true)
    } catch (e) {
      alert('Error marking as paid')
    } finally {
      setIsPending(false)
    }
  }

  if (isPaid) {
    return (
        <span className="bg-green-50 text-green-700 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
            <Check size={14} /> Paid
        </span>
    )
  }

  return (
    <button 
        disabled={isPending}
        onClick={handlePayout}
        className="bg-oku-dark text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-all shadow-lg active:scale-95 disabled:opacity-50"
    >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : 'Mark Paid'}
    </button>
  )
}
