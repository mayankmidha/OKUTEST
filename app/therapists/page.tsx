import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TherapistsPage() {
  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true }
  })

  return (
    <div className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl font-display font-bold text-oku-dark mb-6 tracking-tighter">Our People</h1>
          <p className="font-script text-3xl text-oku-purple mb-8">Licensed, trauma-informed, and deeply human.</p>
          <p className="text-xl text-oku-taupe max-w-2xl leading-relaxed">
            Browse our collective of practitioners dedicated to holding space for the complexities of your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {practitioners.map((practitioner) => (
            <div key={practitioner.id} className="group bg-white rounded-card overflow-hidden shadow-sm border border-oku-taupe/10 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="h-64 bg-oku-purple/5 relative overflow-hidden">
                {practitioner.user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={practitioner.user.avatar} 
                        alt={practitioner.user.name || 'Practitioner'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-oku-purple text-6xl opacity-20">
                        OKU
                    </div>
                )}
                <div className="absolute top-4 right-4">
                   <span className="bg-white/80 backdrop-blur-md text-oku-dark px-4 py-2 rounded-pill text-xs font-black uppercase tracking-widest shadow-sm">
                        ${practitioner.hourlyRate || 150}/hr
                    </span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-display font-bold text-oku-dark mb-2">{practitioner.user.name}</h2>
                <p className="text-oku-purple font-script text-xl mb-6">Psychotherapist</p>
                
                <p className="text-oku-taupe text-sm mb-8 line-clamp-3 leading-relaxed">
                  {practitioner.bio || "No bio available."}
                </p>

                <div className="mb-8">
                  <h4 className="text-[10px] font-black text-oku-taupe uppercase tracking-[0.4em] mb-4">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {(practitioner.specialization || []).map((spec, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-widest font-black bg-white/50 px-3 py-1 rounded-pill text-oku-dark border border-oku-taupe/5">
                        {spec.trim()}
                      </span>
                    ))}
                    {(!practitioner.specialization || practitioner.specialization.length === 0) && (
                      <span className="text-[10px] uppercase tracking-widest font-black bg-white/50 px-3 py-1 rounded-pill text-oku-dark border border-oku-taupe/5">
                        General Practice
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link 
                      href={`/book/${practitioner.id}`} 
                      className="block w-full text-center bg-oku-dark text-white py-4 rounded-pill font-black text-[10px] uppercase tracking-[0.4em] hover:bg-opacity-80 transition-all shadow-xl"
                  >
                    Book Full Session
                  </Link>
                  <Link 
                      href={`/book/${practitioner.id}/trial`} 
                      className="block w-full text-center bg-white text-oku-purple border border-oku-purple py-4 rounded-pill font-black text-[10px] uppercase tracking-[0.4em] hover:bg-oku-purple/5 transition-all"
                  >
                    Free 15-Min Trial
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
