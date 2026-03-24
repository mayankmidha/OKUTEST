'use client'

import { useState } from 'react'
import { Search, Filter, X, Check, ArrowRight, ShieldCheck, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/lib/currency'

export default function TherapistFilters({ therapists, specialties, isFirstTime = false }: { therapists: any[], specialties: string[], isFirstTime?: boolean }) {
  const [search, setSearch] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(300)

  const filtered = therapists.filter(t => {
    const matchesSearch = t.user.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.bio?.toLowerCase().includes(search.toLowerCase())
    
    const matchesSpecialty = selectedSpecialties.length === 0 || 
                             selectedSpecialties.some(s => t.specialization?.includes(s))
    
    const matchesPrice = (t.hourlyRate || 150) <= maxPrice

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
             {(selectedSpecialties.length > 0 || search || maxPrice < 300) && (
                <button onClick={() => { setSearch(''); setSelectedSpecialties([]); setMaxPrice(300); }} className="text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">Clear All</button>
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
                    placeholder="Find a therapist..."
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-oku-purple transition-all"
                  />
               </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Max Hourly Rate</label>
                  <span className="text-sm font-bold text-oku-dark">${maxPrice}</span>
               </div>
               <input 
                 type="range" 
                 min="50" max="300" step="10"
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                 className="w-full accent-oku-purple"
               />
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

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((practitioner) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={practitioner.id} 
                className="group bg-white rounded-[4rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-oku-taupe/5 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 hover:-translate-y-2"
              >
                <div className="h-72 bg-oku-cream relative overflow-hidden">
                  {practitioner.user.avatar ? (
                      <img 
                          src={practitioner.user.avatar} 
                          alt={practitioner.user.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-oku-purple/20 text-8xl font-display font-black tracking-tighter">OKU</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-oku-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                     {practitioner.isVerified && (
                        <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2.5 shadow-2xl border border-white w-fit">
                           <ShieldCheck size={14} className="text-oku-purple" strokeWidth={2} />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-dark">Verified Provider</span>
                        </div>
                     )}
                     {isFirstTime && (
                        <div className="bg-oku-navy/90 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2.5 shadow-2xl border border-white/10 w-fit">
                           <Clock size={14} className="text-oku-purple" strokeWidth={2} />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">10-Min Trial Available</span>
                        </div>
                     )}
                  </div>
                  
                  <div className="absolute bottom-8 right-8 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                     <span className="bg-white text-oku-dark px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white">
                          {formatCurrency(practitioner.hourlyRate || 150, practitioner.baseCurrency || 'USD')} / Session
                      </span>
                  </div>
                </div>
                
                <div className="p-10 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-4xl font-display font-bold text-oku-dark mb-2 tracking-tighter">{practitioner.user.name}</h2>
                    <p className="text-oku-purple font-script text-2xl italic opacity-60">Clinical Specialist</p>
                  </div>
                  
                  <p className="text-sm text-oku-taupe mb-10 line-clamp-2 leading-[1.8] font-display italic opacity-80">
                    "{practitioner.bio || "Devoted to holding space for your unfolding journey and psychological wellness."}"
                  </p>

                  <div className="flex flex-wrap gap-2.5 mb-10 h-14 overflow-hidden">
                    {(practitioner.specialization || []).slice(0, 3).map((spec: string, i: number) => (
                      <span key={i} className="text-[9px] uppercase tracking-[0.2em] font-black bg-oku-cream-warm/40 px-4 py-2 rounded-full text-oku-taupe border border-oku-taupe/5">
                        {spec.trim()}
                      </span>
                    ))}
                    {(practitioner.specialization?.length > 3) && (
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-oku-purple/40 px-2 py-2">
                            +{practitioner.specialization.length - 3} More
                        </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Link 
                        href={`/dashboard/client/book/new/${practitioner.id}`} 
                        className="bg-oku-dark text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-purple-dark transition-all text-center shadow-2xl shadow-oku-dark/10 active:scale-95"
                    >
                      Book Care Session
                    </Link>
                    {isFirstTime && (
                        <Link 
                            href={`/dashboard/client/book/new/${practitioner.id}?type=trial`} 
                            className="bg-oku-purple/20 text-oku-purple-dark py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-oku-purple/30 transition-all text-center border border-oku-purple/10 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Clock size={14} /> Claim 10-Min Meet
                        </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
