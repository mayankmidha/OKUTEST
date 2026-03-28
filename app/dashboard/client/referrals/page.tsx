import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Coins,
  Gift,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { ReferralShareCard } from '@/components/ReferralShareCard'
import {
  ensureUserReferralCode,
  getReferralSummaryForUser,
  MAX_REFERRAL_REWARDS,
} from '@/lib/referrals'

function milestoneTone(isEarned: boolean, isUnlocked: boolean) {
  if (isEarned) {
    return 'border-oku-green-dark/10 bg-oku-green/10 text-oku-green-dark'
  }

  if (isUnlocked) {
    return 'border-oku-blue/10 bg-oku-blue/10 text-oku-navy'
  }

  return 'border-oku-taupe/10 bg-white text-oku-taupe'
}

export default async function ClientReferralHubPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const referralCode = await ensureUserReferralCode(session.user.id, session.user.name)

  if (!referralCode) {
    redirect('/dashboard/client')
  }

  const referralSummary = await getReferralSummaryForUser(session.user.id)
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const inviteUrl = `${protocol}://${host}/auth/signup?ref=${referralCode}`

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-oku-peach-dark text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">
              Referral Hub
            </span>
            <span className="text-oku-taupe/40 text-[10px] font-black uppercase tracking-[0.3em]">
              Client Dashboard
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-oku-dark">
            Grow Care Together.
          </h1>
          <p className="text-xl text-oku-taupe font-display italic opacity-80 max-w-2xl">
            Share your invite, track each referral journey, and see exactly how session credit builds across the first three paid sessions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/client" className="btn-navy group flex items-center gap-3">
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Back to Overview
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="card-glass p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">People Referred</p>
            <p className="text-4xl font-display font-bold text-oku-dark">{referralSummary.referralCount}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-peach/30 text-oku-peach-dark flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="card-glass p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Started Paid Care</p>
            <p className="text-4xl font-display font-bold text-oku-dark">{referralSummary.convertedReferralCount}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-blue/10 text-oku-navy flex items-center justify-center">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="card-glass p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Rewards Earned</p>
            <p className="text-4xl font-display font-bold text-oku-dark">${referralSummary.totalEarned.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-green/10 text-oku-green-dark flex items-center justify-center">
            <Gift size={24} />
          </div>
        </div>

        <div className="card-glass p-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Session Credit Live</p>
            <p className="text-4xl font-display font-bold text-oku-dark">${referralSummary.availableCredit.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-oku-purple/20 text-oku-purple-dark flex items-center justify-center">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          <ReferralShareCard
            inviteUrl={inviteUrl}
            referralCode={referralCode}
            referralCount={referralSummary.referralCount}
            recentRewards={referralSummary.rewards.slice(0, 5)}
            totalEarned={referralSummary.totalEarned}
            availableCredit={referralSummary.availableCredit}
          />

          <section className="card-glass p-8 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe opacity-50">
                  Referral Tracking
                </p>
                <h2 className="text-2xl font-display font-bold text-oku-dark mt-3">
                  Friend-by-friend progress
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-oku-cream text-oku-navy flex items-center justify-center border border-oku-taupe/10">
                <Users size={20} />
              </div>
            </div>

            {referralSummary.referredClients.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-oku-taupe/10 bg-white/60 p-10 text-center">
                <Gift className="mx-auto text-oku-peach-dark/50 mb-4" size={34} />
                <p className="text-xl font-display italic text-oku-taupe mb-2">No referrals yet.</p>
                <p className="text-sm text-oku-taupe/70 max-w-lg mx-auto leading-relaxed">
                  Share your invite link with someone who wants therapy. Once they complete paid sessions, you will see each milestone unlock here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {referralSummary.referredClients.map((client) => (
                  <div key={client.id} className="rounded-[2rem] border border-oku-taupe/10 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xl font-bold text-oku-dark">
                          {client.name || 'New client referral'}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-taupe/60">
                          Joined {new Date(client.joinedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:min-w-[260px]">
                        <div className="rounded-2xl bg-oku-cream/60 px-4 py-3 border border-oku-taupe/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/50">Paid Sessions</p>
                          <p className="mt-2 text-2xl font-display font-bold text-oku-dark">{client.paidSessionsCount}</p>
                        </div>
                        <div className="rounded-2xl bg-oku-mint/30 px-4 py-3 border border-oku-taupe/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/50">Credit Earned</p>
                          <p className="mt-2 text-2xl font-display font-bold text-oku-dark">${client.earnedAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                      {Array.from({ length: MAX_REFERRAL_REWARDS }, (_, index) => {
                        const rewardStep = index + 1
                        const isEarned = client.rewardedSessionsCount >= rewardStep
                        const isUnlocked = client.paidSessionsCount >= rewardStep

                        return (
                          <div
                            key={`${client.id}-${rewardStep}`}
                            className={`rounded-[1.5rem] border px-4 py-4 ${milestoneTone(isEarned, isUnlocked)}`}
                          >
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                              Session {rewardStep}
                            </p>
                            <p className="mt-3 font-bold">
                              {isEarned ? 'Credit earned' : isUnlocked ? 'Paid session logged' : 'Waiting'}
                            </p>
                            <p className="mt-2 text-xs opacity-70 leading-relaxed">
                              {isEarned
                                ? 'This milestone has already generated referral credit.'
                                : isUnlocked
                                  ? 'Payment landed. Credit should follow this milestone.'
                                  : 'This reward unlocks when the referred client completes this paid session.'}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-oku-taupe/5 pt-5">
                      <p className="text-sm text-oku-taupe/80">
                        {client.sessionsRemainingForRewards === 0
                          ? 'Reward cap reached for this referral. Additional sessions are still great for care, but no longer add referral credit.'
                          : `${client.sessionsRemainingForRewards} reward milestone${client.sessionsRemainingForRewards === 1 ? '' : 's'} still available for this referral.`}
                      </p>
                      {client.latestPaidSessionAt && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe/50">
                          Latest paid session {new Date(client.latestPaidSessionAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <section className="card-glass p-8 md:p-10 bg-gradient-to-br from-white/80 to-oku-ocean/40 border-oku-blue/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe opacity-50">
                  Credit Wallet
                </p>
                <h2 className="text-2xl font-display font-bold text-oku-dark mt-3">How your credit moves</h2>
              </div>
              <Coins className="text-oku-navy" size={22} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-[1.75rem] border border-white bg-white/75 px-5 py-5">
                <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Available Now</p>
                <p className="mt-3 text-3xl font-display font-bold text-oku-dark">${referralSummary.availableCredit.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white bg-white/75 px-5 py-5">
                <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Used Already</p>
                <p className="mt-3 text-3xl font-display font-bold text-oku-dark">${referralSummary.totalCreditRedeemed.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[1.5rem] border border-white bg-white/65 px-5 py-4 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-oku-green-dark mt-0.5" />
                <p className="text-sm text-oku-taupe/80 leading-relaxed">
                  Referral credit is session credit only. It automatically applies first when you go to checkout.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white bg-white/65 px-5 py-4 flex items-start gap-3">
                <Clock3 size={16} className="text-oku-navy mt-0.5" />
                <p className="text-sm text-oku-taupe/80 leading-relaxed">
                  Each referred client can unlock up to three rewards: one for each of their first three paid sessions.
                </p>
              </div>
            </div>

            <Link href="/dashboard/client/book" className="mt-8 btn-sky w-full block text-center py-4">
              Use Credit On A Session
            </Link>
          </section>

          <section className="card-glass p-8 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe opacity-50">
                  Reward History
                </p>
                <h2 className="text-2xl font-display font-bold text-oku-dark mt-3">Every credit event</h2>
              </div>
              <Gift className="text-oku-peach-dark" size={22} />
            </div>

            {referralSummary.rewards.length === 0 ? (
              <p className="text-sm text-oku-taupe italic opacity-60">
                Referral rewards will appear here as soon as someone you invited completes a paid session.
              </p>
            ) : (
              <div className="space-y-4">
                {referralSummary.rewards.map((reward) => (
                  <div key={reward.id} className="rounded-[1.75rem] border border-oku-taupe/10 bg-white/80 px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-oku-dark">
                          {reward.referredUser.name || 'New client referral'}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-taupe/50">
                          Reward #{reward.rewardStep} • {reward.appointment.service.name}
                        </p>
                      </div>
                      <p className="text-xl font-display font-bold text-oku-dark">
                        ${reward.rewardAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-oku-taupe/50">
                      <span>{new Date(reward.createdAt).toLocaleDateString()}</span>
                      <span>{reward.rewardPercent}% credit</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
