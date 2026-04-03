import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
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
  if (isEarned) return 'border-oku-mint bg-oku-mint/30 text-oku-darkgrey'
  if (isUnlocked) return 'border-oku-babyblue/30 bg-oku-babyblue/20 text-oku-darkgrey'
  return 'border-oku-darkgrey/10 bg-white/60 text-oku-darkgrey/50'
}

export default async function ClientReferralHubPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const referralCode = await ensureUserReferralCode(session.user.id, session.user.name)
  if (!referralCode) redirect('/dashboard/client')

  const referralSummary = await getReferralSummaryForUser(session.user.id)
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const inviteUrl = `${protocol}://${host}/auth/signup?ref=${referralCode}`

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/5 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Growth Circle</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Share the <span className="text-oku-purple-dark italic">Light.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8 max-w-2xl leading-relaxed">
              Invite those you care about into the sanctuary. When they begin their journey, we honour your shared commitment to healing.
            </p>
          </div>

          {/* Balance card */}
          <div className="card-glass-3d !p-10 !bg-oku-darkgrey text-white flex items-center gap-8 shadow-2xl self-start lg:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet size={32} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Session Credit</p>
              <p className="text-4xl font-bold tracking-tighter">
                ${referralSummary.availableCredit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {[
            { label: 'People Referred',    value: referralSummary.referralCount,                            bg: 'bg-oku-peach/60',    icon: <Users size={20} /> },
            { label: 'Started Paid Care',  value: referralSummary.convertedReferralCount,                   bg: 'bg-oku-babyblue/60', icon: <Sparkles size={20} /> },
            { label: 'Rewards Earned',     value: `$${referralSummary.totalEarned.toFixed(2)}`,             bg: 'bg-oku-mint/60',     icon: <Gift size={20} /> },
            { label: 'Credit Available',   value: `$${referralSummary.availableCredit.toFixed(2)}`,         bg: 'bg-oku-lavender/60', icon: <Wallet size={20} /> },
          ].map((stat, i) => (
            <div key={i} className={`card-glass-3d !p-8 ${stat.bg} flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">{stat.label}</p>
                <span className="text-oku-darkgrey/30">{stat.icon}</span>
              </div>
              <p className="text-4xl heading-display text-oku-darkgrey mt-6">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Share card + referral tracking */}
          <div className="lg:col-span-7 space-y-10">
            <ReferralShareCard
              inviteUrl={inviteUrl}
              referralCode={referralCode}
              referralCount={referralSummary.referralCount}
              recentRewards={referralSummary.rewards.slice(0, 5)}
              totalEarned={referralSummary.totalEarned}
              availableCredit={referralSummary.availableCredit}
            />

            {/* Friend-by-friend tracking */}
            <section className="card-glass-3d !p-12 !bg-white/40">
              <div className="flex items-center justify-between gap-4 mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">Referral Tracking</p>
                  <h2 className="heading-display text-3xl text-oku-darkgrey mt-3">
                    Friend-by-friend <span className="italic text-oku-purple-dark">Progress</span>
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-oku-lavender/40 text-oku-purple-dark flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>

              {referralSummary.referredClients.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-purple-dark/10 rounded-[3rem]">
                  <Gift className="mx-auto text-oku-purple-dark/20 mb-6 animate-float-3d" size={40} />
                  <p className="text-xl font-display italic text-oku-darkgrey/30">No referrals yet.</p>
                  <p className="text-sm text-oku-darkgrey/20 mt-3 font-display italic max-w-md mx-auto leading-relaxed">
                    Share your invite link. Once they complete a paid session, each milestone appears here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {referralSummary.referredClients.map((client) => (
                    <div key={client.id} className="rounded-[2rem] border border-oku-darkgrey/5 bg-white/70 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xl font-bold text-oku-darkgrey">
                            {client.name || 'New client referral'}
                          </p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                            Joined {new Date(client.joinedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:min-w-[240px]">
                          <div className="rounded-2xl bg-oku-lavender/30 px-4 py-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Paid Sessions</p>
                            <p className="mt-2 text-2xl font-display font-bold text-oku-darkgrey">{client.paidSessionsCount}</p>
                          </div>
                          <div className="rounded-2xl bg-oku-mint/30 px-4 py-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Credit Earned</p>
                            <p className="mt-2 text-2xl font-display font-bold text-oku-darkgrey">${client.earnedAmount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Milestone steps */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        {Array.from({ length: MAX_REFERRAL_REWARDS }, (_, index) => {
                          const rewardStep = index + 1
                          const isEarned = client.rewardedSessionsCount >= rewardStep
                          const isUnlocked = client.paidSessionsCount >= rewardStep
                          return (
                            <div
                              key={`${client.id}-${rewardStep}`}
                              className={`rounded-[1.5rem] border px-4 py-4 ${milestoneTone(isEarned, isUnlocked)}`}
                            >
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">
                                Session {rewardStep}
                              </p>
                              <p className="mt-3 font-bold text-sm">
                                {isEarned ? 'Credit earned' : isUnlocked ? 'Paid session logged' : 'Waiting'}
                              </p>
                              <p className="mt-2 text-xs opacity-60 leading-relaxed">
                                {isEarned
                                  ? 'This milestone has already generated referral credit.'
                                  : isUnlocked
                                    ? 'Payment landed. Credit should follow this milestone.'
                                    : 'Unlocks when the referred client completes this paid session.'}
                              </p>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-oku-darkgrey/5 pt-5">
                        <p className="text-sm text-oku-darkgrey/50 leading-relaxed">
                          {client.sessionsRemainingForRewards === 0
                            ? 'Reward cap reached for this referral.'
                            : `${client.sessionsRemainingForRewards} reward milestone${client.sessionsRemainingForRewards === 1 ? '' : 's'} still available.`}
                        </p>
                        {client.latestPaidSessionAt && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                            Latest paid session {new Date(client.latestPaidSessionAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right: Credit wallet + reward history */}
          <div className="lg:col-span-5 space-y-10">
            {/* Credit wallet */}
            <section className="card-glass-3d !p-12 !bg-oku-babyblue/30">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">Credit Wallet</p>
                  <h2 className="heading-display text-3xl text-oku-darkgrey mt-3">
                    How credit <span className="italic text-oku-purple-dark">moves</span>
                  </h2>
                </div>
                <Coins className="text-oku-darkgrey/40" size={22} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Available Now</p>
                  <p className="mt-3 text-3xl font-display font-bold text-oku-darkgrey">${referralSummary.availableCredit.toFixed(2)}</p>
                </div>
                <div className="rounded-[1.75rem] border border-white bg-white/70 px-5 py-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Used Already</p>
                  <p className="mt-3 text-3xl font-display font-bold text-oku-darkgrey">${referralSummary.totalCreditRedeemed.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="rounded-[1.5rem] bg-white/60 border border-white px-5 py-4 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-oku-darkgrey/50 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-oku-darkgrey/60 leading-relaxed">
                    Referral credit is session credit only. It automatically applies first at checkout.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-white/60 border border-white px-5 py-4 flex items-start gap-3">
                  <Clock3 size={16} className="text-oku-darkgrey/50 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-oku-darkgrey/60 leading-relaxed">
                    Each referred client can unlock up to three rewards — one for each of their first three paid sessions.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/client/therapists"
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full flex items-center justify-center gap-2"
              >
                Use Credit On A Session <ArrowUpRight size={14} />
              </Link>
            </section>

            {/* Reward history */}
            <section className="card-glass-3d !p-12 !bg-white/40">
              <div className="flex items-center justify-between gap-4 mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">Reward History</p>
                  <h2 className="heading-display text-3xl text-oku-darkgrey mt-3">
                    Every credit <span className="italic text-oku-purple-dark">event</span>
                  </h2>
                </div>
                <Gift className="text-oku-darkgrey/30" size={22} />
              </div>

              {referralSummary.rewards.length === 0 ? (
                <p className="text-sm text-oku-darkgrey/40 italic">
                  Referral rewards will appear here as soon as someone you invited completes a paid session.
                </p>
              ) : (
                <div className="space-y-4">
                  {referralSummary.rewards.map((reward) => (
                    <div key={reward.id} className="rounded-[1.75rem] border border-oku-darkgrey/5 bg-white/70 px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-oku-darkgrey">
                            {reward.referredUser.name || 'New client referral'}
                          </p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                            Reward #{reward.rewardStep} · {reward.appointment.service.name}
                          </p>
                        </div>
                        <p className="text-xl font-display font-bold text-oku-darkgrey">
                          ${reward.rewardAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                        <span>{new Date(reward.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
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
    </div>
  )
}
