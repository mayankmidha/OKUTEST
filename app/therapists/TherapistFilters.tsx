'use client'

import { useState } from 'react'
import { Search, Filter, X, Check, ArrowRight, ShieldCheck, Star } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function TherapistFilters({ therapists, specialties }: { therapists: any[], specialties: string[] }) {
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
          <AnimatePresence>
            {filtered.map((practitioner) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={practitioner.id} 
                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm border border-oku-taupe/10 hover:shadow-2xl transition-all"
              >
                <div className="h-56 bg-oku-purple/5 relative overflow-hidden">
                  {practitioner.user.avatar ? (
                      <img 
                          src={practitioner.user.avatar} 
                          alt={practitioner.user.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-oku-purple text-6xl opacity-20">OKU</div>
                  )}
                  <div className="absolute top-6 left-6">
                     {practitioner.isVerified && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl border border-white">
                           <ShieldCheck size={14} className="text-green-600" />
                           <span className="text-[8px] font-black uppercase tracking-widest text-oku-dark">Verified Specialist</span>
                        </div>
                     )}
                  </div>
                  <div className="absolute bottom-6 right-6">
                     <span className="bg-oku-dark text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                          ${practitioner.hourlyRate || 150}/hr
                      </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h2 className="text-3xl font-display font-bold text-oku-dark mb-1">{practitioner.user.name}</h2>
                  <p className="text-oku-purple font-script text-xl mb-6 italic">Clinical Practitioner</p>
                  
                  <p className="text-sm text-oku-taupe mb-8 line-clamp-2 leading-relaxed opacity-80">
                    {practitioner.bio || "No bio available."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8 h-12 overflow-hidden">
                    {(practitioner.specialization || []).map((spec: string, i: number) => (
                      <span key={i} className="text-[9px] uppercase tracking-widest font-black bg-oku-cream-warm/30 px-3 py-1 rounded-full text-oku-taupe border border-oku-taupe/5">
                        {spec.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link 
                        href={`/book/${practitioner.id}`} 
                        className="flex-1 bg-oku-dark text-white py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-oku-purple transition-all text-center shadow-lg active:scale-95"
                    >
                      Book Session
                    </Link>
                    <Link 
                        href={`/book/${practitioner.id}/trial`} 
                        className="flex-1 bg-white text-oku-dark border border-oku-taupe/20 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-oku-cream transition-all text-center shadow-sm active:scale-95"
                    >
                      Free Trial
                    </Link>
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
