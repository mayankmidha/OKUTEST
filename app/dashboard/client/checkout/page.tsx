import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { getCheckoutReferralCredit } from '@/lib/referrals'
import { detectCurrency, formatCurrency, getLiveExchangeRates, localizeAmount } from '@/lib/currency'
import { getAppointmentBillingAmount } from '@/lib/pricing'
import { 
  CreditCard, ShieldCheck, Zap, 
  Sparkles, ArrowRight, Lock, 
  ChevronLeft, Calendar, User
} from 'lucide-react'
import Link from 'next/link'

interface CheckoutPageProps {
  searchParams: Promise<{ id: string; type: string; cancelled?: string }>
}

export default async function UniversalCheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await auth()
  const { id, type = 'APPOINTMENT', cancelled } = await searchParams
  
  if (!session?.user) redirect('/auth/login')
  if (!id) notFound()

  const [currentUser, exchangeRates] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { location: true },
    }),
    getLiveExchangeRates('INR'),
  ])

  let title = "Checkout"
  let subtitle = ""
  let entityDetails: any = null
  let grossAmount = 0
  let netAmount = 0
  let creditApplied = 0
  let availableCredit = 0

  // 1. Resolve Data based on Type
  if (type === 'APPOINTMENT') {
      const booking = await prisma.appointment.findUnique({
        where: { id },
        include: { practitioner: true, service: true }
      })
      if (!booking) notFound()
      
      const summary = await getCheckoutReferralCredit(booking.id)
      grossAmount = summary?.grossAmount ?? getAppointmentBillingAmount(booking)
      availableCredit = summary?.availableCredit ?? 0
      creditApplied = summary?.creditApplied ?? 0
      netAmount = summary?.netAmount ?? grossAmount
      
      title = `Session with ${booking.practitioner.name}`
      subtitle = `${booking.service.name} • ${new Date(booking.startTime).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
      entityDetails = { image: booking.practitioner.avatar, icon: "🧘" }

  } else if (type === 'ASSESSMENT') {
      const assignment = await prisma.assignedAssessment.findUnique({
        where: { id },
        include: { assessment: true, practitioner: true }
      })
      if (!assignment) notFound()
      
      grossAmount = assignment.chargeAmount || assignment.assessment.price || 0
      netAmount = grossAmount
      title = assignment.assessment.title
      subtitle = `Premium Clinical Report • Requested by ${assignment.practitioner?.name || 'Oku Clinic'}`
      entityDetails = { icon: "📋" }
  }

  const viewerCurrency = detectCurrency(currentUser?.location)
  const localizedGross = localizeAmount(grossAmount, currentUser?.location, 'INR', exchangeRates, viewerCurrency)
  const localizedNet = localizeAmount(netAmount, currentUser?.location, 'INR', exchangeRates, viewerCurrency)
  const localizedCredit = localizeAmount(creditApplied, currentUser?.location, 'INR', exchangeRates, viewerCurrency)

  return (
    <div className="min-h-screen bg-oku-cream/30 py-32 px-6 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/10 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto relative z-10">
            
            <Link href="/dashboard/client" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 hover:text-oku-purple-dark transition-colors mb-12 group">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Cancel and Return
            </Link>

            {cancelled && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-700 text-sm font-bold flex items-center gap-3">
                    <Lock size={18} /> The payment process was cancelled. Please try again.
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-12">
                
                {/* Left: Summary */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="card-glass-3d !p-12 !bg-white/80 !rounded-[3rem] shadow-xl">
                        <div className="flex items-center gap-8 mb-12 pb-12 border-b border-oku-darkgrey/5">
                            <div className="w-24 h-24 rounded-[2rem] bg-oku-lavender/40 flex items-center justify-center text-4xl shadow-inner border border-white/60 overflow-hidden">
                                {entityDetails?.image ? <img src={entityDetails.image} className="w-full h-full object-cover" /> : entityDetails?.icon}
                            </div>
                            <div>
                                <span className="px-3 py-1 bg-oku-purple/10 text-oku-purple-dark text-[9px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">Secure Checkout</span>
                                <h1 className="heading-display text-4xl text-oku-darkgrey mb-2">{title}</h1>
                                <p className="text-sm text-oku-darkgrey/50 italic font-display">{subtitle}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">Subtotal</span>
                                <span className="text-xl font-bold text-oku-darkgrey">{formatCurrency(localizedGross.amount, localizedGross.currency)}</span>
                            </div>
                            
                            {creditApplied > 0 && (
                                <div className="flex justify-between items-center text-green-700">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Referral Credit Applied</span>
                                    <span className="text-xl font-bold">-{formatCurrency(localizedCredit.amount, localizedCredit.currency)}</span>
                                </div>
                            )}

                            <div className="pt-8 mt-8 border-t border-oku-darkgrey/5 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-purple-dark">Total Due</p>
                                    <p className="text-xs text-oku-darkgrey/30 italic mt-1 font-display">Includes all platform fees</p>
                                </div>
                                <div className="text-right">
                                    <p className="heading-display text-6xl text-oku-darkgrey">{formatCurrency(localizedNet.amount, localizedNet.currency)}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/20 mt-2">Paid in {localizedNet.currency}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-oku-purple-dark" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey">AES-256 Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-oku-purple-dark" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey">PCI-DSS Compliant</span>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="card-glass-3d !p-10 !bg-oku-dark text-white !rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-lavender mb-8">Payment Method</h3>
                            
                            <div className="space-y-4">
                                <form action="/api/checkout/universal" method="POST">
                                    <input type="hidden" name="id" value={id} />
                                    <input type="hidden" name="type" value={type} />
                                    <input type="hidden" name="method" value="stripe" />
                                    <button className="btn-pill-3d bg-white text-oku-dark border-white w-full !py-5 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform group/btn">
                                        Pay with Card <CreditCard size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                    </button>
                                </form>

                                <form action="/api/checkout/universal" method="POST">
                                    <input type="hidden" name="id" value={id} />
                                    <input type="hidden" name="type" value={type} />
                                    <input type="hidden" name="method" value="razorpay" />
                                    <button className="btn-pill-3d bg-transparent border-white/20 text-white w-full !py-5 flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                                        Pay with UPI / QR <Zap size={18} />
                                    </button>
                                </form>
                            </div>

                            <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/30 leading-loose">
                                Instant confirmation • Refundable within 8 hours
                            </p>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-oku-purple/10 rounded-full blur-[80px]" />
                    </section>

                    <div className="p-8 bg-oku-mint/10 border border-oku-mint/20 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3 text-oku-mint-dark">
                            <Sparkles size={18} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Sanctuary Trust</span>
                        </div>
                        <p className="text-xs text-oku-darkgrey/60 font-display italic leading-relaxed">
                            Every transaction on Oku contributes to our therapist empowerment fund, helping clinicians provide sliding-scale care to those in need.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
