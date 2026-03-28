'use client'

import { useState } from 'react'
import { Check, Copy, Gift, Link2, Users } from 'lucide-react'

type ReferralRewardPreview = {
  id: string
  rewardAmount: number
  rewardStep: number
  referredUser: {
    name: string | null
  }
}

export function ReferralShareCard({
  inviteUrl,
  referralCode,
  referralCount,
  recentRewards,
  totalEarned,
  availableCredit,
}: {
  inviteUrl: string
  referralCode: string
  referralCount: number
  recentRewards: ReferralRewardPreview[]
  totalEarned: number
  availableCredit: number
}) {
  const [copiedTarget, setCopiedTarget] = useState<'code' | 'link' | null>(null)

  const copyValue = async (value: string, target: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedTarget(target)
      window.setTimeout(() => setCopiedTarget(null), 1800)
    } catch (error) {
      setCopiedTarget(null)
    }
  }

  return (
    <section className="card-glass p-8 md:p-10 border-oku-peach-dark/10 bg-gradient-to-br from-white/80 via-oku-peach/40 to-oku-mint/30">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe opacity-50">Referral Circle</p>
          <h2 className="text-2xl font-display font-bold text-oku-dark mt-3">Bring A Friend Into Care</h2>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-oku-peach-dark shadow-sm">
          <Gift size={24} />
        </div>
      </div>

      <p className="text-sm text-oku-taupe font-display italic leading-relaxed opacity-70 mb-8">
        When someone joins through your referral and completes a paid session, you earn 10% for each of their first three paid sessions.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">People Referred</p>
          <p className="mt-3 text-3xl font-display font-bold text-oku-dark">{referralCount}</p>
        </div>
        <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Rewards Earned</p>
          <p className="mt-3 text-3xl font-display font-bold text-oku-dark">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Session Credit</p>
          <p className="mt-3 text-3xl font-display font-bold text-oku-dark">${availableCredit.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Referral Code</p>
            <button
              onClick={() => copyValue(referralCode, 'code')}
              className="inline-flex items-center gap-2 rounded-full border border-oku-taupe/10 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-oku-dark"
            >
              {copiedTarget === 'code' ? <Check size={12} /> : <Copy size={12} />}
              {copiedTarget === 'code' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-lg font-black tracking-[0.2em] text-oku-dark">{referralCode}</p>
        </div>

        <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Invite Link</p>
            <button
              onClick={() => copyValue(inviteUrl, 'link')}
              className="inline-flex items-center gap-2 rounded-full border border-oku-taupe/10 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-oku-dark"
            >
              {copiedTarget === 'link' ? <Check size={12} /> : <Link2 size={12} />}
              {copiedTarget === 'link' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-oku-taupe break-all">{inviteUrl}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} className="text-oku-navy" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe">Recent Rewards</p>
        </div>
        {recentRewards.length === 0 ? (
          <p className="text-sm text-oku-taupe italic opacity-60">Your first referral reward will appear here.</p>
        ) : (
          <div className="space-y-3">
            {recentRewards.map((reward) => (
              <div key={reward.id} className="rounded-[1.5rem] border border-white bg-white/70 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-oku-dark">{reward.referredUser.name || 'New client referral'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50 mt-1">
                    Reward #{reward.rewardStep}
                  </p>
                </div>
                <p className="text-lg font-display font-bold text-oku-dark">${reward.rewardAmount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
