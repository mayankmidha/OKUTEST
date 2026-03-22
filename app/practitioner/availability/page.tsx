'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PractitionerLoadingState,
  PractitionerPill,
  PractitionerSectionCard,
  PractitionerShell,
  PractitionerStatCard,
} from '@/components/practitioner-shell/practitioner-shell'
import { getCurrentUser, logoutUser } from '@/lib/auth'

type AvailabilitySlot = {
  day: string
  endTime: string
  isAvailable: boolean
  startTime: string
}

const DEFAULT_SLOTS: AvailabilitySlot[] = [
  { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
  { day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: false },
]

const STORAGE_KEY = 'oku-therapy-practitioner-availability'

function loadStoredSlots(): AvailabilitySlot[] {
  if (typeof window === 'undefined') {
    return DEFAULT_SLOTS
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return DEFAULT_SLOTS
  }

  try {
    return JSON.parse(stored) as AvailabilitySlot[]
  } catch {
    return DEFAULT_SLOTS
  }
}

export default function PractitionerAvailabilityPage() {
  const user = getCurrentUser()
  const router = useRouter()
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => loadStoredSlots())
  const [message, setMessage] = useState('Availability updated.')

  useEffect(() => {
    if (!user || user.role !== 'THERAPIST') {
      router.replace('/auth/login')
      return
    }
  }, [router, user])

  if (!user || user.role !== 'THERAPIST') {
    return null
  }

  const updateSlot = (day: string, patch: Partial<AvailabilitySlot>) => {
    setSlots((current) =>
      current.map((slot) => (slot.day === day ? { ...slot, ...patch } : slot)),
    )
    setMessage('Availability updated.')
  }

  return (
    <PractitionerShell
      badge="Availability"
      currentPath="/practitioner/availability"
      description="Keep a polished weekly schedule of your working hours with quick edits for every day of the week."
      headerActions={
        <button
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          onClick={() => {
            logoutUser()
            router.push('/auth/login')
          }}
          type="button"
        >
          Sign out
        </button>
      }
      heroActions={
        <Link
          className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          href="/practitioner/dashboard"
        >
          Back to dashboard
        </Link>
      }
      title="Weekly availability"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PractitionerStatCard
          accent="bg-oku-sage"
          detail="Days currently marked available."
          label="Available days"
          value={slots.filter((slot) => slot.isAvailable).length}
        />
        <PractitionerStatCard
          accent="bg-oku-pink"
          detail="Days currently marked off."
          label="Unavailable days"
          value={slots.filter((slot) => !slot.isAvailable).length}
        />
        <PractitionerStatCard
          accent="bg-oku-purple"
          detail="The current availability set visible to the practice."
          label="Schedule status"
          value="Up to date"
        />
      </div>

      <div className="mt-6">
        <PractitionerSectionCard
          action={<PractitionerPill tone="purple">Week view</PractitionerPill>}
          actions={<PractitionerPill tone="sage">Saved</PractitionerPill>}
          description="Set weekly hours, block off time, and keep your schedule easy to scan."
          title="Availability grid"
        >
          <div className="mb-5 rounded-[1.5rem] border border-oku-purple/20 bg-oku-purple/5 px-4 py-3 text-sm text-oku-purple-dark">
            {message}
          </div>

          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                className="rounded-[1.5rem] border border-oku-taupe/5 bg-white p-4 transition hover:border-oku-taupe/10 hover:shadow-lg"
                key={slot.day}
              >
                <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_auto] lg:items-center">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-taupe opacity-40">{slot.day}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <PractitionerPill tone={slot.isAvailable ? 'sage' : 'dark'}>
                        {slot.isAvailable ? 'Available' : 'Off'}
                      </PractitionerPill>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-oku-taupe">
                    Start
                    <input
                      className="w-full rounded-2xl border border-oku-taupe/5 bg-oku-cream/20 px-3 py-2 text-oku-dark shadow-inner outline-none transition focus:border-oku-purple/30 disabled:opacity-30"
                      disabled={!slot.isAvailable}
                      onChange={(event) => updateSlot(slot.day, { startTime: event.target.value })}
                      type="time"
                      value={slot.startTime}
                    />
                  </label>

                  <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-oku-taupe">
                    End
                    <input
                      className="w-full rounded-2xl border border-oku-taupe/5 bg-oku-cream/20 px-3 py-2 text-oku-dark shadow-inner outline-none transition focus:border-oku-purple/30 disabled:opacity-30"
                      disabled={!slot.isAvailable}
                      onChange={(event) => updateSlot(slot.day, { endTime: event.target.value })}
                      type="time"
                      value={slot.endTime}
                    />
                  </label>

                  <label className="inline-flex items-center gap-3 rounded-full border border-oku-taupe/5 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-widest text-oku-dark shadow-sm cursor-pointer hover:bg-oku-cream transition-colors">
                    <input
                      checked={slot.isAvailable}
                      className="h-4 w-4 rounded border-oku-taupe/20 text-oku-purple focus:ring-oku-purple"
                      onChange={(event) => updateSlot(slot.day, { isAvailable: event.target.checked })}
                      type="checkbox"
                    />
                    Toggle
                  </label>
                </div>
              </div>
            ))}
          </div>
        </PractitionerSectionCard>
      </div>
    </PractitionerShell>
  )
}
