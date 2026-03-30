import { prisma } from '@/lib/prisma'
import { autoConvert, formatCurrency } from '@/lib/currency'
import { Briefcase, Award, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TherapistsPage() {
  const practitioners = await prisma.practitionerProfile.findMany({
    where: { isVerified: true },
    include: { user: true }
  })

  return (
    <div className="oku-page-public min-h-screen bg-oku-lavender relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-oku-blush/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mb-32">
          <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>Our Collective</span>
          <h1 className="heading-display text-oku-darkgrey text-7xl md:text-9xl leading-[0.85] tracking-tight mb-12">
            People <br />
            <span className="text-oku-purple-dark italic">first.</span>
          </h1>
          <p className="text-xl md:text-3xl text-oku-darkgrey/70 font-display italic leading-relaxed max-w-2xl border-l-4 border-oku-purple-dark/20 pl-8">
            Oku is a diverse group of clinicians, thinkers, and healers committed to your growth—holding space for all parts of who you are.
          </p>
          <p className="mt-8 text-sm text-oku-darkgrey/50 italic font-bold">
            Session prices start from ₹1500/hr · Prices shown in INR for India.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-32">
          {practitioners.map((member: any, idx) => {
            const colors = ['bg-white/60', 'bg-oku-mint/40', 'bg-oku-peach/40', 'bg-oku-babyblue/40']
            return (
            <div key={member.id} className={`group card-glass-3d tilt-card overflow-hidden !rounded-[4rem] flex flex-col md:flex-row min-h-[500px] ${colors[idx % colors.length]}`}>
              {/* Visual Side */}
              <div className="md:w-2/5 relative overflow-hidden bg-white/20">
                <img 
                    src={member.user.avatar || '/uploads/2025/07/placeholder.jpg'} 
                    alt={member.user.name || ''} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 tilt-card-content"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-oku-darkgrey/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   <div className="bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl border border-white w-fit animate-float-3d">
                      <ShieldCheck size={14} className="text-oku-purple-dark" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-darkgrey">Verified Specialist</span>
                   </div>
                   {member.isIntroductory && (
                      <div className="bg-oku-purple-dark text-white px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl border border-oku-purple-dark w-fit animate-float-3d" style={{ animationDelay: '0.5s' }}>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Introductory rate</span>
                      </div>
                   )}
                </div>

                <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex justify-between items-center">
                    <div className="flex gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-oku-darkgrey shadow-lg ring-1 ring-white/20 animate-float-3d">
                          <ShieldCheck size={18}/>
                       </div>
                    </div>
                    <span className="bg-white text-oku-darkgrey px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        ₹{Math.max(member.internationalSessionRate || member.indiaSessionRate || member.hourlyRate || 1500, 1500)} / HR
                    </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 p-12 md:p-16 lg:p-20 flex flex-col tilt-card-content">
                <div className="flex justify-between items-start mb-10">
                  <div>
                      <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey tracking-tighter group-hover:text-oku-purple-dark transition-colors">{member.user.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                          <p className="text-oku-purple-dark font-script text-2xl italic opacity-80">{member.specialization[0] || 'Therapist'}</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-oku-darkgrey/20" />
                          <p className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey/40 flex items-center gap-2">
                              <Briefcase size={12} /> {member.experienceYears}+ Experience
                          </p>
                      </div>
                  </div>
                </div>

                <div className="mb-12">
                  <p className="text-lg text-oku-darkgrey/70 leading-relaxed font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
                    "{member.bio?.substring(0, 150)}..."
                  </p>
                  <Link href={`/therapists/${member.id}`} className="inline-block mt-6 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline transition-all">
                    View full profile →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4 flex items-center gap-2"><Award size={14}/> Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.specialization.slice(0, 3).map((spec: string, idx: number) => (
                              <span key={idx} className="text-[9px] uppercase tracking-widest font-black bg-white/60 text-oku-darkgrey/60 px-4 py-2 rounded-xl border border-white/80 shadow-sm">
                                  {spec.trim()}
                              </span>
                          ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4 flex items-center gap-2"><BookOpen size={14}/> Background</h4>
                        <p className="text-xs font-bold text-oku-darkgrey/60 leading-relaxed italic">
                            {member.education || 'Master of Psychology'}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-10 border-t border-oku-darkgrey/5">
                  <Link 
                      href={`/auth/signup?callbackUrl=/dashboard/client/book/new/${member.id}`}
                      className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-6 text-[11px] pulse-cta"
                  >
                    Establish Care with {member.user.name?.split(' ')[0]} <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          )})}
        </div>

        <div className="text-center py-32 mt-32 border-t border-oku-darkgrey/10">
          <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey mb-12 leading-tight italic">Want to join our collective?</h2>
          <Link href="/auth/practitioner-signup" className="btn-pill-3d bg-oku-mint border-white/80 text-oku-darkgrey !px-16 !py-8 text-xs">
            Professional Inquiries
          </Link>
        </div>
      </div>
    </div>

  )
}
