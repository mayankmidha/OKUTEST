'use client'

import { useState } from 'react'
import { 
    Search, Filter, X, Check, ArrowRight, ShieldCheck, 
    Star, Clock, Award, BookOpen, Globe, Briefcase,
    Linkedin, ExternalLink, Zap
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { type ExchangeRateTable, formatCurrency, localizeAmount } from '@/lib/currency'
import { resolvePractitionerSessionPrice } from '@/lib/pricing'

export default function TherapistFilters({
  therapists,
  specialties,
  isFirstTime = false,
}: {
  therapists: any[]
  specialties: string[]
  isFirstTime?: boolean
}) {
  const getDisplayedSessionRate = (practitioner: any) => {
    const rate = practitioner.price || practitioner.consultationFee || practitioner.hourlyRate || practitioner.indiaSessionRate || 1500
    return Math.max(rate, 1500)
  }

  const sliderMin = 1500
  const sliderMax = 5000
  const [search, setSearch] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(sliderMin)

  const filtered = therapists.filter(t => {
    const matchesSearch = t.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
                          t.name?.toLowerCase().includes(search.toLowerCase()) ||
                          t.bio?.toLowerCase().includes(search.toLowerCase())
    
    const matchesSpecialty = selectedSpecialties.length === 0 || 
                             selectedSpecialties.some(s => t.specialization?.includes(s) || t.specialties?.includes(s))
    
    const matchesPrice = getDisplayedSessionRate(t) <= maxPrice

    return matchesSearch && matchesSpecialty && matchesPrice
  })

  const toggleSpecialty = (s: string) => {
    if (selectedSpecialties.includes(s)) {
      setSelectedSpecialties(selectedSpecialties.filter(item => item !== s))
    } else {
      setSelectedSpecialties([...selectedSpecialties, s])
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12">
      
      {/* Sidebar Filters */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm sticky top-28">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-sm font-black uppercase tracking-widest text-oku-dark flex items-center gap-2">
                <Filter size={16} className="text-oku-purple" /> Filters
             </h3>
             {(selectedSpecialties.length > 0 || search || maxPrice > sliderMin) && (
                <button onClick={() => { setSearch(''); setSelectedSpecialties([]); setMaxPrice(sliderMin); }} className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">Clear All</button>
             )}
          </div>

          <div className="space-y-10">
            {/* Search */}
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Search Name</label>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe" size={14} />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find a specialist..."
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-oku-purple transition-all"
                  />
               </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Max Session Rate</label>
                  <span className="text-sm font-bold text-oku-dark">₹{maxPrice}</span>
               </div>
               <input 
                 type="range" 
                 min={sliderMin} max={sliderMax} step={250}
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                 className="w-full accent-oku-purple"
               />
               <p className="text-[9px] text-oku-taupe italic mt-2">
                 Session prices start from ₹1500/hr · Prices shown in INR for India.
               </p>
            </div>

            {/* Specialties */}
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Clinical Specialties</label>
               <div className="flex flex-wrap gap-2">
                  {specialties.map(s => {
                    const active = selectedSpecialties.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSpecialty(s)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                          active 
                          ? 'bg-oku-dark border-oku-dark text-white shadow-md' 
                          : 'bg-oku-cream/50 border-oku-taupe/10 text-oku-taupe hover:border-oku-purple/50'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="lg:col-span-9 space-y-8">
        <div className="flex items-center justify-between px-2">
           <p className="text-sm text-oku-taupe italic">Showing {filtered.length} specialists matching your needs.</p>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((practitioner) => {
              const practitionerTitle = practitioner.specialization?.[0]?.trim() || 'Practitioner'

              return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={practitioner.id} 
                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm border border-oku-taupe/10 hover:shadow-2xl transition-all duration-700 flex flex-col md:flex-row"
              >
                {/* Visual Side */}
                <div className="md:w-1/3 h-80 md:h-auto relative overflow-hidden bg-oku-cream">
                  {practitioner.user.avatar ? (
                      <img 
                          src={practitioner.user.avatar} 
                          alt={practitioner.user.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-oku-purple/20 text-8xl font-display font-black tracking-tighter">OKU</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-oku-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                     {practitioner.isVerified && (
                        <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-white w-fit">
                           <ShieldCheck size={12} className="text-oku-purple" />
                           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-oku-dark">Verified</span>
                        </div>
                     )}
                     {practitioner.isIntroductory && (
                        <div className="bg-oku-purple text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-oku-purple w-fit">
                           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Introductory rate</span>
                        </div>
                     )}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
                      <div className="flex gap-2">
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-default shadow-lg ring-1 ring-white/20">
                            <ShieldCheck size={14}/>
                         </div>
                      </div>
                      <span className="bg-white text-oku-dark px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
                          {formatCurrency(getDisplayedSessionRate(practitioner), 'INR')} / SESSION
                      </span>

                  </div>
                </div>
                
                {/* Content Side */}
                <div className="flex-1 p-10 lg:p-12 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-oku-dark tracking-tighter group-hover:text-oku-navy transition-colors">{practitioner.user.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-oku-purple font-script text-xl italic opacity-80">{practitionerTitle}</p>
                            <span className="w-1 h-1 rounded-full bg-oku-taupe/20" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 flex items-center gap-1">
                                <Briefcase size={10} /> {practitioner.experienceYears || 0} Years Experience
                            </p>
                        </div>
                    </div>
                    {isFirstTime && (
                        <div className="bg-oku-navy text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg ring-4 ring-oku-navy/5">
                           <Zap size={12} className="text-oku-purple animate-pulse" />
                           <span className="text-[8px] font-black uppercase tracking-widest">Free 10-Min Trial</span>
                        </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-oku-taupe mb-8 line-clamp-3 leading-relaxed font-display italic opacity-80 border-l-2 border-oku-purple/20 pl-6">
                    "{practitioner.bio || "Devoted to holding space for your unfolding journey and psychological wellness."}"
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                      <div>
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-oku-navy/40 mb-3 flex items-center gap-2"><Award size={12}/> Expertise</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {(practitioner.specialization || []).slice(0, 3).map((spec: string, i: number) => (
                                <span key={i} className="text-[8px] uppercase tracking-widest font-black bg-oku-ocean text-oku-navy-light px-3 py-1.5 rounded-lg border border-oku-blue-mid/10">
                                    {spec.trim()}
                                </span>
                            ))}
                          </div>
                      </div>
                      <div>
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-oku-navy/40 mb-3 flex items-center gap-2"><BookOpen size={12}/> Background</h4>
                          <p className="text-[10px] font-bold text-oku-dark line-clamp-2 leading-tight">
                              {practitioner.education || "Certified Practitioner of Psychotherapy"}
                          </p>
                      </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-oku-taupe/5 grid grid-cols-2 gap-4">
                    <Link 
                        href={`/dashboard/client/book/new/${practitioner.id}`} 
                        className="bg-oku-dark text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-navy transition-all text-center shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                      Establish Care <ArrowRight size={14} />
                    </Link>
                    <Link 
                        href={`/therapists/${practitioner.id}`} 
                        className="bg-white text-oku-dark border border-oku-taupe/10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-cream transition-all text-center shadow-sm active:scale-95"
                    >
                        View full profile →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
