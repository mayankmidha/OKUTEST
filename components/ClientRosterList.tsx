'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, User, Mail, ArrowRight } from 'lucide-react'

type ClientEntry = {
  client: {
    id: string
    name: string | null
    email: string
    clientProfile: { noShowCount: number } | null
    moodEntries: { mood: number }[]
  }
  totalSessions: number
  lastSession: Date
  nextSession: Date | null
  notesCount: number
}

export function ClientRosterList({ clients }: { clients: ClientEntry[] }) {
  const [query, setQuery] = useState('')

  const filtered = clients.filter(c =>
    !query || c.client.name?.toLowerCase().includes(query.toLowerCase()) || c.client.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="card-glass-3d !bg-white/60 !p-5 sm:!p-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-oku-darkgrey/30" size={16} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients by name or email..."
            className="w-full bg-white/60 border border-white/80 pl-12 pr-6 py-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-oku-lavender/50 focus:border-white transition-all shadow-sm placeholder:text-oku-darkgrey/30 text-oku-darkgrey"
          />
        </div>
        {query && (
          <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30 mt-4 ml-2">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Client list */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="card-glass-3d !bg-white/40 !p-20 text-center border-2 border-dashed">
            <User size={48} className="mx-auto text-oku-darkgrey/20 mb-6" />
            <h3 className="heading-display text-2xl text-oku-darkgrey mb-2">
              {query ? 'No matching patients found.' : 'Your roster is empty.'}
            </h3>
            <p className="text-oku-darkgrey/40 text-sm">
              {query ? 'Try a different name or email.' : 'When clients book sessions, they will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.client.id} className="card-glass-3d group !bg-white/60 !p-6 transition-all duration-500 hover:shadow-2xl sm:!p-8">
              <div className="grid gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">

                {/* Patient Identity */}
                <div className="flex items-center gap-4 sm:gap-6 xl:col-span-4">
                  <div className="w-14 h-14 rounded-2xl bg-oku-lavender/60 flex items-center justify-center text-oku-darkgrey font-bold text-xl border-2 border-white shadow-inner">
                    {c.client.name?.substring(0, 1) || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-oku-darkgrey group-hover:text-oku-purple-dark transition-colors">{c.client.name || 'Unknown'}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail size={11} className="text-oku-darkgrey/30" />
                      <span className="truncate text-xs text-oku-darkgrey/40">{c.client.email}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Stats */}
                <div className="grid grid-cols-2 gap-4 border-y border-white/60 py-5 sm:grid-cols-3 xl:col-span-5 xl:border-y-0 xl:border-x xl:px-8 xl:py-0">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 mb-1">Sessions</p>
                    <p className="text-xl font-bold text-oku-darkgrey">{c.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 mb-1">Last Mood</p>
                    <p className="text-xl font-bold text-oku-darkgrey">
                      {c.client.moodEntries[0]
                        ? c.client.moodEntries[0].mood >= 4 ? 'Good' : c.client.moodEntries[0].mood === 3 ? 'Neutral' : 'Low'
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 mb-1">No Shows</p>
                    <p className={`text-xl font-bold ${(c.client.clientProfile?.noShowCount ?? 0) > 0 ? 'text-red-500' : 'text-oku-darkgrey'}`}>
                      {c.client.clientProfile?.noShowCount ?? 0}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 xl:col-span-3 xl:justify-end">
                  {c.nextSession ? (
                    <div className="xl:mr-4 xl:text-right">
                      <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 mb-1">Next Session</p>
                      <p className="text-xs font-bold text-oku-purple-dark">{new Date(c.nextSession).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] uppercase tracking-widest font-black text-oku-darkgrey/30 xl:mr-4">No upcoming</p>
                  )}
                  <Link
                    href={`/practitioner/clients/${c.client.id}`}
                    className="w-12 h-12 rounded-2xl bg-oku-lavender/60 flex items-center justify-center text-oku-darkgrey group-hover:bg-oku-darkgrey group-hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
