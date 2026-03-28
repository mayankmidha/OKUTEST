import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  DollarSign,
  FileText,
  Receipt,
  Wallet,
} from 'lucide-react'
import { PractitionerShell, PractitionerSectionCard, PractitionerStatCard } from '@/components/practitioner-shell/practitioner-shell'
import { formatMoney, getPractitionerFinanceSummary } from '@/lib/provider-finance'
import { requestPractitionerPayout } from '@/app/practitioner/actions'

function statusTone(status: string) {
  const normalized = status.toUpperCase()

  if (normalized === 'COMPLETED' || normalized === 'PAID') {
    return 'bg-green-50 text-green-700 border-green-100'
  }

  if (normalized === 'PENDING') {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return 'bg-oku-cream-warm/50 text-oku-taupe border-oku-taupe/10'
}

export default async function BillingHub() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) redirect('/auth/login')
  const practitionerId = session.user.id

  const [finance, appointmentsWithClaims] = await Promise.all([
    getPractitionerFinanceSummary(practitionerId),
    prisma.appointment.findMany({
      where: {
        practitionerId,
        claim: { isNot: null },
      },
      include: { claim: { include: { policy: true } }, client: true, service: true },
      orderBy: { startTime: 'desc' },
    }),
  ])

  const revenueLedger = [...finance.sessionEarnings, ...finance.assessmentEarnings].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  )
  const canRequestPayout = finance.availableBalance >= finance.settings.minimumPayoutAmount

  async function submitPayoutRequest(formData: FormData) {
    'use server'

    const note = String(formData.get('note') || '')
    const latestFinance = await getPractitionerFinanceSummary(practitionerId)
    await requestPractitionerPayout({
      amount: latestFinance.availableBalance,
      note,
    })
  }

  return (
    <PractitionerShell
      title="Billing & Payouts"
      description="Track what you have earned, what is pending, and what can be cashed out from one place."
      badge="Financial Ops"
      currentPath="/practitioner/billing"
      heroActions={
        <Link href="/practitioner/dashboard" className="btn-primary py-4 px-8 flex items-center gap-2 shadow-xl">
          <ArrowUpRight size={18} /> Back to Dashboard
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <PractitionerStatCard
          label="Available Balance"
          value={formatMoney(finance.availableBalance)}
          detail={`Minimum payout ${formatMoney(finance.settings.minimumPayoutAmount)}`}
          accent="bg-oku-matcha-dark"
        />
        <PractitionerStatCard
          label="Pending Payouts"
          value={formatMoney(finance.pendingPayoutAmount)}
          detail="Waiting for processing"
          accent="bg-oku-pink"
        />
        <PractitionerStatCard
          label="Paid Out"
          value={formatMoney(finance.paidOutAmount)}
          detail="Completed withdrawals"
          accent="bg-oku-lavender-dark"
        />
        <PractitionerStatCard
          label="Total Earned"
          value={formatMoney(finance.totalEarned)}
          detail="Sessions + assessments"
          accent="bg-oku-navy"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Revenue Split</p>
              <h3 className="text-2xl font-display font-bold text-oku-dark mt-2">Session and assessment earnings</h3>
            </div>
            <Wallet className="text-oku-purple" size={22} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-oku-cream/40 px-5 py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Sessions</span>
              <span className="font-display text-lg font-bold text-oku-dark">{formatMoney(finance.totalSessionEarnings)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-oku-cream/40 px-5 py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">Assessments</span>
              <span className="font-display text-lg font-bold text-oku-dark">{formatMoney(finance.totalAssessmentEarnings)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-oku-dark px-5 py-4 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Platform Fees Generated</span>
              <span className="font-display text-lg font-bold">{formatMoney(finance.totalPlatformFeesGenerated)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl p-8 lg:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Cash Out</p>
              <h3 className="text-2xl font-display font-bold text-oku-dark mt-2">Request your payout</h3>
            </div>
            <DollarSign className="text-oku-purple" size={22} />
          </div>

          <form action={submitPayoutRequest} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-oku-cream/40 p-5 border border-oku-taupe/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Requested Amount</p>
                <p className="mt-2 text-3xl font-display font-bold text-oku-dark">{formatMoney(finance.availableBalance)}</p>
              </div>
              <div className="rounded-3xl bg-oku-cream-warm/30 p-5 border border-oku-taupe/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-50">Status</p>
                <p className="mt-2 text-lg font-bold text-oku-dark">
                  {canRequestPayout ? 'Ready for cash out' : 'Below minimum payout'}
                </p>
                <p className="mt-1 text-xs text-oku-taupe italic">
                  Minimum payout: {formatMoney(finance.settings.minimumPayoutAmount)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-2 ml-2">
                Payout note
              </label>
              <textarea
                name="note"
                rows={3}
                placeholder="Optional note for finance/admin review"
                className="w-full rounded-3xl border border-oku-taupe/10 bg-oku-cream/30 px-5 py-4 text-sm text-oku-dark focus:outline-none focus:border-oku-purple"
              />
            </div>

            <button
              type="submit"
              disabled={!canRequestPayout}
              className="w-full rounded-full bg-oku-dark py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl transition-all hover:bg-oku-purple disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Payout Request
            </button>
          </form>

          {!canRequestPayout && (
            <div className="mt-5 flex items-center gap-3 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-amber-800">
              <AlertTriangle size={16} />
              <p className="text-xs font-medium">
                Add more completed earnings to reach the minimum payout threshold.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PractitionerSectionCard
            title="Revenue Ledger"
            description="Combined session and assessment earnings with platform split snapshots."
          >
            <div className="space-y-4">
              {revenueLedger.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-taupe/10 rounded-3xl bg-white">
                  <Receipt className="mx-auto text-oku-taupe/20 mb-4" size={48} />
                  <p className="text-oku-taupe italic font-display text-lg">No settled earnings yet.</p>
                </div>
              ) : (
                revenueLedger.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-4 rounded-[2.25rem] border border-oku-taupe/10 bg-white p-6 shadow-sm transition-all hover:shadow-xl md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-oku-purple/10 text-oku-purple">
                        {entry.sourceType === 'ASSESSMENT' ? <FileText size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-bold text-oku-dark">{entry.sourceLabel}</p>
                          <span className="rounded-full border border-oku-taupe/10 bg-oku-cream/60 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-oku-taupe">
                            {entry.sourceType}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-widest text-oku-taupe opacity-60">
                          {entry.clientName} • {new Date(entry.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-2 text-left md:text-right">
                      <p className="text-xl font-display font-bold text-oku-dark">{formatMoney(entry.practitionerPayoutAmount)}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple">
                        Gross {formatMoney(entry.grossAmount)} • Fee {formatMoney(entry.platformFeeAmount)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PractitionerSectionCard>

          <PractitionerSectionCard
            title="Insurance Claims"
            description="Claims remain visible here for providers who file reimbursable appointments."
          >
            <div className="space-y-4">
              {appointmentsWithClaims.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-taupe/10 rounded-3xl bg-white">
                  <Receipt className="mx-auto text-oku-taupe/20 mb-4" size={48} />
                  <p className="text-oku-taupe italic font-display text-lg">No insurance claims filed yet.</p>
                </div>
              ) : (
                appointmentsWithClaims.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-[2.25rem] border border-oku-taupe/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-oku-navy/5 text-oku-navy">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-oku-dark leading-tight">{appt.client?.name}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">
                          {new Date(appt.startTime).toLocaleDateString()} • {appt.claim?.policy?.providerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-display font-bold text-oku-dark">{formatMoney(appt.claim?.claimAmount || 0)}</p>
                      <span className={`rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${statusTone(appt.claim?.status || 'DRAFT')}`}>
                        {appt.claim?.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PractitionerSectionCard>
        </div>

        <div className="space-y-8">
          <PractitionerSectionCard
            title="Payout History"
            description="Track what has been requested, approved, and paid."
          >
            <div className="space-y-4">
              {finance.payouts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-oku-taupe/10 bg-oku-cream/30 p-8 text-center">
                  <Wallet className="mx-auto mb-4 text-oku-taupe/20" size={42} />
                  <p className="text-sm italic text-oku-taupe">No payout requests yet.</p>
                </div>
              ) : (
                finance.payouts.map((payout) => (
                  <div key={payout.id} className="rounded-[2rem] border border-oku-taupe/10 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-oku-dark">{formatMoney(payout.amount)}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusTone(payout.status)}`}>
                        {payout.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 border-t border-oku-taupe/5 pt-4 text-xs text-oku-taupe">
                      <p>Period: {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}</p>
                      {payout.processedAt && <p>Processed: {new Date(payout.processedAt).toLocaleString()}</p>}
                      {payout.requestNote && <p className="italic">Note: {payout.requestNote}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </PractitionerSectionCard>
        </div>
      </div>
    </PractitionerShell>
  )
}
