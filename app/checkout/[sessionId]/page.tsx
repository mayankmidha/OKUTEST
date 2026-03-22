import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CheckoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await auth()
  const { sessionId } = await params
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const booking = await prisma.appointment.findUnique({
    where: { id: sessionId },
    include: { 
      practitionerProfile: { include: { user: true } },
      service: true
    }
  })

  if (!booking) {
    return <div>Appointment not found</div>
  }

  return (
    <div className="min-h-screen bg-oku-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">

            <h1 className="text-4xl font-display font-bold text-oku-dark mb-8 text-center">Complete Booking</h1>
            
            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-lg mb-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-oku-taupe/10">
                     <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-oku-cream">
                        {booking.practitionerProfile?.user.avatar ? (
                            <img src={booking.practitionerProfile.user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-oku-purple/10 flex items-center justify-center text-2xl">🧘</div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-oku-dark">Session with {booking.practitionerProfile?.user.name}</h2>
                        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                            {new Date(booking.startTime).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold text-oku-dark">Total Due</span>
                    <span className="text-2xl font-display font-bold text-oku-dark">${booking.service.price}</span>
                </div>

                {/* Payment Buttons (Stubs) */}
                <div className="space-y-4">
                    <form action="/api/checkout" method="POST">
                        <input type="hidden" name="sessionId" value={booking.id} />
                        <input type="hidden" name="method" value="stripe" />
                        <button className="w-full py-4 bg-oku-purple text-oku-dark rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-md">
                            Pay with Card (Stripe)
                        </button>
                    </form>
                    <form action="/api/checkout" method="POST">
                        <input type="hidden" name="sessionId" value={booking.id} />
                        <input type="hidden" name="method" value="razorpay" />
                        <button className="w-full py-4 bg-oku-blue text-blue-800 rounded-pill font-black text-[10px] uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all shadow-md">
                            Pay with UPI (Razorpay)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
