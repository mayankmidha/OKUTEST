import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DollarSign, ArrowUpRight, Wallet, CheckCircle, TrendingUp } from 'lucide-react'
import { UserRole } from '@prisma/client'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardCard } from '@/components/DashboardCard'
import { AdminPayoutButton } from './AdminPayoutButton'

import { formatCurrency, convertToINR, autoConvert } from '@/lib/currency'

export default async function AdminFinancialsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

  // Fetch global settings for dynamic fee
  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'global' }
  })
  const PLATFORM_FEE_PERCENTAGE = (settings?.platformFeePercent || 20) / 100

  // Fetch all completed payments
  const payments = await prisma.payment.findMany({
    where: { status: 'COMPLETED' },
    include: {
      appointment: {
        include: {
          practitioner: {
            include: {
                practitionerProfile: true
            }
          },
          service: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate stats
  const totalGrossRevenue = payments.reduce((acc, p) => acc + p.amount, 0)
  const totalPlatformCut = totalGrossRevenue * PLATFORM_FEE_PERCENTAGE
  const totalTherapistPayouts = totalGrossRevenue - totalPlatformCut

  // Group by Therapist for Payouts
  const therapistPayouts = new Map()
  payments.forEach(p => {
    // Defensive checks for relations
    if (!p.appointment || !p.appointment.practitioner) {
        console.warn(`Payment ${p.id} is missing appointment or practitioner relation.`)
        return
    }

    const therapist = p.appointment.practitioner
    const therapistCut = p.amount * (1 - PLATFORM_FEE_PERCENTAGE)
    
    if (!therapistPayouts.has(therapist.id)) {
        therapistPayouts.set(therapist.id, {
            id: therapist.id,
            name: therapist.name || 'Unknown Therapist',
            email: therapist.email,
            avatar: therapist.avatar,
            totalGenerated: p.amount,
            owed: therapistCut,
            sessionCount: 1
        })
    } else {
        const existing = therapistPayouts.get(therapist.id)
        existing.totalGenerated += p.amount
        existing.owed += therapistCut
        existing.sessionCount += 1
    }
  })

  const payoutList = Array.from(therapistPayouts.values())

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
                  {(() => {
                      const conv = autoConvert(totalGrossRevenue);
                      return formatCurrency(conv.amount, conv.currency);
                  })()}
               </p>
            </DashboardCard>
            <DashboardCard subtitle={`Platform Net (${settings?.platformFeePercent || 20}%)`} icon={<ArrowUpRight size={20} strokeWidth={1.5} />} variant="matcha">
               <p className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {(() => {
                      const conv = autoConvert(totalPlatformCut);
                      return formatCurrency(conv.amount, conv.currency);
                  })()}
               </p>
            </DashboardCard>
            <DashboardCard subtitle="Provider Liabilities" icon={<Wallet size={20} strokeWidth={1.5} />} variant="lavender">
               <p className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
                  {(() => {
                      const conv = autoConvert(totalTherapistPayouts);
                      return formatCurrency(conv.amount, conv.currency);
                  })()}
               </p>
            </DashboardCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
                    <div className="p-10 border-b border-oku-taupe/10 flex justify-between items-center bg-oku-cream/30">
                        <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Pending Payouts</h2>
                        <span className="px-3 py-1 bg-oku-dark text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Batch #2026-03</span>
                    </div>
                    <div className="p-10 space-y-6">
                        {payoutList.length === 0 ? (
                            <p className="text-sm text-oku-taupe italic text-center py-10 opacity-60">No pending payouts found in this cycle.</p>
                        ) : (
                            payoutList.map((p, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-oku-cream/30 rounded-[2.5rem] border border-oku-taupe/5 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white shadow-inner bg-oku-purple/10 flex items-center justify-center text-xl">
                                            {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" /> : '🧘'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-oku-dark text-xl">{p.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mt-1">{p.sessionCount} Sessions Completed</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex items-center gap-8">
                                        <div className="text-right border-r border-oku-taupe/10 pr-8">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1 opacity-60">Total Owed</p>
                                            <p className="text-3xl font-display font-bold text-oku-dark">
                                                {(() => {
                                                    const conv = autoConvert(p.owed);
                                                    return formatCurrency(conv.amount, conv.currency);
                                                })()}
                                            </p>
                                        </div>
                                        <AdminPayoutButton practitionerId={p.id} amount={p.owed} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <DashboardCard title="Recent Volume" icon={<TrendingUp size={20} strokeWidth={1.5} />}>
                <div className="space-y-8 mt-4">
                    {payments.slice(0, 8).map(p => (
                        <div key={p.id} className="flex justify-between items-center border-b border-oku-taupe/5 pb-6 last:border-0 group cursor-pointer">
                            <div>
                                <p className="text-lg font-display font-bold text-oku-dark group-hover:text-oku-purple transition-colors">
                                    {(() => {
                                        const conv = autoConvert(p.amount);
                                        return formatCurrency(conv.amount, conv.currency);
                                    })()}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1 truncate max-w-[120px]">
                                    {p.appointment?.service?.name || 'Standard Session'}
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
        </div>
      </div>
    </div>
  )
}
