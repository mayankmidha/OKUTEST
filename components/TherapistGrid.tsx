'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search, ShieldCheck, Star, Briefcase, ArrowRight,
  SlidersHorizontal, X, ChevronDown, BookOpen, Sparkles, Heart
} from 'lucide-react'

interface Practitioner {
  id: string
  bio: string | null
  specialization: string[]
  education: string | null
  experienceYears: number | null
  indiaSessionRate: number | null
  internationalSessionRate: number | null
  hourlyRate: number | null
  isIntroductory: boolean | null
  languages: string[]
  user: { id: string; name: string | null; avatar: string | null }
}

interface Props {
  practitioners: Practitioner[]
  specialties: string[]
}

const CARD_COLORS = [
  'from-oku-lavender/40 to-white/60',
  'from-oku-mint/40 to-white/60',
  'from-oku-peach/40 to-white/60',
  'from-oku-butter/40 to-white/60',
]

function getRate(p: Practitioner): number {
  return Math.max(p.indiaSessionRate || p.internationalSessionRate || p.hourlyRate || 1500, 1500)
}

export function TherapistGrid({ practitioners, specialties }: Props) {
  const [search, setSearch] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(8000)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return practitioners.filter((p) => {
      const q = search.toLowerCase()
      const nameMatch = p.user.name?.toLowerCase().includes(q)
      const bioMatch = p.bio?.toLowerCase().includes(q)
      const specMatch = p.specialization.some((s) => s.toLowerCase().includes(q))
      const matchesSearch = !q || nameMatch || bioMatch || specMatch

      const matchesSpec =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((s) => p.specialization.includes(s))

      const rate = getRate(p)
      const matchesPrice = rate <= maxPrice

      return matchesSearch && matchesSpec && matchesPrice
    })
  }, [practitioners, search, selectedSpecialties, maxPrice])

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const hasFilters = search || selectedSpecialties.length > 0 || maxPrice < 8000
  const clearAll = () => {
    setSearch('')
    setSelectedSpecialties([])
    setMaxPrice(8000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-oku-lavender/50 via-oku-cream to-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oku-blush/25 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-oku-mint/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] w-[500px] h-[300px] bg-oku-butter/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 pt-36 pb-32 relative z-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-[10px] font-black uppercase tracking-widest text-oku-purple-dark shadow-sm mb-6">
            <Sparkles size={11} /> {practitioners.length} Verified Specialists
          </span>
          <h1 className="heading-display text-6xl md:text-8xl lg:text-[7rem] text-oku-darkgrey tracking-tighter leading-[0.88] mb-6">
            Find your <br />
            <span className="text-oku-purple-dark italic">therapist.</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-8">
            <p className="text-lg md:text-xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-lg">
              Trauma-informed, queer-affirming, culturally sensitive care.
              First consultation is always free.
            </p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-oku-mint/50 rounded-full border border-oku-mint">
                <Heart size={12} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">Free first consult</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-oku-lavender/50 rounded-full border border-oku-lavender">
                <ShieldCheck size={12} className="text-oku-purple-dark" />
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/60">From ₹1,500 / hr</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-oku-darkgrey/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, specialty, or concern..."
                className="w-full pl-12 pr-5 py-4 bg-white/80 backdrop-blur-sm border border-white/80 rounded-2xl text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 outline-none focus:border-oku-lavender focus:ring-2 focus:ring-oku-lavender/20 transition-all shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-oku-darkgrey/30 hover:text-oku-darkgrey" />
                </button>
              )}
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                filtersOpen || selectedSpecialties.length > 0 || maxPrice < 8000
                  ? 'bg-oku-darkgrey text-white border-oku-darkgrey'
                  : 'bg-white/80 text-oku-darkgrey/60 border-white/80 hover:border-oku-lavender'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(selectedSpecialties.length > 0 || maxPrice < 8000) && (
                <span className="bg-oku-purple-dark text-white text-[9px] px-2 py-0.5 rounded-full">
                  {selectedSpecialties.length + (maxPrice < 8000 ? 1 : 0)}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
            {hasFilters && (
              <button onClick={clearAll} className="px-6 py-4 rounded-2xl border border-oku-darkgrey/10 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 hover:text-oku-darkgrey hover:border-oku-darkgrey/30 transition-all">
                Clear All
              </button>
            )}
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-6 space-y-6">
                  {/* Specialties */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-3">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSpecialty(s)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedSpecialties.includes(s)
                              ? 'bg-oku-darkgrey text-white'
                              : 'bg-white text-oku-darkgrey/50 border border-oku-darkgrey/10 hover:border-oku-purple-dark/30 hover:text-oku-purple-dark'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Max Session Rate</p>
                      <span className="text-sm font-black text-oku-darkgrey">
                        ₹{maxPrice.toLocaleString('en-IN')} / hr
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1500}
                      max={8000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-oku-purple-dark"
                    />
                    <div className="flex justify-between text-[9px] text-oku-darkgrey/30 font-black uppercase tracking-widest mt-1">
                      <span>₹1,500</span>
                      <span>₹8,000</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          layout
          className="flex items-center justify-between mb-8"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
            {filtered.length} therapist{filtered.length !== 1 ? 's' : ''} {hasFilters ? 'match your filters' : 'available'}
          </p>
          {hasFilters && filtered.length === 0 && (
            <button onClick={clearAll} className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline">
              Clear filters
            </button>
          )}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-2xl font-display italic text-oku-darkgrey/40 mb-4">No matches found.</p>
            <p className="text-sm text-oku-darkgrey/30 mb-6">Try broadening your search or clearing filters.</p>
            <button onClick={clearAll} className="btn-pill-3d bg-oku-darkgrey text-white">
              Show All Therapists
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((member, idx) => (
                <TherapistCard key={member.id} member={member} idx={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer CTA — Join the collective */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 text-center border-t border-oku-darkgrey/10 pt-24"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mb-4">For Practitioners</p>
          <h2 className="heading-display text-4xl md:text-6xl text-oku-darkgrey mb-6 italic">
            Join our collective.
          </h2>
          <p className="text-oku-darkgrey/50 font-display italic max-w-md mx-auto mb-8">
            We're always looking for trauma-informed, culturally sensitive clinicians to join the OKU family.
          </p>
          <Link
            href="/auth/practitioner-signup"
            className="btn-pill-3d bg-oku-mint border-white/80 text-oku-darkgrey inline-flex items-center gap-2"
          >
            Professional Inquiries <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function TherapistCard({ member, idx }: { member: Practitioner; idx: number }) {
  const rate = getRate(member)
  const gradients = CARD_COLORS
  const gradient = gradients[idx % gradients.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/70 rounded-[2.5rem] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow flex flex-col`}
    >
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-white/30">
        <motion.img
          src={member.user.avatar || '/uploads/2025/07/placeholder.jpg'}
          alt={member.user.name || ''}
          className="w-full h-full object-cover object-top"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheck size={10} className="text-oku-purple-dark" />
            <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey">Verified</span>
          </div>
          {member.isIntroductory && (
            <div className="flex items-center gap-1.5 bg-oku-purple-dark text-white px-3 py-1.5 rounded-full shadow-sm">
              <Star size={10} />
              <span className="text-[9px] font-black uppercase tracking-widest">Intro Rate</span>
            </div>
          )}
        </div>

        {/* Rate badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
          <span className="text-[10px] font-black text-oku-darkgrey">
            ₹{rate.toLocaleString('en-IN')}<span className="text-oku-darkgrey/40">/hr</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <div className="mb-4">
          <h2 className="heading-display text-2xl text-oku-darkgrey tracking-tight mb-1">{member.user.name}</h2>
          <p className="text-sm text-oku-purple-dark font-display italic opacity-80">
            {member.specialization[0] || 'Therapist'}
            {member.experienceYears ? ` · ${member.experienceYears}+ yrs` : ''}
          </p>
        </div>

        {/* Bio */}
        <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed line-clamp-3 mb-4 flex-1">
          {member.bio || 'Compassionate, evidence-based therapy tailored to your needs.'}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {member.specialization.slice(0, 3).map((spec, i) => (
            <span key={i} className="px-3 py-1 bg-white/60 border border-white/80 rounded-xl text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/50">
              {spec.trim()}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 mt-auto">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={`/auth/signup?callbackUrl=/dashboard/client/book/new/${member.id}`}
              className="w-full flex items-center justify-center gap-2 py-4 bg-oku-darkgrey text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple-dark transition-colors shadow-sm"
            >
              Book Free Consult <ArrowRight size={13} />
            </Link>
          </motion.div>
          <Link
            href={`/therapists/${member.id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/50 border border-white/80 text-oku-darkgrey/60 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-oku-darkgrey transition-all"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
