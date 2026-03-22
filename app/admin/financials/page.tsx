import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DollarSign, ArrowUpRight, Wallet, CheckCircle } from 'lucide-react'
import { UserRole } from '@prisma/client'

export default async function AdminFinancialsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect('/auth/login')
  }

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
  
  // Assuming a standard 80/20 split where the platform keeps 20%
  const PLATFORM_FEE_PERCENTAGE = 0.20
  
  const totalPlatformCut = totalGrossRevenue * PLATFORM_FEE_PERCENTAGE
  const totalTherapistPayouts = totalGrossRevenue - totalPlatformCut

  // Group by Therapist for Payouts
  const therapistPayouts = new Map()
  payments.forEach(p => {
    const therapist = p.appointment.practitioner
    const therapistCut = p.amount * (1 - PLATFORM_FEE_PERCENTAGE)
    
    if (!therapistPayouts.has(therapist.id)) {
        therapistPayouts.set(therapist.id, {
            name: therapist.name,
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
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
            Financial Ledger
          </h1>
          <p className="text-oku-taupe mt-2 font-display italic">Manage platform revenue and practitioner payouts.</p>
        </div>

        {/* Global Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-white/10 rounded-xl"><DollarSign size={20} /></div>
                     <p className="text-[10px] uppercase tracking-widest font-black opacity-60">Gross Volume (GMV)</p>
                  </div>
                  <p className="text-5xl font-display font-bold">${totalGrossRevenue.toLocaleString()}</p>
               </div>
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-xl"><ArrowUpRight size={20} /></div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Platform Net (20%)</p>
               </div>
               <p className="text-5xl font-display font-bold text-oku-dark">${totalPlatformCut.toLocaleString()}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-oku-purple/10 text-oku-purple rounded-xl"><Wallet size={20} /></div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Provider Liabilities (80%)</p>
               </div>
               <p className="text-5xl font-display font-bold text-oku-dark">${totalTherapistPayouts.toLocaleString()}</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Provider Payouts */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-oku-taupe/10 flex justify-between items-center">
                        <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Provider Payouts</h2>
                        <span className="px-3 py-1 bg-oku-cream-warm text-oku-taupe rounded-full text-[10px] font-black uppercase tracking-widest">Pending Cycle</span>
                    </div>
                    <div className="p-8 space-y-6">
                        {payoutList.length === 0 ? (
                            <p className="text-sm text-oku-taupe italic text-center py-10">No payouts pending.</p>
                        ) : (
                            payoutList.map((p, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-oku-cream/30 rounded-3xl border border-oku-taupe/5 group hover:bg-white hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                            {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-oku-purple/10 flex items-center justify-center text-xl">🧘</div>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-oku-dark text-lg">{p.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-oku-taupe mt-1">{p.sessionCount} Sessions Completed</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-1">Owed Amount</p>
                                            <p className="text-2xl font-display font-bold text-oku-purple">${p.owed.toLocaleString()}</p>
                                        </div>
                                        <button className="bg-oku-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-colors shadow-md flex items-center gap-2">
                                            <CheckCircle size={14} /> Mark Paid
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Recent Transactions Log */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm">
                    <h3 className="text-xl font-display font-bold text-oku-dark mb-6">Recent Transactions</h3>
                    <div className="space-y-6">
                        {payments.slice(0, 8).map(p => (
                            <div key={p.id} className="flex justify-between items-center border-b border-oku-taupe/5 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-bold text-oku-dark">${p.amount.toFixed(2)}</p>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mt-1 truncate max-w-[150px]">
                                        {p.appointment.service.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[8px] font-black uppercase tracking-widest">
                                        Settled
                                    </span>
                                    <p className="text-[10px] text-oku-taupe mt-1 opacity-60">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {payments.length > 8 && (
                        <button className="w-full mt-6 py-3 bg-oku-cream-warm/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-oku-dark transition-colors">
                            View All History
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
