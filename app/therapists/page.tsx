import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/DashboardHeader'
import TherapistFilters from '@/components/TherapistFilters'
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import { detectCurrency, getLiveExchangeRates } from '@/lib/currency'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PublicTherapistsPage() {
  const [practitioners, exchangeRates] = await Promise.all([
    prisma.practitionerProfile.findMany({
        where: { isVerified: true },
        include: { user: true }
    }),
    getLiveExchangeRates('INR'),
  ])

  // Get unique specialties for filters
  const allSpecialties = practitioners.flatMap(p => p.specialization)
  const uniqueSpecialties = Array.from(new Set(allSpecialties)).filter(Boolean)

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden font-sans">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-oku-lavender/40 rounded-full blur-[160px]" />
          <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-oku-mint/30 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-24 text-center space-y-8">
            <span className="px-5 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-oku-purple-dark shadow-sm inline-block">
              Our Collective
            </span>
            
            <h1 className="heading-display text-oku-darkgrey text-7xl md:text-9xl leading-[0.8] tracking-tighter">
              Meet the <br />
              <span className="text-oku-purple-dark italic">Practitioners.</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-oku-darkgrey/50 font-display italic leading-relaxed max-w-2xl mx-auto border-l-4 border-oku-purple-dark/10 pl-10">
              A diverse collective of licensed, trauma-informed therapists dedicated to your healing and growth.
            </p>
          </div>

          <div className="mt-20">
            <TherapistFilters
              therapists={practitioners}
              specialties={uniqueSpecialties}
              isFirstTime={true}
            />
          </div>

          {/* Conversion Hook Footer */}
          <div className="mt-32 p-12 bg-oku-dark rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                  <div className="space-y-4">
                      <h2 className="heading-display text-5xl tracking-tighter">Ready to begin your <span className="text-oku-lavender italic">journey?</span></h2>
                      <p className="text-white/50 font-display italic text-xl">Create your secure sanctuary to book a free 15-min consultation.</p>
                  </div>
                  <Link href="/auth/signup" className="btn-pill-3d bg-white text-oku-dark border-white !px-12 !py-6 text-lg flex items-center gap-3 hover:bg-oku-lavender transition-all group pulse-cta">
                      Join the Collective <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
              <div className="absolute top-0 right-0 w-[50%] h-full bg-oku-purple/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="max-w-5xl mx-auto px-12 py-20 border-t border-oku-darkgrey/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700 relative z-10">
          <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-oku-purple-dark" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey">Verified Clinical Collective</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey">Secure & Confidential &copy; 2026</p>
      </div>
    </div>
  )
}
