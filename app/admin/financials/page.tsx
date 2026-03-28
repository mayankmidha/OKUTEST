import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DollarSign, ArrowUpRight, Wallet, TrendingUp, ClipboardList, Receipt } from 'lucide-react'
import { UserRole } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { AdminPayoutButton } from './AdminPayoutButton'
import { formatMoney, getAssessmentRevenueSplit, getPlatformSettings, getSessionRevenueSplit, roundMoney } from '@/lib/provider-finance'
import { isPsychiatristProfile } from '@/lib/practitioner-type'

export default async function AdminFinancialsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  const settings = await getPlatformSettings().catch(() => ({
    maintenanceMode: false,
    platformFeePercent: 20,
    therapySessionPlatformFeePercent: 20,
    psychiatrySessionPlatformFeePercent: 20,
    assessmentPlatformFeePercent: 20,
    minimumPayoutAmount: 25,
  }))

  const [payments, assessmentCharges, payoutRequests] = await Promise.all([
    prisma.payment.findMany({
    where: { status: 'COMPLETED' },
    include: {
      appointment: {
        include: {
          practitioner: {
            include: {
                practitionerProfile: true
            }
          },
          service: true,
          client: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
    }),
    prisma.assignedAssessment.findMany({
      where: { billingStatus: 'COMPLETED' },
      include: {
        assessment: { select: { title: true, price: true } },
        client: { select: { name: true } },
        practitioner: {
          include: {
            practitionerProfile: true,
          },
        },
      },
      orderBy: { chargedAt: 'desc' }
    }),
    prisma.payout.findMany({
      where: { status: 'PENDING' },
      include: {
        practitioner: { select: { name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  const sessionEntries = payments.map((payment) => {
    const revenue = payment.platformFeeAmount || payment.practitionerPayoutAmount
      ? {
          grossAmount: payment.amount,
          platformFeeAmount: payment.platformFeeAmount,
          practitionerPayoutAmount: payment.practitionerPayoutAmount,
        }
      : getSessionRevenueSplit({
          grossAmount: payment.amount,
          practitionerProfile: payment.appointment?.practitioner?.practitionerProfile,
          settings,
        })

    return {
      id: payment.id,
      practitionerId: payment.appointment?.practitionerId,
      practitionerName: payment.appointment?.practitioner?.name || 'Unknown Therapist',
      practitionerAvatar: payment.appointment?.practitioner?.avatar,
      practitionerDiscipline: isPsychiatristProfile(payment.appointment?.practitioner?.practitionerProfile) ? 'Psychiatrist' : 'Therapist',
      serviceName: payment.appointment?.service?.name || 'Standard Session',
      clientName: payment.appointment?.client?.name || 'Client',
      createdAt: payment.createdAt,
      ...revenue,
    }
  })

  const assessmentEntries = assessmentCharges.map((assignment) => {
    const revenue = assignment.platformFeeAmount || assignment.practitionerPayoutAmount
      ? {
          grossAmount: assignment.chargeAmount,
          platformFeeAmount: assignment.platformFeeAmount,
          practitionerPayoutAmount: assignment.practitionerPayoutAmount,
        }
      : getAssessmentRevenueSplit({
          grossAmount: assignment.chargeAmount,
          settings,
        })

    return {
      id: assignment.id,
      practitionerId: assignment.practitionerId,
      practitionerName: assignment.practitioner.name || 'Unknown Therapist',
      practitionerAvatar: assignment.practitioner.avatar,
      assessmentName: assignment.assessment.title,
      clientName: assignment.client.name || 'Client',
      createdAt: assignment.chargedAt || assignment.completedAt || assignment.createdAt,
      ...revenue,
    }
  })

  const providerPayouts = new Map<string, any>()

  sessionEntries.forEach((entry) => {
    if (!entry.practitionerId) return
    const existing = providerPayouts.get(entry.practitionerId) || {
      id: entry.practitionerId,
      name: entry.practitionerName,
      avatar: entry.practitionerAvatar,
      discipline: entry.practitionerDiscipline,
      sessionCount: 0,
      assessmentCount: 0,
      totalGenerated: 0,
      owed: 0,
    }
    existing.totalGenerated += entry.grossAmount
    existing.owed += entry.practitionerPayoutAmount
    existing.sessionCount += 1
    providerPayouts.set(entry.practitionerId, existing)
  })

  assessmentEntries.forEach((entry) => {
    const existing = providerPayouts.get(entry.practitionerId) || {
      id: entry.practitionerId,
      name: entry.practitionerName,
      avatar: entry.practitionerAvatar,
      discipline: 'Therapist',
      sessionCount: 0,
      assessmentCount: 0,
      totalGenerated: 0,
      owed: 0,
    }
    existing.totalGenerated += entry.grossAmount
    existing.owed += entry.practitionerPayoutAmount
    existing.assessmentCount += 1
    providerPayouts.set(entry.practitionerId, existing)
  })

  payoutRequests.forEach((request) => {
    const existing = providerPayouts.get(request.practitionerId) || {
      id: request.practitionerId,
      name: request.practitioner?.name || 'Unknown Therapist',
      avatar: request.practitioner?.avatar,
      discipline: 'Therapist',
      sessionCount: 0,
      assessmentCount: 0,
      totalGenerated: 0,
      owed: 0,
    }
    existing.pendingPayoutAmount = (existing.pendingPayoutAmount || 0) + request.amount
    existing.pendingPayouts = (existing.pendingPayouts || 0) + 1
    providerPayouts.set(request.practitionerId, existing)
  })

  const payoutList = Array.from(providerPayouts.values())
  const totalSessionRevenue = roundMoney(sessionEntries.reduce((acc, item) => acc + item.grossAmount, 0))
  const totalAssessmentRevenue = roundMoney(assessmentEntries.reduce((acc, item) => acc + item.grossAmount, 0))
  const totalGrossRevenue = roundMoney(totalSessionRevenue + totalAssessmentRevenue)
  const totalPlatformCut = roundMoney(
    sessionEntries.reduce((acc, item) => acc + item.platformFeeAmount, 0) +
      assessmentEntries.reduce((acc, item) => acc + item.platformFeeAmount, 0)
  )
  const totalTherapistPayouts = roundMoney(
    sessionEntries.reduce((acc, item) => acc + item.practitionerPayoutAmount, 0) +
      assessmentEntries.reduce((acc, item) => acc + item.practitionerPayoutAmount, 0)
  )
  const totalPendingPayouts = roundMoney(payoutRequests.reduce((acc, item) => acc + item.amount, 0))

  return (
    <div className="py-12 px-10">
      <DashboardHeader 
        title="Financial Ledger" 
        description="Oversee platform revenue splits and manage clinical provider payouts."
        actions={
           <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Fiscal Cycle Active
           </div>
        }
      />

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <DashboardCard subtitle="Gross Volume (GMV)" icon={<DollarSign size={20} strokeWidth={1.5} />} variant="dark">
               <p className="text-5xl font-display font-bold text-white tracking-tighter">
                  {formatMoney(totalGrossRevenue)}
               </p>
               <p className="mt-4 text-[10px] uppercase tracking-widest text-white/40 font-black">Sessions + Assessments</p>
            </DashboardCard>
            <DashboardCard subtitle={`Platform Net (${settings?.platformFeePercent || 20}%)`} icon={<ArrowUpRight size={20} strokeWidth={1.5} />} variant="matcha">
               <p className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {formatMoney(totalPlatformCut)}
               </p>
               <p className="mt-4 text-[10px] uppercase tracking-widest text-oku-dark/50 font-black">Commission retained by platform</p>
            </DashboardCard>
            <DashboardCard subtitle="Provider Liabilities" icon={<Wallet size={20} strokeWidth={1.5} />} variant="lavender">
               <p className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {formatMoney(totalTherapistPayouts)}
               </p>
               <p className="mt-4 text-[10px] uppercase tracking-widest text-oku-dark/50 font-black">Unpaid provider earnings</p>
            </DashboardCard>
            <DashboardCard subtitle="Assessment Revenue" icon={<ClipboardList size={20} strokeWidth={1.5} />} variant="white">
               <p className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {formatMoney(totalAssessmentRevenue)}
               </p>
               <p className="mt-4 text-[10px] uppercase tracking-widest text-oku-purple font-black">Billable evaluations completed</p>
            </DashboardCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
                    <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-cream/30">
                        <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Pending Payouts</h2>
                        <span className="px-3 py-1 bg-oku-dark text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                          {payoutRequests.length} Requests
                        </span>
                    </div>
                    <div className="p-10 space-y-6">
                        {payoutList.length === 0 ? (
                            <p className="text-sm text-oku-taupe italic text-center py-10 opacity-60">No pending payouts found in this cycle.</p>
                        ) : (
                            payoutList.map((p, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-oku-cream/30 rounded-[2.5rem] border border-oku-taupe/5 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white shadow-inner bg-oku-purple/10 flex items-center justify-center text-xl">
                                            {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" alt={p.name} /> : '🧘'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-oku-dark text-xl">{p.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mt-1">
                                              {p.sessionCount} Sessions • {p.assessmentCount} Assessments
                                            </p>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1 opacity-60">
                                              {p.discipline}
                                            </p>
                                            {p.pendingPayouts ? (
                                              <p className="text-[10px] uppercase tracking-widest font-black text-oku-navy mt-1">
                                                {p.pendingPayouts} Pending Requests
                                              </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex items-center gap-8">
                                        <div className="text-right border-r border-oku-taupe/10 pr-8">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1 opacity-60">Total Owed</p>
                                            <p className="text-3xl font-display font-bold text-oku-dark">
                                                {formatMoney(p.owed)}
                                            </p>
                                            {p.pendingPayoutAmount ? (
                                              <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-oku-navy">
                                                {formatMoney(p.pendingPayoutAmount)} queued
                                              </p>
                                            ) : null}
                                        </div>
                                        <AdminPayoutButton practitionerId={p.id} amount={p.owed} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
              <DashboardCard title="Recent Volume" icon={<TrendingUp size={20} strokeWidth={1.5} />}>
                <div className="space-y-8 mt-4">
                    {[
                      ...sessionEntries.map((item) => ({
                        id: item.id,
                        amount: item.grossAmount,
                        label: item.serviceName,
                        clientName: item.clientName,
                        createdAt: item.createdAt,
                        kind: 'Session',
                      })),
                      ...assessmentEntries.map((item) => ({
                        id: item.id,
                        amount: item.grossAmount,
                        label: item.assessmentName,
                        clientName: item.clientName,
                        createdAt: item.createdAt,
                        kind: 'Assessment',
                      })),
                    ].slice(0, 8).map(p => (
                        <div key={p.id} className="flex justify-between items-center border-b border-oku-taupe/5 pb-6 last:border-0 group cursor-pointer">
                            <div>
                                <p className="text-lg font-display font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
                                    {formatMoney(p.amount)}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1 truncate max-w-[120px]">
                                    {p.kind} • {p.label}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100">
                                    Settled
                                </span>
                                <p className="text-[10px] text-oku-taupe mt-2 opacity-40 font-black">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-10 block text-center py-4 rounded-2xl bg-oku-cream-warm/20 text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:bg-oku-dark hover:text-white transition-all">Export Report</button>
              </DashboardCard>

              <DashboardCard title="Pending Requests" subtitle={`${payoutRequests.length} requests • ${formatMoney(totalPendingPayouts)} pending`} icon={<Receipt size={20} strokeWidth={1.5} />}>
                <div className="space-y-5 mt-4">
                  {payoutRequests.length === 0 ? (
                    <p className="text-sm italic text-oku-taupe opacity-60 text-center py-8">No payout requests awaiting approval.</p>
                  ) : (
                    payoutRequests.map((request) => (
                      <div key={request.id} className="rounded-[2rem] border border-oku-taupe/10 bg-oku-cream/30 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-oku-dark">{request.practitioner?.name || 'Provider'}</p>
                            <p className="text-[10px] uppercase tracking-widest text-oku-taupe font-black mt-1 opacity-60">
                              {request.practitioner?.email}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-oku-purple font-black mt-2">
                              {request.requestNote || 'Payout request'}
                            </p>
                          </div>
                          <p className="text-2xl font-display font-bold text-oku-dark">{formatMoney(request.amount)}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-widest text-oku-taupe font-black opacity-60">
                            Requested {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <AdminPayoutButton practitionerId={request.practitionerId} amount={request.amount} payoutId={request.id} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DashboardCard>
            </div>
        </div>
      </div>
    </div>
  )
}
