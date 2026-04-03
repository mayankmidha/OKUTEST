'use client'

import { useState } from 'react'
import { Search, Filter, ArrowRight, ShieldCheck, Briefcase, Award, BookOpen, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { formatCurrency } from '@/lib/currency'

export default function TherapistFilters({
  therapists,
  specialties,
  isFirstTime = false,
}: {
  therapists: any[]
  specialties: string[]
  isFirstTime?: boolean
}) {
  const sliderMin = 1500
  const sliderMax = 5000

  const [search, setSearch] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(sliderMax) // default = show all

  const getRate = (p: any) =>
    Math.max(p.price || p.consultationFee || p.hourlyRate || p.indiaSessionRate || 1500, 1500)

  const filtered = therapists.filter((t) => {
    const name = t.user?.name || t.name || ''
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (t.bio || '').toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some(
        (s) => t.specialization?.includes(s) || t.specialties?.includes(s)
      )
    const matchesPrice = getRate(t) <= maxPrice
    return matchesSearch && matchesSpecialty && matchesPrice
  })

  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )

  const hasFilters = search || selectedSpecialties.length > 0 || maxPrice < sliderMax

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      {/* ── Sidebar ── */}
      <aside className="lg:col-span-3">
        <div className="sticky top-28 card-glass-3d !bg-white/70 !p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey flex items-center gap-2">
              <Filter size={14} className="text-oku-purple-dark" /> Filters
            </h3>
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setSelectedSpecialties([]); setMaxPrice(sliderMax) }}
                className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline flex items-center gap-1"
              >
                <X size={10} /> Clear
              </button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-oku-darkgrey/40">Search</label>
            <div className="relative">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-darkgrey/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or focus area…"
                className="input-pastel pl-10 text-xs"
              />
            </div>
          </div>

          {/* Price slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black uppercase tracking-[0.25em] text-oku-darkgrey/40">Max Rate</label>
              <span className="text-xs font-bold text-oku-darkgrey">
                ₹{maxPrice === sliderMax ? `${sliderMax}+` : maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={250}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-oku-purple-dark"
            />
            <p className="text-[9px] text-oku-darkgrey/30 italic">Starting from ₹1,500/hr</p>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.25em] text-oku-darkgrey/40">Specialty</label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => {
                  const active = selectedSpecialties.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSpecialty(s)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                        active
                          ? 'bg-oku-darkgrey border-oku-darkgrey text-white shadow-md'
                          : 'bg-white/60 border-oku-darkgrey/10 text-oku-darkgrey/60 hover:border-oku-purple-dark/40'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Cards ── */}
      <div className="lg:col-span-9 space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-oku-darkgrey/40 pl-1">
          {filtered.length} specialist{filtered.length !== 1 ? 's' : ''} found
        </p>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center border-2 border-dashed border-oku-darkgrey/10 rounded-[3rem]"
            >
              <p className="text-xl font-display italic text-oku-darkgrey/30">No specialists match your filters.</p>
              <button
                onClick={() => { setSearch(''); setSelectedSpecialties([]); setMaxPrice(sliderMax) }}
                className="mt-6 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline"
              >
                Reset filters →
              </button>
            </motion.div>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.04 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-oku-darkgrey/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row"
              >
                {/* Photo */}
                <div className="md:w-72 h-64 md:h-auto relative overflow-hidden bg-oku-lavender/30 flex-shrink-0">
                  {p.user?.avatar ? (
                    <img
                      src={p.user.avatar}
                      alt={p.user.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-display font-black text-oku-purple-dark/20">
                      {p.user?.name?.charAt(0) || 'O'}
                    </div>
                  )}

                  {/* Verified badge */}
                  {p.isVerified && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white">
                      <ShieldCheck size={11} className="text-oku-purple-dark" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-oku-darkgrey">Verified</span>
                    </div>
                  )}

                  {/* Rate on hover */}
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-oku-darkgrey text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                      {formatCurrency(getRate(p), 'INR')} / session
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-10 flex flex-col">
                  <div className="mb-2">
                    <span className="chip !text-[8px] !px-3 !py-1 mb-3 inline-block">
                      {p.specialization?.[0] || 'Therapist'}
                    </span>
                    <h2 className="heading-display text-3xl text-oku-darkgrey">{p.user?.name}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-1 flex items-center gap-1">
                      <Briefcase size={10} /> {p.experienceYears || 0} yrs experience
                    </p>
                  </div>

                  <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed line-clamp-2 border-l-2 border-oku-purple-dark/15 pl-5 my-6">
                    "{p.bio || 'Devoted to holding space for your unfolding journey.'}"
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2 flex items-center gap-1">
                        <Award size={10} /> Specialties
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(p.specialization || []).slice(0, 3).map((spec: string, j: number) => (
                          <span
                            key={j}
                            className="px-2.5 py-1 bg-oku-lavender/60 text-oku-purple-dark text-[8px] font-black uppercase tracking-widest rounded-lg"
                          >
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-2 flex items-center gap-1">
                        <BookOpen size={10} /> Credentials
                      </h4>
                      <p className="text-[10px] font-bold text-oku-darkgrey line-clamp-2 leading-tight">
                        {p.education || 'Certified Practitioner of Psychotherapy'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-oku-darkgrey/5 grid grid-cols-2 gap-4">
                    <Link
                      href={`/dashboard/client/book/new/${p.id}`}
                      className="bg-oku-darkgrey text-white py-4 rounded-full font-black text-[10px] uppercase tracking-[0.25em] hover:bg-oku-purple-dark transition-all text-center shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      Book Session <ArrowRight size={13} />
                    </Link>
                    <Link
                      href={`/therapists/${p.id}`}
                      className="bg-oku-lavender/40 text-oku-darkgrey border border-oku-lavender py-4 rounded-full font-black text-[10px] uppercase tracking-[0.25em] hover:bg-oku-lavender transition-all text-center active:scale-95"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
