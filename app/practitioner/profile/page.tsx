'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PractitionerLoadingState,
  PractitionerPill,
  PractitionerSectionCard,
  PractitionerShell,
} from '@/components/practitioner-shell/practitioner-shell'
import { getCurrentUser, logoutUser } from '@/lib/auth'

type PractitionerProfileData = {
  bio: string | null
  isVerified: boolean
  licenseNumber: string | null
  specialization: string[]
  hourlyRate: number | null
  user: {
    email: string
    name: string | null
  }
}

export default function PractitionerProfilePage() {
  const user = getCurrentUser()
  const router = useRouter()
  const [profile, setProfile] = useState<PractitionerProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'THERAPIST') {
      router.replace('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        // Mock profile data
        setProfile({
          bio: 'Experienced therapist specializing in anxiety, depression, and trauma recovery. Committed to creating a safe, compassionate space for healing and growth.',
          isVerified: true,
          licenseNumber: 'PSY-2023-001',
          specialization: ['Anxiety', 'Depression', 'Trauma', 'CBT', 'Mindfulness'],
          hourlyRate: 150,
          user: {
            email: user.email,
            name: user.name
          }
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [router, user])

  if (isLoading) {
    return <PractitionerLoadingState message="Loading profile..." />
  }

  if (!user || user.role !== 'THERAPIST') {
    return null
  }

  return (
    <PractitionerShell
      badge="Profile"
      currentPath="/practitioner/profile"
      description="Your professional presence, credentials, and practice details—all in one place."
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
        <>
          <Link
            className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            href="/practitioner/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
            href="/practitioner/schedule"
          >
            Schedule
          </Link>
        </>
      }
      title="Profile"
    >
      <div className="space-y-8">
        <PractitionerSectionCard title="Professional Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <p className="text-slate-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <p className="text-slate-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
              <p className="text-slate-900">{profile?.licenseNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate</label>
              <p className="text-slate-900">${profile?.hourlyRate || 'Not set'}/hour</p>
            </div>
          </div>
        </PractitionerSectionCard>

        <PractitionerSectionCard title="Bio">
          <p className="text-slate-700 leading-relaxed">
            {profile?.bio || 'No bio provided yet.'}
          </p>
        </PractitionerSectionCard>

        <PractitionerSectionCard title="Specializations">
          <div className="flex flex-wrap gap-2">
            {profile?.specialization.map((spec, index) => (
              <PractitionerPill key={index} tone="sky">
                {spec}
              </PractitionerPill>
            ))}
          </div>
        </PractitionerSectionCard>

        <PractitionerSectionCard title="Verification Status">
          <div className="flex items-center gap-2">
            <PractitionerPill tone={profile?.isVerified ? "emerald" : "amber"}>
              {profile?.isVerified ? 'Verified' : 'Pending Verification'}
            </PractitionerPill>
          </div>
        </PractitionerSectionCard>
      </div>
    </PractitionerShell>
  )
}
