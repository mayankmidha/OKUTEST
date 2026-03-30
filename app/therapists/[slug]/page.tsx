import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, Award, BookOpen, ArrowRight, ShieldCheck, 
  ChevronLeft, Star, Globe, Heart, MessageCircle 
} from 'lucide-react'

export default async function TherapistProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id: slug },
    include: { 
      user: true,
      availability: true
    }
  })

  if (!practitioner) {
    notFound()
  }

  const name = practitioner.user.name || ''
  const firstName = name.split(' ')[0]

  return (
    <div className="oku-page-public min-h-screen bg-oku-lavender relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-blush/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/20 rounded-full blur-[120px] animate-float-3d" />

      {/* Navigation & Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10">
        <Link 
          href="/therapists" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/60 hover:text-oku-darkgrey transition-colors mb-12 bg-white/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/60 shadow-sm"
        >
          <ChevronLeft size={14} /> Back to Collective
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: Image & Quick Stats */}
          <div className="space-y-12">
            <div className="relative group tilt-card">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/80">
                <img 
                  src={practitioner.user.avatar || '/uploads/2025/07/placeholder.jpg'} 
                  alt={name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 tilt-card-content"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 card-glass-3d !p-8 !rounded-[3rem] max-w-[240px] animate-float-3d">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-oku-mint rounded-full flex items-center justify-center text-oku-darkgrey/60">
                       <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">Verified Specialist</span>
                 </div>
                 <p className="text-xs text-oku-darkgrey/60 italic leading-relaxed">
                   Licensed and verified clinical practitioner.
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="card-glass-3d !bg-oku-mint/40 !p-8 !rounded-[2.5rem]">
                  <Briefcase size={20} className="text-oku-purple-dark/60 mb-4 animate-float-3d" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">Experience</p>
                  <p className="text-lg font-bold text-oku-darkgrey">{practitioner.experienceYears}+ Years</p>
               </div>
               <div className="card-glass-3d !bg-oku-peach/40 !p-8 !rounded-[2.5rem]">
                  <Star size={20} className="text-oku-purple-dark/60 mb-4 animate-float-3d" style={{ animationDelay: '0.5s' }} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">Rating</p>
                  <p className="text-lg font-bold text-oku-darkgrey">4.9 / 5.0</p>
               </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-12">
            <div>
              <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>
                {practitioner.specialization[0]}
              </span>
              <h1 className="heading-display text-7xl md:text-8xl text-oku-darkgrey mb-6 tracking-tighter">
                {name}
              </h1>
              <p className="text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed opacity-80 max-w-xl border-l-4 border-oku-purple-dark/10 pl-8">
                Holding space for your unfolding journey through clinical excellence and compassionate presence.
              </p>
            </div>

            <div className="space-y-10">
              <section className="card-glass-3d !p-10 !bg-white/40">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-6 flex items-center gap-3">
                  <Heart size={14}/> Therapeutic Approach
                </h4>
                <p className="text-lg text-oku-darkgrey/70 leading-relaxed font-display italic">
                  {practitioner.bio || "I believe in a relational, depth-oriented approach that honors the complexity of the human experience. My work is rooted in creating a safe, non-judgmental sanctuary where you can explore your patterns and move towards healing at your own pace."}
                </p>
              </section>

              <section className="card-glass-3d !p-10 !bg-oku-babyblue/30">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-6 flex items-center gap-3">
                  <Award size={14}/> Clinical Specialties
                </h4>
                <div className="flex flex-wrap gap-3">
                  {practitioner.specialization.map((spec, i) => (
                    <span key={i} className="px-6 py-3 bg-white/60 border border-white/80 rounded-full text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60 shadow-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </section>

              <section className="card-glass-3d !p-10 !bg-oku-butter/30">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30 mb-6 flex items-center gap-3">
                  <BookOpen size={14}/> Credentials
                </h4>
                <p className="text-lg text-oku-darkgrey font-bold leading-relaxed italic">
                   {practitioner.education || "Master of Psychology & Certified Practitioner of Psychotherapy"}
                </p>
              </section>
            </div>

            <div className="pt-12 border-t border-oku-darkgrey/5 flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href={`/dashboard/client/book/new/${practitioner.id}`}
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-6 text-[11px] pulse-cta w-full sm:w-auto"
              >
                Establish Care with {firstName} <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link 
                href="/auth/signup"
                className="btn-pill-3d bg-white/60 border-white text-oku-darkgrey !px-12 !py-6 text-[11px] w-full sm:w-auto"
              >
                Inquiry <MessageCircle size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
