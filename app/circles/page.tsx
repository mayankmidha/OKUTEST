import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import { Users, Calendar, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CirclesPage() {
  const session = await auth()
  
  const circles = await prisma.appointment.findMany({
    where: { 
      isGroupSession: true,
      startTime: { gte: new Date() },
      status: 'CONFIRMED'
    },
    include: {
      practitioner: { select: { name: true, avatar: true, practitionerProfile: { select: { specialization: true } } } },
      participants: true
    },
    orderBy: { startTime: 'asc' }
  })

  return (
    <div className="oku-page-public min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-oku-lavender/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mb-32">
          <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>Community Healing</span>
          <h1 className="heading-display text-7xl md:text-9xl leading-[0.85] tracking-tight mb-12 text-oku-darkgrey">
            Therapeutic <br />
            <span className="text-oku-purple-dark italic">Circles.</span>
          </h1>
          <p className="text-xl md:text-3xl text-oku-darkgrey/70 font-display italic leading-relaxed max-w-2xl border-l-4 border-oku-purple-dark/20 pl-8">
            Safe, facilitated group spaces to explore shared experiences and find collective resonance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {circles.length === 0 ? (
            <div className="col-span-full py-32 text-center card-glass-3d !bg-white/40">
               <Users className="mx-auto text-oku-purple-dark/20 mb-8 animate-float-3d" size={64} />
               <h3 className="heading-display text-3xl text-oku-darkgrey">New circles are forming...</h3>
               <p className="text-oku-darkgrey/40 italic font-display mt-4 text-xl">Check back soon for upcoming sessions.</p>
            </div>
          ) : (
            circles.map((circle) => {
              const [title, desc] = (circle.notes || '|').split('|')
              const isFull = (circle.participants?.length || 0) >= (circle.maxParticipants || 10)
              
              return (
                <div key={circle.id} className="card-glass-3d !p-10 !bg-white/60 group hover:shadow-2xl transition-all duration-700 relative flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
                      <Users size={32} />
                    </div>
                    {isFull ? (
                      <span className="bg-oku-peach text-oku-darkgrey/60 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">At Capacity</span>
                    ) : (
                      <span className="bg-oku-mint text-oku-darkgrey/60 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {circle.maxParticipants - circle.participants.length} Spots Left
                      </span>
                    )}
                  </div>

                  <h3 className="heading-display text-3xl text-oku-darkgrey mb-4">{title || 'Community Circle'}</h3>
                  <p className="text-oku-darkgrey/60 text-sm leading-relaxed mb-10 italic font-display flex-1">
                    {desc || 'A facilitated space for shared growth and exploration.'}
                  </p>

                  <div className="space-y-6 pt-10 border-t border-oku-darkgrey/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md">
                             <img src={circle.practitioner?.avatar || '/uploads/2025/07/placeholder.jpg'} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">{circle.practitioner?.name}</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-oku-purple-dark opacity-60">Facilitator</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-bold text-oku-darkgrey">₹{circle.priceSnapshot || 500}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">per session</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40 px-2">
                       <div className="flex items-center gap-2"><Calendar size={12} /> {new Date(circle.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                       <div className="flex items-center gap-2"><Clock size={12} /> {new Date(circle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>

                    <Link 
                      href={`/circles/${circle.id}/join`}
                      className={`btn-pill-3d w-full !py-5 ${isFull ? 'bg-oku-taupe/10 text-oku-taupe pointer-events-none' : 'bg-oku-darkgrey text-white pulse-cta'}`}
                    >
                      {isFull ? 'Waiting List Only' : 'Join this Circle'} <ArrowRight size={16} className="ml-3" />
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Info Section */}
        <div className="mt-48 grid lg:grid-cols-2 gap-24 items-center">
           <div className="card-glass-3d !p-16 !bg-oku-lavender/40 border-2">
              <Sparkles className="text-oku-purple-dark mb-10 animate-float-3d" size={48} />
              <h2 className="heading-display text-5xl text-oku-darkgrey mb-8 italic">The power of resonance.</h2>
              <p className="text-oku-darkgrey/70 text-lg leading-relaxed mb-8">
                Circles are not just therapy groups. They are curated spaces where the facilitator and 
                participants work together to build a shared language for what is often kept in silence.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-sm font-bold text-oku-darkgrey">
                    <div className="w-2 h-2 rounded-full bg-oku-purple-dark" />
                    Maximum 10 participants per circle
                 </div>
                 <div className="flex items-center gap-4 text-sm font-bold text-oku-darkgrey">
                    <div className="w-2 h-2 rounded-full bg-oku-purple-dark" />
                    Secure, clinical-grade video encryption
                 </div>
                 <div className="flex items-center gap-4 text-sm font-bold text-oku-darkgrey">
                    <div className="w-2 h-2 rounded-full bg-oku-purple-dark" />
                    No clinical diagnosis required to join
                 </div>
              </div>
           </div>
           
           <div className="space-y-12">
              <h2 className="heading-display text-6xl text-oku-darkgrey tracking-tight leading-none">Why choose a <span className="text-oku-purple-dark italic">Circle?</span></h2>
              <p className="text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed border-l-4 border-oku-purple-dark/10 pl-10">
                Individual therapy focuses on your unique story. Circles focus on the fact that your story is 
                not yours alone—finding strength in the shared human experience.
              </p>
              <div className="flex flex-wrap gap-4">
                 <span className="chip bg-white border-white">Trauma-Informed</span>
                 <span className="chip bg-white border-white">Queer-Affirmative</span>
                 <span className="chip bg-white border-white">Neuro-Inclusive</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
