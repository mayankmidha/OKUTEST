import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCheckoutReferralCredit } from '@/lib/referrals'
import { detectCurrency, formatCurrency, getLiveExchangeRates, localizeAmount } from '@/lib/currency'
import { getAppointmentBillingAmount } from '@/lib/pricing'

export default async function CheckoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await auth()
  const { sessionId } = await params
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const [booking, user, exchangeRates] = await Promise.all([
    prisma.appointment.findUnique({
    where: { id: sessionId },
    include: { 
      practitioner: { include: { practitionerProfile: true } },
      service: true
    }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { location: true },
    }),
    getLiveExchangeRates('INR'),
  ])

  if (!booking) {
    return <div>Appointment not found</div>
  }

  const checkoutSummary = await getCheckoutReferralCredit(booking.id)
  const viewerCurrency = detectCurrency(user?.location)
  const grossAmount = checkoutSummary?.grossAmount ?? getAppointmentBillingAmount(booking)
  const availableCredit = checkoutSummary?.availableCredit ?? 0
  const creditApplied = checkoutSummary?.creditApplied ?? 0
  const netAmount = checkoutSummary?.netAmount ?? getAppointmentBillingAmount(booking)
  const localizedGross = localizeAmount(grossAmount, user?.location, 'INR', exchangeRates, viewerCurrency)
  const localizedAvailable = localizeAmount(availableCredit, user?.location, 'INR', exchangeRates, viewerCurrency)
  const localizedCreditApplied = localizeAmount(creditApplied, user?.location, 'INR', exchangeRates, viewerCurrency)
  const localizedNet = localizeAmount(netAmount, user?.location, 'INR', exchangeRates, viewerCurrency)
  const totalDueLabel = formatCurrency(localizedNet.amount, localizedNet.currency)
  const baseNetLabel = formatCurrency(netAmount, 'INR')

  return (
    <div className="min-h-screen bg-oku-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">

            <h1 className="text-4xl font-display font-bold text-oku-dark mb-8 text-center">Complete Booking</h1>
            
            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-lg mb-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-oku-taupe/10">
                     <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-oku-cream">
                        {booking.practitioner.avatar ? (
                            <img src={booking.practitioner.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-oku-purple/10 flex items-center justify-center text-2xl">🧘</div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-oku-dark">Session with {booking.practitioner.name}</h2>
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                            {new Date(booking.startTime).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-oku-dark">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-oku-taupe">Session Total</span>
                        <span className="text-lg font-display font-bold">{formatCurrency(localizedGross.amount, localizedGross.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center text-oku-dark">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-oku-taupe">Referral Credit Available</span>
                        <span className="text-lg font-display font-bold">{formatCurrency(localizedAvailable.amount, localizedAvailable.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center text-oku-dark">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-oku-taupe">Credit Applied</span>
                        <span className="text-lg font-display font-bold text-green-700">-{formatCurrency(localizedCreditApplied.amount, localizedCreditApplied.currency)}</span>
                    </div>
                    <div className="rounded-3xl border border-oku-peach/40 bg-oku-peach/20 px-5 py-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-oku-dark">Total Due</span>
                            <span className="text-2xl font-display font-bold text-oku-dark">{totalDueLabel}</span>
                        </div>
                        <p className="mt-2 text-sm text-oku-taupe">
                            Referral credit is automatically used before card or UPI payment. Base billing amount: {baseNetLabel}.
                        </p>
                    </div>
                </div>

                {/* Payment Buttons (Stubs) */}
                <div className="space-y-4">
                    {netAmount === 0 ? (
                        <form action="/api/checkout" method="POST">
                            <input type="hidden" name="sessionId" value={booking.id} />
                            <input type="hidden" name="method" value="referral-credit" />
                            <button className="w-full py-4 bg-oku-green text-green-900 rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-md">
                                Confirm with Referral Credit
                            </button>
                        </form>
                    ) : (
                        <>
                            <form action="/api/checkout" method="POST">
                                <input type="hidden" name="sessionId" value={booking.id} />
                                <input type="hidden" name="method" value="stripe" />
                                <button className="w-full py-4 bg-oku-purple text-oku-dark rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-md">
                                    Pay {totalDueLabel} with Card (Stripe)
                                </button>
                            </form>
                            <form action="/api/checkout" method="POST">
                                <input type="hidden" name="sessionId" value={booking.id} />
                                <input type="hidden" name="method" value="razorpay" />
                                <button className="w-full py-4 bg-oku-blue text-blue-800 rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-md">
                                    Pay {totalDueLabel} with UPI (Razorpay)
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}
