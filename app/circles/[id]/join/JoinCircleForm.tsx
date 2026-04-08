'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, ArrowRight } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'

export function JoinCircleForm({
  circleId,
  isAuthenticated,
  requiresPayment,
}: {
  circleId: string
  isAuthenticated: boolean
  requiresPayment: boolean
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false)
  const { update } = useSession()
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: ''
  })
  const router = useRouter()

  const handleJoin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!isAuthenticated) {
        // 1. Create Account
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userDetails)
        })

        if (!registerRes.ok) {
          const data = await registerRes.json()
          throw new Error(data.message || "Could not create account.")
        }

        // 2. Sign in
        const loginRes = await signIn('credentials', {
          email: userDetails.email,
          password: userDetails.password,
          redirect: false
        })

        if (loginRes?.error) throw new Error("Account created but login failed.")

        // 2.1 Refresh local session
        await update()
      }

      if (requiresPayment) {
        router.push(`/dashboard/client/checkout?type=GROUP_SESSION&id=${circleId}`)
      } else {
        const joinRes = await fetch(`/api/circles/${circleId}/join`, {
          method: 'POST'
        })

        if (!joinRes.ok) {
          const data = await joinRes.json().catch(() => ({ message: "Could not join circle." }))
          throw new Error(data.message || "Could not join circle.")
        }

        router.push(`/dashboard/client/circles?success=true&circleId=${circleId}`)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="text-center space-y-8">
        <div className="w-20 h-20 bg-oku-lavender rounded-3xl flex items-center justify-center mx-auto">
           <Sparkles size={40} className="text-oku-purple-dark" />
        </div>
        <div>
           <h3 className="heading-display text-3xl text-oku-darkgrey">You&apos;re almost there.</h3>
           <p className="text-oku-darkgrey/40 font-display italic mt-2">Click below to finalize your attendance.</p>
        </div>
        <button
          onClick={() => handleJoin()}
          disabled={isSubmitting || !guidelinesAccepted}
          className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : requiresPayment ? 'Continue to Payment' : 'Confirm My Spot'}
        </button>
        <label className="flex items-start gap-3 text-xs text-oku-darkgrey/60 text-left">
          <input
            type="checkbox"
            checked={guidelinesAccepted}
            onChange={e => setGuidelinesAccepted(e.target.checked)}
            className="mt-1"
          />
          <span>I agree to the community guidelines and understand circle sessions are confidential spaces.</span>
        </label>
      </div>
    )
  }

  return (
    <form onSubmit={handleJoin} className="space-y-6">
      <div className="text-center mb-10">
         <h3 className="heading-display text-3xl text-oku-darkgrey">Join the Collective.</h3>
         <p className="text-oku-darkgrey/40 font-display italic mt-2">Create an account to secure your spot.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">Full Name</label>
          <input
            required
            className="input-pastel"
            placeholder="Jane Doe"
            value={userDetails.name}
            onChange={e => setUserDetails({...userDetails, name: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">Email Address</label>
          <input
            required
            type="email"
            className="input-pastel"
            placeholder="jane@example.com"
            value={userDetails.email}
            onChange={e => setUserDetails({...userDetails, email: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4 text-left block">Date of Birth</label>
          <input
            required
            type="date"
            className="input-pastel"
            value={userDetails.dateOfBirth}
            onChange={e => setUserDetails({...userDetails, dateOfBirth: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 ml-4">Create Password</label>
          <input
            required
            type="password"
            className="input-pastel"
            placeholder="••••••••"
            value={userDetails.password}
            onChange={e => setUserDetails({...userDetails, password: e.target.value})}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs text-oku-darkgrey/60">
        <input
          type="checkbox"
          checked={guidelinesAccepted}
          onChange={e => setGuidelinesAccepted(e.target.checked)}
          className="mt-1"
        />
        <span>I agree to the community guidelines and understand circle sessions are confidential spaces.</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting || !guidelinesAccepted}
        className="btn-pill-3d bg-oku-darkgrey text-white w-full !py-5 mt-8 shadow-xl hover:bg-oku-purple-dark transition-all"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} className="mr-2" /> Complete Registration & Continue</>}
      </button>

      <p className="text-[9px] text-center text-oku-darkgrey/30 mt-6 px-4">
        By continuing, you agree to OKU&apos;s clinical consent and privacy protocol.
      </p>
    </form>
  )
}
